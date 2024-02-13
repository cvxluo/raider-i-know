"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import RunModel from "@/models/Run";

import {
  countCharactersInRuns,
  filterRunsToLimit,
  getLimitedChars,
  slugCharacter,
  summarizeRunDetails,
} from "@/utils/funcs";
import { getRunDetails } from "../raiderio/mythic_plus/run_details";
import { createManyCharacters, saveRoster } from "./character";
import {
  Character,
  CharacterMinimal,
  Run,
  RunReducedRoster,
} from "@/utils/types";
import { summarizeRoster } from "@/utils/funcs";

const LOG_RUN_CREATION = false;

export const createRun = async (run: Run): Promise<Run> => {
  await mongoDB();

  console.log(
    "Creating run",
    run.keystone_run_id,
    "of dungeon",
    run.dungeon.name,
    "in database...",
  );

  const keystone_run_id = run.keystone_run_id;
  const roster = run.roster;

  // upsert roster
  // consider a cleaner split between methods that clean their data and methods that don't
  // the calling function should most likely be the one summarizing
  const newCharacterIDs = await saveRoster(roster);

  const reducedRun = { ...run, roster: newCharacterIDs };

  const newRun = await RunModel.findOneAndUpdate(
    {
      keystone_run_id: keystone_run_id,
    },
    reducedRun,
    {
      new: true,
      upsert: true,
    },
  )
    .lean()
    .catch((e) => {
      console.error("Error creating run in database.");
      throw e;
    });

  const flattenedRun = JSON.parse(JSON.stringify(newRun));

  return flattenedRun;
};

// https://stackoverflow.com/questions/39988848/trying-to-do-a-bulk-upsert-with-mongoose-whats-the-cleanest-way-to-do-this
// bulk upsert
export const createManyRuns = async (runs: Run[]): Promise<Run[]> => {
  await mongoDB();

  if (LOG_RUN_CREATION) {
    console.log("Creating", runs.length, "runs in database with ids...");
    console.log(runs.map((run) => run.keystone_run_id));
  }

  const simpleRuns = await Promise.allSettled(
    runs.map(async (run) => {
      // const characters = await createManyCharacters(run.roster);
      const characters = await saveRoster(summarizeRoster(run.roster));
      return {
        ...run,
        roster: characters.map((character) => character._id),
      };
    }),
  )
    .then((results) => {
      return results
        .filter((result) => result.status === "fulfilled")
        .map(
          (result) =>
            (result as PromiseFulfilledResult<RunReducedRoster>).value,
        );
    })
    .catch((e) => {
      console.error("Error creating roster in database.");
      throw e;
    });

  const newRuns = await RunModel.collection
    .bulkWrite(
      simpleRuns.map((run) => ({
        updateOne: {
          filter: { keystone_run_id: run.keystone_run_id },
          update: { $set: run },
          upsert: true,
        },
      })),
    )
    .catch((e) => {
      console.error("Error creating runs in database.");
      throw e;
    });

  const flattenedRuns = JSON.parse(JSON.stringify(newRuns));

  return flattenedRuns;
};

export const createRunFromID = async (
  season: string,
  keystone_run_id: number,
) => {
  await mongoDB();

  const runFromID = await getRunDetails(season, keystone_run_id);

  const summarizedRun = summarizeRunDetails(runFromID);

  return createRun(summarizedRun);
};

export const getRun = async (run: Run) => {
  await mongoDB();

  const retrievedRun = await RunModel.findOne({
    keystone_run_id: run.keystone_run_id,
  }).lean();

  const flattenedRun = JSON.parse(JSON.stringify(retrievedRun));

  return flattenedRun;
};

export const getRunFromID = async (keystone_run_id: number) => {
  await mongoDB();

  const retrievedRun = await RunModel.findOne({
    keystone_run_id: keystone_run_id,
  }).lean();

  const flattenedRun = JSON.parse(JSON.stringify(retrievedRun));

  return flattenedRun;
};

export const getRunsWithCharacter = async (character: Character) => {
  await mongoDB();

  const region = character.region.name;
  const realm = character.realm.name;
  const name = character.name;

  const retrievedRuns = await RunModel.find({
    roster: {
      $elemMatch: {
        region: region,
        realm: realm,
        name: name,
      },
    },
  }).lean();

  const flattenedRuns = JSON.parse(JSON.stringify(retrievedRuns));

  return flattenedRuns;
};

// returns an array with runs with degrees of separation for a particular character
// [0 degrees (runs character was in), 1 degree (runs character was in with other characters), 2 degrees, 3 degrees, ...]
// limit is the minimum number of runs a a character must have with another character to be included in the result
// need to limit degree and limit aggressively, branching factor is high
export const getLimitedRunsAtDegree = async (
  degree: number,
  character: Character,
  limit: number,
  excludes: Character[] = [],
) => {
  await mongoDB();

  const degreeRuns: Run[][] = [];
  const allCharSlugs = [slugCharacter(character)];
  let charsToSearch = [character];

  for (let i = 0; i <= degree; i++) {
    const runs = await Promise.all(
      charsToSearch.map(async (char) => {
        return await getRunsWithCharacter(char);
      }),
    ).then((runs) => {
      return runs.flat();
    });

    const charCounts = countCharactersInRuns(runs);
    const limitedChars = Object.keys(charCounts).filter(
      (key) => charCounts[key] >= limit,
    );

    charsToSearch = limitedChars
      .map((char) => {
        const [name, realm, region] = char.split("-");
        const character = {
          name,
          realm: {
            id: 0,
            connected_realm_id: 0,
            name: realm,
            slug: "slug",
            locale: "",
          },
          region: {
            name: region,
            slug: "slug",
            short_name: "",
          },
        };
        return character;
      })
      .filter((character) => {
        return !excludes.some((exclude) => {
          return (
            exclude.region.name === character.region.name &&
            exclude.realm.name === character.realm.name &&
            exclude.name === character.name
          );
        });
      });

    allCharSlugs.push(
      ...charsToSearch.map((char) => {
        return slugCharacter(char);
      }),
    );

    degreeRuns[i] = runs.filter((run) => {
      return !degreeRuns
        .flat()
        .map((run) => run.keystone_run_id)
        .includes(run.keystone_run_id);
    });
  }

  return degreeRuns;
};

/*
 returns 
 [
  [
    {
      character info,
      parentChar
    },
    ...
  ],
  [...],
]
*/
export const getCharGraph = async (
  character: Character,
  degree: number,
  limit: number,
  excludes: Character[] = [],
) => {
  const charGraph = [
    [
      {
        character: character,
        parentCharacter: character,
      },
    ],
  ];
  let charsToSearch = [character];
  const allCharsSearched: Character[] = [];

  for (let i = 0; i <= degree; i++) {
    const characters = await Promise.all(
      charsToSearch.map(async (parentChar) => {
        const runs = await getRunsWithCharacter(parentChar);
        const limitedChars = getLimitedChars(runs, limit, [
          ...allCharsSearched,
          parentChar,
          ...excludes,
        ]);
        return limitedChars.map((char) => {
          return {
            character: char,
            parentCharacter: parentChar,
          };
        });
      }),
    );

    charsToSearch = characters.flat().map((char) => char.character);

    allCharsSearched.push(...charsToSearch);

    charGraph.push(characters.flat());
  }
  return charGraph;
};

export const getRunsAtDegree = async (degree: number, character: Character) => {
  await mongoDB();

  return await getLimitedRunsAtDegree(degree, character, 0);
};

export const getAllRuns = async () => {
  await mongoDB();

  const runs = await RunModel.find({});

  const flattenedRuns = JSON.parse(JSON.stringify(runs));

  return flattenedRuns;
};

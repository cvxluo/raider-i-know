"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import Run from "@/models/Run";

import {
  countCharactersInRuns,
  slugCharacter,
  summarizeRunDetails,
} from "@/utils/funcs";
import { getRunDetails } from "../raiderio/mythic_plus/run_details";
import { createManyCharacters, saveRoster } from "./character";

const LOG_RUN_CREATION = false;

export const createRun = async (run) => {
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

  const newRun = await Run.findOneAndUpdate(
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
export const createManyRuns = async (runs) => {
  await mongoDB();

  if (LOG_RUN_CREATION) {
    console.log("Creating", runs.length, "runs in database with ids...");
    console.log(runs.map((run) => run.keystone_run_id));
  }

  const simpleRuns = await Promise.allSettled(
    runs.map(async (run) => {
      const newCharacterIDs = await createManyCharacters(run.roster).map(
        (character) => character._id,
      );
      return {
        ...run,
        roster: newCharacterIDs,
      };
    }),
  ).catch((e) => {
    console.error("Error creating roster in database.");
    throw e;
  });

  const newRuns = await Run.collection
    .bulkWrite(
      runs.map((run) => ({
        updateOne: {
          filter: { keystone_run_id: run.keystone_run_id },
          update: { $set: run },
          upsert: true,
        },
      })),
    )
    .lean()
    .catch((e) => {
      console.error("Error creating runs in database.");
      throw e;
    });

  const flattenedRuns = JSON.parse(JSON.stringify(newRuns));

  return flattenedRuns;
};

export const createRunFromID = async (season, keystone_run_id) => {
  await mongoDB();

  const runFromID = await getRunDetails(season, keystone_run_id);

  const summarizedRun = summarizeRunDetails(runFromID);

  return createRun(summarizedRun);
};

export const getRun = async (run) => {
  await mongoDB();

  const retrievedRun = await Run.findOne({
    keystone_run_id: run.keystone_run_id,
  }).lean();

  const flattenedRun = JSON.parse(JSON.stringify(retrievedRun));

  return flattenedRun;
};

export const getRunFromID = async (keystone_run_id) => {
  await mongoDB();

  const retrievedRun = await Run.findOne({
    keystone_run_id: keystone_run_id,
  }).lean();

  const flattenedRun = JSON.parse(JSON.stringify(retrievedRun));

  return flattenedRun;
};

export const getRunsWithCharacter = async (character) => {
  await mongoDB();

  const region = character.region;
  const realm = character.realm;
  const name = character.name;

  const retrievedRuns = await Run.find({
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

// returns a dict with runs with degrees of separation for a particular character
// {0: 0 degrees (runs character was in), 1: 1 degree (runs character was in with other characters), 2: 2 degrees, 3: 3 degrees, ...}
// limit is the minimum number of runs a a character must have with another character to be included in the result
// need to limit degree and limit aggressively, branching factor is high
export const getLimitedRunsAtDegree = async (degree, character, limit) => {
  await mongoDB();

  const degreeRuns = {};
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
        const character = { name, realm, region };
        return character;
      })
      .filter((character) => {
        return !allCharSlugs.includes(slugCharacter(character));
      });

    allCharSlugs.push(
      ...charsToSearch.map((char) => {
        return slugCharacter(char);
      }),
    );

    degreeRuns[i] = runs.filter((run) => {
      return !Object.values(degreeRuns)
        .flat()
        .map((run) => run.keystone_run_id)
        .includes(run.keystone_run_id);
    });
  }

  return degreeRuns;
};

export const getRunsAtDegree = async (degree, character) => {
  await mongoDB();

  return await getLimitedRunsAtDegree(degree, character, 0);
};

export const getAllRuns = async () => {
  await mongoDB();

  const runs = await Run.find({});

  const flattenedRuns = JSON.parse(JSON.stringify(runs));

  return flattenedRuns;
};

"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import Run from "@/models/Run";

import { getRunDetails } from "../raiderio/mythic_plus/run_details";
import { slugCharacter, summarizeRunDetails } from "@/utils/funcs";
import Character from "@/models/Character";
import { createCharacter } from "./character";
import { countCharactersInRuns } from "@/utils/funcs";

export const createRun = async (run) => {
  await mongoDB();

  const {
    season,
    dungeon,
    keystone_run_id,
    mythic_level,
    completed_at,
    weekly_modifiers,
    keystone_team_id,
    roster,
  } = run;

  // upsert roster
  const newCharacterIDs = await Promise.all(
    roster.map(async (character) => {
      const newCharacter = await createCharacter(
        character.region,
        character.realm,
        character.name,
      );
      return newCharacter._id;
    }),
  );

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
  ).lean();

  const flattenedRun = JSON.parse(JSON.stringify(newRun));

  return flattenedRun;
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

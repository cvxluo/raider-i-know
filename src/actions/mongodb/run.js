"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import Run from "@/models/Run";

import { getRunDetails } from "../raiderio/mythic_plus/run_details";
import { summarizeRunDetails } from "@/utils/funcs";
import Character from "@/models/Character";
import { createCharacter } from "./character";

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

export const getAllRuns = async () => {
  await mongoDB();

  const runs = await Run.find({});

  const flattenedRuns = JSON.parse(JSON.stringify(runs));

  return flattenedRuns;
};

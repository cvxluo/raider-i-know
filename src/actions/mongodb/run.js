"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import Run from "@/models/Run";

import { getRunDetails } from "../raiderio/mythic_plus/run_details";
import { summarizeRunDetails } from "@/utils/funcs";
import { saveRoster } from "./character";

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

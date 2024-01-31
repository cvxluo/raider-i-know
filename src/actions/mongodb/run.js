"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import Run from "@/models/Run";

import { getRunDetails } from "../raiderio/mythic_plus/run_details";
import { summarizeRunDetails } from "@/utils/funcs";

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

  const newRun = await Run.create(run);

  return newRun;
};

export const createRunFromID = async (season, keystone_run_id) => {
  await mongoDB();

  const runFromID = await getRunDetails(season, keystone_run_id);

  const trimmedRun = summarizeRunDetails(runFromID);

  const newRun = await Run.create(trimmedRun).lean();

  return newRun.toObject();
};

export const getRun = async (run) => {
  await mongoDB();

  const retrievedRun = await Run.findOne({
    keystone_run_id: run.keystone_run_id,
  });

  return retrievedRun;
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

  return runs;
};

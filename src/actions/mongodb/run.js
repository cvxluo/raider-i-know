"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import Run from "@/models/Run";

export const createRun = async (season, keystone_run_id) => {
  await mongoDB();

  const newRun = await Run.create({
    season,
    keystone_run_id,
  });

  return newRun;
};

export const getRun = async (season, keystone_run_id) => {
  await mongoDB();

  const run = await Run.findOne({
    season,
    keystone_run_id,
  });

  return run;
};

export const getAllRuns = async () => {
  await mongoDB();

  const runs = await Run.find();

  return runs;
};

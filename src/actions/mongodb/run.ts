"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import RunModel from "@/models/Run";
import mongoose from "mongoose";

import { summarizeRoster, summarizeRunDetails } from "@/utils/funcs";
import { Character, Run, RunReducedRoster } from "@/utils/types";
import { getRunDetails } from "../raiderio/mythic_plus/run_details";
import { saveRoster } from "./character";

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
        roster: characters.map(
          (character) => new mongoose.Types.ObjectId(character._id),
        ),
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

export const getAllRuns = async () => {
  await mongoDB();

  const runs = await RunModel.find({});

  const flattenedRuns = JSON.parse(JSON.stringify(runs));

  return flattenedRuns;
};

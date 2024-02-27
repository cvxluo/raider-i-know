"use server";

import { getRunsForCharacter } from "@/actions/raiderio/character_runs";
import { createManyRuns, getRun, getRuns, getRunsFromIDs } from "../run";
import { getRunDetails } from "@/actions/raiderio/mythic_plus/run_details";
import { summarizeRunDetails } from "@/utils/funcs";
import { AffixSets, DungeonIds } from "@/utils/consts";
import { useRIOThrottle } from "@/utils/rioThrottle/useRIOThrottle";
import { RunRaw } from "@/utils/types";

export const getFullRunsForCharacter = async (
  season: string,
  characterId: number,
  dungeonId: number,
  affixes: string,
  date: string,
) => {
  const runSummaries = await getRunsForCharacter(
    season,
    characterId,
    dungeonId,
    affixes,
    date,
  );

  const runIds = runSummaries.runs.map((run) => run.summary.keystone_run_id);

  // TODO: error handling for this - assume returning runraw
  const runs = (await Promise.all(
    runIds.map((id) => useRIOThrottle(getRunDetails, { season, id })),
  )) as RunRaw[];

  return runs;
};

export const saveRunsForCharacter = async (
  season: string,
  characterId: number,
  dungeonId: number,
  affixes: string,
  date: string,
) => {
  const runs = await getFullRunsForCharacter(
    season,
    characterId,
    dungeonId,
    affixes,
    date,
  );
  const cleanRuns = runs.map(summarizeRunDetails);

  // TODO: we have to limit the number of runs we save per operation to 10 at a time
  // due to limits on server action - this can be improved

  const responses = [];

  const s = 10;
  for (let i = 0; i < cleanRuns.length; i += s) {
    const res = await createManyRuns(cleanRuns.slice(i, i + s));
    responses.push(res);
  }

  return responses;
};

export const saveDungeonRunsForCharacter = async (
  season: string,
  characterId: number,
) => {
  const runs = await Promise.all(
    DungeonIds.map((dungeonId) => {
      return getFullRunsForCharacter(
        season,
        characterId,
        dungeonId,
        "all",
        "all",
      );
    }),
  );
  const cleanRuns = runs.flat().map(summarizeRunDetails);

  const responses = [];

  const s = 10;
  for (let i = 0; i < cleanRuns.length; i += s) {
    const res = await createManyRuns(cleanRuns.slice(i, i + s));
    responses.push(res);
  }

  return responses;
};

// this runs for all dungeons and affixes
export const saveAllRunsForCharacter = async (
  season: string,
  characterId: number,
) => {
  // since an individual affix - dungeon request can often return nothing, we retread functionality of saveRunsForCharacter
  const cleanRuns = [];

  for (let dungeonId of DungeonIds) {
    for (let affixSet of AffixSets) {
      const affixes = affixSet.join("-");
      const runs = await getFullRunsForCharacter(
        season,
        characterId,
        dungeonId,
        affixes,
        "all",
      );
      cleanRuns.push(...runs.map(summarizeRunDetails));
    }
  }

  const responses = [];

  const s = 10;
  for (let i = 0; i < cleanRuns.length; i += s) {
    const res = await createManyRuns(cleanRuns.slice(i, i + s));
    responses.push(res);
  }

  return responses;
};

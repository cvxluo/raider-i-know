"use server";

import { getRuns } from "@/actions/raiderio/mythic_plus/runs";
import { Dungeons } from "@/utils/consts";
import { useRIOThrottle } from "@/utils/useRIOThrottle";
import { createRun } from "../run";
import { summarizeRunDetails } from "@/utils/funcs";

const PAGE_LIMIT = 100;

export const getTopDungeonRuns = async (season, region, dungeon, affixes) => {
  const requests = await Promise.allSettled(
    [...Array(PAGE_LIMIT + 1).keys()].map((pageNum) => {
      return useRIOThrottle(getRuns(season, region, dungeon, affixes, pageNum));
    }),
  );

  return requests
    .filter((request) => {
      return (
        request !== undefined &&
        request.status === "fulfilled" &&
        !("error" in request.value)
      );
    })
    .map((request) => {
      return request.value.rankings;
    })
    .flat()
    .map((runDetails) => {
      return runDetails.run;
    });
};

// this sends about 100 * 8 (num pages * 8 dungeons) requests to rio
// it will time out if called by the frontend
export const getTopRuns = async (season, region, affixes) => {
  const runs = await Promise.allSettled(
    Dungeons.map((dungeon) => {
      return getTopDungeonRuns(season, region, dungeon, affixes);
    }),
  );

  return runs.map((dungeon_runs) => {
    return dungeon_runs.value;
  });
};

export const saveTopRuns = async (season, region, affixes) => {
  console.log("Saving top runs...");
  const dungeon_top_runs = await getTopRuns(season, region, affixes);

  dungeon_top_runs.map((dungeon_runs) => {
    dungeon_runs.map((run) => {
      const cleanRun = summarizeRunDetails(run);
      try {
        createRun(cleanRun);
      } catch (err) {
        console.log(err);
      }
    });
  });
};

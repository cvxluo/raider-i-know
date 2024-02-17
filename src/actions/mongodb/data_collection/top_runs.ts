"use server";

import { getRuns } from "@/actions/raiderio/mythic_plus/runs";
import { AffixSets, Dungeons } from "@/utils/consts";
import { summarizeRunDetails } from "@/utils/funcs";
import { useRIOThrottle } from "@/utils/rioThrottle/useRIOThrottle";
import { RankingRaw, RunRaw } from "@/utils/types";
import { createManyRuns } from "../run";

const PAGE_LIMIT = 100;

export const saveTopDungeonRuns = async (
  season: string,
  region: string,
  dungeon: string,
  affixes: string,
) => {
  const runs = await Promise.allSettled(
    [...Array(PAGE_LIMIT + 1)].map((_, pageNum) => {
      const runSet = useRIOThrottle(getRuns, {
        season,
        region,
        dungeon,
        affixes,
        page: pageNum,
      })
        .then((res) => {
          return (res as RankingRaw).rankings;
        })
        .then((rankings) => {
          const rankingsSet = rankings.map((ranking: { run: RunRaw }) => {
            const cleanRun = summarizeRunDetails(ranking.run);

            return cleanRun;
          });

          return createManyRuns(rankingsSet);
        })
        .catch((e) => {
          console.error("Error saving top runs: ", e);
          return e;
        });

      return runSet;
    }),
  );

  return runs;
};

// this sends about 100 * 8 (num pages * 8 dungeons) requests to rio
// it will time out if called by the frontend
export const saveTopRuns = async (
  season: string,
  region: string,
  affixes: string,
) => {
  const runs = await Promise.allSettled(
    Dungeons.map((dungeon) => {
      return saveTopDungeonRuns(season, region, dungeon, affixes);
    }),
  );

  // console.log("RUNS: ", runs);

  return runs;
};

// This sends 100 * 8 * 10 (num pages * 8 dungeons * 10 sets of affixes) requests to rio
export const saveAllTopRuns = async (season: string, region: string) => {
  console.log("Saving all top runs...");
  const affixes = AffixSets.map((affixSet) => {
    return affixSet.join("-").toLowerCase();
  });

  affixes.map((affix) => {
    saveTopRuns(season, region, affix);
  });
};

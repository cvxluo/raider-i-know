"use server";

import { getRuns } from "@/actions/raiderio/mythic_plus/runs";
import { Dungeons } from "@/utils/consts";
import { useRIOThrottle } from "@/utils/useRIOThrottle";

const PAGE_LIMIT = 100;

export const getTopDungeonRuns = async (season, region, dungeon, affixes) => {
  const runs = await Promise.allSettled(
    [...Array(PAGE_LIMIT + 1).keys()].map((pageNum) => {
      return useRIOThrottle(getRuns(season, region, dungeon, affixes, pageNum));
    }),
  );

  return runs;
};

export const getTopRuns = async (season, region, affixes) => {
  const runs = await Promise.allSettled(
    Dungeons.map((dungeon) => {
      return getTopDungeonRuns(season, region, dungeon, affixes);
    }),
  );

  return runs;
};

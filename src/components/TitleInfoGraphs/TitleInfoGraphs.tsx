"use client";

import { getLatestTitleCounts } from "@/actions/mongodb/title";
import { getScoreColors } from "@/actions/raiderio/score_colors";
import { DungeonIdToName } from "@/utils/consts";
import { LevelCounts, TitleInfo } from "@/utils/types";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import TitleDungeonChart from "./TitleDungeonChart";

const TitleInfoGraphs = () => {
  const [titleInfo, setTitleInfo] = useState<TitleInfo>({
    title_score: 0,
    num_title_players: 0,
    title_range_chars: [],
    title_top_runs: [],
    level_counts: Object.values(DungeonIdToName).reduce((acc, dungeon) => {
      acc[dungeon] = {
        Fortified: {},
        Tyrannical: {},
      };
      return acc;
    }, {} as LevelCounts),
  });

  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    getLatestTitleCounts().then((res) => {
      setTitleInfo(res);
    });

    getScoreColors("season-df-3").then((res) => {
      // we want lower keys to be purple, higher to be orange
      // we cut out low colors, and then take every 3rd color to get a larger differential between colors
      // TODO: this assumes the range is at max 10 colors, which is not guaranteed
      const colors = res
        .slice(0, 100)
        .map((color) => color.rgbHex)
        .filter((color, index, self) => index % 10 === 0)
        .reverse();
      setColors(colors);
    });
  }, []);

  return (
    <Box>
      {Object.values(DungeonIdToName)
        .sort((a, b) => a.localeCompare(b))
        .map((dungeon) => {
          return (
            <TitleDungeonChart
              dungeonLevelCounts={titleInfo.level_counts[dungeon]}
              dungeonName={dungeon}
              colors={colors}
              key={dungeon}
            />
          );
        })}
    </Box>
  );
};

export default TitleInfoGraphs;

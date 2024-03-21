"use client";
import { Run, RunReducedRoster } from "@/utils/types";
// note that since this page uses apex charts, this can't be a server component

import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderMark,
} from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import RunLevelRangeSlider from "../RunLevelRangeSlider";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const FrequentlyPlayedWithTree = ({ runs }: { runs: Run[] }) => {
  const [dungeonCountSliderValue, setDungeonCountSliderValue] = useState([
    0, 100,
  ]);
  const [minLevel, setMinLevel] = useState(0);
  const [maxLevel, setMaxLevel] = useState(100);

  useEffect(() => {
    setDungeonCountSliderValue([
      Math.min(...runs.map((run) => run.mythic_level)),
      Math.max(...runs.map((run) => run.mythic_level)),
    ]);
    if (runs.length !== 0) {
      setMinLevel(Math.min(...runs.map((run) => run.mythic_level)));
      setMaxLevel(Math.max(...runs.map((run) => run.mythic_level)));
    }
  }, [runs]);

  // TODO: consider using getLimitedPlayers for this
  const playerNames = runs
    .filter(
      (run) =>
        run.mythic_level >= dungeonCountSliderValue[0] &&
        run.mythic_level <= dungeonCountSliderValue[1],
    )
    .reduce((acc, run) => {
      run.roster.forEach((player) => {
        if (!acc.includes(player.name)) {
          acc.push(player.name);
        }
      });
      return acc;
    }, [] as string[]);

  const playerCountData = runs
    .filter(
      (run) =>
        run.mythic_level >= dungeonCountSliderValue[0] &&
        run.mythic_level <= dungeonCountSliderValue[1],
    )
    .reduce(
      (acc, run) => {
        run.roster.forEach((player) => {
          acc[player.name] = acc[player.name] ? acc[player.name] + 1 : 1;
        });
        return acc;
      },
      {} as Record<string, number>,
    );

  return (
    <Box>
      <Text>
        Runs in range:{" "}
        {
          runs.filter(
            (run) =>
              run.mythic_level >= dungeonCountSliderValue[0] &&
              run.mythic_level <= dungeonCountSliderValue[1],
          ).length
        }
      </Text>
      <Text>Number of unique characters played with: {playerNames.length}</Text>
      <Box mt={4} p={4}>
        <RunLevelRangeSlider
          range={dungeonCountSliderValue}
          setRange={setDungeonCountSliderValue}
          minLevel={minLevel}
          maxLevel={maxLevel}
        />
        <Chart
          options={{
            chart: {
              type: "treemap",
            },
          }}
          series={[
            {
              data: Object.entries(playerCountData)
                .map(([name, count]) => ({
                  x: name,
                  y: count,
                }))
                .sort((a, b) => b.y - a.y),
            },
          ]}
          type="treemap"
          width={"100%"}
          height={400}
        />
      </Box>
    </Box>
  );
};

export default FrequentlyPlayedWithTree;

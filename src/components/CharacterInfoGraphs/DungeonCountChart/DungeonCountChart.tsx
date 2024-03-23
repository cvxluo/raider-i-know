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

const DungeonCountChart = ({ runs }: { runs: Run[] }) => {
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

  const dungeonNames = runs
    .filter(
      (run) =>
        run.mythic_level >= dungeonCountSliderValue[0] &&
        run.mythic_level <= dungeonCountSliderValue[1],
    )
    .reduce((acc, run) => {
      if (!acc.includes(run.dungeon.name)) {
        acc.push(run.dungeon.name);
      }
      return acc;
    }, [] as string[])
    .sort();

  const dungeonCountData = runs
    .filter(
      (run) =>
        run.mythic_level >= dungeonCountSliderValue[0] &&
        run.mythic_level <= dungeonCountSliderValue[1],
    )
    .reduce(
      (acc, run) => {
        acc[run.dungeon.name] = acc[run.dungeon.name]
          ? acc[run.dungeon.name] + 1
          : 1;
        return acc;
      },
      {} as { [key: string]: number },
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
              type: "bar",
            },
            xaxis: {
              categories: dungeonNames,
            },
            title: { text: "Runs per dungeon" },
          }}
          series={[
            {
              name: "Dungeons",
              data: dungeonNames.map((name) => dungeonCountData[name]),
            },
          ]}
          type="bar"
          width={"100%"}
          height={400}
        />
      </Box>
    </Box>
  );
};

export default DungeonCountChart;

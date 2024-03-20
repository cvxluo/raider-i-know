"use client";
import { RunReducedRoster } from "@/utils/types";
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
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DungeonCountChart = ({ runs }: { runs: RunReducedRoster[] }) => {
  const [dungeonCountSliderValue, setDungeonCountSliderValue] = useState([
    0, 100,
  ]);
  const [minRunLevel, setMinRunLevel] = useState(0);
  const [maxRunLevel, setMaxRunLevel] = useState(100);

  useEffect(() => {
    setMinRunLevel(Math.min(...runs.map((run) => run.mythic_level)));
    setMaxRunLevel(Math.max(...runs.map((run) => run.mythic_level)));
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
        <RangeSlider
          aria-label={["min", "max"]}
          min={minRunLevel}
          max={maxRunLevel}
          colorScheme="teal"
          defaultValue={[minRunLevel, maxRunLevel]}
          onChange={(values) => {
            setDungeonCountSliderValue(values);
          }}
          mb={4}
        >
          <RangeSliderMark value={minRunLevel} mt="2" fontSize="sm">
            {minRunLevel}
          </RangeSliderMark>
          <RangeSliderMark value={maxRunLevel} mt="2" ml="-2.5" fontSize="sm">
            {maxRunLevel}
          </RangeSliderMark>
          <RangeSliderMark
            value={dungeonCountSliderValue[0]}
            textAlign="center"
            mt="-8"
            ml="-2.5"
          >
            {dungeonCountSliderValue[0]}
          </RangeSliderMark>
          <RangeSliderMark
            value={dungeonCountSliderValue[1]}
            textAlign="center"
            mt="-8"
            ml="-2.5"
          >
            {dungeonCountSliderValue[1]}
          </RangeSliderMark>

          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Chart
          options={{
            chart: {
              type: "bar",
            },
            xaxis: {
              categories: dungeonNames,
            },
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

"use client";
import { Run, RunReducedRoster } from "@/utils/types";
// note that since this page uses apex charts, this can't be a server component

import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderMark,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberInputStepper,
  NumberDecrementStepper,
  Tooltip,
} from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import RunLevelRangeSlider from "../RunLevelRangeSlider";
import { getLimitedChars } from "@/utils/funcs";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const FrequentlyPlayedWithTree = ({ runs }: { runs: Run[] }) => {
  const [dungeonCountSliderValue, setDungeonCountSliderValue] = useState([
    0, 100,
  ]);
  const [minLevel, setMinLevel] = useState(0);
  const [maxLevel, setMaxLevel] = useState(100);

  const [runLimit, setRunLimit] = useState(15);

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
  const playerNames = getLimitedChars(
    runs.filter(
      (run) =>
        run.mythic_level >= dungeonCountSliderValue[0] &&
        run.mythic_level <= dungeonCountSliderValue[1],
    ),
    runLimit,
  ).map((char) => char.name);

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

  const limitedPlayerCountData = Object.entries(playerCountData)
    .filter(([name, count]) => playerNames.includes(name))
    .reduce(
      // TODO: this reduction is only necessary to keep playerCountData and
      // limitedPlayerCountData in the same format - probably remove
      (acc, [name, count]) => {
        acc[name] = count;
        return acc;
      },
      {} as Record<string, number>,
    );

  console.log(playerCountData);
  console.log(limitedPlayerCountData);

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
      <Text>Number of unique characters: {playerNames.length}</Text>
      <Box mt={4} p={4}>
        <RunLevelRangeSlider
          range={dungeonCountSliderValue}
          setRange={setDungeonCountSliderValue}
          minLevel={minLevel}
          maxLevel={maxLevel}
        />
        <Tooltip label="Minimum number of runs for a character to be included">
          <Text fontSize="sm" display="inline" mr={2}>
            Run Limit:
          </Text>
        </Tooltip>
        <NumberInput
          width={"10%"}
          defaultValue={15}
          min={0}
          value={runLimit}
          onChange={(value) => setRunLimit(parseInt(value || "0"))}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Chart
          options={{
            chart: {
              type: "treemap",
            },
            title: {
              text: "Adjacent character breakdown by number of runs",
            },
          }}
          series={[
            {
              data: Object.entries(limitedPlayerCountData)
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

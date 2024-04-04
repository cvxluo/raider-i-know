"use client";
import { Run } from "@/utils/types";
// note that since this page uses apex charts, this can't be a server component

import {
  Box,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import RunLevelRangeSlider from "../RunLevelRangeSlider";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const FrequenTeamsTree = ({ runs }: { runs: Run[] }) => {
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

  const teamRuns = runs
    .filter(
      (run) =>
        run.mythic_level >= dungeonCountSliderValue[0] &&
        run.mythic_level <= dungeonCountSliderValue[1],
    )
    .map((run) => run.keystone_team_id);

  const teamIdToNames = runs.reduce(
    (acc, run) => {
      acc[run.keystone_team_id] = run.roster.map((char) => char.name);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const teamRunData = runs
    .filter(
      (run) =>
        run.mythic_level >= dungeonCountSliderValue[0] &&
        run.mythic_level <= dungeonCountSliderValue[1],
    )
    .reduce(
      (acc, run) => {
        acc[run.keystone_team_id] = acc[run.keystone_team_id]
          ? acc[run.keystone_team_id] + 1
          : 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  const limitedTeamRunData = Object.entries(teamRunData)
    .filter(([team, count]) => count >= runLimit)
    .reduce(
      (acc, [team, count]) => {
        acc[team] = count;
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
      <Text>Number of unique teams: {teamRuns.length}</Text>
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
            colors: ["#FF0000"],
          }}
          series={[
            {
              data: Object.entries(limitedTeamRunData)
                .map(([keystone_team_id, count]) => ({
                  x: teamIdToNames[keystone_team_id].join(", "),
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

export default FrequenTeamsTree;

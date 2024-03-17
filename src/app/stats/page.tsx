"use client";

import { Box, Text, Flex } from "@chakra-ui/react";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import {
  getDungeonCounts,
  getRunLevels,
  getRunCountByWeek,
} from "@/actions/mongodb/aggregations/run_stats";

const DungeonCountChart = () => {
  const [dungeonCountData, setDungeonCountData] = useState<
    {
      _id: string;
      count: number;
    }[]
  >([]);

  useEffect(() => {
    getDungeonCounts().then((data) => {
      setDungeonCountData(data);
    });
  }, []);

  return (
    <Chart
      options={{
        chart: {
          type: "bar",
        },
        xaxis: {
          categories: dungeonCountData.map((dungeon) => dungeon._id),
        },
      }}
      series={[
        {
          name: "Dungeons",
          data: dungeonCountData.map((dungeon) => dungeon.count),
        },
      ]}
      type="bar"
      width="500"
    />
  );
};

const RunLevelChart = () => {
  const [runLevelData, setRunLevelData] = useState<
    {
      _id: number;
      count: number;
    }[]
  >([]);

  useEffect(() => {
    getRunLevels().then((data) => {
      setRunLevelData(data);
    });
  }, []);
  return (
    <Chart
      options={{
        chart: {
          type: "bar",
        },
        xaxis: {
          categories: runLevelData.map((level) => level._id),
        },
      }}
      series={[
        {
          name: "Mythic Levels",
          data: runLevelData.map((level) => level.count),
        },
      ]}
      type="bar"
      width="500"
    />
  );
};

const RunCountByWeek = () => {
  const [runCountByWeek, setRunCountByWeek] = useState<
    {
      _id: Date;
      count: number;
    }[]
  >([]);

  useEffect(() => {
    getRunCountByWeek().then((data) => {
      setRunCountByWeek(data);
    });
  }, []);

  return (
    <Chart
      options={{
        chart: {
          type: "bar",
        },
        xaxis: {
          categories: runCountByWeek.map(
            (week) => week._id.toISOString().split("T")[0],
          ),
        },
      }}
      series={[
        {
          name: "Runs",
          data: runCountByWeek.map((week) => week.count),
        },
      ]}
      type="bar"
      width="500"
    />
  );
};

// TODO: consider SSR for this page
const StatsPage = () => {
  return (
    <Flex>
      <DungeonCountChart />
      <RunLevelChart />
      <RunCountByWeek />
    </Flex>
  );
};

export default StatsPage;

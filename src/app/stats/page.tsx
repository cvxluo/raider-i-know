"use client";

import { Box, Text, Flex, Grid } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useEffect, useState } from "react";
import {
  getDungeonCounts,
  getRunLevels,
  getRunCountByWeek,
  getCharacterServerCount,
} from "@/actions/mongodb/aggregations/run_stats";
import { getClassCounts } from "@/actions/mongodb/aggregations/character_stats";
import { ClassColors } from "@/utils/consts";

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
      width={"100%"}
      height={400}
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
      width={"100%"}
      height={400}
    />
  );
};

const RunCountByWeekChart = () => {
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
      width={"100%"}
      height={400}
    />
  );
};

const CharacterClassCountChart = () => {
  const [classCounts, setClassCounts] = useState<
    {
      _id: string;
      count: number;
    }[]
  >([]);

  useEffect(() => {
    getClassCounts().then((data) => {
      setClassCounts(data);
    });
  }, []);

  const classColorMapping = classCounts.map((charClass) => {
    return ClassColors[charClass._id];
  });

  return (
    <Chart
      options={{
        chart: {
          type: "bar",
        },
        xaxis: {
          categories: classCounts.map((charClass) => charClass._id),
        },
        colors: classColorMapping,
        plotOptions: {
          bar: {
            horizontal: true,
            distributed: true,
          },
        },
      }}
      series={[
        {
          name: "Classes",
          data: classCounts.map((charClass) => charClass.count),
        },
      ]}
      type="bar"
      width={"100%"}
      height={400}
    />
  );
};

const CharacterServerCountChart = () => {
  const [serverCounts, setServerCounts] = useState<
    {
      _id: string;
      count: number;
    }[]
  >([]);

  useEffect(() => {
    getCharacterServerCount().then((data) => {
      setServerCounts(data);
    });
  }, []);

  return (
    <Chart
      options={{
        chart: {
          type: "bar",
        },
        xaxis: {
          categories: serverCounts.map((server) => server._id),
        },
      }}
      series={[
        {
          name: "Servers",
          data: serverCounts.map((server) => server.count),
        },
      ]}
      type="bar"
      width={"100%"}
      height={400}
    />
  );
};

// TODO: consider SSR for this page
const StatsPage = () => {
  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={10} p={10}>
      <DungeonCountChart />
      <RunLevelChart />
      <RunCountByWeekChart />
      <CharacterClassCountChart />
      <CharacterServerCountChart />
    </Grid>
  );
};

export default StatsPage;

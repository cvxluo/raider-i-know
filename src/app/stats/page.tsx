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
        dataLabels: { enabled: false },
        title: { text: "Runs per dungeon" },
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
        dataLabels: { enabled: false },
        title: { text: "Runs per key Level" },
      }}
      series={[
        {
          name: "Key Levels",
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
          type: "line",
        },
        xaxis: {
          categories: runCountByWeek.map(
            (week) => week._id.toISOString().split("T")[0],
          ),
        },
        dataLabels: { enabled: false },
        title: { text: "Runs per week" },
      }}
      series={[
        {
          name: "Runs",
          data: runCountByWeek.map((week) => week.count),
        },
      ]}
      type="line"
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
        title: { text: "Occurences of classes across runs" },
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
      setServerCounts(data.filter((server) => server.count > 500));
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
        dataLabels: { enabled: false },
        title: {
          text: "Number of unique characters on servers (w/ >500 characters)",
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
    <Box p={10}>
      <Text>
        Please note that these statistics are not reflective of all M+ runs -
        only the ones stored in the database.
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={10} p={10}>
        <DungeonCountChart />
        <RunLevelChart />
        <RunCountByWeekChart />
        <CharacterClassCountChart />
        <CharacterServerCountChart />
      </Grid>
    </Box>
  );
};

export default StatsPage;

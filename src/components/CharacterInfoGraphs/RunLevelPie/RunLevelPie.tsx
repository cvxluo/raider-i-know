"use client";
import { Run, RunReducedRoster } from "@/utils/types";
// note that since this page uses apex charts, this can't be a server component

import { Box, Text } from "@chakra-ui/react";

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const RunLevelPie = ({ runs }: { runs: Run[] }) => {
  const keyLevelCounts = runs.reduce(
    (acc, run) => {
      if (acc[run.mythic_level] === undefined) {
        acc[run.mythic_level] = 0;
      }
      acc[run.mythic_level] += 1;
      return acc;
    },
    {} as Record<number, number>,
  );

  return (
    <Box>
      <Box mt={4} p={4}>
        <Chart
          options={{
            chart: {
              type: "pie",
            },
            labels: Object.keys(keyLevelCounts),
            title: { text: "Runs per key level" },
          }}
          series={Object.values(keyLevelCounts)}
          type="pie"
          width={"100%"}
          height={400}
        />
      </Box>
    </Box>
  );
};

export default RunLevelPie;

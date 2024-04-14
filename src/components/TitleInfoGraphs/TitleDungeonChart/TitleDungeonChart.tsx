"use client";

import { DungeonLevelCount } from "@/utils/types";
import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TitleDungeonChart = ({
  dungeonLevelCounts,
  dungeonName,
  colors,
  highlightLevels,
}: {
  dungeonLevelCounts: DungeonLevelCount;
  dungeonName: string;
  colors: string[];
  highlightLevels: {
    Fortified: number;
    Tyrannical: number;
  };
}) => {
  const dungeonLevelCountsKeys = Object.keys(dungeonLevelCounts["Fortified"])
    .concat(Object.keys(dungeonLevelCounts["Tyrannical"]))
    .map(Number)
    .filter((key) => key !== 0);
  const totalKeys = dungeonLevelCountsKeys.length;
  const minLevel = Math.min(...dungeonLevelCountsKeys);
  const maxLevel = Math.max(...dungeonLevelCountsKeys);
  const fortifiedData = Array.from(
    { length: maxLevel - minLevel + 1 },
    (_, i) => {
      return dungeonLevelCounts["Fortified"]?.[i + minLevel] || 0;
    },
  );

  const tyrannicalData = Array.from(
    { length: maxLevel - minLevel + 1 },
    (_, i) => {
      return dungeonLevelCounts["Tyrannical"]?.[i + minLevel] || 0;
    },
  );

  const trimmedColors = colors.slice(-(maxLevel - minLevel + 1));

  return (
    <Box>
      <Chart
        series={Array.from({ length: maxLevel - minLevel + 1 }, (_, i) => {
          const c =
            highlightLevels["Fortified"] === i + minLevel
              ? "#000000"
              : trimmedColors[i];
          return {
            name: `Level ${i + minLevel}`,
            data: [fortifiedData[i], tyrannicalData[i]],
            color: c,
          };
        })}
        options={{
          chart: {
            type: "bar",
            height: 200,
            stacked: true,
          },
          plotOptions: {
            bar: {
              horizontal: true,
              dataLabels: {
                total: {
                  enabled: false,
                },
              },
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
              return opts.seriesIndex + minLevel;
            },
            style: {
              colors: ["#fff"],
            },
          },
          stroke: {
            width: 1,
            colors: ["#fff"],
          },
          title: {
            text: dungeonName,
          },
          xaxis: {
            categories: ["Fortified", "Tyrannical"],
          },
          yaxis: {
            title: {
              text: undefined,
            },
          },
          legend: {
            show: false,
          },
          tooltip: {
            x: {
              formatter: function (val, opts) {
                return val + " " + dungeonName;
              },
            },
            y: {
              formatter: function (val, opts) {
                return val + " (" + Math.round(val / totalKeys) + "%)";
              },
            },
          },
        }}
        type="bar"
        width={"100%"}
        height={500}
      />
    </Box>
  );
};

export default TitleDungeonChart;

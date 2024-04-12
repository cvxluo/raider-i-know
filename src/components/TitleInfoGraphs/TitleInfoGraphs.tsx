"use client";

import { getLatestTitleInfo } from "@/actions/mongodb/title";
import { DungeonIdToName } from "@/utils/consts";
import { DungeonLevelCount, LevelCounts, TitleInfo } from "@/utils/types";
import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TitleDungeonChart = ({
  dungeonLevelCounts,
  dungeonName,
}: {
  dungeonLevelCounts: DungeonLevelCount;
  dungeonName: string;
}) => {
  const minLevel = Math.min(
    ...[
      ...Object.keys(dungeonLevelCounts["Fortified"]).map(Number),
      ...Object.keys(dungeonLevelCounts["Tyrannical"]).map(Number),
    ],
  );
  const maxLevel = Math.max(
    ...[
      ...Object.keys(dungeonLevelCounts["Fortified"]).map(Number),
      ...Object.keys(dungeonLevelCounts["Tyrannical"]).map(Number),
    ],
  );
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

  return (
    <Box>
      <Chart
        series={Array.from({ length: maxLevel - minLevel + 1 }, (_, i) => {
          return {
            name: `Level ${i + minLevel}`,
            data: [fortifiedData[i], tyrannicalData[i]],
          };
        })}
        options={{
          chart: {
            type: "bar",
            height: 350,
            stacked: true,
            stackType: "100%",
          },
          plotOptions: {
            bar: {
              horizontal: true,
              dataLabels: {
                total: {
                  enabled: true,
                  offsetX: 0,
                  style: {
                    fontSize: "13px",
                    fontWeight: 900,
                  },
                },
              },
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
        }}
        type="bar"
        width={"100%"}
        height={500}
      />
    </Box>
  );
};

const TitleInfoGraphs = () => {
  const [titleInfo, setTitleInfo] = useState<TitleInfo>({
    title_score: 0,
    num_title_players: 0,
    title_range_chars: [],
    title_top_runs: [],
    level_counts: Object.values(DungeonIdToName).reduce((acc, dungeon) => {
      acc[dungeon] = {
        Fortified: {},
        Tyrannical: {},
      };
      return acc;
    }, {} as LevelCounts),
  });

  useEffect(() => {
    getLatestTitleInfo().then((res) => {
      setTitleInfo(res);
    });
  }, []);

  return (
    <Box>
      {Object.values(DungeonIdToName)
        .sort((a, b) => a.localeCompare(b))
        .map((dungeon) => {
          return (
            <TitleDungeonChart
              dungeonLevelCounts={titleInfo.level_counts[dungeon]}
              dungeonName={dungeon}
              key={dungeon}
            />
          );
        })}
    </Box>
  );
};

export default TitleInfoGraphs;

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { getDungeonCounts } from "@/actions/mongodb/aggregations/run_stats";

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

export default DungeonCountChart;

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useEffect, useState } from "react";

import { getRunLevels } from "@/actions/mongodb/aggregations/run_stats";

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

export default RunLevelChart;

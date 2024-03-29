import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useEffect, useState } from "react";

import { getRunCountByWeek } from "@/actions/mongodb/aggregations/run_stats";

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

export default RunCountByWeekChart;

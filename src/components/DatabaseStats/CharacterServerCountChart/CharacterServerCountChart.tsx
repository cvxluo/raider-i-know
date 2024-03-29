import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useEffect, useState } from "react";

import { getCharacterServerCount } from "@/actions/mongodb/aggregations/run_stats";

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

export default CharacterServerCountChart;

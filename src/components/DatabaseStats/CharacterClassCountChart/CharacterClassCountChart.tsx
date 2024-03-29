import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useEffect, useState } from "react";

import { getClassCounts } from "@/actions/mongodb/aggregations/character_stats";
import { ClassColors } from "@/utils/consts";

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

export default CharacterClassCountChart;

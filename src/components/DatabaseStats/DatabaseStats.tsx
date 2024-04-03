import { Grid } from "@chakra-ui/react";
import CharacterClassCountChart from "./CharacterClassCountChart";
import CharacterServerCountChart from "./CharacterServerCountChart";
import DungeonCountChart from "./DungeonCountChart";
import RunCountByWeekChart from "./RunCountByWeekChart";
import RunLevelChart from "./RunLevelChart";

const DatabaseStats = () => {
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

export default DatabaseStats;

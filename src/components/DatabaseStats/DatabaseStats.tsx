import { Grid } from "@chakra-ui/react";
import DungeonCountChart from "./DungeonCountChart";
import RunLevelChart from "./RunLevelChart";
import RunCountByWeekChart from "./RunCountByWeekChart";
import CharacterClassCountChart from "./CharacterClassCountChart";
import CharacterServerCountChart from "./CharacterServerCountChart";

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

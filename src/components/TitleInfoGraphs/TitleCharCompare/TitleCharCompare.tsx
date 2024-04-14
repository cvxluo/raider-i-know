import { DungeonIdToName } from "@/utils/consts";
import { BestRuns, LevelCounts } from "@/utils/types";
import { InfoIcon } from "@chakra-ui/icons";
import { Box, Grid, Text, Tooltip } from "@chakra-ui/react";

const TitleCharCompare = ({
  levelCounts,
  charRunLevels,
  numTotalKeys,
}: {
  levelCounts: LevelCounts;
  charRunLevels: BestRuns;
  numTotalKeys: number;
}) => {
  const fortifiedPercentiles = Object.entries(DungeonIdToName)
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([dungeonID, dungeonName]) => {
      const numKeysEqualOrBelow = Object.keys(
        levelCounts[dungeonName]["Fortified"],
      ).reduce((acc, key) => {
        if (parseInt(key) <= charRunLevels[parseInt(dungeonID)]?.Fortified) {
          acc += levelCounts[dungeonName]["Fortified"][parseInt(key)];
        }
        return acc;
      }, 0);
      return Math.round((numKeysEqualOrBelow / numTotalKeys) * 100) / 100;
    });

  const tyrannicalPercentiles = Object.entries(DungeonIdToName)
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([dungeonID, dungeonName]) => {
      const numKeysEqualOrBelow = Object.keys(
        levelCounts[dungeonName]["Tyrannical"],
      ).reduce((acc, key) => {
        if (parseInt(key) <= charRunLevels[parseInt(dungeonID)]?.Tyrannical) {
          acc += levelCounts[dungeonName]["Tyrannical"][parseInt(key)];
        }
        return acc;
      }, 0);
      return Math.round((numKeysEqualOrBelow / numTotalKeys) * 100) / 100;
    });

  const lowestFortifiedPercentile = Math.min(...fortifiedPercentiles);
  const lowestFortifiedDungeon = Object.entries(DungeonIdToName)
    .sort((a, b) => a[1].localeCompare(b[1]))
    .find(
      ([dungeonID, dungeonName], i) =>
        fortifiedPercentiles[i] === lowestFortifiedPercentile,
    )?.[1];

  const lowestTyrannicalPercentile = Math.min(...tyrannicalPercentiles);
  const lowestTyrannicalDungeon = Object.entries(DungeonIdToName)
    .sort((a, b) => a[1].localeCompare(b[1]))
    .find(
      ([dungeonID, dungeonName], i) =>
        tyrannicalPercentiles[i] === lowestTyrannicalPercentile,
    )?.[1];

  return (
    <Box>
      <Text fontWeight="bold" fontSize="xl">
        Your Key Percentiles:
      </Text>
      <Text fontSize="sm">
        Shows the percentile of title range keys equal to or lower than the key
        level you have completed for each dungeon{" "}
        <Tooltip
          label={
            "E.g. if your fortified BRH percentile is 0.5, your key is equal to or higher than 50% of the fortified BRH keys in the title range."
          }
        >
          <InfoIcon />
        </Tooltip>
      </Text>

      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Box>
          <Text fontWeight="bold" fontSize="lg">
            Fortified
          </Text>
          {Object.entries(DungeonIdToName)
            .sort((a, b) => a[1].localeCompare(b[1]))
            .map(([dungeonID, dungeonName], i) => {
              return (
                <Box key={dungeonID}>
                  <Text as="b" display="inline" fontSize="sm">
                    {dungeonName}
                  </Text>
                  <Text display="inline" fontSize="sm">
                    : {fortifiedPercentiles[i]}
                  </Text>
                </Box>
              );
            })}
          <Text fontSize="sm" as="i" display="inline">
            Lowest Relative Fortified Key: {lowestFortifiedPercentile} -{" "}
            {lowestFortifiedDungeon}
          </Text>
        </Box>

        <Box>
          <Text fontWeight="bold" fontSize="lg">
            Tyrannical
          </Text>
          {Object.entries(DungeonIdToName)
            .sort((a, b) => a[1].localeCompare(b[1]))
            .map(([dungeonID, dungeonName], i) => {
              return (
                <Box key={dungeonID}>
                  <Text as="b" fontSize="sm" display="inline">
                    {dungeonName}
                  </Text>
                  <Text display="inline" fontSize="sm">
                    : {tyrannicalPercentiles[i]}
                  </Text>
                </Box>
              );
            })}
          <Text fontSize="sm" as="i" display="inline">
            Lowest Relative Tyrannical Key: {lowestTyrannicalPercentile} -{" "}
            {lowestTyrannicalDungeon}
          </Text>
        </Box>
      </Grid>
    </Box>
  );
};

export default TitleCharCompare;

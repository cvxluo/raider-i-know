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
        </Box>
      </Grid>
    </Box>
  );
};

export default TitleCharCompare;

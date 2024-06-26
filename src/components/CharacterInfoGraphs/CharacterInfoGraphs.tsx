"use client";

import { Character, Run } from "@/utils/types";

import { Box, Heading, Text } from "@chakra-ui/react";

import DungeonCountChart from "@/components/CharacterInfoGraphs/DungeonCountChart";
import FrequentlyPlayedWithTree from "@/components/CharacterInfoGraphs/FrequentlyPlayedWithTree";
import RunLevelPie from "@/components/CharacterInfoGraphs/RunLevelPie";
import FrequenTeamsTree from "./FrequentTeamsTree";

const CharacterInfoGraphs = ({
  character,
  characterRuns,
}: {
  character: Character | null;
  characterRuns: Run[];
}) => {
  return (
    <Box>
      <Text>
        Please note that these statistics are not reflective of all M+ runs -
        only the ones stored in the database.
      </Text>
      <Heading size="md">Runs</Heading>
      <Text>Total Runs in Database: {characterRuns.length}</Text>
      <DungeonCountChart runs={characterRuns} />

      <Heading size="md">Frequently Played With</Heading>
      <FrequentlyPlayedWithTree runs={characterRuns} />

      <Heading size="md">Frequent Teams Played In</Heading>
      <FrequenTeamsTree runs={characterRuns} />

      <Heading size="md">Key Levels</Heading>
      <RunLevelPie runs={characterRuns} />
    </Box>
  );
};

export default CharacterInfoGraphs;

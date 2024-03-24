"use client";
import { getCharacterByRIOID } from "@/actions/mongodb/character";
import {
  getPopulatedRunsWithCharacter,
  getRunsWithCharacter,
} from "@/actions/mongodb/run";
import { Character, Run, RunReducedRoster } from "@/utils/types";
// note that since this page uses apex charts, this can't be a server component

import { Skeleton } from "@chakra-ui/react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import DungeonCountChart from "@/components/CharacterInfoGraphs/DungeonCountChart";
import FrequentlyPlayedWithTree from "@/components/CharacterInfoGraphs/FrequentlyPlayedWithTree";
import RunLevelPie from "@/components/CharacterInfoGraphs/RunLevelPie";

const CharacterDataPage = ({ params }: { params: { characterId: string } }) => {
  const characterId = params.characterId;
  const [character, setCharacter] = useState<Character | null>(null);
  const [characterRuns, setCharacterRuns] = useState<Run[] | []>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    getCharacterByRIOID(parseInt(characterId)).then((char) => {
      if (char === null) {
        setError(true);
        setIsLoaded(true);
        return;
      }
      setCharacter(char);

      getPopulatedRunsWithCharacter(char).then((runs) => {
        setCharacterRuns(runs);
        setIsLoaded(true);
        console.log(runs);
      });
    });
  }, []);

  return (
    <Box maxW="6xl" mx="auto" p={4}>
      <Heading>
        {character ? character.name : <Skeleton>Loading</Skeleton>}
      </Heading>
      <Heading size="md">ID: {characterId}</Heading>
      <Skeleton isLoaded={isLoaded}>
        <Box
          mt={4}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
        >
          <Text>
            Please note that these statistics are not reflective of all M+ runs
            - only the ones stored in the database.
          </Text>
          <Heading size="md">Runs</Heading>
          <Text>Total Runs in Database: {characterRuns.length}</Text>
          <DungeonCountChart runs={characterRuns} />

          <Heading size="md">Frequently Played With</Heading>
          <FrequentlyPlayedWithTree runs={characterRuns} />

          <Heading size="md">Key Levels</Heading>
          <RunLevelPie runs={characterRuns} />
        </Box>
      </Skeleton>
    </Box>
  );
};

export default CharacterDataPage;

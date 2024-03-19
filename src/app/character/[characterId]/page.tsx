"use client";
import { getCharacter, getCharacterByRIOID } from "@/actions/mongodb/character";
import { getRunsWithCharacter } from "@/actions/mongodb/run";
import { getRunsForCharacter } from "@/actions/raiderio/character_runs";
import { Character, Run, RunReducedRoster } from "@/utils/types";
// note that since this page uses apex charts, this can't be a server component

import { Link, Skeleton, Spacer } from "@chakra-ui/react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DungeonCountChart = ({ runs }: { runs: RunReducedRoster[] }) => {
  const dungeonNames = runs.reduce((acc, run) => {
    if (!acc.includes(run.dungeon.name)) {
      acc.push(run.dungeon.name);
    }
    return acc;
  }, [] as string[]);

  const dungeonCountData = runs.reduce(
    (acc, run) => {
      acc[run.dungeon.name] = acc[run.dungeon.name]
        ? acc[run.dungeon.name] + 1
        : 1;
      return acc;
    },
    {} as { [key: string]: number },
  );

  return (
    <Chart
      options={{
        chart: {
          type: "bar",
        },
        xaxis: {
          categories: dungeonNames,
        },
      }}
      series={[
        {
          name: "Dungeons",
          data: dungeonNames.map((name) => dungeonCountData[name]),
        },
      ]}
      type="bar"
      width={"100%"}
      height={400}
    />
  );
};

const CharacterDataPage = ({ params }: { params: { characterId: string } }) => {
  const characterId = params.characterId;
  const [character, setCharacter] = useState<Character | null>(null);
  const [characterRuns, setCharacterRuns] = useState<RunReducedRoster[] | null>(
    null,
  );
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

      getRunsWithCharacter(char).then((runs) => {
        setCharacterRuns(runs);
        setIsLoaded(true);
        console.log(runs);
      });
    });
  }, []);

  return (
    <Box maxW="6xl" mx="auto" py={4}>
      <Heading>
        {character ? character.name : <Skeleton>Loading</Skeleton>}
      </Heading>
      <Heading size="md">{characterId}</Heading>
      <Skeleton isLoaded={isLoaded}>
        <Box
          mt={4}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
        >
          <Heading size="md">Runs</Heading>
          <DungeonCountChart runs={characterRuns || []} />
        </Box>
      </Skeleton>
    </Box>
  );
};

export default CharacterDataPage;

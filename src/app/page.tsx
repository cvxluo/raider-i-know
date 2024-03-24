"use client";

import dynamic from "next/dynamic";
const CharForceGraph = dynamic(() => import("@/components/CharForceGraph"), {
  ssr: false,
});

import CharacterSelector from "@/components/CharacterSelector";
import { testAppendingLayer, testSaveTopAffixes } from "@/utils/testfuncs";
import { Character, CharacterGraph } from "@/utils/types";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { getCharacter } from "@/actions/mongodb/character";
import GraphOptionsSelector from "@/components/GraphOptionsSelector";
import DataOptionsSelector from "@/components/DataOptionsSelector";
import {
  getRunsForAllCharacters,
  purgeCharacters,
  purgeRuns,
} from "@/actions/mongodb/data_collection/character_trawling";
import { getClassCounts } from "@/actions/mongodb/aggregations/character_stats";
import {
  getDungeonCounts,
  getRunLevels,
} from "@/actions/mongodb/aggregations/run_stats";
import { QuestionIcon } from "@chakra-ui/icons";
import Link from "next/link";

export default function Home() {
  const [mainChar, setMainChar] = useState<Character>({
    name: "",
    region: {
      name: "",
      slug: "",
      short_name: "",
    },
    realm: {
      id: 0,
      name: "",
      slug: "",
      connected_realm_id: 0,
      locale: "",
    },
  });

  const loadButtons = false;

  const [graphOptions, setGraphOptions] = useState({
    showLabels: false,
    degree: 2,
    runLimit: 15,
    treeMode: true,
    radialMode: true,
  });

  const [charError, setCharError] = useState(false);

  const handleCharSubmit = async (charInfo: Character) => {
    getCharacter(charInfo.region.name, charInfo.realm.name, charInfo.name).then(
      (char) => {
        if (char === null) {
          setCharError(true);
          return;
        } else {
          setMainChar(char);
          setCharError(false);
        }
      },
    );
  };

  const handleTestSaveLimited = async () => {
    await getRunsForAllCharacters(0, 25);
  };

  const handleTestSaveLessLimited = async () => {
    await getRunsForAllCharacters(0, 20);
  };

  const handleDeleteRuns = async () => {
    const purgeResult = await purgeRuns(20);
    console.log(purgeResult);
  };

  const handleDeleteChars = async () => {
    const purgeResult = await purgeCharacters();
    console.log(purgeResult);
  };

  const handleSaveTopRuns = async () => {
    await testSaveTopAffixes();
  };

  const test = async () => {
    const result = await getRunLevels();
    console.log(result);
  };

  return (
    <Box>
      {loadButtons && (
        <Box>
          <Button onClick={test}>Test</Button>
          <Button onClick={handleTestSaveLimited}>Test Save Runs 25+</Button>
          <Button onClick={handleTestSaveLessLimited}>
            Test Save Runs 20+
          </Button>
          <Button onClick={handleDeleteRuns}>Delete Runs</Button>
          <Button onClick={handleDeleteChars}>Delete Characters</Button>
          <Button onClick={handleSaveTopRuns}>Save Top Runs</Button>
        </Box>
      )}
      <Box maxW="6xl" mx="auto" py={4} px={{ base: 4, md: 8 }}>
        <CharacterSelector handleCharSubmit={handleCharSubmit} />
        {charError && (
          <Alert status="error">
            <AlertIcon />

            <AlertTitle>Character not found</AlertTitle>
            <Link href="/faq">
              <QuestionIcon />
            </Link>
          </Alert>
        )}
        <br />

        <DataOptionsSelector
          graphOptions={graphOptions}
          setGraphOptions={setGraphOptions}
        />
        <br />

        <GraphOptionsSelector
          graphOptions={graphOptions}
          setGraphOptions={setGraphOptions}
        />
      </Box>
      <CharForceGraph mainChar={mainChar} graphOptions={graphOptions} />
    </Box>
  );
}

"use client";

import { getProfile } from "@/actions/raiderio/characters/profile";
import { getRuns } from "@/actions/raiderio/mythic_plus/runs";

import { useEffect, useState } from "react";
import { Box, Button, Input } from "@chakra-ui/react";
import {
  createRun,
  createRunFromID,
  getRunFromID,
} from "@/actions/mongodb/run";
import {
  testGetRuns,
  testGetTopDungeonRuns,
  testGetTopRuns,
} from "@/utils/testfuncs";
import CharacterSelector from "@/components/CharacterSelector";
import { getCharacter } from "@/actions/mongodb/character";

export default function Home() {
  const [characterName, setCharacterName] = useState("");
  const [runID, setRunID] = useState(0);

  const test = async () => {
    testGetTopRuns();
  };

  const handleCharSubmit = async (charInfo) => {
    const { region, realm, name } = charInfo;

    const profile = await getCharacter(region, realm, name);

    console.log(profile);
  };

  return (
    <Box>
      <Input
        placeholder="Run ID"
        value={runID}
        onChange={(e) => {
          setRunID(e.target.value);
        }}
      ></Input>
      <Button
        onClick={() => {
          test();
        }}
      >
        Test
      </Button>

      <CharacterSelector handleCharSubmit={handleCharSubmit} />
    </Box>
  );
}

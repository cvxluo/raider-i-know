"use client";

import { getProfile } from "@/actions/raiderio/characters/profile";
import { getRuns } from "@/actions/raiderio/mythic_plus/runs";

import { useEffect, useState } from "react";
import { Box, Button, Input, List } from "@chakra-ui/react";
import {
  createRun,
  createRunFromID,
  getLimitedRunsAtDegree,
  getRunFromID,
  getRunsWithCharacter,
} from "@/actions/mongodb/run";
import {
  testGetRuns,
  testGetTopDungeonRuns,
  testGetTopRuns,
} from "@/utils/testfuncs";
import CharacterSelector from "@/components/CharacterSelector";
import { getCharacter } from "@/actions/mongodb/character";
import { countCharactersInRuns } from "@/utils/funcs";

export default function Home() {
  const [characterName, setCharacterName] = useState("");
  const [runID, setRunID] = useState(0);

  const [runsWithChar, setRunsWithChar] = useState([]);
  const [charCounts, setCharCounts] = useState({});

  const test = async () => {
    testGetTopRuns();
  };

  const handleCharSubmit = async (charInfo) => {
    const { region, realm, name } = charInfo;

    console.log(charInfo);

    const runs = await getRunsWithCharacter({ region, realm, name });
    setRunsWithChar(runs);

    const limited = await getLimitedRunsAtDegree(1, charInfo, 10);

    console.log(limited);
  };

  useEffect(() => {
    setCharCounts(countCharactersInRuns(runsWithChar));
  }, [runsWithChar]);

  return (
    <Box>
      <Button
        onClick={() => {
          test();
        }}
      >
        Test
      </Button>

      <CharacterSelector handleCharSubmit={handleCharSubmit} />

      <List>
        {Object.keys(charCounts).map((char) => {
          return (
            <li key={char}>
              {char} - {charCounts[char]}
            </li>
          );
        })}
      </List>
    </Box>
  );
}

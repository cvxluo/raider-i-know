"use client";

import {
  getLimitedRunsAtDegree,
  getRunsWithCharacter,
} from "@/actions/mongodb/run";
import CharacterSelector from "@/components/CharacterSelector";
import { countCharactersInRuns, filterRunsToLimit } from "@/utils/funcs";
import { testSaveTopAffixes } from "@/utils/testfuncs";
import { Box, Button, List } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Home() {
  const [characterName, setCharacterName] = useState("");
  const [runID, setRunID] = useState(0);

  const [runsWithChar, setRunsWithChar] = useState([]);
  const [charCounts, setCharCounts] = useState({});

  const test = async () => {
    testSaveTopAffixes();

    // testGetRuns();
  };

  const handleCharSubmit = async (charInfo) => {
    const { region, realm, name } = charInfo;

    console.log(charInfo);

    const runs = await getRunsWithCharacter({ region, realm, name });
    const limitedRuns = filterRunsToLimit(runs, 10, [charInfo]);
    setRunsWithChar(limitedRuns);

    const limited = await getLimitedRunsAtDegree(2, charInfo, 30);

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

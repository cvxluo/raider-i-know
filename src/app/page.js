"use client";

import {
  getLimitedRunsAtDegree,
  getRunsWithCharacter,
} from "@/actions/mongodb/run";
import CharForceGraph from "@/components/CharForceGraph";
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
  const [limitedRuns, setLimitedRuns] = useState([]);
  const [mainChar, setMainChar] = useState({});

  const test = async () => {
    testSaveTopAffixes();

    // testGetRuns();
  };

  const handleCharSubmit = async (charInfo) => {
    const { region, realm, name } = charInfo;
    setMainChar(charInfo);

    console.log(charInfo);

    const runs = await getRunsWithCharacter({ region, realm, name });
    const limitedRuns = filterRunsToLimit(runs, 30, [charInfo]);
    setRunsWithChar(limitedRuns);

    const limited = await getLimitedRunsAtDegree(1, charInfo, 30);
    setLimitedRuns(limited);

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

      <CharForceGraph degrees={limitedRuns} mainChar={mainChar} />

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

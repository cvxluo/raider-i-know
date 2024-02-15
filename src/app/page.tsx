"use client";

import { getRunsWithCharacter } from "@/actions/mongodb/run";

import { getCharGraph } from "@/actions/mongodb/run_graphs";

import dynamic from "next/dynamic";
const CharForceGraph = dynamic(() => import("@/components/CharForceGraph"), {
  ssr: false,
});

import CharacterSelector from "@/components/CharacterSelector";
import { countCharactersInRuns, filterRunsToLimit } from "@/utils/funcs";
import { testSaveTopAffixes } from "@/utils/testfuncs";
import { Character, CharacterNode, Run } from "@/utils/types";
import { Box, Button, List } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Home() {
  const [characterName, setCharacterName] = useState("");
  const [runID, setRunID] = useState(0);

  const [runsWithChar, setRunsWithChar] = useState<Run[]>([]);
  const [charCounts, setCharCounts] = useState<{ [key: string]: number }>({});
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
  const [charGraph, setCharGraph] = useState<CharacterNode[][]>([]);

  const handleCharSubmit = async (charInfo: Character) => {
    const { region, realm, name } = charInfo;
    setMainChar(charInfo);

    console.log(charInfo);

    const runs = await getRunsWithCharacter({ region, realm: realm, name });
    const limitedRuns = filterRunsToLimit(runs, 30, [charInfo]);
    setRunsWithChar(limitedRuns);

    const charGraph = await getCharGraph(charInfo, 2, 30, [charInfo]);
    setCharGraph(charGraph);
    console.log(charGraph);
  };

  useEffect(() => {
    setCharCounts(countCharactersInRuns(runsWithChar));
  }, [runsWithChar]);

  const handleTest = async () => {
    const res = await testSaveTopAffixes();
    console.log(res);
  };

  return (
    <Box>
      <Button onClick={handleTest}>test</Button>
      <CharacterSelector handleCharSubmit={handleCharSubmit} />

      <CharForceGraph mainChar={mainChar} charGraph={charGraph} />

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

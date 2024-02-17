"use client";

import { getRunsWithCharacter } from "@/actions/mongodb/run";

import { getCharGraph } from "@/actions/mongodb/run_graphs";

import dynamic from "next/dynamic";
const CharForceGraph = dynamic(() => import("@/components/CharForceGraph"), {
  ssr: false,
});

import CharacterSelector from "@/components/CharacterSelector";
import { testSaveTopAffixes } from "@/utils/testfuncs";
import { Character, CharacterNode, Run } from "@/utils/types";
import { Box, Button, List, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getCharacter } from "@/actions/mongodb/character";

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
  const [charGraph, setCharGraph] = useState<CharacterNode[][]>([]);
  const [loading, setLoading] = useState(false);

  const handleCharSubmit = async (charInfo: Character) => {
    setLoading(true);
    setMainChar(charInfo);

    const retrievedMainChar = await getCharacter(
      charInfo.region.name,
      charInfo.realm.name,
      charInfo.name,
    );

    console.log(retrievedMainChar);

    const charGraph = await getCharGraph(retrievedMainChar, 2, 30, [
      retrievedMainChar,
    ]);
    setCharGraph(charGraph);
    console.log(charGraph);

    setLoading(false);
  };

  const handleTest = async () => {
    const res = await testSaveTopAffixes();
    console.log(res);
  };

  return (
    <Box>
      <Button onClick={handleTest}>test</Button>
      <CharacterSelector handleCharSubmit={handleCharSubmit} />

      {loading && <Spinner />}

      <CharForceGraph mainChar={mainChar} charGraph={charGraph} />
    </Box>
  );
}

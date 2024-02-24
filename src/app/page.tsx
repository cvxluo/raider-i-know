"use client";

import { getRunsWithCharacter } from "@/actions/mongodb/run";

import { getCharGraph, getDenseCharGraph } from "@/actions/mongodb/run_graphs";

import dynamic from "next/dynamic";
const CharForceGraph = dynamic(() => import("@/components/CharForceGraph"), {
  ssr: false,
});

import CharacterSelector from "@/components/CharacterSelector";
import { testSaveTopAffixes } from "@/utils/testfuncs";
import { Character, CharacterGraph, CharacterNode, Run } from "@/utils/types";
import { Box, Button, List, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getCharacter } from "@/actions/mongodb/character";
import GraphOptionsSelector from "@/components/GraphOptionsSelector";
import DataOptionsSelector from "@/components/DataOptionsSelector";

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
  const [charGraph, setCharGraph] = useState<CharacterGraph>({
    nodes: [],
    links: [],
  });
  const [loading, setLoading] = useState(false);

  const [graphOptions, setGraphOptions] = useState({
    showLabels: false,
    degree: 2,
    runLimit: 15,
    treeMode: false,
    radialMode: false,
  });

  const handleCharSubmit = async (charInfo: Character) => {
    setLoading(true);
    setMainChar(charInfo);

    const retrievedMainChar = await getCharacter(
      charInfo.region.name,
      charInfo.realm.name,
      charInfo.name,
    );

    console.log(retrievedMainChar);

    let charGraph;
    if (graphOptions.treeMode) {
      console.log("tree mode");
      charGraph = await getCharGraph(
        retrievedMainChar,
        graphOptions.degree,
        graphOptions.runLimit,
        [retrievedMainChar],
      );
    } else {
      charGraph = await getDenseCharGraph(
        retrievedMainChar,
        graphOptions.degree,
        graphOptions.runLimit,
        [retrievedMainChar],
      );
    }

    setCharGraph(charGraph);
    console.log(charGraph);
    console.log(graphOptions);

    setLoading(false);
  };

  return (
    <Box>
      <CharacterSelector handleCharSubmit={handleCharSubmit} />
      <DataOptionsSelector
        graphOptions={graphOptions}
        setGraphOptions={setGraphOptions}
      />
      <GraphOptionsSelector
        graphOptions={graphOptions}
        setGraphOptions={setGraphOptions}
      />

      {loading && <Spinner />}

      <CharForceGraph
        mainChar={mainChar}
        charGraph={charGraph}
        graphOptions={graphOptions}
      />
    </Box>
  );
}

"use client";

import dynamic from "next/dynamic";
const CharForceGraph = dynamic(() => import("@/components/CharForceGraph"), {
  ssr: false,
});

import { getCharacter } from "@/actions/mongodb/character";
import CharacterSelector from "@/components/CharacterSelector";
import DataOptionsSelector from "@/components/DataOptionsSelector";
import GraphOptionsSelector from "@/components/GraphOptionsSelector";
import { testSaveTopAffixes } from "@/utils/testfuncs";
import { Character } from "@/utils/types";
import { QuestionIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

export default function GraphBuilder() {
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

  const [expandOptions, setExpandOptions] = useState(true);

  const [graphOptions, setGraphOptions] = useState({
    showLabels: false,
    degree: 3,
    runLimit: 15,
    treeMode: true,
    radialMode: true,
    nodeForceStrength: -100,
    linkDistance: 30,
    runBasedLinks: false,
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
  return (
    <Box>
      <Button onClick={() => testSaveTopAffixes()}>Test</Button>
      <Accordion
        allowToggle
        onChange={() => {
          setExpandOptions(!expandOptions);
        }}
        defaultIndex={[0]}
        pb={4}
        reduceMotion={true}
      >
        <AccordionItem>
          <AccordionPanel pb={0}>
            <Box maxW="6xl" mx="auto" pt={2} px={4}>
              <CharacterSelector handleCharSubmit={handleCharSubmit} />
              {charError && (
                <Alert status="error" mt={2} variant="top-accent">
                  <AlertIcon />

                  <AlertTitle>Character not found</AlertTitle>
                  <Link href="/faq">
                    <QuestionIcon />
                  </Link>
                </Alert>
              )}
              <Spacer height="10px" />

              <DataOptionsSelector
                graphOptions={graphOptions}
                setGraphOptions={setGraphOptions}
              />
              <Spacer height="10px" />
              <GraphOptionsSelector
                graphOptions={graphOptions}
                setGraphOptions={setGraphOptions}
              />
            </Box>
          </AccordionPanel>
          <AccordionButton p={0}>
            <Flex mx="auto">
              <AccordionIcon />
            </Flex>
          </AccordionButton>
        </AccordionItem>
      </Accordion>
      <CharForceGraph
        mainChar={mainChar}
        graphOptions={graphOptions}
        large={!expandOptions}
      />
    </Box>
  );
}

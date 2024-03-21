"use client";

import { getCharacter } from "@/actions/mongodb/character";
import CharacterSelector from "@/components/CharacterSelector";
import { Box, Text, Input, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CharacterInfoPage = () => {
  const router = useRouter();
  return (
    <Box maxW="6xl" mx="auto" py={4}>
      <Heading>Character Statistics</Heading>
      <CharacterSelector
        handleCharSubmit={(char) => {
          // TODO: note slight redundancy in getting the character twice
          // we get it here, and we also get it immediately upon navigating to the character's info page
          getCharacter(char.region.name, char.realm.name, char.name).then(
            (char) => {
              router.push(`/character/${char.id}`);
            },
          );
        }}
      />
    </Box>
  );
};

export default CharacterInfoPage;

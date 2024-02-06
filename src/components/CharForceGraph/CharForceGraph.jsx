import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Realms, Regions } from "@/utils/consts";

import { ForceGraph2D } from "react-force-graph";
import { slugCharacter } from "@/utils/funcs";

const CharForceGraph = ({ degrees, mainChar, charGraph }) => {
  /*
  const characters = [
    {
      id: slugCharacter(mainChar),
      name: mainChar.name,
      fy: 0,
    },
  ];
  
  for (let i = 0; i < degrees.length; i++) {
    const layerChars = degrees[i]
      .map((run) => {
        return run.roster;
      })
      .flat();
    characters.push(
      ...layerChars
        .filter((char) => {
          return !characters.find((c) => c.id === slugCharacter(char));
        })
        .map((char) => {
          return {
            id: slugCharacter(char),
            name: char.name,
            fy: i * 100 + 1,
          };
        }),
    );

    console.log(characters);
  }
  */

  const characters = charGraph
    .map((layer, i) => {
      return layer.map((nodeInfo, j) => {
        return {
          id: slugCharacter(nodeInfo.character),
          name: nodeInfo.character.name,
          fx: j * 10,
          fy: i * 100 + 1,
        };
      });
    })
    .flat();

  const links = charGraph
    .map((layer) => {
      return layer.map((nodeInfo) => {
        return {
          source: slugCharacter(
            nodeInfo.parentCharacter ? nodeInfo.parentCharacter : mainChar,
          ),
          target: slugCharacter(nodeInfo.character),
        };
      });
    })
    .flat();

  return (
    <Box>
      <ForceGraph2D
        graphData={{
          nodes: characters,
          links: links,
        }}
      />
    </Box>
  );
};

export default CharForceGraph;

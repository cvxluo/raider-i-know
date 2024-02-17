import { Box } from "@chakra-ui/react";

import { slugCharacter } from "@/utils/funcs";
import { Character, CharacterNode } from "@/utils/types";
import { ForceGraph2D } from "react-force-graph";

const CharForceGraph = ({
  mainChar,
  charGraph,
}: {
  mainChar: Character;
  charGraph: CharacterNode[][];
}) => {
  console.log("CHAR GRAPH", charGraph);
  console.log(
    charGraph.map((layer) => {
      return layer.map((node) => {
        return node.character;
      });
    }),
  );
  console.log(
    charGraph.map((layer) => {
      return layer.map((node) => {
        return node.parentCharacter;
      });
    }),
  );

  const characters = charGraph
    .map((layer, i) => {
      return layer.map((nodeInfo, j) => {
        return {
          id: nodeInfo.character.id,
          name: nodeInfo.character.name,
        };
      });
    })
    .flat();

  const links = charGraph
    .map((layer) => {
      return layer.map((nodeInfo) => {
        return {
          source: nodeInfo.parentCharacter.id,
          target: nodeInfo.character.id,
        };
      });
    })
    .flat();

  characters[0] = {
    ...characters[0],
    fx: 0,
    fy: 0,
  } as {
    id: number;
    name: string;
    fx: number;
    fy: number;
    nodeLabel: string;
    nodeColor: string;
  };
  console.log(characters);
  console.log(links);

  return (
    <Box>
      <ForceGraph2D
        graphData={{
          nodes: characters,
          links: links,
        }}
        nodeLabel={(node) => node.name}
        nodeColor={(node) => {
          if (node.id === characters[0].id) {
            return "red";
          } else {
            return "blue";
          }
        }}
      />
    </Box>
  );
};

export default CharForceGraph;

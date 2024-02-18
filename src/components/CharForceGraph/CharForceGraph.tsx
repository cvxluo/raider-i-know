import { Box } from "@chakra-ui/react";

import { slugCharacter } from "@/utils/funcs";
import { Character, CharacterGraph, CharacterNode } from "@/utils/types";
import { ForceGraph2D } from "react-force-graph";

const CharForceGraph = ({
  mainChar,
  charGraph,
}: {
  mainChar: Character;
  charGraph: CharacterGraph;
}) => {
  return (
    <Box>
      <ForceGraph2D
        graphData={{
          nodes: charGraph.nodes,
          links: charGraph.links,
        }}
        nodeLabel={(node) => node.name}
        nodeVal={(node) => {
          return (
            4 - (charGraph.nodes.find((n) => n.id === node.id)?.layer || 1)
          );
        }}
        nodeColor={(node) => {
          return (
            charGraph.nodes.find((n) => n.id === node.id)?.nodeColor || "blue"
          );
        }}
      />
    </Box>
  );
};

export default CharForceGraph;

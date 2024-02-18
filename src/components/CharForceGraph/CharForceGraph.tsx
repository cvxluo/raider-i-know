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
      />
    </Box>
  );
};

export default CharForceGraph;

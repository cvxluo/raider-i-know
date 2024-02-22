import { Box } from "@chakra-ui/react";

import { slugCharacter } from "@/utils/funcs";
import {
  Character,
  CharacterGraph,
  CharacterNode,
  GraphOptions,
} from "@/utils/types";
import { ForceGraph2D } from "react-force-graph";

const CharForceGraph = ({
  mainChar,
  charGraph,
  graphOptions,
}: {
  mainChar: Character;
  charGraph: CharacterGraph;
  graphOptions: GraphOptions;
}) => {
  const canvasObject = (node: any, ctx: CanvasRenderingContext2D) => {
    const label = node.name;
    const fontSize = 12;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = node.nodeColor || "black";
    ctx.fillText(label, node.x as number, node.y as number);
  };

  const dagMode = graphOptions.treeMode
    ? graphOptions.radialMode
      ? "radialout"
      : "td"
    : undefined;

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
        nodeCanvasObject={graphOptions.showLabels ? canvasObject : undefined}
        dagMode={dagMode}
      />
    </Box>
  );
};

export default CharForceGraph;

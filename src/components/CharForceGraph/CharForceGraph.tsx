import { Box, Spinner } from "@chakra-ui/react";

import { Character, CharacterGraph, GraphOptions } from "@/utils/types";
import { ForceGraph2D } from "react-force-graph";
import { useEffect, useState } from "react";

import { getCharGraph, getDenseCharGraph } from "@/actions/mongodb/run_graphs";

const CharForceGraph = ({
  mainChar,
  graphOptions,
}: {
  mainChar: Character;
  graphOptions: GraphOptions;
}) => {
  const [charGraph, setCharGraph] = useState<CharacterGraph>({
    nodes: [],
    links: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(mainChar);
    setLoading(true);

    if (mainChar.name === "") {
      return;
    }

    if (graphOptions.treeMode) {
      console.log("tree mode");
      getCharGraph(mainChar, graphOptions.degree, graphOptions.runLimit, [
        mainChar,
      ]).then((graph) => {
        setCharGraph(graph);
        setLoading(false);
      });
    } else {
      getDenseCharGraph(mainChar, graphOptions.degree, graphOptions.runLimit, [
        mainChar,
      ]).then((graph) => {
        setCharGraph(graph);
        setLoading(false);
      });
    }
  }, [mainChar]);

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
      {loading && <Spinner />}
      <ForceGraph2D
        graphData={{
          nodes: charGraph.nodes,
          links: charGraph.links,
        }}
        nodeLabel={(node) => node.name}
        nodeVal={(node) => {
          return (
            Math.max(...charGraph.nodes.map((char) => char.layer || 0)) -
            (charGraph.nodes.find((n) => n.id === node.id)?.layer || 1)
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

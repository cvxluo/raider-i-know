import {
  Box,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/react";

import { Character, CharacterGraph, GraphOptions } from "@/utils/types";
import { ForceGraph2D } from "react-force-graph";
import { useEffect, useState } from "react";
import { Run } from "@/utils/types";

import {
  appendNextLayer,
  getCharGraph,
  getDenseCharGraph,
  graphDataToForceGraph,
} from "@/actions/mongodb/run_graphs";
import { getPopulatedRunsWithCharacter } from "@/actions/mongodb/run";

const CharForceGraph = ({
  mainChar,
  graphOptions,
}: {
  mainChar: Character;
  graphOptions: GraphOptions;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNode, setSelectedNode] = useState<Character | null>(null);

  const [graphInfo, setGraphInfo] = useState<{
    layers: Character[][];
    linkCounts: { [key: number]: { [key: number]: number } };
    runs: { [key: number]: Run[] };
  }>({
    layers: [],
    linkCounts: {},
    runs: {},
  });
  const [charGraph, setCharGraph] = useState<CharacterGraph>({
    nodes: [],
    links: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(mainChar);

    if (mainChar.name === "") {
      return;
    }

    setLoading(true);

    /*
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
    */

    retrieveGraphData(mainChar).then(() => {
      setLoading(false);
    });
  }, [mainChar]);

  const retrieveGraphData = async (char: Character) => {
    const layers = [[char]];
    const linkCounts: {
      [key: number]: { [key: number]: number };
    } = {};
    linkCounts[char.id as number] = {};
    const charId = char.id as number;
    const runs: { [key: number]: Run[] } = {};
    runs[charId] = await getPopulatedRunsWithCharacter(char);
    for (let i = 0; i < graphOptions.degree; i++) {
      await appendNextLayer(layers, linkCounts, runs);
      // TODO: technically an antipattern, as the objects in state are not supposed to be mutable,
      // and we are mutating them each time we appendNextLayer - maybe better approach is to use getNextLayer directly?
      setGraphInfo({ layers, linkCounts, runs });
    }
  };

  // get graph from info
  useEffect(() => {
    const graph = graphDataToForceGraph(
      graphInfo.layers,
      graphInfo.linkCounts,
      graphInfo.runs,
      !graphOptions.treeMode,
      graphOptions.runLimit,
      graphOptions.degree,
    );
    setCharGraph(graph);
  }, [graphInfo, graphOptions]);

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

  console.log(charGraph);

  return (
    <Box>
      {loading && <Spinner />}
      <Button onClick={() => onOpen()}>Test modal</Button>
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
        onNodeClick={(node) => {
          setSelectedNode(node);
          onOpen();
          console.log(node);
          console.log(charGraph);
        }}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedNode ? selectedNode.name : "Character not found"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>test</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CharForceGraph;

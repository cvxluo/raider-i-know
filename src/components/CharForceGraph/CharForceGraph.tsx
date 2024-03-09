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

import {
  appendNextLayer,
  getCharGraph,
  getDenseCharGraph,
} from "@/actions/mongodb/run_graphs";

const CharForceGraph = ({
  mainChar,
  graphOptions,
}: {
  mainChar: Character;
  graphOptions: GraphOptions;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNode, setSelectedNode] = useState<Character | null>(null);

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

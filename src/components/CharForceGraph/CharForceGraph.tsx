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
  List,
  ListItem,
  UnorderedList,
  Toast,
  useToast,
  Tooltip,
  HStack,
} from "@chakra-ui/react";

import { Character, CharacterGraph, GraphOptions } from "@/utils/types";
import { ForceGraph2D } from "react-force-graph";
import { useEffect, useRef, useState } from "react";
import { Run } from "@/utils/types";

import {
  appendNextLayer,
  getNextLayer,
} from "@/components/CharForceGraph/run_graphs";
import { graphDataToForceGraph } from "./GraphDataProcessing";
import { getPopulatedRunsWithCharacter } from "@/actions/mongodb/run";
import { DungeonIdToName, DungeonIds } from "@/utils/consts";
import { useRouter } from "next/navigation";
import {
  InfoIcon,
  InfoOutlineIcon,
  QuestionIcon,
  QuestionOutlineIcon,
} from "@chakra-ui/icons";
import CharGraphModal from "./CharGraphModal";

var lastRequest = 0;

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

const CharForceGraph = ({
  mainChar,
  graphOptions,
  large,
}: {
  mainChar: Character;
  graphOptions: GraphOptions;
  large: boolean;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNode, setSelectedNode] = useState<Character | null>(null);

  const toast = useToast();

  const graphRef = useRef<any>();

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

  useEffect(() => {
    console.log(mainChar);

    // TODO: this is a hack - verifying mainChar is not null should be CharacterSelector responsibility,
    // but because mainChar can change (in region/realm), triggering the useEffect, we need to check here as well
    if (mainChar.name === "") {
      return;
    }

    lastRequest++;

    const retrievePromise = retrieveGraphData(
      mainChar,
      graphOptions.degree,
      lastRequest,
    );

    toast.promise(retrievePromise, {
      loading: {
        title: `Loading graph for ${mainChar.name}-${mainChar.realm.name} (${graphOptions.degree})`,
        isClosable: true,
      },
      success: {
        title: `Loaded graph for ${mainChar.name}-${mainChar.realm.name} (${graphOptions.degree})`,
        isClosable: true,
      },
      error: {
        title: "Error loading graph, try again later.",
        isClosable: true,
      },
    });
  }, [mainChar, graphOptions.degree]);

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    graph.d3Force("charge").strength(graphOptions.nodeForceStrength);
    // if runBasedLinks is true, we set the distance based on the number of runs between characters
    if (graphOptions.runBasedLinks) {
      graph.d3Force("link").distance((link: any) => {
        // TODO: hard coded 200 - if a link has more than 200 runs, we set to 0.1 of the default distance
        // could be more adaptable here
        return (
          Math.max((100 - link.numRuns) / 100, 0.1) * graphOptions.linkDistance
        );
      });
    } else {
      graph.d3Force("link").distance(graphOptions.linkDistance);
    }
  }, [graphRef, graphOptions.nodeForceStrength, graphOptions.linkDistance]);

  const retrieveGraphData = async (
    char: Character,
    degreeToRetrieve: number,
    reqNum: number,
  ) => {
    // check if we already have all the graph data needed
    if (
      degreeToRetrieve < graphInfo.layers.length &&
      graphInfo.layers[0][0].id === char.id
    ) {
      // Already loaded - success, close toast
      return;
    }
    // if we do not have all the graph data, but already retrieved some, use that as a basis
    // note that if the character id is different, we always skip this and start from scratch
    var layers = [[char]];
    var linkCounts: {
      [key: number]: { [key: number]: number };
    } = {};
    const charId = char.id as number;
    linkCounts[charId] = {};
    var runs: { [key: number]: Run[] } = {};
    runs[charId] = await getPopulatedRunsWithCharacter(char);

    if (
      graphInfo.layers.length !== 0 &&
      graphInfo.layers[0][0].id === char.id
    ) {
      layers = graphInfo.layers;
      linkCounts = graphInfo.linkCounts;
      runs = graphInfo.runs;
    }

    for (let i = layers.length; i < degreeToRetrieve + 1; i++) {
      const nextLayerData = await getNextLayer(layers, linkCounts, runs, i);
      layers = [...layers.slice(0, i + 1), nextLayerData.nextLayer];
      Object.keys(nextLayerData.nextLinks).forEach((source) => {
        linkCounts[parseInt(source)] =
          nextLayerData.nextLinks[parseInt(source)];
      });
      Object.keys(nextLayerData.nextRuns).forEach((charId) => {
        runs[parseInt(charId)] = nextLayerData.nextRuns[parseInt(charId)];
      });

      // TODO: hacky race condition check
      if (lastRequest !== reqNum) {
        // request changed, send an error toast
        throw new Error("Request changed");
      }

      setGraphInfo({ layers, linkCounts, runs });
    }
    // success, close toast
    return;
  };

  // get graph from info
  useEffect(() => {
    console.log("Graph Info", graphInfo);
    const graph = graphDataToForceGraph(
      graphInfo.layers,
      graphInfo.linkCounts,
      graphInfo.runs,
      !graphOptions.treeMode,
      graphOptions.runLimit,
      graphOptions.degree,
    );
    console.log("Graph data", graph);
    setCharGraph(graph);
  }, [graphInfo, graphOptions]);

  const dagMode = graphOptions.treeMode
    ? graphOptions.radialMode
      ? "radialout"
      : "td"
    : undefined;

  return (
    <Box
      w="100%"
      h="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        w="80%"
        h="80%"
        mb={2}
      >
        <ForceGraph2D
          ref={graphRef}
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
            // TODO: consider using onNodeHover to prevent graph moving on click
            setSelectedNode(node);
            onOpen();
          }}
          height={large ? window.innerHeight * 0.8 : window.innerHeight * 0.5}
          width={window.innerWidth * 0.8}
        />
      </Box>

      <CharGraphModal
        isOpen={isOpen}
        onClose={onClose}
        selectedNode={selectedNode}
        graphInfo={graphInfo}
      />
      <HStack>
        <Tooltip
          label={`${graphInfo.layers.flat().length} characters (${charGraph.nodes.length} displayed), ${Object.values(graphInfo.runs).flat().length} runs`}
        >
          <InfoIcon />
        </Tooltip>
        <Tooltip
          label={
            graphInfo.layers.length
              ? "Click on a node to see more info"
              : "Enter your character's info to see the graph"
          }
        >
          <QuestionIcon />
        </Tooltip>
      </HStack>
    </Box>
  );
};

export default CharForceGraph;

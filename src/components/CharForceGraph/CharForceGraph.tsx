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
import { DungeonIdToName, DungeonIds } from "@/utils/consts";

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
  }, [mainChar, graphOptions.degree]);

  const retrieveGraphData = async (char: Character) => {
    // check if we already have all the graph data needed
    if (
      graphOptions.degree < graphInfo.layers.length &&
      graphInfo.layers[0][0].id === char.id
    ) {
      return;
    }
    // if we do not have all the graph data, but already retrieved some, use that as a basis
    if (
      graphInfo.layers.length !== 0 &&
      graphInfo.layers[0][0].id === char.id
    ) {
      const layers = graphInfo.layers;
      const linkCounts = graphInfo.linkCounts;
      const runs = graphInfo.runs;
      for (let i = graphInfo.layers.length; i <= graphOptions.degree; i++) {
        await appendNextLayer(layers, linkCounts, runs);
        setGraphInfo({ layers, linkCounts, runs });
      }
      return;
    }
    // otherwise, start from scratch
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
  /*
  backgroundColor="#101020"
  linkColor={() => 'rgba(255,255,255,0.2)'}
  linkDirectionalParticles={2}
  linkDirectionalParticleWidth={2}
  */

  const mostPlayedWith = (char: Character, n = 5) => {
    const linkCounts = graphInfo.linkCounts[char.id as number];
    if (!linkCounts) {
      return [];
    }
    return Object.entries(linkCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([id, count]) => {
        return graphInfo.layers.flat().find((c) => c.id === parseInt(id))?.name;
      });
  };

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
        onNodeClick={(node) => {
          // TODO: consider using onNodeHover to prevent graph moving on click
          setSelectedNode(node);
          onOpen();
        }}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedNode ? selectedNode.name : "Character not found"}
          </ModalHeader>
          <ModalCloseButton />
          {selectedNode && graphInfo.runs && (
            <ModalBody>
              <Text as="b">
                Number of runs in database:{" "}
                {graphInfo.runs[selectedNode.id as number].length}
              </Text>
              <br />
              <Text as="b">Most Frequently Played With:</Text>
              <br />
              <UnorderedList>
                {
                  // shows most played with characters
                  mostPlayedWith(selectedNode as Character).map((char) => {
                    return <ListItem key={char}>{char}</ListItem>;
                  })
                }
              </UnorderedList>
              <Text as="b">Most Frequent Dungeons Runs:</Text>
              <br />
              <UnorderedList>
                {
                  // shows how many runs for each dungeon
                  DungeonIds.map((dungeonId) => {
                    return (
                      <ListItem key={dungeonId}>
                        {DungeonIdToName[dungeonId]}:{" "}
                        {
                          graphInfo.runs[selectedNode.id as number].filter(
                            (run) => run.dungeon.id === dungeonId,
                          ).length
                        }
                      </ListItem>
                    );
                  })
                }
              </UnorderedList>
            </ModalBody>
          )}

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

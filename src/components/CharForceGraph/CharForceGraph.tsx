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
import { useEffect, useRef, useState } from "react";
import { Run } from "@/utils/types";

import {
  appendNextLayer,
  getCharGraph,
  getDenseCharGraph,
  getNextLayer,
  graphDataToForceGraph,
} from "@/actions/mongodb/run_graphs";
import { getPopulatedRunsWithCharacter } from "@/actions/mongodb/run";
import { DungeonIdToName, DungeonIds } from "@/utils/consts";
import { useRouter } from "next/navigation";

const CharForceGraph = ({
  mainChar,
  graphOptions,
}: {
  mainChar: Character;
  graphOptions: GraphOptions;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNode, setSelectedNode] = useState<Character | null>(null);

  const graphRef = useRef<any>();

  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;

    graph.d3Force("charge").strength(graphOptions.nodeForceStrength);
    // if runBasedLinks is true, we set the distance based on the number of runs between characters
    if (graphOptions.runBasedLinks) {
      graph.d3Force("link").distance((link: any) => {
        // TODO: hard coded 200 - if a link has more than 200 runs, we set to 0.1 of the default distance
        // could be more adaptable here
        console.log(
          Math.max((100 - link.numRuns) / 100, 0.1) * graphOptions.linkDistance,
        );
        return (
          Math.max((100 - link.numRuns) / 100, 0.1) * graphOptions.linkDistance
        );
      });
    } else {
      graph.d3Force("link").distance(graphOptions.linkDistance);
    }
  }, [graphRef, graphOptions.nodeForceStrength, graphOptions.linkDistance]);

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
  // note that loading message is not necessarily completely accurate, since it updates async
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  var lastRequest = {
    character: {
      name: "",
      region: {
        name: "",
        slug: "",
        short_name: "",
      },
      realm: {
        id: 0,
        name: "",
        slug: "",
        connected_realm_id: 0,
        locale: "",
      },
    },
    degree: 0,
  };

  const router = useRouter();

  useEffect(() => {
    console.log(mainChar);

    // TODO: this is a hack - verifying mainChar is not null should be CharacterSelector responsibility,
    // but because mainChar can change (in region/realm), triggering the useEffect, we need to check here as well
    if (mainChar.name === "") {
      return;
    }

    setLoading(true);
    lastRequest = { character: mainChar, degree: graphOptions.degree };
    setLoadingMessage(
      `Loading graph for ${mainChar.name}-${mainChar.realm.name} (${graphOptions.degree})`,
    );

    retrieveGraphData(mainChar, graphOptions.degree).then(() => {
      // multiple requests can be inflight - we only stop loading if the LAST request is done,
      // determined if retrievingChar is null, since it is set to null at the end of the last completed request
      setLoading(false);
    });
  }, [mainChar, graphOptions.degree]);

  const retrieveGraphData = async (
    char: Character,
    degreeToRetrieve: number,
  ) => {
    // check if we already have all the graph data needed
    if (
      degreeToRetrieve < graphInfo.layers.length &&
      graphInfo.layers[0][0].id === char.id
    ) {
      return;
    }
    // if we do not have all the graph data, but already retrieved some, use that as a basis
    // note that if the character id is different, we always skip this and start from scratch

    var layers;
    if (
      graphInfo.layers.length !== 0 &&
      graphInfo.layers[0][0].id === char.id
    ) {
      layers = graphInfo.layers;
      const linkCounts = graphInfo.linkCounts;
      const runs = graphInfo.runs;
      for (let i = graphInfo.layers.length; i <= degreeToRetrieve; i++) {
        const nextLayerData = await getNextLayer(
          layers,
          linkCounts,
          runs,
          i - 1,
        );
        layers = [...layers.slice(0, i + 1), nextLayerData.nextLayer];
        Object.keys(nextLayerData.nextLinks).forEach((source) => {
          linkCounts[parseInt(source)] =
            nextLayerData.nextLinks[parseInt(source)];
        });
        Object.keys(nextLayerData.nextRuns).forEach((charId) => {
          runs[parseInt(charId)] = nextLayerData.nextRuns[parseInt(charId)];
        });

        // TODO: hacky race condition check
        if (
          lastRequest.character.name !== char.name ||
          lastRequest.degree !== degreeToRetrieve
        ) {
          return;
        }

        setGraphInfo({ layers, linkCounts, runs });
      }
      return;
    }
    // otherwise, start from scratch
    layers = [[char]];
    const linkCounts: {
      [key: number]: { [key: number]: number };
    } = {};
    linkCounts[char.id as number] = {};
    const charId = char.id as number;
    const runs: { [key: number]: Run[] } = {};
    runs[charId] = await getPopulatedRunsWithCharacter(char);
    for (let i = 0; i < graphOptions.degree; i++) {
      // note this can be a long process - multiple processes can get to this step
      const nextLayerData = await getNextLayer(layers, linkCounts, runs, i);
      layers = [...layers.slice(0, i + 1), nextLayerData.nextLayer];
      Object.keys(nextLayerData.nextLinks).forEach((source) => {
        linkCounts[parseInt(source)] =
          nextLayerData.nextLinks[parseInt(source)];
      });
      Object.keys(nextLayerData.nextRuns).forEach((charId) => {
        runs[parseInt(charId)] = nextLayerData.nextRuns[parseInt(charId)];
      });

      // TODO: hacky race condition check - if, between the time we started retrieving and now, the mainChar has changed, stop
      if (
        lastRequest.character.name !== char.name ||
        lastRequest.degree !== degreeToRetrieve
      ) {
        return;
      }

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
    <Box
      w="100%"
      h="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
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
        height={window.innerHeight * 0.5}
      />

      {loading && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          w="100%"
          h="100%"
        >
          <Text>{loadingMessage}</Text>
          <Spinner />
        </Box>
      )}

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
              <Text as="b"># Runs Per Dungeon:</Text>
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
            <Button
              variant="ghost"
              onClick={() => {
                if (selectedNode) router.push(`/character/${selectedNode.id}`);
              }}
            >
              More Info
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CharForceGraph;

import {
  countCharactersInRuns,
  getCharactersInRuns,
  getLimitedChars,
} from "@/utils/funcs";
import { Character, CharacterGraph, Run } from "@/utils/types";

import { getPopulatedRunsWithCharacter, getRunsWithCharacter } from "./run";

/*
   returns 
   [
    [
      {
        character info,
        parentChar
      },
      ...
    ],
    [...],
  ]
  */

export const getCharGraph = async (
  character: Character,
  degree: number,
  limit: number,
  excludes: Character[] = [],
) => {
  const charGraph: CharacterGraph = {
    nodes: [
      {
        id: character.id as number,
        name: character.name,
        fx: 0,
        fy: 0,
        // layer used to increase size of nodes, not actually a value used by the graph
        layer: 0,
        nodeColor: "red",
      },
    ],
    links: [],
  };
  let charsToSearch = [character];
  let newCharsToSearch: Character[] = [];
  const allCharsSearched: Character[] = [];

  for (let i = 0; i < degree; i++) {
    for (let character of charsToSearch) {
      const runs = await getPopulatedRunsWithCharacter(character);

      const limitedChars = getLimitedChars(runs, limit, [...excludes]);

      for (let char of limitedChars) {
        if (!allCharsSearched.some((c) => c.id === char.id)) {
          allCharsSearched.push(char);
          newCharsToSearch.push(char);

          charGraph.links.push({
            source: character.id as number,
            target: char.id as number,
          });
        }
      }
    }

    // TODO: this might not be necessary, since we sequentially add to charsToSearch
    charsToSearch = charsToSearch.filter((c) => c.id !== character.id);

    charsToSearch = newCharsToSearch;
    newCharsToSearch = [];

    charGraph.nodes = [
      ...charGraph.nodes,
      ...charsToSearch.map((c) => {
        return {
          id: c.id as number,
          name: c.name,
          layer: i + 1,
        };
      }),
    ];
  }

  return charGraph;
};

export const getDenseCharGraph = async (
  character: Character,
  degree: number,
  limit: number,
  excludes: Character[] = [],
) => {
  const charGraph: CharacterGraph = {
    nodes: [
      {
        id: character.id as number,
        name: character.name,
        fx: 0,
        fy: 0,
        // layer used to increase size of nodes, not actually a value used by the graph
        layer: 0,
        nodeColor: "red",
      },
    ],
    links: [],
  };
  let charsToSearch = [character];
  let newCharsToSearch: Character[] = [];
  const allCharsSearched: Character[] = [];

  for (let i = 0; i < degree; i++) {
    for (let character of charsToSearch) {
      const runs = await getPopulatedRunsWithCharacter(character);

      const limitedChars = getLimitedChars(runs, limit, [...excludes]);

      for (let char of limitedChars) {
        if (!allCharsSearched.some((c) => c.id === char.id)) {
          allCharsSearched.push(char);
          newCharsToSearch.push(char);
        }
        charGraph.links.push({
          source: character.id as number,
          target: char.id as number,
        });
      }
    }

    charsToSearch = newCharsToSearch;
    newCharsToSearch = [];

    charGraph.nodes = [
      ...charGraph.nodes,
      ...charsToSearch.map((c) => {
        return {
          id: c.id as number,
          name: c.name,
          layer: i + 1,
        };
      }),
    ];
  }

  return charGraph;
};

/*
Returns minimally preprocessed data necessary to populate a force graph
Runs getPopulatedRunsWithCharacter for ALL characters connected
*/
export const getGraphData = async (
  mainCharacter: Character,
  degree: number,
  limit: number,
  excludes: Character[] = [],
) => {
  // List of all characters in the graph
  const characters: Character[] = [mainCharacter];

  // Dict of all runs in the graph, with character id as key
  const runs: { [key: number]: Run[] } = {};

  // List of layers, each layer is a list of characters
  const layerChars: Character[][] = [];

  let charsToSearch = [mainCharacter];
  let newCharsToSearch: Character[] = [];

  for (let i = 0; i <= degree; i++) {
    for (let character of charsToSearch) {
      const charRuns = await getPopulatedRunsWithCharacter(character);

      runs[character.id as number] = charRuns;
      characters.push(character);

      const limitedChars = getLimitedChars(charRuns, limit, [...excludes]);

      for (let char of limitedChars) {
        if (!characters.some((c) => c.id === char.id)) {
          characters.push(char);
          newCharsToSearch.push(char);
        }
      }

      charsToSearch = newCharsToSearch;
      newCharsToSearch = [];

      if (layerChars[i]) {
        layerChars[i].push(character);
      } else {
        layerChars[i] = [character];
      }
    }
  }

  return { characters, runs, layerChars };
};

// start from [[mainChar]], with all the runs of mainChar, and an empty mainChar link array
// add [[mainChar], [all adjacent chars]]
export const getNextLayer = async (
  layers: Character[][],
  linkCounts: { [key: number]: { [key: number]: number } },
  runs: { [key: number]: Run[] },
  degree = -1,
  excludes: Character[] = [],
) => {
  const d = degree === -1 ? layers.length - 1 : degree;
  const nextLayer: Character[] = [];
  const nextLinks: { [key: number]: { [key: number]: number } } = {};
  const nextRuns: { [key: number]: Run[] } = {};
  const previousCharacters = layers.flat();

  for (let character of layers[d]) {
    const charRuns = runs[character.id as number];
    // const charRuns = await getPopulatedRunsWithCharacter(character);
    const charCounts = countCharactersInRuns(charRuns, excludes);
    const newChars = getCharactersInRuns(charRuns).filter((char) => {
      // filter here to exclude characters already in the graph
      // TODO: we limit the minimum number of runs to 15 since its the current minimum - but should be adjustable
      return (
        previousCharacters.every((c) => c.id !== char.id) &&
        charCounts[char.id as number] >= 15 &&
        char.id !== character.id
      );
    });

    nextLayer.push(...newChars);
    previousCharacters.push(...newChars);

    // TODO: concerned about rate limiting issues if using map
    await Promise.all(
      newChars.map(async (newChar) => {
        const newCharRuns = await getPopulatedRunsWithCharacter(newChar);
        nextRuns[newChar.id as number] = newCharRuns;

        nextLinks[newChar.id as number] = {};

        const newCharCounts = countCharactersInRuns(newCharRuns);
        // TODO: countCharactersInRuns should be refactored to work with excludes
        delete newCharCounts[newChar.id as number];

        const connectionsInGraph = previousCharacters.filter(
          (char) => newCharCounts[char.id as number] > 0,
        );
        // note we use bottom up links - higher degree node links to lower degree node
        connectionsInGraph.forEach((char) => {
          nextLinks[newChar.id as number][char.id as number] =
            newCharCounts[char.id as number];
        });
      }),
    );
  }

  return { nextLayer, nextLinks, nextRuns };
};

export const appendNextLayer = async (
  layers: Character[][],
  linkCounts: { [key: number]: { [key: number]: number } },
  runs: { [key: number]: Run[] },
  degree = -1,
  excludes: Character[] = [],
) => {
  const d = degree === -1 ? layers.length - 1 : degree;
  const nextLayerData = await getNextLayer(
    layers,
    linkCounts,
    runs,
    degree,
    excludes,
  );

  layers.push(nextLayerData.nextLayer);
  Object.keys(nextLayerData.nextLinks).forEach((source) => {
    linkCounts[parseInt(source)] = nextLayerData.nextLinks[parseInt(source)];
  });
  Object.keys(nextLayerData.nextRuns).forEach((charId) => {
    runs[parseInt(charId)] = nextLayerData.nextRuns[parseInt(charId)];
  });
};

export const graphDataToForceGraph = (
  layers: Character[][],
  linkCounts: { [key: number]: { [key: number]: number } },
  runs: { [key: number]: Run[] },
  dense = false,
  limit = 15,
  degree = -1,
) => {
  const d = degree === -1 ? layers.length - 1 : degree;
  const degreeLayers = layers.slice(0, d + 1);
  if (degreeLayers.length === 0) {
    return { nodes: [], links: [] } as CharacterGraph;
  }
  const nodes = degreeLayers
    .map((layer, i) => {
      return layer.map((char) => {
        return {
          id: char.id as number,
          name: char.name,
          layer: i,
        };
      });
    })
    .flat();

  let links: { source: number; target: number; numRuns?: number }[] = [];
  if (dense) {
    // TODO: doesn't account for limit
    links = Object.keys(linkCounts)
      .map((source) => {
        return Object.keys(linkCounts[parseInt(source)]).map((target) => {
          return {
            source: parseInt(source),
            target: parseInt(target),
            numRuns: linkCounts[parseInt(source)][parseInt(target)],
          };
        });
      })
      .flat()
      .filter((link) => {
        return (
          nodes.some((node) => node.id === link.source) &&
          nodes.some((node) => node.id === link.target && link.numRuns >= limit)
        );
      });
  } else {
    // to get the tree version, we prioritize high count nodes for each link
    links = [];

    // reverse bfs-like solution - has issues with lingering components
    // caused by us wanting highest count links, but bfs not guaranteeing that the highest count link is found first
    // going bottom up - each node in a layer is connected to the highest count node in the layer above
    for (let i = degreeLayers.length - 1; i > 0; i--) {
      for (let source of degreeLayers[i]) {
        const sourceId = source.id as number;
        const targetLayer = degreeLayers[i - 1];
        const sourceConnections = targetLayer.filter(
          (target) => linkCounts[sourceId][target.id as number] > 0,
        );
        const target = sourceConnections.reduce((a, b) => {
          return linkCounts[b.id as number][sourceId] >
            linkCounts[a.id as number][sourceId]
            ? b
            : a;
        });

        // note tree mode has different limit rules, since we want to show the highest count links
        // we don't filter a link if a node it connects to has another link, as that would leave an orphaned component
        // idea is that every link we find here is part of the tree - however, we can remove low count leaf nodes
        // so, at every point, we can remove a low count leaf IF it is a leaf - no other links to it
        if (
          linkCounts[sourceId][target.id as number] >= limit ||
          links.map((link) => link.source).includes(sourceId)
        ) {
          links.push({
            // TODO: slight misnaming, we want this to be true since we use radial out mode
            target: sourceId,
            source: target.id as number,
            numRuns: linkCounts[sourceId][target.id as number],
          });
        }
      }
    }
  }

  // remove all nodes that are not connected to any links
  const filteredNodes = nodes.filter((node) => {
    return links.some(
      (link) => link.source === node.id || link.target === node.id,
    );
  });

  return { nodes: filteredNodes, links } as CharacterGraph;
};

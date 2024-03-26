import {
  countCharactersInRuns,
  getCharactersInRuns,
  getLimitedChars,
} from "@/utils/funcs";
import { Character, CharacterGraph, CharacterNode, Run } from "@/utils/types";

import {
  getPopulatedRunsWithCharacter,
  getPopulatedRunsWithCharacters,
  getRunsWithCharacter,
} from "./run";
import next from "next";
import { ClassColors } from "@/utils/consts";

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
// this works by first call func -> find all characters connected to the last layer
// -> get all their runs -> process -> return them as the last layer -> repeat
export const getNextLayer = async (
  layers: Character[][],
  linkCounts: { [key: number]: { [key: number]: number } },
  runs: { [key: number]: Run[] },
  degree = -1,
  excludes: Character[] = [],
) => {
  const d = degree === -1 ? layers.length - 1 : degree;
  const nextLayer: Character[] = [];
  const nextLinks: { [key: number]: { [key: number]: number } } = {
    ...linkCounts,
  };
  const nextRuns: { [key: number]: Run[] } = {};
  const previousCharacters = layers.flat();

  const layerChars = layers[d];
  const layerRuns = layerChars.map((char) => runs[char.id as number]).flat();
  const charCounts = countCharactersInRuns(layerRuns, excludes);
  const newChars = getCharactersInRuns(layerRuns).filter((char) => {
    return (
      previousCharacters.every((c) => c.id !== char.id) &&
      charCounts[char.id as number] >= 15 &&
      char.id !== layerChars[0].id
    );
  });

  nextLayer.push(...newChars);
  previousCharacters.push(...newChars);

  // get all runs for new characters
  const allNewCharRequests = newChars
    .reduce(
      (acc, char) => {
        // batch requests to 100 characters to prevent payload size errors
        acc[acc.length - 1].push(char);
        if (acc[acc.length - 1].length === 20) {
          acc.push([]);
        }
        return acc;
      },
      [[]] as Character[][],
    )
    .map((chars) => getPopulatedRunsWithCharacters(chars));

  const allNewCharRuns = (await Promise.all(allNewCharRequests)).flat();
  // getPopulatedRunsWithCharacters(newChars);

  newChars.map((newChar) => {
    const newCharRuns = allNewCharRuns.filter((run) =>
      run.roster.map((char) => char.id).includes(newChar.id as number),
    );

    nextRuns[newChar.id as number] = newCharRuns;

    nextLinks[newChar.id as number] = {};

    const newCharCounts = countCharactersInRuns(newCharRuns);
    delete newCharCounts[newChar.id as number];

    const connectionsInGraph = previousCharacters.filter(
      (char) => newCharCounts[char.id as number] > 0,
    );

    connectionsInGraph.map((char) => {
      nextLinks[newChar.id as number][char.id as number] =
        newCharCounts[char.id as number];

      if (!nextLinks[char.id as number]) {
        nextLinks[char.id as number] = {};
      }
      nextLinks[char.id as number][newChar.id as number] =
        newCharCounts[char.id as number];
    });
  });

  return { nextLayer, nextLinks, nextRuns };
};

export const appendNextLayer = async (
  layers: Character[][],
  linkCounts: { [key: number]: { [key: number]: number } },
  runs: { [key: number]: Run[] },
  degree = -1,
  excludes: Character[] = [],
) => {
  const d = degree === -1 ? layers.length : degree;
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

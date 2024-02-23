import { getLimitedChars } from "@/utils/funcs";
import { Character, CharacterGraph } from "@/utils/types";

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
  const charGraph = {
    nodes: [
      {
        id: character.id,
        name: character.name,
        fx: 0,
        fy: 0,
        // layer used to increase size of nodes, not actually a value used by the graph
        layer: 0,
        nodeColor: "red",
      },
    ],
    links: [],
  } as CharacterGraph;
  let charsToSearch = [character];
  let newCharsToSearch: Character[] = [];
  const allCharsSearched: Character[] = [];

  for (let i = 0; i <= degree; i++) {
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
  const charGraph = {
    nodes: [
      {
        id: character.id,
        name: character.name,
        fx: 0,
        fy: 0,
        // layer used to increase size of nodes, not actually a value used by the graph
        layer: 0,
        nodeColor: "red",
      },
    ],
    links: [],
  } as CharacterGraph;
  let charsToSearch = [character];
  let newCharsToSearch: Character[] = [];
  const allCharsSearched: Character[] = [];

  for (let i = 0; i <= degree; i++) {
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

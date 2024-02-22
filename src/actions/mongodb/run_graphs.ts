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

// TODO: this currently uses an old parentChar - character relationship
// rewrite to be like getDenseCharGraph
export const getCharGraph = async (
  character: Character,
  degree: number,
  limit: number,
  excludes: Character[] = [],
) => {
  const charGraph = [
    [
      {
        character: character,
        parentCharacter: character,
      },
    ],
  ];

  let charsToSearch = [character];
  const allCharsSearched: Character[] = [];

  for (let i = 0; i <= degree; i++) {
    const characters = await Promise.all(
      charsToSearch.map(async (parentChar) => {
        const runs = await getPopulatedRunsWithCharacter(parentChar);
        // this doesn't handle duplicates since its mapping
        // we remove them later, but there probably is a more elegant solution
        const limitedChars = getLimitedChars(runs, limit, [
          ...allCharsSearched,
          parentChar,
          ...excludes,
        ]);
        return limitedChars.map((char) => {
          return {
            character: char,
            parentCharacter: parentChar,
          };
        });
      }),
    );

    charsToSearch = characters.flat().map((char) => char.character);

    allCharsSearched.push(...charsToSearch);

    charGraph.push(
      characters.flat().filter((char, index) => {
        return (
          characters
            .flat()
            .findIndex((c) => c.character.id === char.character.id) === index
        );
      }),
    );
  }

  const characters = charGraph
    .map((layer, i) => {
      return layer.map((nodeInfo, j) => {
        return {
          id: nodeInfo.character.id as number,
          name: nodeInfo.character.name,
        };
      });
    })
    .flat();

  characters[0] = {
    ...characters[0],
    fx: 0,
    fy: 0,
    nodeColor: "red",
  } as {
    id: number;
    name: string;
    fx: number;
    fy: number;
    nodeLabel: string;
    nodeColor: string;
  };

  const links = charGraph
    .map((layer) => {
      return layer.map((nodeInfo) => {
        return {
          source: nodeInfo.parentCharacter.id as number,
          target: nodeInfo.character.id as number,
        };
      });
    })
    .flat()
    .slice(1);

  return {
    nodes: characters,
    links: links,
  };
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

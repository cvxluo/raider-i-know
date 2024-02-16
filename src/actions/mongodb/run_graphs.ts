import { getLimitedChars } from "@/utils/funcs";
import { Character } from "@/utils/types";

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

    charGraph.push(characters.flat());
  }
  return charGraph;
};

"use server";

import CharacterModel from "@/models/Character";
import mongodb from "../mongodb";
import {
  saveDungeonRunsForCharacter,
  saveLimitedDungeonRunsForCharacter,
} from "./character_runs";

const LOG_CHARACTER_TRAWLING = true;

export const getRunsForAllCharacters = async (
  startIndex = 0,
  key_level_limit = 0,
) => {
  await mongodb();

  const totalCharacters = await CharacterModel.countDocuments({});

  if (LOG_CHARACTER_TRAWLING)
    console.log("Total number of characters: " + totalCharacters);

  for (let i = 0; i < totalCharacters; i += 10) {
    // TODO: since this operation adds characters to the database, getting
    // a specific page can return duplicate characters - should fix
    const page = await CharacterModel.find(
      {},
      {},
      { skip: i, limit: 10, sort: { _id: -1 } },
    ).lean();

    console.log(i, "of", totalCharacters, "characters trawled");
    console.log("Trawling characters: ", page.map((c) => c.name).join(", "));

    const res = await Promise.all(
      page.map(async (character) => {
        await saveLimitedDungeonRunsForCharacter(
          "season-df-3",
          character.id,
          key_level_limit,
        );
      }),
    );
  }
};

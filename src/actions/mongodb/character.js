"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import Character from "@/models/Character";
import { summarizeRoster } from "@/utils/funcs";

export const createCharacter = async (region, realm, name) => {
  await mongoDB();

  const newCharacter = await Character.findOneAndReplace(
    {
      region,
      realm,
      name,
    },
    {
      region,
      realm,
      name,
    },
    {
      new: true,
      upsert: true,
    },
  );

  return newCharacter;
};

export const getCharacter = async (region, realm, name) => {
  await mongoDB();

  const character = await Character.findOne({
    region,
    realm,
    name,
  }).lean();

  const flattenedCharacter = JSON.parse(JSON.stringify(character));

  return flattenedCharacter;
};

export const getAllCharacters = async () => {
  await mongoDB();

  const characters = await Character.find().lean();

  const flattenedCharacters = JSON.parse(JSON.stringify(characters));

  return flattenedCharacters;
};

export const saveRoster = async (rosterDetails) => {
  await mongoDB();

  const newCharacterIDs = await Promise.all(
    rosterDetails.map(async (character) => {
      const newCharacter = await createCharacter(
        character.region,
        character.realm,
        character.name,
      );
      return newCharacter._id;
    }),
  );

  return newCharacterIDs;
};

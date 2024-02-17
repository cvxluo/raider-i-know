"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import CharacterModel from "@/models/Character";
import { Character } from "@/utils/types";

const LOG_CHARACTER_CREATION = false;

export const createCharacter = async (character: Character) => {
  await mongoDB();

  const newCharacter = await CharacterModel.findOneAndReplace(
    character,
    character,
    {
      new: true,
      upsert: true,
    },
  )
    .lean()
    .catch((e) => {
      console.error("Error creating character in database.");
      throw e;
    });

  const flattenedCharacter = JSON.parse(JSON.stringify(newCharacter));

  return flattenedCharacter;
};

// upsert operation
// TODO: consider writing an upsertMany func for this and manyRuns
export const createManyCharacters = async (characters: Character[]) => {
  await mongoDB();

  const res = await CharacterModel.collection
    .bulkWrite(
      characters.map((character) => ({
        updateOne: {
          filter: {
            region: character.region,
            realm: character.realm,
            name: character.name,
          },
          update: { $set: character },
          upsert: true,
          new: true,
        },
      })),
    )
    .then((res) => {
      if (LOG_CHARACTER_CREATION)
        console.log(
          "Upserted characters: ",
          characters.map((character) => character.name),
        );
      return res;
    })
    .catch((e) => {
      console.error("Error creating characters in database.");
      throw e;
    });

  const flattenedRes = JSON.parse(JSON.stringify(res));

  return flattenedRes;
};

export const getCharacter = async (
  region: string,
  realm: string,
  name: string,
) => {
  await mongoDB();

  const character = await CharacterModel.findOne({
    "region.name": region,
    "realm.name": realm,
    name,
  }).lean();

  const flattenedCharacter = JSON.parse(JSON.stringify(character));

  return flattenedCharacter;
};

export const getAllCharacters = async () => {
  await mongoDB();

  const characters = await CharacterModel.find().lean();

  const flattenedCharacters = JSON.parse(JSON.stringify(characters));

  return flattenedCharacters;
};

export const saveRoster = async (rosterDetails: Character[]) => {
  await mongoDB();

  const newCharacterIDs = await Promise.all(
    rosterDetails.map(async (character) => {
      const newCharacter = await createCharacter(character);
      return newCharacter;
    }),
  ).catch((e) => {
    console.error("Error saving roster in database.");
    throw e;
  });

  return newCharacterIDs;
};

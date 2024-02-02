"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import Character from "@/models/Character";
import { summarizeRoster } from "@/utils/funcs";

const LOG_CHARACTER_CREATION = false;

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
  )
    .lean()
    .catch((e) => {
      console.error("Error creating character in database.");
      throw e;
    });

  return newCharacter;
};

// upsert operation
// TODO: consider writing an upsertMany func for this and manyRuns
export const createManyCharacters = async (characters) => {
  await mongoDB();

  const res = await Character.collection
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

  return res;
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
    rosterDetails
      .map(async (character) => {
        const newCharacter = await createCharacter(
          character.region,
          character.realm,
          character.name,
        );
        return newCharacter._id;
      })
      .catch((e) => {
        console.error("Error saving roster in database.");
        throw e;
      }),
  );

  return newCharacterIDs;
};

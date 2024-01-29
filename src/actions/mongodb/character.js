"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import Character from "@/models/Character";

export const createCharacter = async (region, realm, name) => {
  await mongoDB();

  const newCharacter = await Character.create({
    region,
    realm,
    name,
  });

  return newCharacter;
};

export const getCharacter = async (region, realm, name) => {
  await mongoDB();

  const character = await Character.findOne({
    region,
    realm,
    name,
  });

  return character;
};

export const getAllCharacters = async () => {
  await mongoDB();

  const characters = await Character.find();

  return characters;
};

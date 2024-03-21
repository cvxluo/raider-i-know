"use server";

import mongodb from "@/actions/mongodb/mongodb";
import CharacterModel from "@/models/Character";

export const getClassCounts = async () => {
  await mongodb();

  const result = CharacterModel.aggregate([
    {
      $sortByCount: "$class.name",
    },
  ]);

  return result;
};

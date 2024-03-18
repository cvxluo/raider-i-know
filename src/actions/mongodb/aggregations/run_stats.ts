"use server";

import mongodb from "@/actions/mongodb/mongodb";
import CharacterModel from "@/models/Character";
import RunModel from "@/models/Run";

export const getDungeonCounts: {
  (): Promise<
    {
      _id: string;
      count: number;
    }[]
  >;
} = async () => {
  await mongodb();

  const result = RunModel.aggregate([
    {
      $sortByCount: "$dungeon.name",
    },
  ]);

  return result;
};

export const getRunLevels: {
  (): Promise<
    {
      _id: number;
      count: number;
    }[]
  >;
} = async () => {
  await mongodb();

  const result = RunModel.aggregate([
    {
      $sortByCount: "$mythic_level",
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  return result;
};

export const getRunCountByWeek = async () => {
  await mongodb();

  const result = RunModel.aggregate([
    {
      $project:
        /**
         * specifications: The fields to
         *   include or exclude.
         */
        {
          _id: 1,
          completed_at: 1,
          truncatedOrderDate: {
            $dateTrunc: {
              date: "$completed_at",
              unit: "week",
              binSize: 1,
              timezone: "America/Los_Angeles",
              startOfWeek: "Tuesday",
            },
          },
        },
    },
    {
      $sortByCount:
        /**
         * expression: Grouping expression or string.
         */

        "$truncatedOrderDate",
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  return result;
};

export const getCharacterClassCount = async () => {
  await mongodb();

  const result = RunModel.aggregate([
    {
      $sortByCount: "$character.class",
    },
  ]);

  return result;
};

export const getCharacterServerCount = async () => {
  await mongodb();

  const result = CharacterModel.aggregate([
    {
      $sortByCount: "$realm.name",
    },
  ]);

  return result;
};

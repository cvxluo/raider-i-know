"use server";

import mongoDB from "@/actions/mongodb/mongodb";
import TitleInfoModel from "@/models/TitleInfo";

export const getLatestTitleInfo = async () => {
  await mongoDB();

  const latestTitleInfo = await TitleInfoModel.find()
    .sort({ _id: -1 })
    .limit(1)
    .lean()
    .catch((e) => {
      console.error("Error getting latest title info from database.");
      console.log(e);
      throw e;
    });

  const flattenedLatestTitleInfo = JSON.parse(JSON.stringify(latestTitleInfo));

  return flattenedLatestTitleInfo[0] ? flattenedLatestTitleInfo[0] : null;
};

"use server";

import mongoDB from "@/actions/mongodb";
import Run from "@/models/Run";
import urls from "@/utils/urls";

export const test = async () => {
  await mongoDB();

  const new_run = await Run.create({
    season: "season",
    keystone_run_id: 1,
  });

  return new_run;
};

"use server";

import urls from "@/utils/urls";

const LOG_RUN_FETCH = true;

export const getRuns = async (runInfo: {
  season: string;
  region: string;
  dungeon: string;
  affixes: string;
  page: number;
}) => {
  const { season, region, dungeon, affixes, page } = runInfo;

  if (LOG_RUN_FETCH) {
    console.log("Fetching runs for", season, region, dungeon, affixes, page);
  }
  const params = new URLSearchParams({
    season: season,
    region: region,
    dungeon: dungeon,
    affixes: affixes,
    page: page.toString(),
  });

  return fetch(
    urls.raiderio.baseURL + urls.raiderio.mythic_plus.runs + "?" + params,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("Fetch failed for:");
      console.log(err);
      console.log(season, region, dungeon, affixes, page);
      console.log(
        urls.raiderio.baseURL + urls.raiderio.mythic_plus.runs + "?" + params,
      );
      return { error: err };
    });
};

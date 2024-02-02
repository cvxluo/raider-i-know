"use server";

import urls from "@/utils/urls";

export const getRuns = async (runInfo) => {
  const { season, region, dungeon, affixes, page } = runInfo;

  console.log("Fetching runs for", season, region, dungeon, affixes, page);

  const params = new URLSearchParams({
    season: season,
    region: region,
    dungeon: dungeon,
    affixes: affixes,
    page: page,
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

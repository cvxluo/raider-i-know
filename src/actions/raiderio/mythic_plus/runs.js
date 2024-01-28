"use server";

import urls from "@/utils/urls";

export const getRuns = async (season, region, dungeon, affixes, page) => {
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
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
    .then((res) => res.text())
    .then((res) => {
      return res;
    });
};

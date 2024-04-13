"use server";

import urls from "@/utils/urls";

interface ScoreColor {
  rgbHex: string;
  score: number;
}

export const getScoreColors = async (season: string): Promise<ScoreColor[]> => {
  const params = new URLSearchParams({
    season,
  });
  params.set("season", season);

  return fetch(
    urls.raiderio.baseURL +
      urls.raiderio.mythic_plus.score_colors +
      "?" +
      params,
    {
      method: "GET",
      mode: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
    .then((res) => res.json())
    .then((res) => {
      return res;
    });
};

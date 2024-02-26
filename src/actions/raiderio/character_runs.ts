"use server";

import { RunSummary } from "@/utils/types";

export const getRunsForCharacter = async (
  season: string,
  characterId: number,
  dungeonId: number,
  affixes: string,
  date: string,
): Promise<{
  runs: {
    // doesn't return full run details - will need to send another request if needing run object
    summary: RunSummary;
    score: number;
  }[];
  ui: any;
}> => {
  const params = new URLSearchParams({
    season: season,
    characterId: characterId.toString(),
    dungeonId: dungeonId.toString(),
    affixes: affixes,
    date: date,
  });

  /*
  console.log(
    "URL: " + "https://raider.io/api/characters/mythic-plus-runs?" + params,
  );
  */

  return fetch(
    // special url
    "https://raider.io/api/characters/mythic-plus-runs?" + params,
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
      console.log(
        "URL: " + "https://raider.io/api/characters/mythic-plus-runs?" + params,
      );
      return { error: err };
    });
};

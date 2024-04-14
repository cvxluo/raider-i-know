"use server";

import urls from "@/utils/urls";

export const getBestAltRunsForChar = async (req: {
  region: string;
  realm: string;
  name: string;
}): Promise<
  {
    dungeon: string;
    mythic_level: number;
    affixes: {
      name: string;
    }[];
    zone_id: number;
  }[]
> => {
  const params = new URLSearchParams({
    region: req.region,
    realm: req.realm,
    name: req.name,
    fields: "mythic_plus_alternate_runs",
  });

  return fetch(
    urls.raiderio.baseURL + urls.raiderio.characters.profile + "?" + params,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
    .then((res) => res.json())
    .then((res) => {
      return res.mythic_plus_alternate_runs;
    })
    .catch((err) => {
      console.log("Fetch failed for:");
      console.log(err);
      console.log("M+ Best Alternate Runs for:");
      console.log(req);

      return { error: err };
    });
};

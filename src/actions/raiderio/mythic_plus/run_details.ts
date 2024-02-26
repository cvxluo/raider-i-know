"use server";

import urls from "@/utils/urls";

const LOG_RUN_DETAILS = true;

export const getRunDetails = async (req: { season: string; id: number }) => {
  const params = new URLSearchParams({
    season: req.season,
    id: req.id.toString(),
  });

  if (LOG_RUN_DETAILS)
    console.log(
      "URL: " +
        urls.raiderio.baseURL +
        urls.raiderio.mythic_plus.run_details +
        "?" +
        params,
    );

  return fetch(
    urls.raiderio.baseURL +
      urls.raiderio.mythic_plus.run_details +
      "?" +
      params,
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
    });
};

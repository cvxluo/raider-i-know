"use server";

import urls from "@/utils/urls";

export const getRunDetails = async (season: string, id: number) => {
  const params = new URLSearchParams({
    season,
    id: id.toString(),
  });

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

"use server";

import urls from "@/utils/urls";

export const getRunDetails = async (season, id) => {
  const params = new URLSearchParams({
    season: season,
    id: id,
  });

  return fetch(
    urls.raiderio.baseURL +
      urls.raiderio.mythic_plus.run_details +
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

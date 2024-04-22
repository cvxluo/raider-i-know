"use server";

import { Affix } from "@/utils/types";
import urls from "@/utils/urls";

interface AffixData {
  region: string;
  title: string;
  affix_details: Affix[];
}

export const getCurrentAffixes = async (region: string): Promise<Affix[]> => {
  const params = new URLSearchParams({
    region,
  });

  return fetch(
    urls.raiderio.baseURL + urls.raiderio.mythic_plus.affixes + "?" + params,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
    .then((res) => res.json())
    .then((res) => {
      return res.affix_details;
    })
    .catch((err) => {
      console.log("Fetch failed for:");
      console.log(err);
      return { error: err };
    });
};

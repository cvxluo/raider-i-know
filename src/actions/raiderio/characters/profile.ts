"use server";

import { Character } from "@/utils/types";
import urls from "@/utils/urls";

export const getProfile = async (
  region: string,
  realm: string,
  name: string,
  fields = "",
): Promise<Character> => {
  const params = new URLSearchParams({
    region,
    realm,
    name,
    fields,
  });
  params.set("region", region);
  params.set("realm", realm);
  params.set("name", name);
  params.set("fields", fields);

  return fetch(
    urls.raiderio.baseURL + urls.raiderio.characters.profile + "?" + params,
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

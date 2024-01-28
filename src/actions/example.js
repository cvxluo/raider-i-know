"use server";

import urls from "@/utils/urls";

export const exampleRequest = async () => {
  return (
    fetch(urls.baseURL + urls.api.example, {
      method: "GET",
      mode: "same-origin",
      headers: {
        "Content-Type": "text/html",
        // 'Content-Type': 'application/json'
      },
    })
      // .then((res) => res.json())
      .then((res) => res.text())
      .then((res) => {
        return res;
      })
  );
};

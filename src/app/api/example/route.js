import urls from "@/utils/urls";

export async function GET() {
  const res = await fetch(urls.baseURL + "/", {
    method: "GET",
    headers: {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*",
      // 'Content-Type': 'application/json'
    },
  }).catch((error) => {
    console.error("Error:", error);
    return error;
  });
  const data = res;

  return data;
  // return Response.json(data);
}

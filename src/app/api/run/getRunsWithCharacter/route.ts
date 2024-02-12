import { getRunsWithCharacter } from "@/actions/mongodb/run";
import urls from "@/utils/urls";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const realm = searchParams.get("realm")
    ? (searchParams.get("realm") as string)
    : "";
  const region = searchParams.get("region")
    ? (searchParams.get("region") as string)
    : "";
  const name = searchParams.get("name")
    ? (searchParams.get("name") as string)
    : "";

  try {
    const runs = await getRunsWithCharacter({ realm, region, name });

    return Response.json(runs);
  } catch (e) {
    console.error(e);

    // return Response.redirect(urls.error);
    return Response.json({ error: e });
  }
}

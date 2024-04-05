import { getRunsWithCharacter } from "@/actions/mongodb/run";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const realmName = searchParams.get("realm")
    ? (searchParams.get("realm") as string)
    : "";
  const regionName = searchParams.get("region")
    ? (searchParams.get("region") as string)
    : "";
  const name = searchParams.get("name")
    ? (searchParams.get("name") as string)
    : "";

  const realm = {
    name: realmName,
    id: 0,
    slug: "",
    connected_realm_id: 0,
    locale: "",
  };

  const region = {
    name: regionName,
    slug: "",
    short_name: "",
  };

  try {
    const runs = await getRunsWithCharacter({ realm, region, name });

    return Response.json(runs);
  } catch (e) {
    console.error(e);

    // return Response.redirect(urls.error);
    return Response.json({ error: e });
  }
}

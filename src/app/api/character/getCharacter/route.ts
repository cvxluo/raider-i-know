import { getCharacter } from "@/actions/mongodb/character";
import { NextRequest } from "next/server";

// this only retrieves the ObjectID from the database
// in the future, probably use to get runs for a particular character?
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

  try {
    const character = await getCharacter(regionName, realmName, name);

    return Response.json(character);
  } catch (e) {
    console.error(e);

    // return Response.redirect(urls.error);
    return Response.json({ error: e });
  }
}

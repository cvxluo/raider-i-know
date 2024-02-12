import { getCharacter } from "@/actions/mongodb/character";
import urls from "@/utils/urls";
import { NextRequest } from "next/server";

// this only retrieves the ObjectID from the database
// in the future, probably use to get runs for a particular character?
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
    const character = await getCharacter(region, realm, name);

    return Response.json(character);
  } catch (e) {
    console.error(e);

    // return Response.redirect(urls.error);
    return Response.json({ error: e });
  }
}

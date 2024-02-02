import { getCharacter } from "@/actions/mongodb/character";
import urls from "@/utils/urls";

// this only retrieves the ObjectID from the database
// in the future, probably use to get runs for a particular character?
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const region = searchParams.get("region");
  const realm = searchParams.get("realm");
  const name = searchParams.get("name");

  try {
    const character = await getCharacter(region, realm, name);

    return Response.json(character);
  } catch (e) {
    console.error(e);

    return Response.redirect(urls.error);
  }
}

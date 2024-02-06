import { getRunsWithCharacter } from "@/actions/mongodb/run";
import urls from "@/utils/urls";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const realm = searchParams.get("realm");
  const region = searchParams.get("region");
  const name = searchParams.get("name");

  try {
    const runs = await getRunsWithCharacter({ realm, region, name });

    return Response.json(runs);
  } catch (e) {
    console.error(e);

    return Response.redirect(urls.error);
  }
}

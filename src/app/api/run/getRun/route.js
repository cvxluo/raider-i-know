import { getRun, getRunFromID } from "@/actions/mongodb/run";
import urls from "@/utils/urls";

// this only retrieves the ObjectID from the database
// in the future, probably use to get runs for a particular character?
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const keystone_run_id = searchParams.get("keystone_run_id");

  try {
    const run = await getRunFromID(keystone_run_id);

    return Response.json(run);
  } catch (e) {
    console.error(e);

    return Response.redirect(urls.error);
  }
}

import { getRunFromID } from "@/actions/mongodb/run";
import urls from "@/utils/urls";
import { NextRequest } from "next/server";

// this only retrieves the ObjectID from the database
// in the future, probably use to get runs for a particular character?
// also, probably the wrong name for route - should be getRunsFromID or just remove getRuns for this
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const keystone_run_id: number = Number(searchParams.get("keystone_run_id"));

  try {
    const run = await getRunFromID(keystone_run_id);

    return Response.json(run);
  } catch (e) {
    console.error(e);

    // return Response.redirect(urls.error);
    return Response.json({ error: e });
  }
}

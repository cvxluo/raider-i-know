import { NextRequest, NextResponse } from "next/server";

import { getPopulatedRunsWithCharacters } from "@/actions/mongodb/run";
import mongodb from "@/actions/mongodb/mongodb";
import RunModel from "@/models/Run";
import CharacterModel from "@/models/Character";
import { Character } from "@/utils/types";

// limit of 1000 characters per request
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // TODO: consider validation
  const { characters } = await req.json();

  if (!characters) {
    return NextResponse.json(
      { error: "No characters provided." },
      {
        status: 400,
      },
    );
  }

  if (characters.length > 1000) {
    return NextResponse.json(
      {
        error:
          "Too many characters in a single request - consider splitting up your requests.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    await mongodb();

    const retrievedCharacterIds = await CharacterModel.find(
      {
        // TODO: europe region
        // "region.name": { $in: characters.map((char) => char.region.name) },
        "realm.name": {
          $in: characters.map((char: Character) => char.realm.name),
        },
        name: { $in: characters.map((char: Character) => char.name) },
      },
      "_id",
    );

    const retrievedRuns = await RunModel.find(
      {
        roster: { $in: retrievedCharacterIds },
      },
      "roster dungeon.id keystone_run_id -_id",
    )
      .populate("roster", "name realm.name region.name class.name id -_id")
      .lean();

    console.log(
      "Retrieved # of runs:",
      retrievedRuns.length,
      "for # of characters:",
      characters.length,
    );

    const runs = JSON.parse(JSON.stringify(retrievedRuns));

    return new NextResponse(JSON.stringify(runs));
  } catch (e) {
    console.error(e);

    return new NextResponse(null, {
      status: 500,
    });
  }
}

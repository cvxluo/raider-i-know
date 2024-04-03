import { NextRequest, NextResponse } from "next/server";

import mongodb from "@/actions/mongodb/mongodb";
import CharacterModel from "@/models/Character";
import RunModel from "@/models/Run";
import { Character } from "@/utils/types";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { character } = await req.json();

  if (!character) {
    return NextResponse.json(
      { error: "No character provided." },
      {
        status: 400,
      },
    );
  }

  try {
    await mongodb();

    const region = character.region.name;
    const realm = character.realm.name;
    const name = character.name;

    const retrievedCharacter = (await CharacterModel.findOne({
      "region.name": region,
      "realm.name": realm,
      name: name,
    }).lean()) as Character;

    const retrievedRuns = await RunModel.find({
      roster: retrievedCharacter._id,
    })
      .populate("roster")
      .lean();

    const runs = JSON.parse(JSON.stringify(retrievedRuns));

    return new NextResponse(JSON.stringify(runs));
  } catch (e) {
    console.error(e);

    return new NextResponse(null, {
      status: 500,
    });
  }
}

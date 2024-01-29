"use client";

import { getProfile } from "@/actions/raiderio/characters/profile";
import { getRuns } from "@/actions/raiderio/mythic_plus/runs";

import { test } from "@/actions/mongodb/test";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const region = "us";
    const realm = "azshara";
    const name = "Vexea";
    // const fields = "mythic_plus_scores_by_season:current";
    const fields = "mythic_plus_recent_runs";
    getProfile(region, realm, name, fields).then((res) => {
      console.log(res);
    });
    /*
    const season = "season-df-3";
    const region = "us";
    const dungeon = "all";
    const affixes = "fortified-incorporeal-sanguine";
    const page = 0;
    getRuns(season, region, dungeon, affixes, page).then((res) => {
      console.log(res);
    });
    */
  }, []);
  return (
    <div>
      <p>test</p>
    </div>
  );
}

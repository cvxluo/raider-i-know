"use client";

import { getProfile } from "@/actions/raiderio/characters/profile";
import { getRuns } from "@/actions/raiderio/mythic_plus/runs";

import { useEffect, useState } from "react";
import { Box, Button, Input } from "@chakra-ui/react";
import { createRunFromID, getRunFromID } from "@/actions/mongodb/run";

export default function Home() {
  useEffect(() => {
    /*
    const region = "us";
    const realm = "azshara";
    const name = "Vexea";
    // const fields = "mythic_plus_scores_by_season:current";
    const fields = "mythic_plus_recent_runs";
    getProfile(region, realm, name, fields).then((res) => {
      console.log(res);
    });
    */
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

  const [characterName, setCharacterName] = useState("");
  const [runID, setRunID] = useState(0);

  const test = async () => {
    console.log(runID, "here");
    getRunFromID(runID).then((res) => {
      console.log(res);
    });
    console.log("test3");
  };

  return (
    <Box>
      <Input
        placeholder="Run ID"
        value={runID}
        onChange={(e) => {
          setRunID(e.target.value);
        }}
      ></Input>
      <Button
        onClick={() => {
          test();
        }}
      >
        Test
      </Button>
    </Box>
  );
}

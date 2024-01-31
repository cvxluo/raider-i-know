import {
  getTopDungeonRuns,
  getTopRuns,
} from "@/actions/mongodb/data_collection/run_collection";
import { createRun, createRunFromID } from "@/actions/mongodb/run";

import { getRuns } from "@/actions/raiderio/mythic_plus/runs";

export const testCreateRun = async () => {
  const testRun = {
    season: "season-df-3",
    dungeon: "everbloom",
    keystone_run_id: 123456789,
    completed_at: new Date(),
    weekly_modifiers: ["fortified", "sanguine"],
    mythic_level: 15,
    keystone_team_id: 123456789,
    roster: [
      {
        region: "us",
        realm: "azshara",
        name: "Vexea",
      },
    ],
  };

  createRun(testRun).then((res) => {
    console.log(res);
  });
};

export const testCreateFromID = async () => {
  createRunFromID("season-df-3", 22336451).then((res) => {
    console.log(res);
  });
};

export const testGetRuns = async () => {
  const season = "season-df-3";
  const region = "us";
  const dungeon = "all";
  const affixes = "fortified-incorporeal-sanguine";
  const page = 100;
  getRuns(season, region, dungeon, affixes, page).then((res) => {
    console.log(res);
  });
};

export const testGetTopDungeonRuns = async () => {
  const season = "season-df-3";
  const region = "us";
  const dungeon = "everbloom";
  const affixes = "fortified-incorporeal-sanguine";

  getTopDungeonRuns(season, region, dungeon, affixes).then((res) => {
    console.log(res);
  });
};

export const testGetTopRuns = async () => {
  const season = "season-df-3";
  const region = "us";
  const affixes = "fortified-incorporeal-sanguine";

  getTopRuns(season, region, affixes).then((res) => {
    console.log(res);
  });
};

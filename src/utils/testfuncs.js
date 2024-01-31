import { createRun } from "@/actions/mongodb/run";

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
  const page = 0;
  getRuns(season, region, dungeon, affixes, page).then((res) => {
    console.log(res);
  });
};

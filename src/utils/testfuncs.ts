import {
  saveAllTopRuns,
  saveTopDungeonRuns,
  saveTopRuns,
} from "@/actions/mongodb/data_collection/top_runs";
import { createRun, createRunFromID } from "@/actions/mongodb/run";
import { getRunsForCharacter } from "@/actions/raiderio/character_runs";
import { getRuns } from "@/actions/raiderio/mythic_plus/runs";
import { AffixSets, DungeonIds } from "./consts";
import { Run, RunSummary } from "./types";
import {
  saveAllRunsForCharacter,
  saveDungeonRunsForCharacter,
} from "@/actions/mongodb/data_collection/character_runs";

export const testCreateRun = async () => {
  const testRun = {
    season: "season-df-3",
    dungeon: {
      name: "everbloom",
      id: 7109,
    },
    keystone_run_id: 123456789,
    completed_at: new Date(),
    weekly_modifiers: [
      {
        id: 10,
        name: "fortified",
        description: "description",
        slug: "fortified",
      },
    ],
    mythic_level: 15,
    keystone_team_id: 123456789,
    roster: [
      {
        region: {
          name: "us",
          slug: "us",
          short_name: "us",
        },
        realm: {
          id: 123,
          connected_realm_id: 123,
          name: "test realm",
          slug: "test",
          locale: "en_US",
        },
        name: "Vexea",
        faction: "horde",
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
  getRuns({ season, region, dungeon, affixes, page }).then((res) => {
    console.log(res);
  });
};

export const testsaveTopDungeonRuns = async () => {
  const season = "season-df-3";
  const region = "us";
  const dungeon = "everbloom";
  const affixes = "fortified-incorporeal-sanguine";

  saveTopDungeonRuns(season, region, dungeon, affixes).then((res) => {
    console.log(res);
  });
};

export const testGetTopRuns = async () => {
  const season = "season-df-3";
  const region = "us";
  const affixes = "fortified-incorporeal-sanguine";

  saveTopRuns(season, region, affixes).then((res) => {
    console.log(res);
  });
};

export const testSaveTopAffixes = async () => {
  const season = "season-df-3";
  const region = "us";
  const affixes = "fortified-incorporeal-sanguine";

  saveAllTopRuns(season, region);
};

export const testRunsForCharacter = async (
  characterId: number,
  dungeonId = 9028,
) => {
  const season = "season-df-3";
  const affixes = "all";
  const date = "all";

  getRunsForCharacter(season, characterId, dungeonId, affixes, date).then(
    (res) => {
      console.log(res);
    },
  );
};

export const testAllRunsForCharacter = async (characterId: number) => {
  const season = "season-df-3";
  const date = "all";

  // note that runsFromCharacter doesn't return real runs
  const runs: RunSummary[] = [];

  DungeonIds.forEach((dungeonId) => {
    AffixSets.forEach((affixSet) => {
      const affixes = affixSet.join("-");
      getRunsForCharacter(season, characterId, dungeonId, affixes, date).then(
        (res) => {
          runs.push(...res.runs.map((run) => run.summary));
          console.log(res);
          console.log(runs);
        },
      );
    });
  });

  return runs;
};

export const testSaveDungeonRunsForCharacter = async (characterId: number) => {
  const season = "season-df-3";

  saveDungeonRunsForCharacter(season, characterId).then((res) => {
    console.log(res);
  });
};

export const testSaveAllRunsForCharacter = async (characterId: number) => {
  const season = "season-df-3";

  saveAllRunsForCharacter(season, characterId).then((res) => {
    console.log(res);
  });
};

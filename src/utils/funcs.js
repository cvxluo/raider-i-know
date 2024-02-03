export const summarizeRunDetails = (runDetails) => {
  const season = runDetails.season;
  const dungeon = runDetails.dungeon;
  const keystone_run_id = runDetails.keystone_run_id;
  const mythic_level = runDetails.mythic_level;
  const completed_at = runDetails.completed_at;
  const weekly_modifiers = runDetails.weekly_modifiers;
  const keystone_team_id = runDetails.keystone_team_id;
  const roster = runDetails.roster;

  const summarizedRun = {
    season,
    dungeon: {
      id: dungeon.id,
      name: dungeon.name,
    },
    keystone_run_id,
    mythic_level,
    completed_at: new Date(completed_at),
    weekly_modifiers: summarizeAffixes(weekly_modifiers),
    keystone_team_id,
    roster: summarizeRoster(roster),
  };

  return summarizedRun;
};

export const countCharactersInRuns = (runs) => {
  const characters = {};

  runs.forEach((run) => {
    run.roster.forEach((character) => {
      const { region, realm, name } = character;

      const characterKey = `${name}-${realm}-${region}`;

      if (characters[characterKey]) {
        characters[characterKey]++;
      } else {
        characters[characterKey] = 1;
      }
    });
  });

  return characters;
};

// TODO: rename/formalize this func
export const slugCharacter = (character) => {
  return `${character.name}-${character.realm}-${character.region}`;
};

const summarizeRoster = (roster) => {
  return roster.map((rosterItem) => {
    return {
      region: rosterItem.character.region.name,
      realm: rosterItem.character.realm.name,
      name: rosterItem.character.name,
    };
  });
};

const summarizeAffixes = (weekly_modifiers) => {
  return weekly_modifiers.map((modifier) => {
    return modifier.name;
  });
};

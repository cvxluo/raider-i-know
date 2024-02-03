export const summarizeRunDetails = (runDetails) => {
  const {
    season,
    dungeon,
    keystone_run_id,
    mythic_level,
    completed_at,
    weekly_modifiers,
    keystone_team_id,
    roster,
  } = runDetails;

  const summarizedRun = {
    season,
    dungeon: {
      id: dungeon.id,
      name: dungeon.name,
    },
    keystone_run_id,
    mythic_level,
    completed_at: new Date(completed_at),
    weekly_modifiers: weekly_modifiers.map((modifier) => {
      return modifier.name;
    }),
    keystone_team_id,
    roster: roster.map((characterDetails) => {
      return {
        region: characterDetails.character.region.slug,
        realm: characterDetails.character.realm.slug,
        name: characterDetails.character.name,
      };
    }),
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

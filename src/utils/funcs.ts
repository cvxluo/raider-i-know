import { Run, Character, RunRaw, CharacterRaw, Affix } from "./types";

export const summarizeRunDetails = (runDetails: RunRaw) => {
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
    weekly_modifiers,
    keystone_team_id,
    roster: roster.map((rosterItem) => {
      return rosterItem.character;
    }),
  };

  return summarizedRun;
};

export const countCharactersInRuns = (
  runs: Run[],
): {
  [key: string]: number;
} => {
  const characters: {
    [key: string]: number;
  } = {};

  runs.forEach((run) => {
    run.roster.forEach((character) => {
      const { region, realm, name } = character;

      const characterKey = slugCharacter({ region, realm, name });

      if (characters[characterKey]) {
        characters[characterKey]++;
      } else {
        characters[characterKey] = 1;
      }
    });
  });

  return characters;
};

export const getCharactersInRun = (run: RunRaw, excludes: Character[] = []) => {
  return run.roster
    .map((rosterItem) => {
      return {
        region: rosterItem.character.region.name,
        realm: rosterItem.character.realm.name,
        name: rosterItem.character.name,
      };
    })
    .filter((character) => {
      return !excludes.some((exclude) => {
        return (
          exclude.region.slug === character.region &&
          exclude.realm.slug === character.realm &&
          exclude.name === character.name
        );
      });
    });
};

export const getCharactersInRuns = (
  runs: RunRaw[],
  excludes: Character[] = [],
) => {
  return runs.map((run) => {
    return getCharactersInRun(run, excludes);
  });
};

export const getLimitedChars = (
  runs: Run[],
  limit: number,
  excludes: Character[] = [],
) => {
  const charCounts = countCharactersInRuns(runs);
  const limitedChars = Object.keys(charCounts).filter(
    (key) => charCounts[key] >= limit,
  );

  return limitedChars
    .map((char) => {
      const [name, realm, region] = char.split("-");
      const character = {
        name,
        realm: {
          id: 0,
          connected_realm_id: 0,
          name: realm,
          slug: "slug",
          locale: "",
        },
        region: {
          name: region,
          slug: "slug",
          short_name: "",
        },
      };
      return character;
    })
    .filter((character) => {
      return !excludes.some((exclude) => {
        return (
          exclude.region.name === character.region.name &&
          exclude.realm.name === character.realm.name &&
          exclude.name === character.name
        );
      });
    });
};

// gives back only runs where a character in the run appears at least limit times
export const filterRunsToLimit = (
  runs: Run[],
  limit: number,
  excludes: Character[] = [],
) => {
  const charCounts = countCharactersInRuns(runs);

  // use excludes to exclude queried character from being counted
  // slightly clunky - TODO: fix this
  excludes.map((character) => {
    const { region, realm, name } = character;
    const characterKey = slugCharacter({ region, realm, name });
    charCounts[characterKey] = -1;
  });

  return runs.filter((run) => {
    return run.roster.some((character) => {
      const { region, realm, name } = character;

      const characterKey = slugCharacter({ region, realm, name });

      return charCounts[characterKey] >= limit;
    });
  });
};

// TODO: rename/formalize this func
export const slugCharacter = (character: Character): string => {
  return `${character.name}-${character.realm}-${character.region}`;
};

// reduces roster's characters to only relevant info
export const summarizeRoster = (roster: Character[]) => {
  return roster.map((rosterItem) => {
    return {
      region: rosterItem.region,
      realm: rosterItem.realm,
      name: rosterItem.name,
      id: rosterItem.id,
      faction: rosterItem.faction,
      class: rosterItem.class,
      race: rosterItem.race,
    };
  });
};

const summarizeAffixes = (weekly_modifiers: Affix[]) => {
  return weekly_modifiers.map((modifier) => {
    return modifier.name;
  });
};

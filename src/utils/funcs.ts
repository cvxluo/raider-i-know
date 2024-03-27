import { Affix, Character, Run, RunRaw } from "./types";

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
    weekly_modifiers: summarizeAffixes(weekly_modifiers),
    keystone_team_id,
    roster: roster.map((rosterItem) => {
      return rosterItem.character;
    }),
  };

  return summarizedRun;
};

export const countCharactersInRuns = (
  runs: Run[],
  excludes: Character[] = [],
): {
  [key: number]: number;
} => {
  const characters: {
    [key: number]: number;
  } = {};

  runs.forEach((run) => {
    run.roster.forEach((character) => {
      // TODO: this assumes character id exists and is a number - might be unknown
      const characterKey = character.id as number;

      if (characters[characterKey]) {
        characters[characterKey]++;
      } else {
        characters[characterKey] = 1;
      }
    });
  });

  return characters;
};

export const getCharactersInRuns = (runs: Run[]) => {
  const characters = runs
    .map((run) => {
      return run.roster;
    })
    .flat();
  // assume id exists
  console.log("Number of characters in runs: ", characters.length);
  const charIds = characters.map((char) => char.id);
  const uniqueCharacters = characters.filter((char, index) => {
    return !charIds.includes(char.id, index + 1);
  });
  console.log("Number of unique characters in runs: ", uniqueCharacters.length);

  return uniqueCharacters;
};

export const getLimitedChars = (
  runs: Run[],
  limit: number,
  excludes: Character[] = [],
) => {
  const charCounts = countCharactersInRuns(runs);
  const charsInRun = getCharactersInRuns(runs);

  const limitedChars = charsInRun.filter((char) => {
    // TODO: also assumes character id exists
    return charCounts[char.id as number] >= limit;
  });

  return limitedChars.filter((character) => {
    return !excludes.some((exclude) => {
      return (
        exclude.region.name === character.region.name &&
        exclude.realm.name === character.realm.name &&
        exclude.name === character.name
      );
    });
  });
};

// TODO: rename/formalize this func
export const slugCharacter = (character: Character): string => {
  return `${character.name}-${character.realm.name}-${character.region.name}`;
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

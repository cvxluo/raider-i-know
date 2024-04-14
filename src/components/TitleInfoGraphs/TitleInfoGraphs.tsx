"use client";

import { getLatestTitleCounts } from "@/actions/mongodb/title";
import { getBestAltRunsForChar } from "@/actions/raiderio/characters/mplus_best_alt_runs";
import { getBestRunsForChar } from "@/actions/raiderio/characters/mplus_best_runs";
import { getScoreColors } from "@/actions/raiderio/score_colors";
import { DungeonIdToName } from "@/utils/consts";
import { BestRuns, Character, LevelCounts, TitleInfo } from "@/utils/types";
import { Box, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CharacterSelector from "../CharacterSelector";
import TitleCharCompare from "./TitleCharCompare";
import TitleDungeonChart from "./TitleDungeonChart";

const TitleInfoGraphs = () => {
  const [titleInfo, setTitleInfo] = useState<TitleInfo>({
    title_score: 0,
    num_title_players: 0,
    title_range_chars: [],
    title_top_runs: [],
    level_counts: Object.values(DungeonIdToName).reduce((acc, dungeon) => {
      acc[dungeon] = {
        Fortified: {},
        Tyrannical: {},
      };
      return acc;
    }, {} as LevelCounts),
  });

  const [colors, setColors] = useState<string[]>([]);

  const [selectedCharacter, setSelectedCharacter] = useState<Character>({
    name: "",
    region: {
      name: "",
      slug: "",
      short_name: "",
    },
    realm: {
      id: 0,
      name: "",
      slug: "",
      connected_realm_id: 0,
      locale: "",
    },
  });

  const [bestRuns, setBestRuns] = useState<BestRuns>(
    Object.keys(DungeonIdToName).reduce((acc, dungeonID) => {
      acc[parseInt(dungeonID)] = {
        Fortified: 0,
        Tyrannical: 0,
      };
      return acc;
    }, {} as BestRuns),
  );

  const toast = useToast();

  const handleCharacterSelect = async (character: Character) => {
    setSelectedCharacter(character);

    // TODO: clean up
    const bestRunsReq = getBestRunsForChar({
      region: character.region.slug,
      realm: character.realm.slug,
      name: character.name,
    }).then((res) => {
      const runs = res.reduce((acc, run) => {
        acc[run.zone_id] = {
          Fortified: 0,
          Tyrannical: 0,
        };
        return acc;
      }, {} as BestRuns);

      res.forEach((run) => {
        runs[run.zone_id][
          run.affixes.map((affix) => affix.name).includes("Fortified")
            ? "Fortified"
            : "Tyrannical"
        ] = run.mythic_level;
      });

      setBestRuns((prevBestRuns) => {
        const merged = Object.keys(DungeonIdToName).reduce((acc, dungeonID) => {
          acc[parseInt(dungeonID)] = {
            Fortified: Math.max(
              prevBestRuns[parseInt(dungeonID)]["Fortified"],
              runs[parseInt(dungeonID)]["Fortified"],
            ),
            Tyrannical: Math.max(
              prevBestRuns[parseInt(dungeonID)]["Tyrannical"],
              runs[parseInt(dungeonID)]["Tyrannical"],
            ),
          };
          return acc;
        }, {} as BestRuns);
        return merged;
      });
    });

    const bestAltRunsReq = getBestAltRunsForChar({
      region: character.region.slug,
      realm: character.realm.slug,
      name: character.name,
    }).then((res) => {
      const runs = res.reduce((acc, run) => {
        acc[run.zone_id] = {
          Fortified: 0,
          Tyrannical: 0,
        };
        return acc;
      }, {} as BestRuns);

      res.forEach((run) => {
        runs[run.zone_id][
          run.affixes.map((affix) => affix.name).includes("Fortified")
            ? "Fortified"
            : "Tyrannical"
        ] = run.mythic_level;
      });

      setBestRuns((prevBestRuns) => {
        const merged = Object.keys(DungeonIdToName).reduce((acc, dungeonID) => {
          acc[parseInt(dungeonID)] = {
            Fortified: Math.max(
              prevBestRuns[parseInt(dungeonID)]["Fortified"],
              runs[parseInt(dungeonID)]["Fortified"],
            ),
            Tyrannical: Math.max(
              prevBestRuns[parseInt(dungeonID)]["Tyrannical"],
              runs[parseInt(dungeonID)]["Tyrannical"],
            ),
          };
          return acc;
        }, {} as BestRuns);
        return merged;
      });
    });

    toast.promise(Promise.all([bestRunsReq, bestAltRunsReq]), {
      loading: {
        title: `Loading best runs for ${character.name}-${character.realm.name}`,
        isClosable: true,
      },
      success: {
        title: `Loaded best runs for ${character.name}-${character.realm.name}`,
        isClosable: true,
      },
      error: {
        title: "Error loading best runs, try again later.",
        isClosable: true,
      },
    });
  };

  useEffect(() => {
    getLatestTitleCounts().then((res) => {
      setTitleInfo(res);
    });

    getScoreColors("season-df-3").then((res) => {
      // we want lower keys to be purple, higher to be orange
      // we cut out low colors, and then take every 3rd color to get a larger differential between colors
      // TODO: this assumes the range is at max 10 colors, which is not guaranteed
      const colors = res
        .slice(0, 100)
        .map((color) => color.rgbHex)
        .filter((color, index, self) => index % 10 === 0)
        .reverse();
      setColors(colors);
    });
  }, []);

  return (
    <Box>
      <CharacterSelector handleCharSubmit={handleCharacterSelect} />

      {selectedCharacter.name && (
        <TitleCharCompare
          levelCounts={titleInfo.level_counts}
          charRunLevels={bestRuns}
          numTotalKeys={titleInfo.num_title_players}
        />
      )}
      {Object.entries(DungeonIdToName)
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map((entry) => {
          const dungeonID = parseInt(entry[0]);
          const dungeonName = entry[1];
          return (
            <TitleDungeonChart
              dungeonLevelCounts={titleInfo.level_counts[dungeonName]}
              dungeonName={dungeonName}
              colors={colors}
              highlightLevels={bestRuns[dungeonID]}
              key={dungeonID}
            />
          );
        })}
    </Box>
  );
};

export default TitleInfoGraphs;

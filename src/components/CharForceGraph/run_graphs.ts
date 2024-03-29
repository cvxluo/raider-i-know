import {
  countCharactersInRuns,
  getCharactersInRuns,
  getLimitedChars,
} from "@/utils/funcs";
import { Character, CharacterGraph, CharacterNode, Run } from "@/utils/types";

import {
  getPopulatedRunsWithCharacter,
  getPopulatedRunsWithCharacters,
  getRunsWithCharacter,
} from "@/actions/mongodb/run";
import next from "next";
import { ClassColors } from "@/utils/consts";
import urls from "@/utils/urls";

const callGetPopulatedRunsWithCharacters = async (chars: Character[]) => {
  return (
    fetch("/api/character/getRunsWithCharacters", {
      method: "POST",
      body: JSON.stringify({ characters: chars }),
    })
      .then((res) => res.json())
      // TODO: consider error handling patterns here
      .then((res) => {
        if (res.error) {
          throw new Error(res.error);
        }
        return res;
      })
      .catch((e) => {
        console.error(e);
        return [];
      })
  );
};

// start from [[mainChar]], with all the runs of mainChar, and an empty mainChar link array
// add [[mainChar], [all adjacent chars]]
// this works by first call func -> find all characters connected to the last layer
// -> get all their runs -> process -> return them as the last layer -> repeat
export const getNextLayer = async (
  layers: Character[][],
  linkCounts: { [key: number]: { [key: number]: number } },
  runs: { [key: number]: Run[] },
  degree = -1,
  excludes: Character[] = [],
) => {
  const d = degree === -1 ? layers.length - 1 : degree - 1;
  const nextLayer: Character[] = [];
  const nextLinks: { [key: number]: { [key: number]: number } } = {
    ...linkCounts,
  };
  const nextRuns: { [key: number]: Run[] } = {};
  const previousCharacters = layers.flat();

  const layerChars = layers[d];
  const layerRuns = layerChars.map((char) => runs[char.id as number]).flat();
  const charCounts = countCharactersInRuns(layerRuns, excludes);
  const newChars = getCharactersInRuns(layerRuns).filter((char) => {
    return (
      previousCharacters.every((c) => c.id !== char.id) &&
      charCounts[char.id as number] >= 15 &&
      char.id !== layerChars[0].id
    );
  });

  nextLayer.push(...newChars);
  previousCharacters.push(...newChars);

  const allNewCharRequests = newChars
    .reduce(
      (acc, char) => {
        // batch requests to 1000 characters to prevent payload size and timeout errors
        acc[acc.length - 1].push(char);
        if (acc[acc.length - 1].length === 100) {
          acc.push([]);
        }
        return acc;
      },
      [[]] as Character[][],
    )
    .map((chars) => callGetPopulatedRunsWithCharacters(chars));

  const allNewCharRunRetrieved: Run[] = (
    await Promise.all(allNewCharRequests)
  ).flat();
  // remove duplicate runs - happens when we do multiple requests
  const allNewRunIds = allNewCharRunRetrieved.map((run) => run.keystone_run_id);
  const allNewCharRuns = allNewCharRunRetrieved.filter((run, index) => {
    return !allNewRunIds.includes(run.keystone_run_id, index + 1);
  });

  // const allNewCharRuns: Run[] = await callGetPopulatedRunsWithCharacters(newChars);

  newChars.map((newChar) => {
    const newCharRuns = allNewCharRuns.filter((run) =>
      run.roster.map((char) => char.id).includes(newChar.id as number),
    );

    nextRuns[newChar.id as number] = newCharRuns;

    nextLinks[newChar.id as number] = {};

    const newCharCounts = countCharactersInRuns(newCharRuns);
    delete newCharCounts[newChar.id as number];

    const connectionsInGraph = previousCharacters.filter(
      (char) => newCharCounts[char.id as number] > 0,
    );

    connectionsInGraph.map((char) => {
      nextLinks[newChar.id as number][char.id as number] =
        newCharCounts[char.id as number];

      if (!nextLinks[char.id as number]) {
        nextLinks[char.id as number] = {};
      }
      nextLinks[char.id as number][newChar.id as number] =
        newCharCounts[char.id as number];
    });
  });

  return { nextLayer, nextLinks, nextRuns };
};

export const appendNextLayer = async (
  layers: Character[][],
  linkCounts: { [key: number]: { [key: number]: number } },
  runs: { [key: number]: Run[] },
  degree = -1,
  excludes: Character[] = [],
) => {
  const d = degree === -1 ? layers.length : degree;
  const nextLayerData = await getNextLayer(
    layers,
    linkCounts,
    runs,
    degree,
    excludes,
  );

  layers.push(nextLayerData.nextLayer);
  Object.keys(nextLayerData.nextLinks).forEach((source) => {
    linkCounts[parseInt(source)] = nextLayerData.nextLinks[parseInt(source)];
  });
  Object.keys(nextLayerData.nextRuns).forEach((charId) => {
    runs[parseInt(charId)] = nextLayerData.nextRuns[parseInt(charId)];
  });
};

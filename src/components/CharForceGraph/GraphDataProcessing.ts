"use client";

import { ClassColors } from "@/utils/consts";
import { Character, CharacterGraph, CharacterNode, Run } from "@/utils/types";

export const graphDataToForceGraph = (
  layers: Character[][],
  linkCounts: { [key: number]: { [key: number]: number } },
  runs: { [key: number]: Run[] },
  dense = false,
  limit = 15,
  degree = -1,
) => {
  const d = degree === -1 ? layers.length - 1 : degree;
  const degreeLayers = layers.slice(0, d + 1);
  if (degreeLayers.length === 0) {
    return { nodes: [], links: [] } as CharacterGraph;
  }
  const nodes = degreeLayers
    .map((layer, i) => {
      return layer.map((char) => {
        return {
          id: char.id as number,
          name: char.name,
          layer: i,
          nodeColor: char.class ? ClassColors[char.class.name] : "blue",
        };
      });
    })
    .flat() as CharacterNode[];

  nodes[0]["nodeColor"] = "red";

  let links: { source: number; target: number; numRuns?: number }[] = [];
  if (dense) {
    links = Object.keys(linkCounts)
      .map((source) => {
        return Object.keys(linkCounts[parseInt(source)]).map((target) => {
          return {
            source: parseInt(source),
            target: parseInt(target),
            numRuns: linkCounts[parseInt(source)][parseInt(target)],
          };
        });
      })
      .flat()
      .filter((link) => {
        return (
          nodes.some((node) => node.id === link.source) &&
          nodes.some((node) => node.id === link.target && link.numRuns >= limit)
        );
      });
  } else {
    // to get the tree version, we prioritize high count nodes for each link
    links = [];

    // reverse bfs-like solution - has issues with lingering components
    // caused by us wanting highest count links, but bfs not guaranteeing that the highest count link is found first
    // going bottom up - each node in a layer is connected to the highest count node in the layer above
    for (let i = degreeLayers.length - 1; i > 0; i--) {
      for (let source of degreeLayers[i]) {
        const sourceId = source.id as number;
        const targetLayer = degreeLayers[i - 1];
        const sourceConnections = targetLayer.filter(
          (target) => linkCounts[sourceId][target.id as number] > 0,
        );
        // TODO: this handles cases where somehow, a node has no connections
        // this shouldn't happen unless there are no nodes in the graph
        // mostly comes up in fetch errors, etc.
        if (sourceConnections.length === 0) {
          continue;
        }
        const target = sourceConnections.reduce((a, b) => {
          return linkCounts[b.id as number][sourceId] >
            linkCounts[a.id as number][sourceId]
            ? b
            : a;
        });

        // note tree mode has different limit rules, since we want to show the highest count links
        // we don't filter a link if a node it connects to has another link, as that would leave an orphaned component
        // idea is that every link we find here is part of the tree - however, we can remove low count leaf nodes
        // so, at every point, we can remove a low count leaf IF it is a leaf - no other links to it
        if (
          linkCounts[sourceId][target.id as number] >= limit ||
          links.map((link) => link.source).includes(sourceId)
        ) {
          links.push({
            // TODO: slight misnaming, we want this to be true since we use radial out mode
            target: sourceId,
            source: target.id as number,
            numRuns: linkCounts[sourceId][target.id as number],
          });
        }
      }
    }
  }

  // remove all nodes that are not connected to any links
  const filteredNodes = nodes.filter((node) => {
    return links.some(
      (link) => link.source === node.id || link.target === node.id,
    );
  });

  return { nodes: filteredNodes, links } as CharacterGraph;
};

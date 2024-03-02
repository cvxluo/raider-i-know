import mongoose, { ObjectId, Types } from "mongoose";

// this will be the character interface returned from runs, NOT the character api
export interface Character {
  _id?: Types.ObjectId;

  region: Region;
  realm: Realm;
  name: string;

  id?: number;
  faction?: string;
  class?: Class;
  race?: Race;
}

// frontend generally doens't need whole character objects, so this is a minimal version
export interface CharacterMinimal {
  region: string;
  realm: string;
  name: string;
}

export interface Class {
  id: number;
  name: string;
  slug: string;
}

export interface Race {
  id: number;
  name: string;
  slug: string;
  faction: string;
}

export interface Spec {
  id: number;
  name: string;
  slug: string;
}

export interface Run {
  _id?: Types.ObjectId;
  season: string;
  dungeon: {
    name: string;
    id: number;
  };
  keystone_run_id: number;
  mythic_level: number;
  completed_at: Date;
  weekly_modifiers: string[];
  keystone_team_id: number;
  roster: Character[];
}

export interface RunReducedRoster extends Omit<Run, "roster"> {
  roster: mongoose.Types.ObjectId[]; // the character ids
}

export interface RunSummary extends Partial<Run> {
  completed_at: Date;
  dungeon: {
    name: string;
    id: number;
  };
  keystone_run_id: number;
  mythic_level: number;
}

export interface Region {
  name: string;
  slug: string;
  short_name: string;
}

export interface Realm {
  id: number;
  connected_realm_id: number;
  name: string;
  slug: string;
  locale: string;
}

export interface RunRaw {
  season: string;
  dungeon: {
    name: string;
    id: number;
  };
  keystone_run_id: number;
  mythic_level: number;
  completed_at: Date;
  weekly_modifiers: Affix[];
  keystone_team_id: number;
  roster: CharacterRaw[];
}

export interface RankingRaw {
  rankings: {
    rank: number;
    score: number;
    run: RunRaw;
  }[];
}

export interface Affix {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export interface CharacterRaw {
  character: Character;
}

export interface CharacterNode {
  id: number;
  name: string;
  fx?: number;
  fy?: number;
  nodeLabel?: string;
  nodeColor?: string;

  layer?: number;
}

export interface CharacterGraph {
  nodes: CharacterNode[];
  links: {
    source: number;
    target: number;
  }[];
}

export interface GraphOptions {
  showLabels: boolean;
  degree: number;
  runLimit: number;
  treeMode: boolean;
  radialMode: boolean;
}

export type RequestReturn = RunRaw | CharacterRaw | RankingRaw;
export type Request = (...args: any[]) => Promise<RequestReturn>;

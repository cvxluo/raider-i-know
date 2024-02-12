import mongoose, { Types } from "mongoose";

export interface Character {
  _id?: Types.ObjectId;
  region: string;
  realm: string;
  name: string;
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

export interface Region {
  name: string;
  slug: string;
  short_name: string;
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
  character: {
    region: {
      name: string;
    };
    realm: {
      name: string;
    };
    name: string;
  };
}

export interface CharacterNode {
  character: Character;
  parentCharacter: Character;
}

export type RequestReturn = RunRaw | CharacterRaw | RankingRaw;
export type Request = (...args: any[]) => Promise<RequestReturn>;

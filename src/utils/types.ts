import mongoose, { Types } from "mongoose";

export interface Character {
  _id: Types.ObjectId;
  region: string;
  realm: string;
  name: string;
}

export interface Run {
  _id: Types.ObjectId;
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

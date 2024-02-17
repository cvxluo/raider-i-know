import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

/*
const DungeonSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
*/

const RunSchema = new Schema({
  season: {
    type: String,
    required: true,
  },
  dungeon: {
    type: {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  keystone_run_id: {
    type: Number,
    required: true,
  },
  mythic_level: {
    type: Number,
    required: true,
  },
  completed_at: {
    type: Date,
    required: true,
  },
  weekly_modifiers: {
    type: [String],
    required: true,
  },
  keystone_team_id: {
    type: Number,
    required: true,
  },
  roster: [
    {
      type: Types.ObjectId,
      ref: "Character",
      required: true,
    },
  ],
});
export { RunSchema };
export default mongoose.models?.Run ?? mongoose.model("Run", RunSchema);

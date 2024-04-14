import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

const TitleInfoSchema = new Schema({
  title_score: {
    type: Number,
    required: true,
  },
  num_title_players: {
    type: Number,
    required: true,
  },
  title_range_chars: [
    {
      type: Types.ObjectId,
      ref: "Character",
      required: true,
    },
  ],
  title_top_runs: [
    {
      type: Types.ObjectId,
      ref: "Run",
      required: true,
    },
  ],
  // TODO: messy implementation of level_counts
  // can clean up by more strictly defining the schema, or by dynamically creating a LevelCounts schema
  level_counts: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

export { TitleInfoSchema };
export default mongoose.models?.TitleInfo ??
  mongoose.model("TitleInfo", TitleInfoSchema);

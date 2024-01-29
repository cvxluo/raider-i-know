import mongoose from "mongoose";

const { Schema } = mongoose;

const RunSchema = new Schema({
  season: {
    type: String,
    required: true,
  },
  keystone_run_id: {
    type: Number,
    required: true,
  },
});
export { RunSchema };
export default mongoose.models?.Run ?? mongoose.model("Run", RunSchema);

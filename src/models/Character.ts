import mongoose from "mongoose";

const { Schema } = mongoose;

const CharacterSchema = new Schema({
  region: {
    type: String,
    required: true,
  },
  realm: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
export { CharacterSchema };
export default mongoose.models?.Character ??
  mongoose.model("Character", CharacterSchema);

import mongoose from "mongoose";

const { Schema } = mongoose;

const ClassSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
});

const RealmSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  connected_realm_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  locale: {
    type: String,
    required: true,
  },
});

const RaceSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  faction: {
    type: String,
    required: true,
  },
});

const RegionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  short_name: {
    type: String,
    required: true,
  },
});

const CharacterSchema = new Schema({
  region: {
    type: RegionSchema,
    required: true,
  },
  realm: {
    type: RealmSchema,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: false,
  },
  class: {
    type: ClassSchema,
    required: false,
  },
  race: {
    type: RaceSchema,
    required: false,
  },
  faction: {
    type: String,
    required: false,
  },
});

export { CharacterSchema };
export default mongoose.models?.Character ??
  mongoose.model("Character", CharacterSchema);

import mongoose, { Schema, model, Types } from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// const contentTypes = ["images", "video", "article", "audio"];

const ContentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  tags: [{ type: Types.ObjectId, ref: "tags" }],
  userId: { type: Types.ObjectId, ref: "user", required: true },
});

const TagsSchema = new Schema({
  title: String,
});

const LinksSchema = new Schema({
  hash: { type: String, required: true },
  userId: {
    type: Types.ObjectId,
    ref: "users",
    required: true,
  },
});

export const UserModel = model("user", UserSchema);
export const ContentModel = model("content", ContentSchema);
export const TagsModel = model("tags", TagsSchema);
export const LinksModel = model("links", LinksSchema);

// export default {
//   UserModel,
//   ContentModel,
//   TagsModel,
//   LinksModel,
// };

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter";
import contentRouter from "./routes/content";
const app = express();

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);

async function main() {
  // @ts-ignore
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(3000);
}

main();

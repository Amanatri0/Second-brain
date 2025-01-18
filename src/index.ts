import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter";
import contentRouter from "./routes/content";
const app = express();

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);

async function main() {
  await mongoose.connect(
    "mongodb+srv://aman:1cbYwjmP8LlKclTF@cluster0.3lzlb.mongodb.net/second-brainApp"
  );
  app.listen(3000);
}

main();

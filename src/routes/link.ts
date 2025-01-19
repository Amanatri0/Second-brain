import { Router } from "express";
import { ContentModel, LinksModel, UserModel } from "../database/db";
import { userMiddleware } from "../middleware/userMiddleware";

const linkRouter = Router();

function hashValue(len: number) {
  const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let ans = "";

  for (let i = 0; i < len; i++) {
    ans += char[Math.floor(Math.random() * char.length)];
  }
  return ans;
}

linkRouter.post("/share", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const { share } = req.body;
  const hashV = hashValue(15);

  if (share) {
    await LinksModel.create({
      userId: userId,
      hash: hashV,
    });

    res.json({
      message: "Your shareable id is been generated successfully",
      hashV,
    });
  } else {
    await LinksModel.deleteOne({
      userId: userId,
    });
    res.status(303).send({
      message: "Removed sharable link ",
    });
  }
});

linkRouter.get("/:sharablelink", async (req, res) => {
  const sharableLink = req.params.sharablelink;

  try {
    if (!sharableLink) {
      res.status(403).send({
        message: "Please provide a valid params with a valid hash",
      });
      return;
    }

    const hashStr = await LinksModel.findOne({
      hash: sharableLink,
    });
    const user = await UserModel.findOne({
      _id: hashStr?.userId,
    });

    const content = await ContentModel.find({
      userId: user?._id,
    });

    if (user && content) {
      res.json({
        message: `Content of the user ${user.username}`,
        content,
      });
    } else {
      res.status(403).send({
        message: "user content cannot be found",
      });
    }
  } catch (error) {
    res.status(403).send({
      message: "Somethig went wrong while sahrting the content ",
      error: (error as Error).message,
    });
  }
});

export default linkRouter;

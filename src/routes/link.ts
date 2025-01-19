import { Router } from "express";
import { ContentModel, LinksModel, UserModel } from "../database/db";
import { userMiddleware } from "../middleware/userMiddleware";

const linkRouter = Router();

function hashValue(len: number) {
  const char =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_+}{:?><";
  let ans = "";

  for (let i = 0; i < len; i++) {
    ans += char[Math.floor(Math.random() * char.length + 1)];
  }
  return ans;
}

linkRouter.post("/share", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const { share } = req.body;

  console.log(share, userId);

  if (share) {
    const hashV = hashValue(15);
    await LinksModel.create({
      userId: userId,
      hash: hashV,
    });

    console.log(hashV);

    res.json({
      message: "Your shareable id is been generated successfully",
      hashV,
    });
  } else {
    res.status(403).send({
      message: "Sharable link cannot be generated, something went wrong",
    });
  }
});

linkRouter.get("/:sharablelink", async (req, res) => {
  const sharableLink = req.params.sharablelink;

  try {
    if (!sharableLink || sharableLink === null) {
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

    if (user && content && hashStr) {
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

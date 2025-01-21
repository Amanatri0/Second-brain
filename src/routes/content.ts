import { Router, Response, Request } from "express";
import { ContentModel, UserModel } from "../database/db";
import { userMiddleware } from "../middleware/userMiddleware";
const contentRouter = Router();

contentRouter.post(
  "/created",
  userMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    const { link, type, title, tags } = req.body;
    try {
      if (!userId || userId === null) {
        res.status(401).send({
          message: "User ID is not present",
        });
      }

      const user = await UserModel.findOne({
        _id: userId,
      });

      if (!user) {
        res.status(401).send({
          message: "User is not present in the databse please check the userId",
        });
      }

      const content = await ContentModel.create({
        link: link,
        type: type,
        title: title,
        tags: tags,
        userId: userId,
      });

      res.json({
        message: "Conent has been successfully created",
        content: content._id,
      });
    } catch (error) {
      res.status(500).send({
        message: "Content was unabler to create",
        error: (error as Error).message,
      });
    }
  }
);

contentRouter.get(
  "/user/content",
  userMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      res.status(403).send({
        message: "Please provide a valid userId",
      });
    }

    const user = await ContentModel.find({
      userId: userId,
    }).populate("userId", "username");

    if (user) {
      res.json({
        user,
      });
    }
  }
);

contentRouter.delete("/delete", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const contentId = req.body.contentId;

  try {
    const deleteContent = await ContentModel.deleteOne(
      {
        _id: contentId,
      },
      { userId: userId }
    );

    if (deleteContent) {
      const remainingContent = await ContentModel.find({
        userId: userId,
      });

      res.json({
        presentContent: remainingContent,
      });
    }
  } catch (error) {
    res.status(403).send({
      message: "Contnet cannot be deleted, you don't have access",
      error: (error as Error).message,
    });
  }
});

contentRouter.get("/share", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const contentId = req.body.contentId;
  let share = req.body.share;

  try {
    const user = await ContentModel.findOne({
      _id: contentId,
      userId: userId,
    });
    console.log(user);

    if (user) {
      share = true;
      if (share) {
        res.json({
          user,
        });
      } else {
        res.status(401).send({
          message: "Cannot share the content",
        });
      }
    }
  } catch (error) {
    res.status(403).send({
      message: "User content is not sharable",
      error: (error as Error).message,
    });
  }
});

export default contentRouter;

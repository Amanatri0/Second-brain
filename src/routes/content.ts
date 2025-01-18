import { Router, Response, Request } from "express";
import { ContentModel, UserModel } from "../database/db";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
// import { userMiddleware } from "../middleware/userMiddleware";

const contentRouter = Router();

contentRouter.post("/created", async (req: Request, res: Response) => {
  const userId = req.body.userId;
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
});

contentRouter.get("/user/content", async (req: Request, res: Response) => {
  const userId = req.body.userId;
  if (!userId) {
    res.status(403).send({
      message: "Please provide a valid userId",
    });
  }

  const user = await ContentModel.findOne({
    _id: userId,
  });

  console.log(user);

  if (userId === user) {
  }
});

contentRouter.get("/share", async (req, res) => {
  const userId = req.body.userId;
  const courseId = req.body.courseId;

  const user = await ContentModel.findOne({
    userId: userId,
    courseId: courseId,
  }).populate("courseId");

  if (user) {
  }
});

export default contentRouter;

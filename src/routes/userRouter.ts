import { Router } from "express";
import { z } from "zod";
import { UserModel } from "../database/db";
import jwt from "jsonwebtoken";
const JWT_PASSWORD = process.env.JWT_PASSWORD;
import bcrypt from "bcrypt";

const userRouter = Router();

// type UserFormed = z.infer<typeof requiredBody>;

userRouter.post("/signup", async (req, res) => {
  try {
    const requiredBody = z.object({
      email: z.string().email({
        message: "Email cannot be empty, please cheeck the format of the email",
      }),

      username: z.string().min(3, { message: "Username cannot be empty" }),
      password: z.string().min(3, { message: "Password cannot be empty" }),
    });
    const { success } = requiredBody.safeParse(req.body);
    if (!success) {
      res.status(411).send({
        message: "User credentials not correct ",
      });
    }

    const { email, username, password } = req.body;

    const hashedPasssword = await bcrypt.hash(password, 5);

    await UserModel.create({
      email: email,
      username: username,
      password: hashedPasssword,
    });

    res.json({
      message: "User signup has been successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "User already exists",
      error: (error as Error).message,
    });
  }
});

// login end point

userRouter.post("/login", async (req, res) => {
  try {
    // // get the email/username and password
    // const { success } = requiredBody.safeParse(req.body);
    // //check for zod validations
    // if (!success) {
    //   res.status(411).send({
    //     message: "User credentials not correct ",
    //   });
    // }

    // match the format

    const { email, password } = req.body;

    // find the user from the database

    const loggedInUser = await UserModel.findOne({
      email: email,
    });

    // check if the user is already signed up and user data are present in the database
    if (!loggedInUser) {
      res.status(403).send({
        message: "User not found, please signup",
      });
      return;
    }

    //if user is present check for the password and compare the password that the user has provided with the database password

    const hashedPasssword = bcrypt.compare(password, loggedInUser.password);

    // if the password is correct create a token and send the token to the user
    if (!hashedPasssword) {
      res.status(500).send({
        message: "User password failed",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: loggedInUser._id,
      },
      JWT_PASSWORD as string
    );

    res.json({
      token: token,
    });
  } catch (error) {
    res.status(500).send({
      message: "Use login failed",
      error,
    });
  }
});

export default userRouter;

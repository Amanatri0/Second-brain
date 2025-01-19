import { Response, Request, NextFunction } from "express";
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
import jwt, { JwtPayload } from "jsonwebtoken";
import { string } from "zod";
const JWT_PASSWORD = process.env.JWT_PASSWORD;

// interface CustomRequest extends Request {
//   id: string;
// }

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userInfoHeaders = req.headers["authorization"] as string;
  try {
    if (!userInfoHeaders) {
      res.status(411).send({
        message: "User tokem not valid",
      });
    }

    const verifiedToken = jwt.verify(
      userInfoHeaders,
      JWT_PASSWORD as string
    ) as JwtPayload;

    if (verifiedToken === string) {
      res.status(500).send({
        message: "User Middleware check failed",
      });
    }

    if (verifiedToken) {
      req.userId = verifiedToken.id;
      next();
      return;
    }
    res.json({
      message: "User verification successfull",
    });
  } catch (error) {
    res.status(500).send({
      message: "User Middleware check failed",
      error,
    });
  }
};

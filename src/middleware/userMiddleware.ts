import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const JWT_PASSWORD = "abcdefghicklmnop1234456";

interface CustomRequest extends Request {
  id: string;
}

export async function userMiddleware(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const userInfoHeaders = req.headers.authentication as string;
  try {
    if (!userInfoHeaders) {
      res.status(411).send({
        message: "User tokem not valid",
      });
    }

    const verifiedToken = jwt.verify(
      userInfoHeaders,
      JWT_PASSWORD
    ) as JwtPayload;

    if (verifiedToken) {
      req.id = verifiedToken.id;
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
}

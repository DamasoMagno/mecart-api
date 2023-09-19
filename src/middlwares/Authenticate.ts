import { Request, Response, NextFunction } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const [, token] = req.headers.authorization?.split(" ") as string[];

  try {
    const checkUser = verify(token, "575ae83ad709c84f7f89aaa02ff950d7");
    req.userId = checkUser.sub as string;

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(400).json({
        message: "Autenticação expirada",
      })
    }
  }
}
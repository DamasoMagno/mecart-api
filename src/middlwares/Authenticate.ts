import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export function AuthenticateUser(req: Request, res: Response, next: NextFunction) {
  const [, token] = req.headers.authorization?.split(" ") as string[];

  try {
    const checkUser = verify(token, "575ae83ad709c84f7f89aaa02ff950d7");
    req.userId = checkUser.sub as string;
    
    next();
  } catch (error) {
    res.json(error)
  }
}
import { Request, Response, NextFunction } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const [, token] = req.headers.authorization?.split(" ") as string[];

  try {
    const checkUser = verify(token, String(process.env.SECRET_KEY));
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
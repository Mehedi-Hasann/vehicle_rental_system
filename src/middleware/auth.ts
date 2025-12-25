import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

export const auth = (...roles: string[]) => {
  return async(req: Request, res: Response, next : NextFunction) => {
    const token = req.headers.authorization;

    if(!token){
      res.status(500).send({
        success : false,
        message : "You are not allowed"
      })
    }
    const secret = process.env.JWT_SECRET;
    const decoded = await jwt.verify(token as string, secret as string) as JwtPayload;
    req.user = decoded as JwtPayload;

    if(!roles.includes(decoded.role)){
      res.status(401).json({
        success : false,
        message : "Unauthorized!!"
      })
    }

    next();
  }
}

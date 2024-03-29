import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
        const token = (authHeader as string).split(" ")[1]; 
        jwt.verify(token, process.env.TOKEN_SECRET as string, (error: any, decoded: any) => {
            if (error) {
                res.sendStatus(403).json({message: "Unauthorized"});
                return next();
            }
            req.body.decoded = decoded;
            next();
        });
    } else {
        res.status(401).json({message: "Unauthorized"});
    }
}
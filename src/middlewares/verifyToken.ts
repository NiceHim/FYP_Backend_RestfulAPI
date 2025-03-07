import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { decryptToken } from "../utils/tokenUtils";
import dotenv from "dotenv";
dotenv.config();

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    if (token == null) {
        res.status(401).json({message: "Unauthorized"});
        return next();
    }
    // jwt.verify(token, process.env.TOKEN_SECRET as string, (error: any, decoded: any) => {
    //     if (error) {
    //         res.status(401).json({message: "Unauthorized"});
    //         return next();
    //     }
    //     req.decoded = decoded;
    //     next();
    // }); 
    try {
        const payload = await decryptToken(token);
        if (payload == null) {
            res.status(401).json({message: "Unauthorized"});
            return next();
        } else {
            req.decoded = { userId: payload["userId"] as string };
            next();
        }
    } catch (error) {
        res.status(401).json({message: "Unauthorized"});
    }
}
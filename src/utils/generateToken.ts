import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function generateToken(userName: string) {
    const token = jwt.sign({userName: userName}, process.env.TOKEN_SECRET as string, {algorithm: "HS256", expiresIn: "12h"});
    return token;
}
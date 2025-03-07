import * as jwt from "jsonwebtoken";
import * as jose from "jose";
import dotenv from "dotenv";
dotenv.config();

export async function generateToken(userId: string) {
    // const encryptedPlayload = crypto.createHmac("sha256", process.env.TOKEN_PLAYLOAD_SECRET as string)
    //                                 .update(JSON.stringify({ userId: userId }))
    //                                 .digest("base64");
    const payload = {
        userId: userId
    };
    // const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, {algorithm: "HS256", expiresIn: "2h"});
    // const jwt = new jose.SignJWT(payload)
    //                     .setIssuedAt()
    //                     .setExpirationTime("2h")
    //                     .setProtectedHeader({alg: "HS256"})
    //                     .sign(Uint8Array.from(process.env.TOKEN_SECRET as string));
    const jwe = await new jose.EncryptJWT(payload)    
                        .setProtectedHeader({alg: "A256KW", enc: "A256CBC-HS512"})
                        .setIssuedAt()
                        .setExpirationTime("2h")
                        .encrypt(Buffer.from(process.env.JWE_TOKEN_SECRET as string, "base64"));
    return jwe;
}

export async function decryptToken(token: string) {
    const { payload, protectedHeader } = await jose.jwtDecrypt(token, Buffer.from(process.env.JWE_TOKEN_SECRET as string, "base64"));
    return payload;
}
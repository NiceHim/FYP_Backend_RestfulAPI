import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

const iterations = 10000;
const outputLength = 32;

export async function comparePasswordBcrypt(inputPassword: string, hashPassword: string): Promise<boolean> {
    const result = await bcrypt.compare(inputPassword, hashPassword);
    return result;
}

export async function hashPasswordBcrypt(password: string): Promise<string> {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

export async function hashPasswordPBKDF2(inputPassword: string): Promise<Array<string>> {
    const saltBuffer = crypto.randomBytes(16);
    return new Promise((reslove, reject) => {
        crypto.pbkdf2(inputPassword, saltBuffer, iterations, outputLength, "sha512", (err, derivedKey) => {
            if (err) {
                reject(err);
            } else {
                reslove([derivedKey.toString("base64"), saltBuffer.toString("base64")]);
            }
        })
    })
}

export async function comparePasswordPBKDF2(inputPassword: string, hashPassword: string, salt: string): Promise<boolean> {
    const saltBuffer = Buffer.from(salt, "base64");
    return new Promise((reslove, reject) => {
        crypto.pbkdf2(inputPassword, saltBuffer, iterations, outputLength, "sha512", (err, derivedKey) => {
            if (err) {
                reject(err);
            } else {
                reslove(derivedKey.toString("base64") == hashPassword);
            }
        })
    })
}
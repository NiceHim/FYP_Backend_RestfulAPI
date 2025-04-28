import { StrictFilter } from "mongodb";
import MongoDBManager from "../db/MongoDBManager";
import { hashPasswordBcrypt, comparePasswordBcrypt} from "../utils/passwordUtils";
import IUser from "../models/user";
import dotenv from "dotenv";
dotenv.config();

export async function createUser(userName: string, password: string) {
    try {
        const hash = await hashPasswordBcrypt(password);
        const user: IUser = {
            userName: userName,
            hash: hash,
            balance: 0,
            equity: 0,
            unrealizedPnL: 0,
            createdAt: new Date()
        };
        const result = await MongoDBManager.getInstance().collections.user?.insertOne(user);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function findUser(userName: string) {
    try {
        const filter: StrictFilter<IUser> = { "userName": userName };
        const result = await MongoDBManager.getInstance().collections.user?.findOne(filter);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function login(password: string, hash: string) {
    try {
        const result = await comparePasswordBcrypt(password, hash);
        return result;
    } catch (error) {
        throw error;
    }
}
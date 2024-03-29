import * as bcrypt from "bcrypt";
import { StrictFilter } from "mongodb";
import { collections } from "../db/conn";
import IUser from "../models/user";
import dotenv from "dotenv";
dotenv.config();

export async function createAccount(userName: string, password: string) {
    try {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        const account: IUser = {
            userName: userName,
            hash: hash,
            balance: 0,
            equity: 0,
            unrealizedPnL: 0,
            createdAt: new Date()
        };
        const result = await collections.account?.insertOne(account);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function findUser(userName: string) {
    try {
        const filter: StrictFilter<IUser> = { "userName": userName };
        const result = await collections.account?.findOne(filter);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function login(password: string, hash: string) {
    try {
        const result = await bcrypt.compare(password, hash);
        return result;
    } catch (error) {
        throw error;
    }
}
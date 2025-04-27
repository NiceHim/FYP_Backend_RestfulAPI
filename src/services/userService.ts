import { StrictFilter, StrictUpdateFilter, Document, FindOptions, UpdateFilter, ObjectId, TransactionOptions } from "mongodb";
import DBManager from "../db/DBManager";
import IUser from "../models/user";
import dotenv from "dotenv";
import RedisManager from "../db/RedisManager";
dotenv.config();

export async function getUserInfo(userId: string) {
    try {
        const filter: StrictFilter<IUser> = { "_id": new ObjectId(userId) };
        const options: FindOptions<IUser> = {
            projection: {
                "userName": 1,
                "balance": 1,
                "equity": 1,
                "unrealizedPnL": 1,
                "createdAt": 1,
                "_id": 0
            }
        };
        const result = await DBManager.getInstance().collections.user?.findOne(filter, options);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function deposit(userId: string, depositAmt: number) {
    const cacheKey = `cache:balanceRecords:${userId}`;
    await RedisManager.deleteCachedData(cacheKey);
    const transactionOptions: TransactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    const session = DBManager.getInstance().client!.startSession();
    try {
        const result = await session.withTransaction(async (session) => {
            const filter: StrictUpdateFilter<IUser> = { "_id": new ObjectId(userId) };
            const updateFilter: UpdateFilter<IUser> = {
                $inc: { "balance": depositAmt, "equity": depositAmt } 
            };
            await DBManager.getInstance().collections.user?.updateOne(filter, updateFilter, { session });
            const balanceRecord: Document = {
                userId: new ObjectId(userId),
                action: "Deposit",
                amount: depositAmt,
                createdAt: new Date()
            };
            await DBManager.getInstance().collections.balanceRecord?.insertOne(balanceRecord, { session });
            return "Transaction completed successfully";
        }, transactionOptions);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function withdraw(userId: string, withdrawAmt: number) {
    const cacheKey = `cache:balanceRecords:${userId}`;
    await RedisManager.deleteCachedData(cacheKey);
    const transactionOptions: TransactionOptions = {
        readPreference: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' }
    };
    const session = DBManager.getInstance().client!.startSession();
    try {
        const result = await session.withTransaction(async (session) => {
            const filter: StrictUpdateFilter<IUser> = { "_id": new ObjectId(userId) };
            const updateFilter: UpdateFilter<IUser> = {
                $inc: { "balance": -withdrawAmt, "equity": -withdrawAmt } 
            };
            await DBManager.getInstance().collections.user?.updateOne(filter, updateFilter, { session });
            const balanceRecord: Document = {
                userId: new ObjectId(userId),
                action: "Withdraw",
                amount: withdrawAmt,
                createdAt: new Date()
            };
            await DBManager.getInstance().collections.balanceRecord?.insertOne(balanceRecord, { session });
            return "Transaction completed successfully";
        }, transactionOptions);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getBalance(userId: string) {
    try {
        const filter: StrictFilter<IUser> = { "_id": new ObjectId(userId) };
        const options: FindOptions<IUser> = {
            projection: {
                "balance": 1,
                "_id": 0
            }
        }
        const result = await DBManager.getInstance().collections.user?.findOne(filter, options);
        return result?.balance;
    } catch (error) {
        throw error;
    }
}
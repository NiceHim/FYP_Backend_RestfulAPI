import { StrictFilter, StrictUpdateFilter, Document, FindOptions, UpdateFilter, ObjectId } from "mongodb";
import DBManager from "../db/DBManager";
import IUser from "../models/user";
import IBalanceRecord from "../models/balanceRecord";
import dotenv from "dotenv";
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

export async function getAllBalanceRecord(userId: string) {
    try {
        const pipeline: Array<Document> = [
            {
                $match: { "userId": new ObjectId(userId) }
            }, 
            {
                $project: {
                    "action": 1,
                    "amount": 1,
                    "createdAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
                    "_id": 0
                }
            },
            {
                $sort: { "createdAt": -1 }
            }
        ];
        const result = await DBManager.getInstance().collections.balanceRecord?.aggregate(pipeline).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function deposit(userId: string, depositAmt: number) {
    try {
        const filter: StrictUpdateFilter<IUser> = { "_id": new ObjectId(userId) };
        const updateFilter: UpdateFilter<IUser> = {
            $inc: { "balance": depositAmt, "equity": depositAmt } 
        };
        const result = await DBManager.getInstance().collections.user?.updateOne(filter, updateFilter);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function withdraw(userId: string, withdrawAmt: number) {
    try {
        const filter: StrictUpdateFilter<IUser> = { "_id": new ObjectId(userId) };
        const updateFilter: UpdateFilter<IUser> = {
            $inc: { "balance": -withdrawAmt, "equity": -withdrawAmt }
        };
        const result = await DBManager.getInstance().collections.user?.updateOne(filter, updateFilter);
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

export async function insertBalanceRecord(userId: string, action: string, amount: number) {
    try {
        const balanceRecord: IBalanceRecord = {
            userId: new ObjectId(userId),
            action: action,
            amount: amount,
            createdAt: new Date()
        };
        const result = await DBManager.getInstance().collections.balanceRecord?.insertOne(balanceRecord);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getTransaction(userId: string, done: boolean) {
    try {
        let project;
        if (done == true) {
            project = {
                "ticker": 1,
                "price": 1,
                "lot": 1,
                "action": 1,
                PnL: { $round: [ "$PnL", 2 ] },
                "createdAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
                "_id": 0
            }
        } else {
            project = {
                "ticker": 1,
                "price": 1,
                "lot": 1,
                "action": 1,
                PnL: { $round: [ "$PnL", 2 ] },
                "createdAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
                "endedAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$endedAt" } },
                "_id": 0
            }
        }
        const pipeline: Array<Document> = [
            {
                $match: { "userId": new ObjectId(userId), "done": done }
            }, 
            {
                $project: project
            },
            {
                $sort: { "createdAt": -1 }
            }
        ];
        const result = await DBManager.getInstance().collections.transaction?.aggregate(pipeline).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getCurrentTransaction(userId: string) {
    try {
        const pipeline: Array<Document> = [
            {
                $match: { "userId": new ObjectId(userId), "done": false }
            }, 
            {
                $project: {
                    "ticker": 1,
                    "price": 1,
                    "lot": 1,
                    "action": 1,
                    PnL: { $round: [ "$PnL", 2 ] },
                    "createdAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
                    "_id": 0
                }
            },
            {
                $sort: { "createdAt": -1 }
            }
        ];
        const result = await DBManager.getInstance().collections.transaction?.aggregate(pipeline).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getHistoryTransaction(userId: string) {
    try {
        const pipeline: Array<Document> = [
            {
                $match: { "userId": new ObjectId(userId), "done": true }
            }, 
            {
                $project: {
                    "ticker": 1,
                    "price": 1,
                    "lot": 1,
                    "action": 1,
                    PnL: { $round: [ "$PnL", 2 ] },
                    "createdAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
                    "endedAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$endedAt" } },
                    "_id": 0
                }
            },
            {
                $sort: { "endedAt": -1 }
            }
        ];
        const result = await DBManager.getInstance().collections.transaction?.aggregate(pipeline).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}
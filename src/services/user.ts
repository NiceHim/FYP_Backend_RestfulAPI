import { StrictFilter, StrictUpdateFilter, Document, FindOptions, UpdateFilter } from "mongodb";
import { collections } from "../db/conn";
import IUser from "../models/user";
import IBalanceRecord from "../models/balanceRecord";
import ISubscription from "../models/subscription";
import dotenv from "dotenv";
dotenv.config();

export async function getUserInfo(userName: string) {
    try {
        const filter: StrictFilter<IUser> = { "userName": userName };
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
        const result = await collections.account?.findOne(filter, options);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getAllBalanceRecord(userName: string) {
    try {
        const pipeline: Array<Document> = [
            {
                $match: { "userName": userName }
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
        const result = await collections.balanceRecord?.aggregate(pipeline).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function deposit(userName: string, depositAmt: number) {
    try {
        const filter: StrictUpdateFilter<IUser> = { "userName": userName };
        const updateFilter: UpdateFilter<IUser> = {
            $inc: { "balance": depositAmt, "equity": depositAmt } 
        };
        const result = await collections.account?.updateOne(filter, updateFilter);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function withdraw(userName: string, withdrawAmt: number) {
    try {
        const filter: StrictUpdateFilter<IUser> = { "userName": userName };
        const updateFilter: UpdateFilter<IUser> = {
            $inc: { "balance": -withdrawAmt, "equity": -withdrawAmt }
        };
        const result = await collections.account?.updateOne(filter, updateFilter);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getBalance(userName: string) {
    try {
        const filter: StrictFilter<IUser> = { "userName": userName };
        const options: FindOptions<IUser> = {
            projection: {
                "balance": 1,
                "_id": 0
            }
        }
        const result = await collections.account?.findOne(filter, options);
        return result?.balance;
    } catch (error) {
        throw error;
    }
}

export async function insertBalanceRecord(userName: string, action: string, amount: number) {
    try {
        const balanceRecord: IBalanceRecord = {
            userName: userName,
            action: action,
            amount: amount,
            createdAt: new Date()
        };
        const result = await collections.balanceRecord?.insertOne(balanceRecord);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getAllSubscription(userName: string) {
    try {
        const pipeline: Array<Document> = [
            {
                $match: { "userName": userName }
            }, 
            {
                $project: {
                    "ticker": 1,
                    "lot": 1,
                    "status": 1,
                    "doneAt": 1,
                    "createdAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
                    "_id": 0
                }
            },
            {
                $sort: { "createdAt": -1 }
            }
        ];
        const result = await collections.subscription?.aggregate(pipeline).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getOneCurrentSubscription(userName: string, ticker: string) {
    try {
        const filter: StrictFilter<ISubscription> = { "userName": userName, "ticker": ticker, "done": false };
        const result = await collections.subscription?.findOne(filter);
        return result
    } catch (error) {
        throw error;
    }
}


export async function insertSubscription(userName: string, ticker: string, lot: number) {
    try {
        const subscriptionOrder: ISubscription = {
            userName: userName,
            ticker: ticker,
            lot: lot,
            status: "running",
            createdAt: new Date()
        };
        const result = await collections.subscription?.insertOne(subscriptionOrder);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getCurrentTransaction(userName: string) {
    try {
        const pipeline: Array<Document> = [
            {
                $match: { "userName": userName, "done": false }
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
        const result = await collections.transaction?.aggregate(pipeline).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}
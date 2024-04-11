import { StrictFilter, StrictUpdateFilter, Document, FindOptions, UpdateFilter } from "mongodb";
import { collections } from "../db/conn";
import ISubscription from "../models/subscription";
import dotenv from "dotenv";
dotenv.config();

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

export async function getCurrentSubscription(userName: string) {
    try {
        const pipeline: Array<Document> = [
            {
                $match: { "userName": userName, "status": "running" }
            }, 
            {
                $project: {
                    "ticker": 1,
                    "lot": 1,
                    "status": 1,
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

export async function getHistorySubscription(userName: string) {
    try {
        const pipeline: Array<Document> = [
            {
                $match: { "userName": userName, "status": "ended" }
            }, 
            {
                $project: {
                    "ticker": 1,
                    "lot": 1,
                    "status": 1,
                    "createdAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
                    "endedAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$endedAt" } },
                    "_id": 0
                }
            },
            {
                $sort: { "doneAt": -1 }
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


export async function stopSubscription(userName: string, ticker: string, lot: number) {
    try {
        const filter: StrictUpdateFilter<ISubscription> = { "userName": userName, "ticker": ticker, "lot": lot, "status": "running" };
        const updateFilter: UpdateFilter<ISubscription> = {
            $set: { "status": "ended", "endedAt": new Date() } 
        };
        const result = await collections.subscription?.updateOne(filter, updateFilter);
        return result;
    } catch (error) {
        throw error;
    }
}
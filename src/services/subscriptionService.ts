import { StrictFilter, StrictUpdateFilter, Document, FindOptions, UpdateFilter, ObjectId } from "mongodb";
import DBManager from "../db/DBManager";
import ISubscription from "../models/subscription";
import dotenv from "dotenv";
dotenv.config();

export async function getAllSubscription(userId: string) {
    try {
        const pipeline: Array<Document> = [
            {
                $match: { "userId": new ObjectId(userId) }
            }, 
            {
                $project: {
                    "ticker": 1,
                    "lot": 1,
                    "status": 1,
                    "createdAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
                    "endedAt": 1,
                    "_id": 0
                }
            },
            {
                $sort: { "createdAt": -1 }
            }
        ];
        const result = await DBManager.getInstance().collections.subscription?.aggregate(pipeline).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getCurrentSubscription(userId: string) {
    try {
        const pipeline: Array<Document> = [
            {
                $match: { "userId": new ObjectId(userId), "done": false }
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
        const result = await DBManager.getInstance().collections.subscription?.aggregate(pipeline).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getHistorySubscription(userId: string) {
    try {
        const pipeline: Array<Document> = [
            {
                $match: { "userId": new ObjectId(userId), "done": true }
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
                $sort: { "endedAt": -1 }
            }
        ];
        const result = await DBManager.getInstance().collections.subscription?.aggregate(pipeline).toArray();
        return result;
    } catch (error) {
        throw error;
    }
}

export async function getOneCurrentSubscription(userId: string, ticker: string) {
    try {
        const filter: StrictFilter<ISubscription> = { "userId": new ObjectId(userId), "ticker": ticker, "done": false };
        const result = await DBManager.getInstance().collections.subscription?.findOne(filter);
        return result
    } catch (error) {
        throw error;
    }
}


export async function createSubscription(userId: string, ticker: string, lot: number) {
    try {
        const subscriptionOrder: ISubscription = {
            userId: new ObjectId(userId),
            ticker: ticker,
            lot: lot,
            done: false,
            createdAt: new Date()
        };
        const result = await DBManager.getInstance().collections.subscription?.insertOne(subscriptionOrder);
        return result;
    } catch (error) {
        throw error;
    }
}


export async function updateSubscription(userId: string, ticker: string, updateObj: Partial<ISubscription>) {
    try {
        if (updateObj.done == true) {
            updateObj.endedAt = new Date();
        }
        const filter: StrictUpdateFilter<ISubscription> = { "userId": new ObjectId(userId), "ticker": ticker, "done": false };
        const updateFilter: UpdateFilter<ISubscription> = {
            $set: updateObj 
        };
        const result = await DBManager.getInstance().collections.subscription?.updateOne(filter, updateFilter);
        return result;
    } catch (error) {
        throw error;
    }
}
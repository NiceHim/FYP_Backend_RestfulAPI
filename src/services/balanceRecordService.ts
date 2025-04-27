import { StrictFilter, StrictUpdateFilter, Document, FindOptions, UpdateFilter, ObjectId } from "mongodb";
import DBManager from "../db/DBManager";
import IBalanceRecord from "../models/balanceRecord";
import RedisManager from "../db/RedisManager";

export async function getAllBalanceRecord(userId: string) {
    const cacheKey = `cache:balanceRecords:${userId}`;
    const cachedData: Array<IBalanceRecord> = await RedisManager.getCachedData(cacheKey);
    if (cachedData) {
        return cachedData;
    }
    
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

        const result = await DBManager.getInstance().collections.balanceRecord?.aggregate<IBalanceRecord>(pipeline).toArray();
        await RedisManager.setCacheData(cacheKey, result, 60 * 5);
        return result;
    } catch (error) {
        throw error;
    }
}

export async function insertBalanceRecord(userId: string, action: string, amount: number) {
    try {
        await RedisManager.deleteCachedData(`cache:balanceRecords:${userId}`);
        
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
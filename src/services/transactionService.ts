import { StrictFilter, StrictUpdateFilter, Document, FindOptions, UpdateFilter, ObjectId, Transaction } from "mongodb";
import MongoDBManager from "../db/MongoDBManager";
import RedisManager from "../db/RedisManager";


export async function getTransaction(userId: string, done: boolean) {
    const cacheKey = `cache:transactions:${userId}:${done}`;
    const cachedData: Array<Transaction> = await RedisManager.getCachedData(cacheKey);
    if (cachedData) {
        return cachedData;
    }
  
    try {
        let project;
        if (done == true) {
            project = {
                "ticker": 1,
                "price": 1,
                "lot": 1,
                "action": 1,
                PnL: { $round: [ "$profitOrLoss", 2 ] },
                "createdAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
                "endedAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$endedAt" } },
                "_id": 0
            }
        } else {
            project = {
                "ticker": 1,
                "price": 1,
                "lot": 1,
                "action": 1,
                PnL: { $round: [ "$profitOrLoss", 2 ] },
                "createdAt": { $dateToString: { format: "%Y-%m-%d %H:%M:%S", date: "$createdAt" } },
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
        const result = await MongoDBManager.getInstance().collections.transaction?.aggregate<Transaction>(pipeline).toArray();
        await RedisManager.setCacheData(cacheKey, result, 60 *5);
        return result;
    } catch (error) {
        throw error;
    }
}
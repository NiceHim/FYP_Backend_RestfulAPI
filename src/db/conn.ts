import { MongoClient, Collection, Db } from "mongodb";
import IUser from "../models/user";
import IBalanceRecord from "../models/balanceRecord";
import ISubscription from "../models/subscription";
import ITransaction from "../models/transaction";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DATABASE_NAME || "";

export const collections: { 
    account?: Collection<IUser>; 
    balanceRecord?: Collection<IBalanceRecord>;
    subscription?: Collection<ISubscription>;
    transaction?: Collection<ITransaction>;
} = {}

export async function connDB() {
    try {
        const client: MongoClient = new MongoClient(connectionString);
        await client.connect();
        const db: Db = client.db(dbName);
        collections.account = db.collection<IUser>("account");
        collections.balanceRecord = db.collection<IBalanceRecord>("balanceRecord");
        collections.subscription = db.collection<ISubscription>("subscription");
        collections.transaction = db.collection<ITransaction>("transaction");
    } catch (error) {
        throw error;
    }
}

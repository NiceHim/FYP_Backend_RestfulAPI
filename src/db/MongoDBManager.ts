import { MongoClient, Collection, ObjectId, Db } from "mongodb";
import IUser from "../models/user";
import IBalanceRecord from "../models/balanceRecord";
import ISubscription from "../models/subscription";
import ITransaction from "../models/transaction";
import IForexDetail from "../models/forexDetail";

class MongoDBManager {
    private static dbManager: MongoDBManager;
    private _client?: MongoClient;
    private _db?: Db;
    private mongoUrl: string = process.env.MONGODB_URI || "";
    private mongoDbName: string = process.env.MONGODB_DATABASE_NAME || "";
    private _collections: { 
        user?: Collection<IUser>; 
        balanceRecord?: Collection<IBalanceRecord>;
        subscription?: Collection<ISubscription>;
        transaction?: Collection<ITransaction>;
        forexList?: Collection<IForexDetail>;
    } = {}

    private constructor() {
    }

    static getInstance(): MongoDBManager {
        if (this.dbManager) {
            return this.dbManager;
        } else {
            this.dbManager = new MongoDBManager();
            return this.dbManager;
        }
    }

    get collections() {
        return this._collections;
    }

    get client() {
        return this._client;
    }


    async connDB() {
        try {
            this._client = new MongoClient(this.mongoUrl, {
                writeConcern: { w: "majority" },
                readConcern: { level: "majority" },
                readPreference: "secondaryPreferred",
            });
            await this._client.connect();
            this._db = MongoDBManager.getInstance().client!.db(this.mongoDbName);
            this._collections.user = this._db?.collection<IUser>("account");
            this._collections.balanceRecord = this._db?.collection<IBalanceRecord>("balanceRecord");
            this._collections.subscription = this._db?.collection<ISubscription>("subscription");
            this._collections.transaction = this._db?.collection<ITransaction>("transaction");
            this._collections.forexList = this._db?.collection<IForexDetail>("forexList");
        } catch (error) {
            throw error;
        }
    }
    
    async disconnDB() {
        try {
            if (this._client) {
                await this._client.close();
            }
        } catch (error) {
            throw error;
        }
    }
}

export default MongoDBManager;
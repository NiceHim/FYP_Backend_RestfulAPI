import { ObjectId } from "mongodb";

export default interface ISubscription {
    _id?: ObjectId;
    userId?: ObjectId;
    ticker?: string;
    lot?: number;
    done?: boolean;
    endedAt?: Date;
    createdAt?: Date;
}
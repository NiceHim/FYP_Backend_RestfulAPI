import { ObjectId } from "mongodb";

export default interface IBalanceRecord {
    _id?: ObjectId;
    userName: string;
    action: string;
    amount: number;
    createdAt: Date;
}
import { ObjectId } from "mongodb";

export default interface IForexDetail {
    _id?: ObjectId;
    ticker?: string;
    first?: string;
    second?: string
    available?: boolean;
}
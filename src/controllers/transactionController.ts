import { NextFunction, Request, Response } from "express";
import * as TransactionService from "../services/transactionService";

export async function getTransaction(req: Request, res: Response, next: NextFunction) {
    try {
        const { done } = req.query;
        const { userId } = req.decoded;
        const data = await TransactionService.getTransaction(userId, done == "true" ? true : false);
        if (data == null) {
            res.status(404).json({
                message: "Cannot Find Transaction"
            });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}
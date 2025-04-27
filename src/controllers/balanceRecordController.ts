import { NextFunction, Request, Response } from "express";
import * as BalanceRecordService from "../services/balanceRecordService";

export async function getAllBalanceRecord(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.decoded;
        const data = await BalanceRecordService.getAllBalanceRecord(userId);
        if (data == null) {
            res.status(404).json({
                message: "Cannot find balance record"
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
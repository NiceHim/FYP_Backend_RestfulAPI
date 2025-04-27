import { NextFunction, Request, Response } from "express";
import * as UserService from "../services/userService";

export async function getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.decoded;
        const data = await UserService.getUserInfo(userId);

        if (data == null) {
            res.status(404).json({
                message: "Cannot find user information"
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

export async function deposit(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.decoded;
        const depositAmt = req.body.depositAmt;
        const result = await UserService.deposit(userId, parseFloat(depositAmt));
        if (result === null) {
            res.status(400).json({
                message: "Deposit Error"
            });
        }
        res.status(200).json({
            message: "Successfully deposit"
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function withdraw(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.decoded;
        const withdrawAmt = req.body.withdrawAmt;
        const currentBalance = await UserService.getBalance(userId);
        if (currentBalance != null && currentBalance < withdrawAmt) {
            res.status(400).json({
                message: "Withdraw error, account balance does not have enough money"
            });
            return next();
        }
        const result = await UserService.withdraw(userId, parseFloat(withdrawAmt));
        if (result === null) {
            res.status(400).json({
                message: "Withdraw Error"
            });
        }
        res.status(200).json({
            message: "Successfully Withdraw"
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}
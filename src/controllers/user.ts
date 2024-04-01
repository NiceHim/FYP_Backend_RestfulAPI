import { NextFunction, Request, Response } from "express";
import * as UserService from "../services/user";

export async function getUserInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName } = req.body.decoded;
        const data = await UserService.getUserInfo(userName);
        if (data == null) {
            res.status(400).json({
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

export async function getAllBalanceRecord(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName } = req.body.decoded;
        const data = await UserService.getAllBalanceRecord(userName);
        if (data == null) {
            res.status(400).json({
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

export async function deposit(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName } = req.body.decoded;
        const depositAmt = req.body.depositAmt;
        const result = await UserService.deposit(userName, parseFloat(depositAmt));
        if (result == null) {
            res.status(400).json({
                message: "Deposit Error"
            });
        } else {
            await UserService.insertBalanceRecord(userName, "Deposit", parseFloat(depositAmt));
            res.status(200).json({
                message: "Successfully deposit"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function withdraw(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName } = req.body.decoded;
        const withdrawAmt = req.body.withdrawAmt;
        const currentBalance = await UserService.getBalance(userName);
        if (currentBalance != null && currentBalance < withdrawAmt) {
            res.status(400).json({
                message: "Withdraw error, account balance does not have enough money"
            });
            return next();
        }
        const result = await UserService.withdraw(userName, parseFloat(withdrawAmt));
        if (result == null) {
            res.status(400).json({
                message: "Withdraw Error"
            });
        } else {
            await UserService.insertBalanceRecord(userName, "Withdraw", -parseFloat(withdrawAmt));
            res.status(200).json({
                message: "Successfully Withdraw"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function getAllSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName } = req.body.decoded;
        const data = await UserService.getAllSubscription(userName);
        if (data == null) {
            res.status(400).json({
                message: "Cannot get subscription"
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

export async function insertSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName } = req.body.decoded;
        const { ticker, lot } = req.body;
        const currentSubscription = await UserService.getOneCurrentSubscription(userName, ticker);
        if (currentSubscription != null) {
            res.status(400).json({
                message: `Subscription error, you have already subscribe ${ticker} auto trade service`
            });
            return next();
        }
        const result = await UserService.insertSubscription(userName, ticker, lot);
        if (result == null) {
            res.status(400).json({
                message: "Subscription Error"
            });
        } else {
            res.status(200).json({
                message: `Successfully Subscribe ${ticker} Auto Trade Service`
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function getCurrentTransaction(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName } = req.body.decoded;
        const data = await UserService.getCurrentTransaction(userName);
        if (data == null) {
            res.status(400).json({
                message: "Cannot Get Current Transaction"
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

export async function getHistoryTransaction(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName } = req.body.decoded;
        const data = await UserService.getHistoryTransaction(userName);
        if (data == null) {
            res.status(400).json({
                message: "Cannot Get Current Transaction"
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
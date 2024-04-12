import { NextFunction, Request, Response } from "express";
import * as SubscriptionService from "../services/subscription";


export async function getAllSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName } = req.body.decoded;
        const data = await SubscriptionService.getAllSubscription(userName);
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

export async function getCurrentSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName } = req.body.decoded;
        const data = await SubscriptionService.getCurrentSubscription(userName);
        if (data == null) {
            res.status(400).json({
                message: "Cannot get current subscription"
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

export async function getHistorySubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName } = req.body.decoded;
        const data = await SubscriptionService.getHistorySubscription(userName);
        if (data == null) {
            res.status(400).json({
                message: "Cannot get history subscription"
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
        const currentSubscription = await SubscriptionService.getOneCurrentSubscription(userName, ticker);
        if (currentSubscription !== null) {
            res.status(400).json({
                message: `Subscription error, you have already subscribe ${ticker} auto trade service`
            });
            return next();
        }
        const result = await SubscriptionService.insertSubscription(userName, ticker, lot);
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

export async function stopSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const { userName } = req.body.decoded;
        const { ticker, lot } = req.body;
        const result = await SubscriptionService.stopSubscription(userName, ticker, lot);
        if (result == null) {
            res.status(400).json({
                message: "Stop Subscription Error"
            });
        } else {
            res.status(200).json({
                message: `Successfully Stoped ${ticker} Auto Trade Service`
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}
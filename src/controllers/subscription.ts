import { NextFunction, Request, Response } from "express";
import * as SubscriptionService from "../services/subscription";

export async function getAllSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.decoded;
        const data = await SubscriptionService.getAllSubscription(userId);
        if (data == null) {
            res.status(404).json({
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
        const { userId } = req.decoded;
        const data = await SubscriptionService.getCurrentSubscription(userId);
        if (data == null) {
            res.status(404).json({
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
        const { userId } = req.decoded;
        const data = await SubscriptionService.getHistorySubscription(userId);
        if (data == null) {
            res.status(404).json({
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

export async function createSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.decoded;
        const { ticker, lot } = req.body;
        const currentSubscription = await SubscriptionService.getOneCurrentSubscription(userId, ticker);
        if (currentSubscription !== null) {
            res.status(400).json({
                message: `Subscription error, you have already subscribe ${ticker} auto trade service`
            });
            return next();
        }
        const result = await SubscriptionService.createSubscription(userId, ticker, lot);
        if (result == null) {
            res.status(500).json({
                message: "Subscription Error"
            });
        } else {
            res.status(201).json({
                message: `Successfully Subscribe ${ticker} Auto Trade Service`
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function updateSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req.decoded;
        const updateObj = req.body;
        const ticker = req.params.ticker;
        const result = await SubscriptionService.updateSubscription(userId, ticker, updateObj);
        if (result == null) {
            res.status(500).json({
                message: "Update Subscription Error"
            });
        } else {
            res.status(200).json({
                message: `Successfully Updated ${ticker} Auto Trade Service`
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}
import { NextFunction, Request, Response } from "express";
import * as MarketService from "../services/market";

export async function getSnapShotTickers(req: Request, res: Response, next: NextFunction) {
    const tickers = req.params.tickers;
    try {
        const data = await MarketService.getSnapShotTickers(tickers);
        if (data.status == "OK") {
            res.status(200).json(data.tickers);
        } else {
            res.status(400).json({
                message: "Cannot get snapshot data"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function getAggregateData(req: Request, res: Response, next: NextFunction) {
    const { ticker, multiplier, timespan, from, to, adjusted, sort } = req.query;
    try {
        const data = await MarketService.getAggregateData(
            ticker as string, 
            parseInt(multiplier as string), 
            timespan as string, 
            from as string, 
            to as string, 
            adjusted as "true" | "false", 
            sort as "asc" | "desc"
        );
        if (data.status == "OK") {
            res.status(200).json(data.results);
        } else {
            res.status(400).json({
                message: "Cannot get aggregate data"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}


export async function getMarketStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await MarketService.getMarketStatus();
        if (data != null) {
            res.status(200).json(data);
        } else {
            res.status(400).json({
                message: "Cannot get market status"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function getLastQuote(req: Request, res: Response, next: NextFunction) {
    try {
        const { from, to } = req.query;
        const data = await MarketService.getLastQuote(from as string, to as string);
        if (data != null) {
            res.status(200).json(data.last);
        } else {
            res.status(400).json({
                message: "Cannot get last quote"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}


export async function getLastQuoteAndAggregate(req: Request, res: Response, next: NextFunction) {
    try {
        const { ticker, multiplier, timespan, from, to, adjusted, sort } = req.query;
        const tempTicker = (ticker as string).replace("C:", "");
        const firstTicker = tempTicker.slice(0, 3);
        const secondTicker = tempTicker.slice(3, 6);
        const aggregate = await MarketService.getAggregateData(
            ticker as string, 
            parseInt(multiplier as string), 
            timespan as string, 
            from as string, 
            to as string, 
            adjusted as "true" | "false", 
            sort as "asc" | "desc"
        );
        if (aggregate == null) {
            res.status(400).json({
                message: "Cannot not get aggregate data"
            });
            return next();
        }
        const quote = await MarketService.getLastQuote(firstTicker, secondTicker);
        if (quote == null) {
            res.status(400).json({
                message: "Cannot not get last quote"
            });
            return next();
        }
        const data = new Map();
        data.set(firstTicker+"/"+secondTicker, {
            quote: quote.last,
            aggregate: aggregate.results
        });
        res.status(200).json(Object.fromEntries(data));
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}
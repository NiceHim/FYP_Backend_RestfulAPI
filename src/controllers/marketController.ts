import { NextFunction, Request, Response } from "express";
import * as MarketService from "../services/marketService";

export async function getSnapShotTickers(req: Request, res: Response, next: NextFunction) {
    const tickers = req.params.tickers;
    try {
        const data = await MarketService.getSnapShotTickers(tickers);
        if (data.status == "OK") {
            res.status(200).json(data.tickers);
        } else {
            res.status(500).json({
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
            res.status(500).json({
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
            res.status(500).json({
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
            res.status(500).json({
                message: "Cannot get last quote"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function getAllLastQuotes(req: Request, res: Response, next: NextFunction) {
    try {
        const forexList = await MarketService.getForexList();
        if (forexList == null || forexList.length == 0) {
            res.status(404).json({
                message: "Forex List Not Found"
            });
            return next();
        }
        const data = await MarketService.getAllLastQuotes(forexList!);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function getAllAggregates(req: Request, res: Response, next: NextFunction) {
    try { 
        const { multiplier, timespan, from, to, adjusted, sort } = req.query;
        const forexList = await MarketService.getForexList();
        if (forexList == null || forexList.length == 0) {
            res.status(404).json({
                message: "Forex List Not Found"
            });
            return next();
        }
        const data = await MarketService.getAllAggregates(
            forexList!, 
            parseInt(multiplier as string), 
            timespan as string, 
            from as string, 
            to as string, 
            adjusted as "true" | "false", 
            sort as "asc" | "desc"
        );
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}
import { NextFunction, Request, Response } from "express";
import * as MarketService from "../services/market";
import { IAggs, IForexLastQuote } from "@polygon.io/client-js";
import dayjs from 'dayjs';

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


export async function getLastQuoteAndAggregate(req: Request, res: Response, next: NextFunction) {
    try {
        const { ticker, multiplier, timespan, from, to, adjusted, sort } = req.query;
        const tempTicker = (ticker as string).replace("C:", "");
        const firstTicker = tempTicker.slice(0, 3);
        const secondTicker = tempTicker.slice(3, 6);
        let aggregate, quote;
        [aggregate, quote] = await Promise.all([
            MarketService.getAggregateData(
                ticker as string, 
                parseInt(multiplier as string), 
                timespan as string, 
                from as string, 
                to as string, 
                adjusted as "true" | "false", 
                sort as "asc" | "desc"
            ),
            MarketService.getLastQuote(firstTicker, secondTicker)
        ])
        if (aggregate == null || quote == null) {
            res.status(500).json({
                message: "Cannot get aggregate and last quote data" 
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

export async function getAllLastQuotes(req: Request, res: Response, next: NextFunction) {
    try {
        const forexList = await MarketService.getForexList();
        if (forexList == null || forexList.length == 0) {
            res.status(404).json({
                message: "Forex List Not Found"
            });
            return next();
        }
        const data = await Promise.all(forexList!.map(async (forex) => MarketService.getLastQuote(forex.first!, forex.second!)));
        if (data == null) {
            res.status(404).json({
                message: "All Last Quotes Not Found"
            });
            return next();
        }
        const reducedData = data.reduce((filtered: any[], data: IForexLastQuote) => {
            filtered.push({ last: data.last, symbol: data.symbol });
            return filtered;
        }, []);
        reducedData.sort((a, b) => {
            if (a.symbol! < b.symbol!) {
                return -1;
            }
            if (a.symbol! > b.symbol!) {
                return 1;
            }
            return 0;
        });
        res.status(200).json(reducedData);
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
        const data = await Promise.all(
            forexList!.map(async (forex) => MarketService.getAggregateData(
                "C:" + forex.ticker!.replace("/", ""), 
                parseInt(multiplier as string), 
                timespan as string, 
                from as string, 
                to as string, 
                adjusted as "true" | "false", 
                sort as "asc" | "desc"
            ))
        );
        if (data == null) {
            res.status(404).json({
                message: "All Aggregates Not Found"
            });
            return next();
        }
        const reducedData = data.reduce((filtered: any[], data: IAggs) => {
            filtered.push(
                { 
                    results: data.results?.map((result) => ({ value: result.c, time: dayjs(result.t).format("YYYY-MM-DD") })), 
                    symbol: data.ticker?.slice(2, 5) + "/" + data.ticker?.slice(5, 8) 
                }
            );
            return filtered;
        }, []);
        reducedData.sort((a, b) => {
            if (a.symbol! < b.symbol!) {
                return -1;
            }
            if (a.symbol! > b.symbol!) {
                return 1;
            }
            return 0;
        });
        res.status(200).json(reducedData);
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}
import polygonRestfulClient from "../utils/polygonRestfulClient";
import { StrictFilter, StrictUpdateFilter, Document, FindOptions, UpdateFilter, ObjectId } from "mongodb";
import MongoDBManager from "../db/MongoDBManager";
import IForexDetail from "../models/forexDetail";
import { IAggs, IForexLastQuote } from "@polygon.io/client-js";
import { IReducedLastQuote } from "../models/reducedLastQuote";
import dayjs from "dayjs";
import { IReducedAggregate } from "../models/reducedAggregate";
import { hashObject } from "../utils/hashUtil";
import RedisManager from "../db/RedisManager";

export async function getSnapShotTickers(tickers: string) {
    try {
        const data = await polygonRestfulClient.forex.snapshotAllTickers({ tickers: tickers });
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getAggregateData(ticker: string, multiplier: number, timespan: string, from: string, to: string, adjusted: "true" | "false" = "true", sort: "asc" | "desc" = "asc") {
    const hash = hashObject({
        ticker: ticker,
        multiplier: multiplier, 
        timespan: timespan, 
        from: from, 
        to: to, 
        adjusted: adjusted, 
        sort: sort
    });
    const cahceKey = `cache:aggregate:${hash}`;
    const cacheData: IAggs = await RedisManager.getCachedData(cahceKey);
    if (cacheData) {
        return cacheData;
    }
    
    try {
        const data = await polygonRestfulClient.forex.aggregates(ticker, multiplier, timespan, from, to, { adjusted: adjusted, sort: sort, limit: 50000 });
        await RedisManager.setCacheData(cahceKey, data, 60 * 60 * 6);
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getMarketStatus() {
    try {
        const data = await polygonRestfulClient.reference.marketStatus();
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getLastQuote(firstTicker: string, secondTicker: string) {
    try {
        const data = await polygonRestfulClient.forex.lastQuote(firstTicker, secondTicker);
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getAllAggregates(
    forexList: Array<IForexDetail>, 
    multiplier: number, 
    timespan: string, 
    from: string, 
    to: string, 
    adjusted: "true" | "false" = "true", 
    sort: "asc" | "desc" = "asc"
) {
    const hash = hashObject({
        multiplier: multiplier, 
        timespan: timespan, 
        from: from, 
        to: to, 
        adjusted: adjusted, 
        sort: sort
    });
    const cahceKey = `cache:aggregates:${hash}`;
    const cacheData: Array<IReducedAggregate> = await RedisManager.getCachedData(cahceKey);
    if (cacheData) {
        return cacheData;
    }

    try {
        const data = await Promise.all(
            forexList!.map(async (forex) => getAggregateData(
                "C:" + forex.ticker!.replace("/", ""), 
                multiplier, 
                timespan as string, 
                from as string, 
                to as string, 
                adjusted as "true" | "false", 
                sort as "asc" | "desc"
            ))
        );
        const reducedData: Array<IReducedAggregate> = data.reduce((filtered: any[], data: IAggs) => {
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

        await RedisManager.setCacheData(cahceKey, reducedData, 60 * 60 * 6);

        return reducedData;
    } catch (error) {
        throw error;
    }
}

export async function getAllLastQuotes(forexList: Array<IForexDetail>) {
    try {
        const data = await Promise.all(forexList!.map(async (forex) => getLastQuote(forex.first!, forex.second!)));
        const reducedData: Array<IReducedLastQuote> = data.reduce((filtered: any[], data: IForexLastQuote) => {
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
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getForexList() {
    try {
        const filter: StrictFilter<IForexDetail> = { "available": true };
        const data = await MongoDBManager.getInstance().collections.forexList?.find(filter).toArray();
        return data;
    } catch (error) {
        throw error;
    }
}
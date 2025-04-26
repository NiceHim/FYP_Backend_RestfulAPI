import polygonRestfulClient from "../utils/polygonRestfulClient";
import { StrictFilter, StrictUpdateFilter, Document, FindOptions, UpdateFilter, ObjectId } from "mongodb";
import DBManager from "../db/DBManager";
import IForexDetail from "../models/forexDetail";

export async function getSnapShotTickers(tickers: string) {
    try {
        const data = await polygonRestfulClient.forex.snapshotAllTickers({ tickers: tickers });
        return data;
    } catch (error) {
        throw error;
    }
}

export async function getAggregateData(ticker: string, multiplier: number, timespan: string, from: string, to: string, adjusted: "true" | "false" = "true", sort: "asc" | "desc" = "asc") {
    try {
        const data = await polygonRestfulClient.forex.aggregates(ticker, multiplier, timespan, from, to, { adjusted: adjusted, sort: sort, limit: 50000 });
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

export async function getForexList() {
    try {
        const filter: StrictFilter<IForexDetail> = { "available": true };
        const data = await DBManager.getInstance().collections.forexList?.find(filter).toArray();
        return data;
    } catch (error) {
        throw error;
    }
}
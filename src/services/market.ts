import polygonRestfulClient from "../utils/polygonRestfulClient";
import dotenv from "dotenv";
dotenv.config();

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
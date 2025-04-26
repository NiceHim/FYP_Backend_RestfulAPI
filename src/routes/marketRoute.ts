import { Router } from "express";
import * as MarketController from "../controllers/marketController";

const marketRoutes = Router();

marketRoutes.get("/snapshot/:tickers", MarketController.getSnapShotTickers);
marketRoutes.get("/aggregate", MarketController.getAggregateData);
marketRoutes.get("/all-aggregates", MarketController.getAllAggregates);
marketRoutes.get("/status", MarketController.getMarketStatus);
marketRoutes.get("/last-quote", MarketController.getLastQuote);
marketRoutes.get("/all-last-quotes", MarketController.getAllLastQuotes);
marketRoutes.get("/last-quote-and-aggregate", MarketController.getLastQuoteAndAggregate);

export default marketRoutes;
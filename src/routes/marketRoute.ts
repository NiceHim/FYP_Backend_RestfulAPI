import { Router } from "express";
import * as MarketController from "../controllers/marketController";

const marketRoutes = Router();

marketRoutes.get("/snapshot/:tickers", MarketController.getSnapShotTickers);
marketRoutes.get("/aggregate", MarketController.getAggregateData);
marketRoutes.get("/all-aggregates", MarketController.getAllAggregates);
marketRoutes.get("/status", MarketController.getMarketStatus);
marketRoutes.get("/last-quote", MarketController.getLastQuote);
marketRoutes.get("/all-last-quotes", MarketController.getAllLastQuotes);

export default marketRoutes;
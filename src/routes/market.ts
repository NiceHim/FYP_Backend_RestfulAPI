import { Router } from "express";
import * as MarketController from "../controllers/market";

const marketRoutes = Router();

marketRoutes.get("/snapshot/:tickers", MarketController.getSnapShotTickers);
marketRoutes.get("/aggregate", MarketController.getAggregateData);
marketRoutes.get("/status", MarketController.getMarketStatus);
marketRoutes.get("/lastQuote", MarketController.getLastQuote);
marketRoutes.get("/lastQuoteAndAggregate", MarketController.getLastQuoteAndAggregate);

export default marketRoutes;
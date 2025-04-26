import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import * as SubscriptionController from "../controllers/subscriptionController";
import * as SubscirptionValidator from "../validators/subscriptionValidator";

const subscriptionRoutes = Router();

subscriptionRoutes.use(verifyToken);

subscriptionRoutes.get("/current", SubscriptionController.getCurrentSubscription);
subscriptionRoutes.get("/history", SubscriptionController.getHistorySubscription);
subscriptionRoutes.post("/subscribe", SubscirptionValidator.createSubscriptionValidator, SubscriptionController.createSubscription);
subscriptionRoutes.patch("/:ticker", SubscirptionValidator.updateSubscriptionValidator, SubscriptionController.updateSubscription);

export default subscriptionRoutes;
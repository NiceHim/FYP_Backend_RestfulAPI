import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import * as SubscriptionController from "../controllers/subscriptionController";
import * as SubscirptionValidator from "../validators/subscriptionValidator";

const subscriptionRoutes = Router();

subscriptionRoutes.use(verifyToken);

subscriptionRoutes.get("/", SubscriptionController.getAllSubscription);
subscriptionRoutes.post("/", SubscirptionValidator.createSubscriptionValidator, SubscriptionController.createSubscription);
subscriptionRoutes.patch("/:ticker", SubscirptionValidator.updateSubscriptionValidator, SubscriptionController.updateSubscription);

export default subscriptionRoutes;
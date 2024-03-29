import { Router } from "express";
import * as SubscriptionController from "../controllers/subscription";
import { verifyToken } from "../middlewares/verifyToken";

const subscriptionRoutes = Router();

subscriptionRoutes.use(verifyToken);

subscriptionRoutes.post("/subscribe", SubscriptionController.insertSubscription);
subscriptionRoutes.post("/currentSubscription", SubscriptionController.getCurrentSubscription);
subscriptionRoutes.post("/historySubscription", SubscriptionController.getHistorySubscription);
subscriptionRoutes.post("/stopSubscription", SubscriptionController.stopSubscription);

export default subscriptionRoutes;
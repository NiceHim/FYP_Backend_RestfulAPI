import { Router } from "express";
import * as UserController from "../controllers/user";
import { verifyToken } from "../middlewares/verifyToken";

const userRoutes = Router();

userRoutes.use(verifyToken);

userRoutes.post("/userInfo", UserController.getUserInfo);
userRoutes.post("/balanceRecord", UserController.getAllBalanceRecord);
userRoutes.post("/deposit", UserController.deposit);
userRoutes.post("/withdraw", UserController.withdraw);
userRoutes.post("/subscribe", UserController.insertSubscription);
userRoutes.post("/subscription", UserController.getAllSubscription);
userRoutes.post("/currentTransaction", UserController.getCurrentTransaction);

export default userRoutes;
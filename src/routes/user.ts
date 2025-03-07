import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import * as UserController from "../controllers/user";
import * as UserValidator from "../validators/userValidator";

const userRoutes = Router();

userRoutes.use(verifyToken);

userRoutes.get("/info", UserController.getUserInfo);
userRoutes.get("/balance-records", UserController.getAllBalanceRecord);
userRoutes.get("transactions", UserValidator.transactionValidator, UserController.getTransaction);
userRoutes.get("/current-transactions", UserController.getCurrentTransaction);
userRoutes.get("/history-transactions", UserController.getHistoryTransaction);
userRoutes.post("/deposit", UserValidator.depositValidator, UserController.deposit);
userRoutes.post("/withdraw", UserValidator.withdrawValidator, UserController.withdraw);

export default userRoutes;
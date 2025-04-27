import { Router } from "express";
import * as BalanceRecordController from "../controllers/balanceRecordController";
import { verifyToken } from "../middlewares/verifyToken";

const balanceRecordRoutes = Router();

balanceRecordRoutes.use(verifyToken);

balanceRecordRoutes.get("/", BalanceRecordController.getAllBalanceRecord);

export default balanceRecordRoutes;
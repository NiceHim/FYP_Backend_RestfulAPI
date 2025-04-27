import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import * as TransactionController from "../controllers/transactionController";
import * as TransactionValidator from "../validators/transactionValidator";

const transactionRoutes = Router();

transactionRoutes.use(verifyToken);

transactionRoutes.get("/", TransactionValidator.transactionValidator, TransactionController.getTransaction);

export default transactionRoutes;
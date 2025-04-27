import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import * as UserController from "../controllers/userController";
import * as UserValidator from "../validators/userValidator";

const userRoutes = Router();

userRoutes.use(verifyToken);

userRoutes.get("/info", UserController.getUserInfo);
userRoutes.post("/deposit", UserValidator.depositValidator, UserController.deposit);
userRoutes.post("/withdraw", UserValidator.withdrawValidator, UserController.withdraw);

export default userRoutes;
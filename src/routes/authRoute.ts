import { Router } from "express";
import * as authController from "../controllers/authController";
import * as authValidator from "../validators/authValidator";

const authRoutes = Router();

authRoutes.post("/register", authValidator.registerValidator, authController.createUser);
authRoutes.post("/login", authValidator.loginValidator, authController.login);
authRoutes.post("/logout", authController.logout);

export default authRoutes;
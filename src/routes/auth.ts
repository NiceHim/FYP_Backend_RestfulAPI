import { Router } from "express";
import * as authController from "../controllers/auth";

const authRoutes = Router();

authRoutes.post("/register", authController.createUser);
authRoutes.post("/login", authController.login);

export default authRoutes;
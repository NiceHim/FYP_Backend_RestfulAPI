import { NextFunction, Request, Response } from "express";
import * as AuthService from "../services/auth";
import generateToken from "../utils/generateToken";

export async function createUser(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body;
    try {
        const existUser = await AuthService.findUser(userName);
        if (existUser) {
            res.status(400).json({message: `User name ${userName} is already used`});
            return next();
        }
        
        const newUser = await AuthService.createAccount(userName, password);
        if (newUser) {
            res.status(201).json({message: `Successfully create a new user with user name ${userName}`});
        } else {
            res.status(400).json({message: `Falied to create a new user with user name ${userName}`});
        }
    } catch (error) {
        res.status(500).json({
            errorType: "User Create Error",
            message: (error as Error).message
        });
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body;
    try {
        const existUser = await AuthService.findUser(userName);
        if (existUser) {
            const isPasswordMatch = await AuthService.login(password, existUser.hash);
            if (isPasswordMatch == true) {
                const token = generateToken(userName);
                res.status(200).json({message: `Successfully login`, token: token});
            } else {
                res.status(400).json({message: `Incorrect password or user name`});
            }
        } else {
            res.status(400).json({message: `Incorrect password or user name`});
        }
    } catch (error) {
        res.status(500).json({
            errorType: "User Create Error",
            message: (error as Error).message
        });
    }
}
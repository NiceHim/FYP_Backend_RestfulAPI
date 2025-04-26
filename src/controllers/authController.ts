import { NextFunction, Request, Response } from "express";
import * as AuthService from "../services/authService";
import { generateToken } from "../utils/tokenUtils";

export async function createUser(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body;
    try {
        const existUser = await AuthService.findUser(userName);
        if (existUser) {
            res.status(400).json({message: `User name ${userName} is already used`});
            return next();
        }
        
        const newUser = await AuthService.createUser(userName, password);
        if (newUser) {
            res.status(201).json({message: `Successfully create a new user with user name ${userName}`});
        } else {
            res.status(500).json({message: "Falied to create a new user"});
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body;
    try {
        const existUser = await AuthService.findUser(userName);
        if (existUser) {
            const isPasswordMatch = await AuthService.login(password, existUser.hash!);
            if (isPasswordMatch == true) {
                const token = await generateToken(existUser._id.toString());
                res.cookie(
                    "token", 
                    token, 
                    {
                        httpOnly: true,
                        maxAge: 1000 * 60 * 60 * 2,
                        secure: false
                    }
                )
                .status(200)
                .json({message: "Successfully login"})
            } else {
                res.status(400).json({message: "Incorrect password or user name"});
            }
        } else {
            res.status(400).json({message: "Incorrect password or user name"});
        }
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        });
    }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    res.clearCookie("token").status(200).json({message: "Successfully logout"});
}
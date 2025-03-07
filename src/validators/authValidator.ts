import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const registerValidationSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,20}$")).required(),
});

const loginValidationSchema = Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,20}$")).required(),
});


export async function registerValidator(req: Request, res: Response, next: NextFunction) {
    try {
        await registerValidationSchema.validateAsync(req.body);
        next();
    } catch (error: any) {
        res.status(400).json({message: error.message})
    }
}

export async function loginValidator(req: Request, res: Response, next: NextFunction) {
    try {
        await loginValidationSchema.validateAsync(req.body);
        next();
    } catch (error: any) {
        res.status(400).json({message: error.message})
    }
}

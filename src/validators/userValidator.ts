import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const depositValidationSchema = Joi.object({
    depositAmt: Joi.number().required()
});

const withdrawValidationSchema = Joi.object({
    withdrawAmt: Joi.number().required()
});

export async function depositValidator(req: Request, res: Response, next: NextFunction) {
    try {
        await depositValidationSchema.validateAsync(req.body);
        next();
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}

export async function withdrawValidator(req: Request, res: Response, next: NextFunction) {
    try {
        await withdrawValidationSchema.validateAsync(req.body);
        next();
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}

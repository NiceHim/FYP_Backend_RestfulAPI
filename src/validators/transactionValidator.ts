import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const transactionValidationSchema = Joi.object({
    done: Joi.boolean().required()
});

export async function transactionValidator(req: Request, res: Response, next: NextFunction) {
    try {
        await transactionValidationSchema.validateAsync(req.query);
        next();
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const createSubscriptionValidationSchema = Joi.object({
    ticker: Joi.string().required(),
    lot: Joi.number().required()
})

const updateSubscriptionValidationSchema = Joi.object({
    lot: Joi.number().optional(),
    done: Joi.boolean().optional()
})

export async function createSubscriptionValidator(req: Request, res: Response, next: NextFunction) {
    try {
        await createSubscriptionValidationSchema.validateAsync(req.body);
        next();
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}

export async function updateSubscriptionValidator(req: Request, res: Response, next: NextFunction) {
    try {
        await updateSubscriptionValidationSchema.validateAsync(req.body);
        next();
    } catch (error: any) {
        res.status(400).json({message: error.message});
    }
}
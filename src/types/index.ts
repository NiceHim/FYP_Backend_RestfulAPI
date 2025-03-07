import { Request } from "express";

interface IDecodedToken {
    userId: string
}

declare global {
    namespace Express {
      interface Request {
        decoded: IDecodedToken
      }
    }
}


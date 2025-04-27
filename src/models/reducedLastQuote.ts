import { IForexLastQuote } from "@polygon.io/client-js";

export interface IReducedLastQuote {
    last: IForexLastQuote
    symbol: string
}
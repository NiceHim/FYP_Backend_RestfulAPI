import express, { Express, Request, Response , Application, NextFunction } from 'express';
import compression from "compression";
import cookieParser from 'cookie-parser';
import DBManager from './src/db/DBManager';
import marketRoutes from "./src/routes/marketRoute";
import authRoutes from "./src/routes/authRoute";
import userRoutes from "./src/routes/userRoute";
import subscriptionRoutes from "./src/routes/subscriptionRoute";
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || "dev";
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: process.env.CORS_ORIGIN || "http://localhost:5173", credentials: true}));
app.use(compression(
    { 
        filter: (req: Request, res: Response) => {
            if (req.headers['x-no-compression']) {
                return false;
            }
            return compression.filter(req, res);
        },
        threshold: 1000
    }
));

app.use("/market", marketRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/subscription", subscriptionRoutes);
app.get('/:id', (req: Request, res: Response) => {
    console.log(req.params)
    res.send('Welcome to Express & TypeScript Server!!!');
});

DBManager.getInstance().connDB().then(() => {
    console.log("Database Connected")
    app.listen(port);
})
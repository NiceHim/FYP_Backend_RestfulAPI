import express, { Express, Request, Response , Application } from 'express';
import { connDB } from "./src/db/conn";
import marketRoutes from "./src/routes/market";
import authRoutes from "./src/routes/auth";
import userRoutes from "./src/routes/user";
import subscriptionRoutes from "./src/routes/subscription";
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: "*"}));

connDB();

app.use("/market", marketRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/subscription", subscriptionRoutes);
app.get('/:id', (req: Request, res: Response) => {
    console.log(req.params)
    res.send('Welcome to Express & TypeScript Server');
});

app.listen(port);
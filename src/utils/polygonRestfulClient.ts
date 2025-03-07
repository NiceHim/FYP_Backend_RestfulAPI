import { restClient } from "@polygon.io/client-js";
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: path.resolve(__dirname, "..", "..", `.env.${env}`) });

const polygonRestfulClient = restClient(process.env.POLYGON_IO_API_KEY);

export default polygonRestfulClient;
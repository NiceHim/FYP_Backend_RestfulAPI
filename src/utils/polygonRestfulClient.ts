import { restClient } from "@polygon.io/client-js";
import dotenv from "dotenv";
dotenv.config();

const polygonRestfulClient = restClient(process.env.POLYGON_IO_API_KEY);

export default polygonRestfulClient;
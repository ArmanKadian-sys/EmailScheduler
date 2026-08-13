import dotenv from 'dotenv';
import { fileURLToPath } from "url";
import path from "path";
dotenv.config();
import {Queue} from "bullmq";
import IORedis from 'ioredis';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
    path: path.join(__dirname, "../../.env")
});


const connection = new IORedis({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    host: 'tigerlily-top-basketball-93855.db.redis.io',
    port: 19367,
    maxRetriesPerRequest: null
    
});

connection.on("error", (err) => {
    console.error("Redis error:", err);
});

console.log("Connected to Redis:", connection.isReady);

const notificationQueue = new Queue("notifications", {
    connection
});


export {
  notificationQueue,
  connection
};


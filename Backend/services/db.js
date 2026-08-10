import pg from "pg";
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, "../.env")
});


const { Pool } = pg;


console.log("This is the connection string", process.env.DB_CONNECTION_STRING);
const db_pool = new Pool({
  connectionString: process.env.DB_CONNECTION_STRING,
});


export default db_pool;
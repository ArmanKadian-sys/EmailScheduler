import db_pool from "../../services/db.js";

let query = `
  CREATE TABLE IF NOT EXISTS users (
    _id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    createdAt TIMESTAMPTZ DEFAULT NOW()
  );
`;



const result=await db_pool.query(query);

export default result;
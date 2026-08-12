import db_pool from "../../services/db.js";

let query = `
  CREATE TABLE IF NOT EXISTS emails (
    id SERIAL PRIMARY KEY,
    sendTo VARCHAR(255) NOT NULL,
    sendFrom VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    subject TEXT NOT NULL, 
    sendAt TIMESTAMPTZ,
    createdAt TIMESTAMPTZ DEFAULT NOW()
  );
`;

const result=await db_pool.query(query);

export default result;



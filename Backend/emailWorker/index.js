import { connection } from "./services/connection.js";
import { Queue } from "bullmq";
import db_pool from "../services/db.js";
import emailExtracter from "./services/emailExtracter.js";
import { toggler } from "./services/Toggler.js";


const emailQueue= new EmailQueue("emails", {
    connection
})

const {result, start, end} = emailExtracter(db_pool);

await Promise.all(
    result.map((email) =>
        emailQueue.add(`email${email.id}`, email)
    )
);

 


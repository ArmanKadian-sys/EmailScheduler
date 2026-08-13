import { connection } from "./services/connection.js";
import { Queue } from "bullmq";
import db_pool from "../services/db.js";
import emailExtracter from "./services/emailExtracter.js";



const notificationQueue = new Queue("notifications", {
    connection
});

const emailQueue= new EmailQueue("emails", {
    connection
})



emailQueue.add("email-to-send", {
    email
})
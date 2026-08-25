import { toggler } from "./services/Toggler.js";
import { connection } from "./services/connection.js";
import { Queue } from "bullmq";
import { emailWorker } from "./services/emailWorker.js";

const notificationQueue = new Queue("notifications", {
    connection
});

const emailQueue = new Queue("emails", {
    connection
})

await emailQueue.drain();
await notificationQueue.drain();
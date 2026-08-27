import { Worker, Queue } from "bullmq";
import { connection } from "./connection.js";
import { emailSender } from "./emailSender.js";
import toReload from "./toReload.js";
import db_pool from "../../services/db.js";
import { connection } from "./connection.js";
import { toggler } from "./Toggler.js";
import { Queue } from "bullmq";



const emailQueue = new Queue("email", { connection });
let emailWorker;

emailWorker = new Worker("emails", async (job) => {

  // Sending Email
  const emailTime = new Date(job.data.sendat).getTime();
  const now = new Date().getTime();
  const toHold = emailTime - now;

  if (toHold > 0) {
    await connection.set("holding", emailTime);
    await new Promise((resolve) => {
      console.log("Promise pending till", toHold);
      setTimeout(() => {
        resolve();
      }, toHold);
    })

  }

  await connection.set("holding", null);

  await emailSender(job.data);


}, { connection });


emailWorker.on("completed", async (job) => {
  console.log(`This Job has been completed with id:`, job.data.id);
});

emailWorker.on("failed", (err) => {
  console.log(`Job  has failed with error ${err.message}`);
});


export { emailWorker };



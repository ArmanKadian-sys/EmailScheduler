import { Worker, Queue } from "bullmq";
import { connection } from "./connection.js";
import { emailSender } from "./emailSender.js";



const emailWorker = new Worker("emails", async (job) => {
  await emailSender(job.data);

}, { connection });


emailWorker.on("completed", (job) => {
  console.log(`This Job has been completed with id:`, job.data.id);
});

emailWorker.on("failed", (job, err) => {
  console.log(`Job  has failed with error ${err.message}`);
});


export { emailWorker };



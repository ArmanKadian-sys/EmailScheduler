import { Worker, Queue } from "bullmq";
import { connection } from "./connection.js";
import { emailSender } from "./emailSender.js";

let emailWorker;

emailWorker = new Worker("emails", async (job) => {

  const emailTime = new Date(job.data.sendat).getTime();
  const now = new Date().getTime();
  const toHold = emailTime - now;


  console.log("This is working 1");


  await new Promise((resolve) => {
    console.log("Promise pending till", toHold);
    setTimeout(() => {
      resolve();
    }, toHold);
  })

  console.log("The email queue is running now", job.data);

  emailSender(job.data);

}, { connection });


emailWorker.on("completed", (job) => {
  console.log(`This Job has been completed with id:`, job.data.id);
});

emailWorker.on("failed", (err) => {
  console.log(`Job  has failed with error ${err.message}`);
});


export { emailWorker };



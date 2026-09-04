import { Worker, Queue } from "bullmq";
import { connection } from "./connection.js";
import { emailSender } from "./emailSender.js";
import db_pool from "../../services/db.js";
import markSent from "./markSent.js"



const emailsQueue = new Queue("emails", { connection });
await emailsQueue.obliterate({ force: true });
const emailQueue = new Queue("emails", { connection });

let emailWorker;
let cancelJob;

emailWorker = new Worker("emails", async (job) => {

  // Sending Email
  const emailTime = new Date(job.data.sendat).getTime();
  const now = new Date().getTime();
  const toHold = emailTime - now;
  let cancelled = false;

  if (toHold > 0) {
    await connection.set("holding", emailTime);
    await new Promise((resolve) => {
      console.log("Promise pending till", toHold);
      let timer = setTimeout(() => {
        resolve();
      }, toHold);


      cancelJob = () => {
        cancelled = true;
        clearTimeout(timer);
      }


    })
  }

  if (cancelled) {
    throw new Error("The current job has been skipped");
  }

  await connection.set("holding", null);

  await emailSender(job.data);
  await markSent(db_pool, job.data.id);

}, { connection });


emailWorker.on("completed", async (job) => {
  console.log(`This Job has been completed with id:`, job.data.id);
});

emailWorker.on("failed", (err) => {
  console.log(`Job  has failed with error ${err.message}`);
});


export { emailWorker, cancelJob };



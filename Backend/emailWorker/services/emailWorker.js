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

  console.log("******************email worker recieved the job with id********************", job.data.id);

  // Sending Email
  const emailTime = new Date(job.data.sendat).getTime();
  const now = new Date().getTime();
  const toHold = emailTime - now;
  let cancelled = false;

  if (toHold > 0) {
    await connection.set("holding", JSON.stringify(emailTime));
    await new Promise((resolve) => {
      console.log("Promise pending till", toHold);
      let timer = setTimeout(() => {
        resolve();
      }, toHold);

      cancelJob = () => {
        cancelled = true;
        clearTimeout(timer);
        resolve();
      }
    })
  }
  else {
    console.log("Invalid email time and therefore rejected");
    await markSent(db_pool, job.data.id);
    return;
  }



  console.log("**************************************************Came till here******************************************************************");



  if (cancelled) {
    console.log("***********************************cancelled condition ran************************************************")
    await connection.set("holding", null);
    await connection.set("sending", null);
    throw new Error("The current job has been skipped");
  }

  await emailSender(job.data);
  await markSent(db_pool, job.data.id);


}, { connection });


emailWorker.on("completed", async (job) => {
  await connection.set("holding", null);
  console.log(`This Job has been completed with id:`, job.data.id);
});

emailWorker.on("failed", (err) => {
  console.log(`Job  has failed with error ${err.message}`);
});


export { emailWorker, cancelJob, emailQueue };



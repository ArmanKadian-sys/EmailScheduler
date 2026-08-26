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

  //first email
  let endFirst = await connection.get("end")

  if (!endFirst) {
    await connection.set("end", endFirst);
    toggler.resume()
  }


  // Sending Email
  const emailTime = new Date(job.data.sendat).getTime();
  const now = new Date().getTime();
  const toHold = emailTime - now;

  await new Promise((resolve) => {
    console.log("Promise pending till", toHold);
    setTimeout(() => {
      resolve();
    }, toHold);
  })

  emailSender(job.data);


  // Further Checks

  const toggle = await connection.get("toggle");
  let end;

  if (toggle == "1") {
    end = await toReload(db_pool, connection);
    await connection.set("end", end);
    await connection.set("toggle", 0);
    toggler.resume();

  }




}, { connection });


emailWorker.on("completed", async (job) => {
  const { waiting, active } = await emailQueue.getJobCounts();
  if (waiting == 0) {
    let end = await toReload(db_pool, connection);
    if (end) {
      await connection.set("end", end);
    }
    else {
      await connection.del("end");
    }
  }

  console.log(`This Job has been completed with id:`, job.data.id);
});

emailWorker.on("failed", (err) => {
  console.log(`Job  has failed with error ${err.message}`);
});


export { emailWorker };



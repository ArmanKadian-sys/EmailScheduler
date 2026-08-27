import { Worker, Queue } from "bullmq";
import { connection } from "./connection.js";
import db_pool from "../../services/db.js";
import toReload from "./toReload.js";
import { emailWorker } from "./emailWorker.js";

const notificationQueue = new Queue("notifications", {
  connection
});

let toggler;

toggler = new Worker("notifications", async (job) => {

  const endString = await connection.get("end");
  const currentString = job.data.sendAt;

  // Queue's first email, no end string means the queue is empty.
  if (!endString) {
    await connection.set("toggle", { status: 1, time: endString });
    await toggler.pause(); // pause until the queue is Reloaded
    return;
  }
  const end = new Date(endString).getTime();
  const current = new Date(currentString).getTime();

  if (current < end) {
    await connection.set("toggle", { status: 1, time: endString });
    await toggler.pause();
  }


}, { connection });


toggler.on("completed", (job) => {
  console.log(`This Job has been completed`);

});

toggler.on("failed", (job, err) => {
  console.log(`Job  has failed with error ${err.message}`);
});


export { toggler }



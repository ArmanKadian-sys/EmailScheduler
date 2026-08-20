import { Worker, Queue } from "bullmq";
import { connection } from "./connection.js";
import emailExtracter from "./emailExtracter.js";
import db_pool from "../../services/db.js";
import toReload from "./toReload.js";


const notificationQueue = new Queue("notifications", {
  connection
});

const toggler = new Worker("notifications", async (job) => {


  const current = new Date(job.data.sendAt).getTime();
  const startString = await connection.get("start");
  const endString = await connection.get("end");


  //Condition if the email queue is empty and then the notification arrived from the email server
  if (!startString || !endString) {
    await connection.set("toggle", "1");
    await connection.set("start", job.data.sendAt);
    await connection.set("toggle", job.data.sendAt);
    toReload(connection, db_pool);
    return;
  }

  const start = new Date(startString).getTime();
  const end = new Date(endString).getTime();

  if (start <= current && current <= end) {
    await connection.set("toggle", "1");
  }


}, { connection });


toggler.on("completed", (job) => {
  console.log(`This Job has been completed`);

});

toggler.on("failed", (job, err) => {
  console.log(`Job  has failed with error ${err.message}`);
});


export { toggler }



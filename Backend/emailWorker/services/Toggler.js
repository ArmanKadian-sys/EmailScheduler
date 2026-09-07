import { Worker, Queue } from "bullmq";
import { connection } from "./connection.js";
import { emailQueue } from "./emailWorker.js";


const notificationsQueue = new Queue("notifications", {
  connection
});

await notificationsQueue.obliterate({ force: true });
console.log("Notification Queue Deleted");
const notificationQueue = new Queue("notifications", {
  connection
});
console.log("Notification Queue is developed again");

let toggler;

toggler = new Worker("notifications", async (job) => {

  console.log("************************************************************Toggler Ran now********************************************************************************************");
  const endString = await connection.get("end");
  const currentString = job.data.sendAt;
  console.log("toggler ran with endString", endString);

  if (!endString) { // This condition only runs if the queue is empty.
    await connection.set("toggle", JSON.stringify({ status: "1", end: currentString }));
    await connection.set("dbEmpty", false);
    console.log("toggler ran for first email and now paused");
    await toggler.pause(true);
    console.log("the toggler has returned now***************************************************************");
    return;
  }

  const end = new Date(endString).getTime();
  const current = new Date(currentString).getTime();

  if (current < end) {

    const jobs = emailQueue.getJobs()

    jobs.data.forEach(qjob => {
      console.log("job comparison has already started");
      if (job.id == qjob.id) {
        console.log("Toggler job already in the queue");
        return;
      }
    });
    console.log("Toggler job not in the queue");
    await connection.set("toggle", JSON.stringify({ status: "1", end: currentString }));
    console.log("*********Toggler ran current waali condition and it is paused now*******")
    await toggler.pause(true);
    return;
  }


}, { connection });


toggler.on("completed", (job) => {
  console.log(`*********************************************************This Job has been completed***************************************************`);

});

toggler.on("failed", (job, err) => {
  console.log(`Job has failed with error*********************************************************** ${err.message}`);
});


export { toggler }



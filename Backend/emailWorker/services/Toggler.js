import { Worker, Queue } from "bullmq";
import { connection } from "./connection.js";


const notificationsQueue = new Queue("notifications", {
  connection
});
await notificationsQueue.obliterate({ force: true });
const notificationQueue = new Queue("notifications", {
  connection
});

let toggler;

toggler = new Worker("notifications", async (job) => {

  console.log("Toggler Ran now");
  const endString = await connection.get("end");
  const currentString = job.data.sendAt;
  console.log("toggler ran with endString", endString);

  if (!endString) {
    await connection.set("toggle", JSON.stringify({ status: "1", end: endString }));
    await connection.set("dbEmpty", false);
    console.log("toggler ran for first email and now paused");
    await toggler.pause();

    return;
  }
  const end = new Date(endString).getTime();
  const current = new Date(currentString).getTime();

  if (current < end) {
    await connection.set("toggle", { status: 1, end: endString });
    await toggler.pause();
    return;
  }


}, { connection });


toggler.on("completed", (job) => {
  console.log(`This Job has been completed`);

});

toggler.on("failed", (job, err) => {
  console.log(`Job  has failed with error ${err.message}`);
});


export { toggler }



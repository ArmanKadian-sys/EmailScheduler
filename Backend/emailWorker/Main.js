import { toggler } from "./services/Toggler.js";
import { connection } from "./services/connection.js";
import { Queue } from "bullmq";
import { emailWorker, cancelJob } from "./services/emailWorker.js";
import toReload from "./services/toReload.js";
import db_pool from "../services/db.js";

const emailQueue = new Queue("email", { connection });
const notificationQueue = new Queue("notifications", { connection });
await emailQueue.drain();
console.log("email queue drained");
await notificationQueue.drain();
console.log("notification queue drained");
await connection.del("toggle");
await connection.del("end");
await connection.del("dbEmpty");
while (true) {
    console.log("Loop ran");
    let toggle;
    let end;
    end = await connection.get("end");
    toggle = await connection.get("toggle");
    toggle = JSON.parse(toggle);
    console.log("value of toggle obtained", toggle);
    if (toggle) {
        console.log("Toggle status is ", toggle.status);
    }
    const emailQueue = new Queue("emails", { connection });
    const notificationQueue = new Queue("notifications", { connection });
    const waitingCount = await emailQueue.getWaitingCount();
    const holding = await connection.get("holding");
    const dbEmpty = await connection.get("dbEmpty");
    console.log("dbEmpty", dbEmpty);
    console.log("waiting count", waitingCount);

    //Condition if the email worker is running and toggler arrives with a new request to reload emails in the queue.
    if (toggle && toggle.status == "1") {

        console.log("Toggler Condition Ran");

        // This is if the toggle saw the bad value of end
        // if (toggle.end >= end) {
        //     toggler.resume();
        //     continue;
        // }

        const holdingTime = new Date(holding).getTime();
        const noTime = new Date(toggle.end).getTime();
        end = await toReload(db_pool, connection);
        console.log("queue is now realoaded");
        await connection.set("end", end);
        if (toggle.status == "1") {
            if (holdingTime && (noTime < holdingTime)) {
                cancelJob();
            }
            await connection.set("toggle", JSON.stringify({ status: "0", end: null }));
            await toggler.resume();
            console.log("Toggler is now resumed");
        }
    }
    else if (toggle && waitingCount == 0 && dbEmpty == "false" && !holding) {
        //This is the condition if the queue becomes empty and no new emails inserted in the toggler and pending emails still in the database.
        console.log("empty queue condition ran");
        console.log("this is the value of toggle", toggle);

        let end = await toReload(db_pool, connection); //polling 
        console.log("queue now reloaded through empty condition");
        if (end) {
            await connection.set("end", end);
        }
        else {
            console.log("No emails to send now");
            await connection.set("dbEmpty", true);
            await connection.set("end", null);
        }

    }
}


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
await connection.del("holding");
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
    console.log("This is the value of end", end);
    console.log("This is the status of the toggler is paused or not:", toggler.isPaused())
    const emailQueue = new Queue("emails", { connection });
    const notificationQueue = new Queue("notifications", { connection });
    const waitingCount = await emailQueue.getWaitingCount();
    let holdingTime = await connection.get("holding");
    if (holdingTime) {
        holdingTime = JSON.parse(holdingTime);
        console.log("This the value of holding", holdingTime);

    }


    const dbEmpty = await connection.get("dbEmpty");
    console.log("dbEmpty", dbEmpty);
    console.log("waiting count", waitingCount);

    //Condition if the email worker is running and toggler arrives with a new request to reload emails in the queue.
    if (toggle && toggle.status == "1") {

        console.log("Toggler Condition Ran");

        // This is if the toggle read the bad value of end
        // if (toggle.end >= end) {
        //     toggler.resume();
        //     continue;
        // }

        const noTime = new Date(toggle.end).getTime();

        end = await toReload(db_pool, connection);
        console.log("queue is now realoaded");
        await connection.set("end", end);

        if (toggle.status == "1") {
            await connection.set("toggle", JSON.stringify({ status: "0", end: null }));
            console.log("This is the holding time", holdingTime);
            console.log("This is the noTime", noTime);
            if (holdingTime && (noTime < holdingTime)) {
                cancelJob();
                console.log("*****the current email worker job has been cancelled*****")
            }
            const resumed = await toggler.resume();
            console.log("The toggler is now resumed", resumed);

        }
    }
    else if (toggle && waitingCount == 0 && dbEmpty == "false" && !holdingTime) {
        //This is the condition if the queue becomes empty and no new emails inserted in the toggler and pending emails still in the database.
        console.log("************empty queue condition ran*************");
        console.log("this is the value of toggle", toggle);

        let end = await toReload(db_pool, connection); //polling 

        if (end) {
            await connection.set("end", end);
            console.log("***************queue now reloaded through empty condition***************");
        }
        else {
            console.log("No emails to send now");
            await connection.set("dbEmpty", true);
            await connection.set("end", null);
        }

    }
}


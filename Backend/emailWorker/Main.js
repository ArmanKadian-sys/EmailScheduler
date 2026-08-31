import { toggler } from "./services/Toggler.js";
import { connection } from "./services/connection.js";
import { Queue } from "bullmq";
import { emailWorker, cancelJob } from "./services/emailWorker.js";
import toReload from "./services/toReload.js";
import db_pool from "../services/db.js";

const emailQueue = new Queue("email", { connection });
const notificationQueue = new Queue("notifications", { connection });
await emailQueue.drain();
await notificationQueue.drain();
await connection.del("toggle");
await connection.del("end");

while (true) {
    console.log("Loop ran");
    let toggle;
    let end;
    end = await connection.get("end");
    toggle = await connection.get("toggle");
    const waitingCount = await emailQueue.getWaitingCount();
    const holding = await connection.get("holding");

    if (toggle && (toggle.status == "1" || waitingCount == 0)) {


        if (toggle.end >= end) {
            toggle.resume();
            console.log("")
            continue;
        }

        if (waitingCount == 0 && toggle.status == 0) {
            end = await toReload(db_pool, connection);
            if (end) {
                await connection.set("end", end);
            }
            continue;
        }

        const holdingTime = new Date(holding).getTime();
        const noTime = new Date(toggle.end).getTime();
        end = await toReload(db_pool, connection);
        console.log("queue is now realoaded");
        await connection.set("end", end);
        if (toggle.status == "1") {
            if (holdingTime && (noTime < holdingTime)) {
                cancelJob();
            }
            await connection.set("toggle", { status: "0", end: toggle.end });
            toggler.resume();
            console.log("Toggler is now resumed");
        }
    }
}
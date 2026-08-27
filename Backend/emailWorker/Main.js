import { toggler } from "./services/Toggler.js";
import { connection } from "./services/connection.js";
import { Queue } from "bullmq";
import { emailWorker } from "./services/emailWorker.js";
import toReload from "./services/toReload.js";
import db_pool from "../services/db.js";


const emailQueue = new Queue("email", { connection });

while (true) {
    let toggle;
    let end;

    toggle = await connection.get("toggle");
    const waitingCount = await emailQueue.getWaitingCount();
    const holding = await connection.get("holding");

    if (toggle.status == "1" || waitingCount == 0) {

        if (holding) {
            const holdingTime = new Date(holding).getTime();
            const noTime = new Date(toggle.end).getTime();

            if (noTime < holdingTime) {
                emailWorker.resume();
            }


        }



        end = await toReload(db_pool, connection);
        await connection.set("end", end);
        if (toggle.status == "1") {
            await connection.set("toggle", 0);
            toggler.resume();
        }
    }


}
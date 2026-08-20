import { connection } from "./services/connection.js";
import { Queue } from "bullmq";
// import db_pool from "../services/db.js";
import emailExtracter from "./services/emailExtracter.js";
import db_pool from "../services/db.js";
// import { toggler } from "./services/Toggler.js";
import { emailWorker } from "./services/emailWorker.js";



let { result, start, end } = await emailExtracter(db_pool);


result.forEach(email => {
    emailQueue.add(`email_${email.id}`, email);
});

console.log("This is index.js", result);


//


// const toReload = (db_pool) => {
//     const toggle = await connection.get("toggle");

//     let start, result, end = null;

//     if (toggle == "1" || (active == 0 && completed == 0 && failed == 0 && prioritized == 0 && waiting == 0)) {

//         ({ start, result, end } = await emailExtracter(db_pool));

//         return { start, result, end }
//     }
//     else {
//         return null;
//     }

// }



// toReload();




// If email queue is empty, then load the queue
//
// const {result, start, end} = emailExtracter(db_pool);

// await Promise.all(
//     result.map((email) =>
//         emailQueue.add(`email${email.id}`, email)
//     )
// );





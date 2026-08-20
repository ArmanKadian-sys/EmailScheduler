import emailExtracter from "./emailExtracter";
import { connection } from "./connection";
import { Queue } from "bullmq";

const toReload = async (db_pool, connection) => {

  const emailQueue = new Queue("emails", {
    connection
  })

  const toggle = await connection.get("toggle");

  let start, end, result = null;

  if (toggle == "1") {
    ({ start, end, result } = await emailExtracter(db_pool));
  }

  result.rows.forEach(email => {

    await emailQueue.add(`email_${email.id}`, email);

  });;




}

export default toReload;
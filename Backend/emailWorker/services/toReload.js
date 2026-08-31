import emailExtracter from "./emailExtracter.js";
import { Queue } from "bullmq";

const toReload = async (db_pool, connection) => {

  const emailQueue = new Queue("emails", {
    connection
  })

  let start, end, result = null;

  ({ start, end, result } = await emailExtracter(db_pool));

  if (result) {
    await Promise.all(
      result.map(email =>
        emailQueue.add(`email_${email.id}`, email)
      )
    );
  }


  return end;



}

export default toReload;
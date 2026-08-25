import emailExtracter from "./emailExtracter.js";
import { Queue } from "bullmq";

const toReload = async (db_pool, connection) => {

  const emailQueue = new Queue("emails", {
    connection
  })

  const toggle = await connection.get("toggle");
  console.log("this is the value of toggle", toggle);

  let start, end, result = null;

  if (toggle == "1") {
    ({ start, end, result } = await emailExtracter(db_pool));
  }



  await Promise.all(
    result.map(email =>
      emailQueue.add(`email_${email.id}`, email)
    )
  );



}

export default toReload;
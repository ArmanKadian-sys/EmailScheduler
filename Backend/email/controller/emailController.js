import db_pool from "../../services/db.js"
import { notificationQueue } from "../services/notificationQueue.js";

const getEmails = async (req, res, next) => {
  const query = 'SELECT * FROM emails';

  let result;

  try {
    result = await db_pool.query(query)
  }
  catch (error) {
    res.status(500).json({ message: error })
  }


  res.status(200).json({ result })


}

const postEmail = async (req, res, next) => {
  const { sendTo, sendFrom, content, subject, sendAt } = req.body;
  const query = `INSERT INTO emails (sendTo, sendFrom, content, subject, sendAt) VALUES ('${sendTo}', '${sendFrom}', '${content}', '${subject}', '${sendAt}') RETURNING id`;

  let result;

  try {
    result = await db_pool.query(query)
  }
  catch (error) {
    res.status(500).json({ message: error })
  }


  let id = result.rows[0].id;

  try {
    const job = await notificationQueue.add("new-email",
      {
        sendAt,
        id
      }
    )

    console.log("Job added successfully");
  } catch (error) {
    res.status(500).json({ message: "Please try again, server error" });
  }


  res.status(201).json({ result })
}

export default { getEmails, postEmail }
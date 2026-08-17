import dotenv from 'dotenv';
dotenv.config();
import db_pool from "../../services/db.js";
import { BrevoClient } from "@getbrevo/brevo";
import { fileURLToPath } from "url";
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
    path: path.join(__dirname, "../../.env")
});






const emailSender=(email)=>{

let response;

  try{
  response = await fetch(
    `https://api.brevo.com/v3/smtp/email`,
    {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
        },
        body: JSON.stringify({
    sender: {
      email: email.sendfrom,
      name: "Arman"
    },
    subject: email.subject,
    htmlContent: email.content,
    messageVersions: [

      {
        to: [
          {
            email: email.sendto,
            name: "Arman Kadian"
          }
        ],
        htmlContent: email.content,
        subject: email.subject
      }
      
    ]
    }),
    }
      );

  }
  catch(error){
    res.status(402).json({message: error})
  }
}



export {emailSender};
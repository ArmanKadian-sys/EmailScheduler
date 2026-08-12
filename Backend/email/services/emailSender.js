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



const pollerFunc=()=>{

}




const toSendFunc=()=>{
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
      email: "akadian087@gmail.com",
      name: "Arman"
    },
    subject: "Default subject line",
    htmlContent: "<!DOCTYPE html><html><body><h1>Order Confirmation</h1><p>Thank you for your order.</p></body></html>",
    messageVersions: [

      {
        to: [
          {
            email: "armankadian11@gmail.com",
            name: "Arman Kadian"
          }
        ],
        htmlContent: "<!DOCTYPE html><html><body><h1>Order Confirmation</h1><p>Thank you, Bob and Anne! Your order has been processed.</p></body></html>",
        subject: "Your order is confirmed"
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


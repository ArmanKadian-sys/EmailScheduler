import dotenv from 'dotenv';
dotenv.config();
import db_pool from "../../services/db.js";
import {validationResult} from "express-validator";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { BrevoClient } from "@getbrevo/brevo";
import { fileURLToPath } from "url";
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
    path: path.join(__dirname, "../.env")
});


console.log("this is the api key", process.env.BREVO_API_KEY);



const partial_register_one=async(req, res, next)=>{
      const errors = validationResult(req);

      const myerrors=errors.array().map((err) => err.msg)

      if (!errors.isEmpty()) {
        return res.status(422).json({
          message: myerrors
        });
      }

    const hashedPassword= await bycrypt.hash(req.body.password, 12);

    const {name, email}=req.body;  
    
    
    const client = new BrevoClient({
        apiKey: process.env.BREVO_API_KEY,
    });


  let result;
    
  try{
      result=await client.senders.createSender({name, email});
  }catch(error){
     return res.status(422).json({
          message: error
     });
  }


  
    res.status(201).send({
      message:"Partial registration step 1 done",
      hashedPassword, 
      name,
      email, 
      sender_id:result.id,
      otp: result.otp
    })

}

const partial_register_two=async(req, res, next)=>{


  const {hashedPassword, name, email, sender_id, otp}=req.body;

  let response;

  try{
  response = await fetch(
    `https://api.brevo.com/v3/senders/${sender_id}/validate`,
    {
        method: "PUT",
        headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            otp
        }),
    }
      );

  }
  catch(error){
    res.status(402).json({message: error})
  }



  const query=`INSERT INTO users (name, password, email) VALUES ('${name}', '${hashedPassword}', '${email}')`;
  

  let result;
  try{
  result= await db_pool.query(query);
  }
  catch(error){
    res.status(402).json({message: error})
  }

  res.status(201).json({message:"user created successfully"})
  


}

const login=async(req, res, next)=>{

const {email, password}=req.body;

 const query=`SELECT * FROM users WHERE email='${email}'`;
  
  let user;

  try{
  user= await db_pool.query(query);
  }
  catch(error){
    res.status(402).json({message: error})
  }

  console.log(user);


  const isMatch = await bycrypt.compare(password, user.rows[0].password);

  if(!isMatch){
    res.status(422).json({message: "Password Incorrect"});
    return;
  }

const token = jwt.sign({ userId: user._id}, "EmailWebsite");

res.status(201).json({token});

}

export default{
  partial_register_one, 
  partial_register_two, 
  login
}
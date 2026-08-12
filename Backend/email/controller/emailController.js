import db_pool from "../../services/db.js"
import {wss} from "../ws.js";

const getEmails=async(req, res, next)=>{
 const query='SELECT * FROM emails';

 let result;

 try{
  result = await db_pool.query(query)
 }
 catch(error){
  res.status(500).json({message: error})
 }


 res.status(200).json({result})

 
}


const postEmail=async(req, res, next)=>{
  const {sendTo, sendFrom, content, subject, sendAt}=req.body;
  const query=`INSERT INTO emails (sendTo, sendFrom, content, subject, sendAt) VALUES ('${sendTo}', '${sendFrom}', '${content}', '${subject}', '${sendAt}')`;

 let result;
 

 try{
  result = await db_pool.query(query)
 }
 catch(error){
  res.status(500).json({message: error})
 }


 wss.
 res.status(201).json({result})
}

export default {getEmails, postEmail}
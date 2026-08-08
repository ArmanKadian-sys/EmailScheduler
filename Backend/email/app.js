import express from "express";
import mongoose from "mongoose";
import result from "./models/Email.js";
import cors from "cors";
import emailRouter from "./routes/emailrouter.js";
import bodyParser from "body-parser";

const app=express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/emails", emailRouter);


app.listen(3000, ()=>{
  console.log("Email has been connected: ", result);
  console.log("Email server started at 3000");
})



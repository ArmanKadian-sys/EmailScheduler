import express from "express";
import result from "./model/User.js";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import bodyParser from "body-parser";

const app=express();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/authenticate", userRouter);


app.listen(3000, ()=>{
  console.log("User DB has been connected: ", result);
  console.log("Email server started at 3002");
})



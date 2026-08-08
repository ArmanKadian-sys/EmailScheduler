import express from "express";
import emailController from "../controller/emailController.js"

const emailRouter= express.Router();

emailRouter.get("/getEmails", emailController.getEmails);
emailRouter.post("/postEmail", emailController.postEmail);

export default emailRouter;
import userController from "../controller/userController.js";
import express from "express";
import validations  from "../utils/validator.js";


const userRouter=express.Router();

userRouter.post("/register", validations, userController.partial_register_one);
userRouter.post("/register_two", validations, userController.partial_register_two);
userRouter.post("/login", userController.login);


export default userRouter;
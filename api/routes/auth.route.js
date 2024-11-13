import express from "express";
import { singup } from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/sign-up", singup);

export default route;

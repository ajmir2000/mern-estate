import express from "express";
import { signin, signup, google } from "../controllers/auth.controller.js";

const route = express.Router();

route.post("/signup", signup);
route.post("/signin", signin);
route.post("/google", google);

export default route;

import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verfiyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verfiyToken, updateUser);

export default router;

import express from "express";
import { deleteUser, test, updateUser } from "../controllers/user.controller.js";
import { verfiyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verfiyToken, updateUser);
router.delete("/delete/:id", verfiyToken, deleteUser);

export default router;

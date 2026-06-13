import express from "express";
import {
  deleteUser,
  getUserListings,
  test,
  updateUser,
} from "../controllers/user.controller.js";
import { verfiyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id", verfiyToken, updateUser);
router.delete("/delete/:id", verfiyToken, deleteUser);

// routes for listing

router.get("/listings/:id", verfiyToken, getUserListings);

export default router;

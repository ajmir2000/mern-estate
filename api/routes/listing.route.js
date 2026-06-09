import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verfiyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/create", verfiyToken, createListing);

export default router;

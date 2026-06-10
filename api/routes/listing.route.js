import express from "express";
import {
  createListing,
  uploadListingImages,
} from "../controllers/listing.controller.js";

import { verfiyToken } from "../utils/verifyToken.js";

const router = express.Router();

// upload listing Images locally
router.post("/uploadListingImages", verfiyToken, uploadListingImages);

// create listing on mongodb database
router.post("/create", verfiyToken, createListing);

export default router;

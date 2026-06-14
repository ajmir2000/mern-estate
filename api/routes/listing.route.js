import express from "express";
import {
  createListing,
  uploadListingImages,deleteListing,updateListing
} from "../controllers/listing.controller.js";

import { verfiyToken } from "../utils/verifyToken.js";

const router = express.Router();

// upload listing Images locally
router.post("/uploadListingImages", verfiyToken, uploadListingImages);

// create listing on mongodb database
router.post("/create", verfiyToken, createListing);
router.delete("/delete/:id", verfiyToken, deleteListing);
router.post("/update/:id", verfiyToken, updateListing);

export default router;

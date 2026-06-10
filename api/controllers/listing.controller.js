import Listing from "../models/listing.model.js";
import path from "path";
import multer from "multer";
import fs from "fs";

// =========================
// Upload configuration
// =========================
const uploadPath = "uploads/listings";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    cb(
      null,
      `listing-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}${path.extname(file.originalname)}`,
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png/;

  const mimetype = filetypes.test(file.mimetype);

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }

  cb(new Error("Only .jpg, .jpeg and .png files are allowed"));
};

const upload = multer({
  storage,

  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },

  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

// =========================
// Upload listing images
// =========================

export const uploadListingImages = (req, res) => {
  upload.array("images", 6)(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Each image must be less than 2MB",
        });
      }

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          success: false,
          message: "Maximum 6 images allowed",
        });
      }
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    const imageUrls = req.files.map((file) => `/${file.path}`);

    return res.status(200).json({
      success: true,
      imageUrls,
    });
  });
};

// =========================
// Create listing
// =========================

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);

    return res.status(201).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};

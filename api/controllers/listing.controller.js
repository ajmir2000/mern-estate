import Listing from "../models/listing.model.js";
import path from "path";
import multer from "multer";
import fs from "fs";
import { errorHandler } from "../utils/error.js";

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
    // this line of code make bug on windows os beacuse the path is ( \ browser not know that) if we use replaceAll("\\", "/") then the path will be ( / )

    const imageUrls = req.files.map(
      (file) => `/${file.path.replaceAll("\\", "/")}`,
    );

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

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(
      errorHandler(401, "You are not authorized to delete this listing"),
    );
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Listing has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef) {
    return next(
      errorHandler(401, "You are not authorized to update this listing"),
    );
  }
  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    return res.status(200).json({
      success: true,
      listing: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    return res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// Get all listings by query
// =========================
export const getListings = async (req, res, next) => {
  try {
    // Number of listings to return per request (default: 9)
    const limit = parseInt(req.query.limit) || 9;

    // Number of listings to skip for pagination (default: 0)
    const startIndex = parseInt(req.query.startIndex) || 0;

    // Filter by offer status, or include all if not specified
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [true, false] };
    }

    // Filter by furnished status, or include all
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    }

    // Filter by parking status, or include all
    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    }

    // Filter by listing type (rent/sale), or include both
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["rent", "sale"] };
    }

    // Search text for listing name
    const searchTerm = req.query.searchTerm || "";

    // Field used for sorting results
    const sort = req.query.sort || "createdAt";

    // Sort direction: asc or desc
    const order = req.query.order || "desc";

    // Find listings based on filters and search criteria
    const listings = await Listing.find({
      // Case-insensitive search by listing name
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      // Sort results dynamically
      .sort({ [sort]: order })

      // Limit number of returned listings
      .limit(limit)

      // Skip listings for pagination
      .skip(startIndex);

    // Send filtered listings to client
    return res.status(200).json({
      success: true,
      listings,
    });
  } catch (error) {
    // Forward errors to error-handling middleware
    next(error);
  }
};

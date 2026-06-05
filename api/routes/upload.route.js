import express from "express";
import path from "path";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"));
  }
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

router.post(
  "/",
  (req, res, next) => {
    upload.single("image")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "Image size must be less than 2MB",
          });
        }
      }

      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }

      next();
    });
  },

  (req, res) => {
    res.send(`/${req.file.path}`);
  },
);

export default router;

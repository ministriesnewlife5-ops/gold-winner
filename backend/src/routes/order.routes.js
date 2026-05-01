const express = require("express");
const multer = require("multer");

const { asyncHandler } = require("../utils/asyncHandler");
const { createOrderController } = require("../controllers/order.controller");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.post(
  "/order",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  (req, _res, next) => {
    const files = req.files || {};
    const imageFile = files.image?.[0];
    const photoFile = files.photo?.[0];
    req.uploadedFile = imageFile || photoFile || null;
    next();
  },
  asyncHandler(createOrderController),
);

module.exports = router;

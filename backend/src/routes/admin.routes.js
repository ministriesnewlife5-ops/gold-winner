const express = require("express");

const { asyncHandler } = require("../utils/asyncHandler");
const { requireAdminAuth } = require("../middleware/auth");
const {
  listOrdersController,
  dashboardController,
  downloadOrderDescriptorController,
  downloadOrderDetailsController,
  downloadOrderImageController,
  downloadOrderZipController,
  downloadAllOrdersCsvController,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/admin/dashboard", requireAdminAuth, asyncHandler(dashboardController));
router.get("/admin/orders", requireAdminAuth, asyncHandler(listOrdersController));
router.get(
  "/admin/orders/:id/download",
  requireAdminAuth,
  asyncHandler(downloadOrderDescriptorController),
);
router.get(
  "/admin/orders/:id/download/details",
  requireAdminAuth,
  asyncHandler(downloadOrderDetailsController),
);
router.get(
  "/admin/orders/:id/download/image",
  requireAdminAuth,
  asyncHandler(downloadOrderImageController),
);
router.get("/admin/orders/:id/download/zip", requireAdminAuth, asyncHandler(downloadOrderZipController));
router.get("/admin/orders/export/csv", requireAdminAuth, asyncHandler(downloadAllOrdersCsvController));

module.exports = router;

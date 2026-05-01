const express = require("express");

const { asyncHandler } = require("../utils/asyncHandler");
const {
  loginController,
  logoutController,
  adminLoginPageController,
} = require("../controllers/auth.controller");

const router = express.Router();

router.get("/admin/login", adminLoginPageController);
router.post("/auth/login", asyncHandler(loginController));
router.post("/auth/logout", asyncHandler(logoutController));

module.exports = router;

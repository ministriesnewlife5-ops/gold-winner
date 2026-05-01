const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const { env, assertRequiredEnv } = require("./config/env");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");
const authRoutes = require("./routes/auth.routes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

assertRequiredEnv();

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin.split(",").map((x) => x.trim()),
    credentials: true,
  }),
);
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

const orderLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again shortly." },
});

const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "gold-winner-backend" });
});

app.use("/order", orderLimiter);
app.use("/admin", adminLimiter);
app.use("/auth", adminLimiter);
app.use(orderRoutes);
app.use(authRoutes);
app.use(adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

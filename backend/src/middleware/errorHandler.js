const { HttpError } = require("../utils/httpError");

function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ error: error.message, details: error.details });
    return;
  }

  if (error?.name === "ZodError") {
    res.status(400).json({
      error: "Validation failed",
      details: error.issues?.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
    return;
  }

  if (error?.name === "MulterError") {
    res.status(400).json({ error: `File upload error: ${error.message}` });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};

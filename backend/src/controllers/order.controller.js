const { createOrderSchema } = require("../utils/validators");
const { HttpError } = require("../utils/httpError");
const { createOrder, createOrderImage } = require("../services/order.service");
const { uploadOrderImage } = require("../services/storage.service");

const MAX_BYTES = 10 * 1024 * 1024;

function normalizeOrderPayload(body) {
  return {
    name: String(body.name || body.motherName || "").trim(),
    message: String(body.message || "Mother's Day Gift Submission").trim(),
    template_id: String(body.template_id || body.template || "").trim(),
    delivery_address: String(body.delivery_address || body.address || "").trim(),
    phone_number: String(body.phone_number || body.phone || "").replace(/\D/g, ""),
  };
}

async function createOrderController(req, res) {
  const file = req.uploadedFile;

  if (!file) {
    throw new HttpError(400, "Image file is required (field name: image or photo).");
  }

  if (file.size > MAX_BYTES) {
    throw new HttpError(400, "Image must be less than or equal to 10MB.");
  }

  if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
    throw new HttpError(400, "Only PNG and JPG images are supported.");
  }

  const payload = normalizeOrderPayload(req.body);
  const validated = createOrderSchema.parse(payload);

  const order = await createOrder(validated);
  const imagePath = await uploadOrderImage(order.id, file);
  await createOrderImage(order.id, imagePath);

  res.status(201).json({
    order_id: order.id,
    created_at: order.created_at,
  });
}

module.exports = {
  createOrderController,
};

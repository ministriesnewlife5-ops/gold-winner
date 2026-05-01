const { z } = require("zod");

const createOrderSchema = z.object({
  name: z.string().trim().min(1).max(80),
  message: z.string().trim().min(1).max(1000),
  template_id: z.string().trim().min(1).max(80),
  delivery_address: z.string().trim().min(1).max(500),
  phone_number: z
    .string()
    .trim()
    .regex(/^\d{10,15}$/),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

module.exports = {
  createOrderSchema,
  idParamSchema,
};

const { supabaseAdmin } = require("../config/supabase");
const { HttpError } = require("../utils/httpError");

async function createOrder(orderData) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      name: orderData.name,
      message: orderData.message,
      template_id: orderData.template_id,
      delivery_address: orderData.delivery_address,
      phone_number: orderData.phone_number,
    })
    .select("id, created_at")
    .single();

  if (error || !data) {
    throw new HttpError(500, `Failed to create order: ${error?.message || "unknown error"}`);
  }

  return data;
}

async function createOrderImage(orderId, imagePath) {
  const { data, error } = await supabaseAdmin
    .from("order_images")
    .insert({
      order_id: orderId,
      image_path: imagePath,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new HttpError(500, `Failed to save image metadata: ${error?.message || "unknown error"}`);
  }

  return data;
}

async function listOrders() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id,name,message,template_id,delivery_address,phone_number,created_at,order_images(id,image_path,created_at)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new HttpError(500, `Failed to list orders: ${error.message}`);
  }

  return data || [];
}

async function getOrderById(orderId) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id,name,message,template_id,delivery_address,phone_number,created_at,order_images(id,image_path,created_at)",
    )
    .eq("id", orderId)
    .single();

  if (error || !data) {
    throw new HttpError(404, `Order not found: ${error?.message || "unknown error"}`);
  }

  return data;
}

module.exports = {
  createOrder,
  createOrderImage,
  listOrders,
  getOrderById,
};

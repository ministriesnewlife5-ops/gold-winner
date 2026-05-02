const { idParamSchema } = require("../utils/validators");
const { listOrders, getOrderById } = require("../services/order.service");
const { createSignedImageUrl, downloadImageBuffer } = require("../services/storage.service");
const { buildOrderExportPayload, streamOrderZip } = require("../services/export.service");
const { generateOrdersCsv } = require("../services/csv.service");
const { HttpError } = require("../utils/httpError");

async function listOrdersController(req, res) {
  const orders = await listOrders();

  const withSignedUrls = await Promise.all(
    orders.map(async (order) => {
      const firstImage = order.order_images?.[0];
      let image_url = null;

      if (firstImage?.image_path) {
        image_url = await createSignedImageUrl(firstImage.image_path);
      }

      return {
        id: order.id,
        name: order.name,
        message: order.message,
        template_id: order.template_id,
        delivery_address: order.delivery_address,
        phone_number: order.phone_number,
        created_at: order.created_at,
        image_url,
        image_path: firstImage?.image_path || null,
      };
    }),
  );

  res.json({ orders: withSignedUrls });
}

async function dashboardController(req, res) {
  const orders = await listOrders();
  const rows = orders
    .map((order) => {
      const imagePath = order.order_images?.[0]?.image_path;
      const safeName = String(order.name || "").replace(/[&<>\"]/g, "");
      return `<tr>
        <td>${order.created_at}</td>
        <td>${safeName}</td>
        <td>${order.template_id}</td>
        <td>${order.phone_number}</td>
        <td>
          <a href="/admin/orders/${order.id}/download/details">Details JSON</a>
          ${imagePath ? ` | <a href="/admin/orders/${order.id}/download/image">Image</a>` : ""}
          ${imagePath ? ` | <a href="/admin/orders/${order.id}/download/zip">ZIP</a>` : ""}
        </td>
      </tr>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Orders Dashboard</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 1.5rem; background: #f7f8fc; }
    .wrap { max-width: 1200px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 1rem; box-shadow: 0 4px 20px rgba(0,0,0,.06); }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { border-bottom: 1px solid #ececec; padding: .75rem; text-align: left; vertical-align: top; }
    th { background: #f8fafc; }
    .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    button { border: none; background: #111827; color: #fff; padding: .5rem .9rem; border-radius: 8px; cursor: pointer; }
    form { margin: 0; }
    a { color: #1d4ed8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div>
        <h1>Admin Orders</h1>
        <a href="/admin/orders/export/csv" style="display: inline-block; margin-top: 0.5rem; padding: 0.5rem 0.9rem; background: #059669; color: white; border-radius: 8px; text-decoration: none; font-size: 14px;">Download All (CSV)</a>
      </div>
      <form action="/auth/logout" method="post"><button type="submit">Logout</button></form>
    </div>
    <table>
      <thead>
        <tr>
          <th>Created At</th>
          <th>Name</th>
          <th>Template</th>
          <th>Phone</th>
          <th>Downloads</th>
        </tr>
      </thead>
      <tbody>
        ${rows || `<tr><td colspan="5">No orders yet.</td></tr>`}
      </tbody>
    </table>
  </div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
}

async function downloadOrderDetailsController(req, res) {
  const { id } = idParamSchema.parse(req.params);
  const order = await getOrderById(id);

  const payload = buildOrderExportPayload(order);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", `attachment; filename=order-${id}.json`);
  res.send(JSON.stringify(payload, null, 2));
}

async function downloadOrderDescriptorController(req, res) {
  const { id } = idParamSchema.parse(req.params);
  await getOrderById(id);

  res.json({
    order_id: id,
    details_download_url: `/admin/orders/${id}/download/details`,
    image_download_url: `/admin/orders/${id}/download/image`,
    zip_download_url: `/admin/orders/${id}/download/zip`,
  });
}

async function downloadOrderImageController(req, res) {
  const { id } = idParamSchema.parse(req.params);
  const order = await getOrderById(id);

  const imagePath = order.order_images?.[0]?.image_path;
  if (!imagePath) {
    throw new HttpError(404, "No image found for this order.");
  }

  const { buffer, contentType } = await downloadImageBuffer(imagePath);
  const extension = contentType === "image/png" ? "png" : "jpg";

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename=order-${id}.${extension}`);
  res.send(buffer);
}

async function downloadOrderZipController(req, res) {
  const { id } = idParamSchema.parse(req.params);
  const order = await getOrderById(id);

  const imagePath = order.order_images?.[0]?.image_path;
  if (!imagePath) {
    throw new HttpError(404, "No image found for this order.");
  }

  const { buffer, contentType } = await downloadImageBuffer(imagePath);
  streamOrderZip(res, order, buffer, contentType);
}

async function downloadAllOrdersCsvController(req, res) {
  const orders = await listOrders();
  const csv = generateOrdersCsv(orders);

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
  res.send(csv);
}

module.exports = {
  listOrdersController,
  dashboardController,
  downloadOrderDescriptorController,
  downloadOrderDetailsController,
  downloadOrderImageController,
  downloadOrderZipController,
  downloadAllOrdersCsvController,
};

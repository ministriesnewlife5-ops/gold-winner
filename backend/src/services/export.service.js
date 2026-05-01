const archiver = require("archiver");

function buildOrderExportPayload(order) {
  return {
    id: order.id,
    name: order.name,
    message: order.message,
    template_id: order.template_id,
    delivery_address: order.delivery_address,
    phone_number: order.phone_number,
    created_at: order.created_at,
    image: order.order_images?.[0]
      ? {
          id: order.order_images[0].id,
          image_path: order.order_images[0].image_path,
          created_at: order.order_images[0].created_at,
        }
      : null,
  };
}

function streamOrderZip(res, order, imageBuffer, imageContentType) {
  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => {
    res.destroy(err);
  });

  const jsonPayload = JSON.stringify(buildOrderExportPayload(order), null, 2);
  const extension = imageContentType === "image/png" ? "png" : "jpg";

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename=order-${order.id}.zip`);

  archive.pipe(res);
  archive.append(jsonPayload, { name: `order-${order.id}.json` });
  archive.append(imageBuffer, { name: `order-${order.id}.${extension}` });

  archive.finalize();
}

module.exports = {
  buildOrderExportPayload,
  streamOrderZip,
};

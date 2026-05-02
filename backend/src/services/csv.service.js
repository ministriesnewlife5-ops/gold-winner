function escapeCsvField(field) {
  if (field === null || field === undefined) {
    return "";
  }

  const str = String(field);

  // If field contains comma, newline, or quote, wrap in quotes and escape quotes
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

function generateOrdersCsv(orders) {
  const headers = [
    "Order ID",
    "Name",
    "Message",
    "Template",
    "Delivery Address",
    "Phone Number",
    "Created At",
    "Image Path",
  ];

  // Escape header fields
  const headerRow = headers.map(escapeCsvField).join(",");

  // Build data rows
  const dataRows = orders.map((order) => {
    const imagePath = order.order_images?.[0]?.image_path || "";
    const fields = [
      order.id,
      order.name,
      order.message,
      order.template_id,
      order.delivery_address,
      order.phone_number,
      order.created_at,
      imagePath,
    ];
    return fields.map(escapeCsvField).join(",");
  });

  // Combine header + data rows
  const csv = [headerRow, ...dataRows].join("\n");

  return csv;
}

module.exports = {
  generateOrdersCsv,
};

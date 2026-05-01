const path = require("node:path");
const crypto = require("node:crypto");

const { supabaseAdmin } = require("../config/supabase");
const { env } = require("../config/env");
const { HttpError } = require("../utils/httpError");

function getImageExtension(mimeType) {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    default:
      throw new HttpError(400, "Only PNG and JPG images are supported.");
  }
}

async function uploadOrderImage(orderId, file) {
  const ext = getImageExtension(file.mimetype);
  const imagePath = path.posix.join(
    "orders",
    new Date().toISOString().slice(0, 10),
    `${orderId}-${crypto.randomUUID()}.${ext}`,
  );

  const { error } = await supabaseAdmin.storage.from(env.storageBucket).upload(imagePath, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
    cacheControl: "31536000",
  });

  if (error) {
    throw new HttpError(500, `Failed to upload image to storage: ${error.message}`);
  }

  return imagePath;
}

async function createSignedImageUrl(imagePath, expiresInSeconds = env.orderImageSignedUrlTtl) {
  const { data, error } = await supabaseAdmin.storage
    .from(env.storageBucket)
    .createSignedUrl(imagePath, expiresInSeconds);

  if (error || !data?.signedUrl) {
    throw new HttpError(500, `Failed to generate signed image URL: ${error?.message || "unknown error"}`);
  }

  return data.signedUrl;
}

async function downloadImageBuffer(imagePath) {
  const { data, error } = await supabaseAdmin.storage.from(env.storageBucket).download(imagePath);

  if (error || !data) {
    throw new HttpError(404, `Image not found: ${error?.message || "unknown error"}`);
  }

  const buffer = Buffer.from(await data.arrayBuffer());

  return {
    buffer,
    contentType: data.type || "application/octet-stream",
  };
}

module.exports = {
  uploadOrderImage,
  createSignedImageUrl,
  downloadImageBuffer,
};

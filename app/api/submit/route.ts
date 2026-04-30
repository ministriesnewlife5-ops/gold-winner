import { NextResponse } from "next/server";

import { Readable } from "node:stream";

import { v2 as cloudinary } from "cloudinary";
import { google } from "googleapis";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function assertEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

function sanitizeFolderPart(input: string) {
  return input
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 40);
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function pad4(n: number) {
  return n.toString().padStart(4, "0");
}

async function getGoogleClients() {
  const raw = assertEnv("GOOGLE_SERVICE_ACCOUNT_JSON");
  const serviceAccount = JSON.parse(raw) as {
    client_email: string;
    private_key: string;
  };

  const auth = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const drive = google.drive({ version: "v3", auth });

  return { sheets, drive };
}

async function ensureMainDriveFolder(drive: ReturnType<typeof google.drive>) {
  const mainFolderName = "Gold_Winner_MothersDay_2026";

  const searchRes = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${mainFolderName.replace(
      /'/g,
      "\\'",
    )}' and trashed=false`,
    fields: "files(id,name)",
    pageSize: 1,
  });

  const existing = searchRes.data.files?.[0];
  if (existing?.id) return existing.id;

  const created = await drive.files.create({
    requestBody: {
      name: mainFolderName,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });

  if (!created.data.id) throw new Error("Failed to create main Drive folder");
  return created.data.id;
}

async function createSubFolder(
  drive: ReturnType<typeof google.drive>,
  parentId: string,
  uniqueId: string,
  motherName: string,
) {
  const folderName = `${uniqueId}_${sanitizeFolderPart(motherName)}`;

  const created = await drive.files.create({
    requestBody: {
      name: folderName,
      parents: [parentId],
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });

  if (!created.data.id) throw new Error("Failed to create subfolder");
  return { folderId: created.data.id, folderName };
}

async function uploadToCloudinary(buffer: Buffer, uniqueId: string) {
  cloudinary.config({
    cloud_name: assertEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: assertEnv("CLOUDINARY_API_KEY"),
    api_secret: assertEnv("CLOUDINARY_API_SECRET"),
    secure: true,
  });

  const publicId = `gold_winner/mothers_day_2026/${uniqueId}`;

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        overwrite: false,
        resource_type: "image",
      },
      (error, res) => {
        if (error || !res?.secure_url) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ secure_url: res.secure_url });
      },
    );

    stream.end(buffer);
  });

  return result.secure_url;
}

async function uploadDriveFile(
  drive: ReturnType<typeof google.drive>,
  parentId: string,
  name: string,
  mimeType: string,
  data: Buffer,
) {
  const created = await drive.files.create({
    requestBody: {
      name,
      parents: [parentId],
    },
    media: {
      mimeType,
      body: Readable.from(data),
    },
    fields: "id",
  });

  return created.data.id ?? "";
}

async function getExistingIds(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  sheetName: string,
) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A:A`,
  });

  const values = res.data.values ?? [];
  const set = new Set<string>();
  for (const row of values) {
    const v = row?.[0];
    if (typeof v === "string" && v.startsWith("GW-MD26-")) set.add(v);
  }
  return set;
}

function generateCandidate() {
  const n = Math.floor(Math.random() * 10000);
  return `GW-MD26-${pad4(n)}`;
}

async function generateUniqueId(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  sheetName: string,
) {
  const existing = await getExistingIds(sheets, spreadsheetId, sheetName);

  for (let i = 0; i < 25; i++) {
    const id = generateCandidate();
    if (!existing.has(id)) return id;
  }

  throw new Error("Could not generate unique order ID");
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const motherName = String(form.get("motherName") ?? "").trim();
    const template = String(form.get("template") ?? "").trim();
    const receiverName = String(form.get("receiverName") ?? "").trim();
    const address = String(form.get("address") ?? "").trim();
    const phone = onlyDigits(String(form.get("phone") ?? ""));
    const photo = form.get("photo");

    if (!motherName) return jsonError("Mother Name is required");
    if (motherName.length > 25) return jsonError("Mother Name max 25 characters");
    if (!template) return jsonError("Template is required");
    if (!receiverName) return jsonError("Receiver Name is required");
    if (!address) return jsonError("Full Address is required");
    if (!phone || phone.length !== 10) return jsonError("Mobile Number must be exactly 10 digits");

    if (!photo || typeof photo === "string") return jsonError("Photo is required");

    const contentType = photo.type;
    if (contentType !== "image/jpeg" && contentType !== "image/png") {
      return jsonError("Photo must be JPG or PNG");
    }

    const arrayBuffer = await photo.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_BYTES) return jsonError("Photo must be <= 10MB");

    const { sheets, drive } = await getGoogleClients();

    const spreadsheetId = assertEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
    const sheetName = assertEnv("GOOGLE_SHEETS_SHEET_NAME");

    const uniqueId = await generateUniqueId(sheets, spreadsheetId, sheetName);

    const imageBuffer = Buffer.from(arrayBuffer);
    const imageUrl = await uploadToCloudinary(imageBuffer, uniqueId);

    const mainFolderId = await ensureMainDriveFolder(drive);
    const { folderId } = await createSubFolder(drive, mainFolderId, uniqueId, motherName);

    const ext = contentType === "image/png" ? "png" : "jpg";
    const imageName = `${uniqueId}.${ext}`;

    await uploadDriveFile(drive, folderId, imageName, contentType, imageBuffer);

    const metadata = {
      uniqueId,
      timestamp: new Date().toISOString(),
      motherName,
      receiverName,
      template,
      address,
      phone,
      imageUrl,
    };

    await uploadDriveFile(
      drive,
      folderId,
      `${uniqueId}_metadata.json`,
      "application/json",
      Buffer.from(JSON.stringify(metadata, null, 2)),
    );

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:H`,
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            uniqueId,
            metadata.timestamp,
            motherName,
            template,
            imageUrl,
            address,
            phone,
            "Pending",
          ],
        ],
      },
    });

    return NextResponse.json({ orderId: uniqueId });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return jsonError(message, 500);
  }
}

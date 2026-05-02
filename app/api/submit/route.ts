import { NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_TIMEOUT_MS = 15000;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  try {
    const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendBaseUrl) {
      return jsonError("Missing env: NEXT_PUBLIC_BACKEND_URL", 500);
    }

    const form = await req.formData();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

    let backendResponse: Response;
    try {
      backendResponse = await fetch(`${backendBaseUrl.replace(/\/$/, "")}/order`, {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown network error";
      const normalized = message.toLowerCase();
      if (normalized.includes("abort") || normalized.includes("timeout")) {
        return jsonError("Backend request timed out. Check backend hosting URL and server health.", 504);
      }
      return jsonError(
        `Failed to connect to backend at ${backendBaseUrl}. Check the backend URL, SSL certificate, firewall, and server status.`,
        502,
      );
    } finally {
      clearTimeout(timeout);
    }

    const rawText = await backendResponse.text();
    let responseBody: { order_id?: string; created_at?: string; error?: string } | null = null;

    try {
      responseBody = rawText ? (JSON.parse(rawText) as typeof responseBody) : null;
    } catch {
      responseBody = null;
    }

    if (!backendResponse.ok || !responseBody.order_id) {
      const fallback = rawText.trim() || "Failed to submit order";
      return jsonError(responseBody?.error || fallback, backendResponse.status || 500);
    }

    return NextResponse.json({
      orderId: responseBody.order_id,
      createdAt: responseBody.created_at,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return jsonError(message, 500);
  }
}

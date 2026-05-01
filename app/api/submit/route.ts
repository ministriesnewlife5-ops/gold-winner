import { NextResponse } from "next/server";

export const runtime = "nodejs";

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

    const backendResponse = await fetch(`${backendBaseUrl.replace(/\/$/, "")}/order`, {
      method: "POST",
      body: form,
    });

    const responseBody = (await backendResponse.json()) as {
      order_id?: string;
      created_at?: string;
      error?: string;
    };

    if (!backendResponse.ok || !responseBody.order_id) {
      return jsonError(responseBody.error || "Failed to submit order", backendResponse.status || 500);
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

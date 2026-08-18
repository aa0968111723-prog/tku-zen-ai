import { NextResponse } from "next/server";
import { zenReply } from "@/lib/zen";

export const runtime = "nodejs";

interface ChatRequestBody {
  message?: unknown;
}

export async function POST(request: Request) {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (typeof body.message !== "string") {
    return NextResponse.json(
      { error: "Field 'message' must be a string." },
      { status: 400 },
    );
  }

  if (body.message.length > 2000) {
    return NextResponse.json(
      { error: "Message is too long (max 2000 characters)." },
      { status: 413 },
    );
  }

  const reply = zenReply(body.message);
  return NextResponse.json({ reply });
}

export async function GET() {
  return NextResponse.json({ status: "ok", service: "tku-zen-ai" });
}

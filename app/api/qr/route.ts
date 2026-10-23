import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { qrSessions, mobileTokens } from "@/lib/store";

const TTL_MS = 45_000; // 45 seconds ang buhay ng QR

// 1) Humihingi ang PC ng bagong QR session
export async function POST() {
  const id = crypto.randomBytes(8).toString("hex");
  qrSessions.set(id, { status: "pending", expiresAt: Date.now() + TTL_MS });
  return NextResponse.json({ id, expiresIn: TTL_MS / 1000 });
}

// 2) Nagpo-poll ang PC: "na-scan na ba?"
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") ?? "";
  const s = qrSessions.get(id);

  if (!s || Date.now() > s.expiresAt) {
    qrSessions.delete(id);
    return NextResponse.json({ status: "expired" });
  }

  if (s.status === "approved") {
    qrSessions.delete(id); // isang beses lang magagamit
    const res = NextResponse.json({ status: "approved" });
    // Sa PC lang na gumawa ng QR ibinibigay ang login cookie
    res.cookies.set("nexus_auth", s.userId!, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  }

  return NextResponse.json({ status: "pending" });
}

// 3) Ini-scan ng phone ang QR gamit ang naka-login niyang session
export async function PUT(req: NextRequest) {
  const { sid, token } = await req.json();

  const s = qrSessions.get(sid);
  if (!s || Date.now() > s.expiresAt) {
    return NextResponse.json({ error: "QR expired" }, { status: 410 });
  }

  const userId = mobileTokens.get(token);
  if (!userId) {
    return NextResponse.json({ error: "Phone not logged in" }, { status: 401 });
  }

  s.status = "approved";
  s.userId = userId;
  return NextResponse.json({ ok: true });
}
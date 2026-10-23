import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { USERS, mobileTokens } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = USERS.find((u) => u.email === email && u.password === password);

  if (!user) {
    return NextResponse.json({ error: "Wrong email or password" }, { status: 401 });
  }

  const token = crypto.randomBytes(16).toString("hex");
  mobileTokens.set(token, user.id);
  return NextResponse.json({ token, name: user.name });
}
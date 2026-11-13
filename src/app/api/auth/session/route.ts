import { NextResponse, type NextRequest } from "next/server";
import { getRequestSessionUser } from "@/features/auth/server-session";

export async function GET(request: NextRequest) {
  const user = await getRequestSessionUser(request);
  return NextResponse.json({
    authenticated: Boolean(user),
    user: user ?? null,
  });
}

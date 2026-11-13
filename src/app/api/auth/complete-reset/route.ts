import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const client = await createSupabaseServerClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return NextResponse.json({ error: "Open a valid reset link first." }, { status: 401 });
  const input = z.object({ password: z.string().min(8).max(256) }).safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: "Use 8–256 characters." }, { status: 400 });
  const result = await client.auth.updateUser({ password: input.data.password });
  if (result.error) return NextResponse.json({ error: "Unable to change password. Request a new reset link." }, { status: 400 });
  await client.auth.signOut({ scope: "global" });
  return NextResponse.json({ ok: true });
}

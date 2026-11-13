import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRequestSessionUser } from "@/features/auth/server-session";
import { catalogSaveSchema } from "@/features/experiments/editor-schema";

export async function GET(request: NextRequest) {
 const user = await getRequestSessionUser(request);
 if (user?.role !== "admin" || user.isDemo) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
 const db = await createSupabaseServerClient();
 const { data, error } = await db.rpc("read_admin_catalog");
 return NextResponse.json(error ? { error: "Unable to load catalog. Refresh your sign-in if your role just changed." } : { experiments: data }, { status: error ? 503 : 200 });
}
export async function PUT(request: NextRequest) {
 const user = await getRequestSessionUser(request);
 if (user?.role !== "admin" || user.isDemo) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
 const input = catalogSaveSchema.safeParse(await request.json().catch(() => null));
 if (!input.success) return NextResponse.json({ error: input.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).slice(0,4).join("; ") }, { status: 400 });
 const db = await createSupabaseServerClient();
 const { data, error } = await db.rpc("save_admin_catalog", { p_data: input.data.experiment, p_status: input.data.status, p_expected: input.data.updatedAt });
 if (error) return NextResponse.json({ error: error.message.includes("Content changed") ? "Another editor changed this experiment. Reload before saving." : "Unable to save. Check your role, catalog limit, and question answers." }, { status: error.message.includes("Content changed") ? 409 : 400 });
 revalidateTag("experiment-catalog", { expire: 0 });
 return NextResponse.json({ ok: true, updatedAt: data });
}

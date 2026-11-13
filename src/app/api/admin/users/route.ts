import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRequestSessionUser } from "@/features/auth/server-session";
import { createSupabaseServerClient } from "@/lib/supabase/server";
export async function GET(request: NextRequest) {
 const user=await getRequestSessionUser(request);
 if(user?.role!=="admin" || user.isDemo) return NextResponse.json({error:"Administrator required."},{status:403});
 const db=await createSupabaseServerClient(); const {data,error}=await db.rpc("read_admin_users");
 return NextResponse.json(error?{error:"Unable to load accounts."}:{users:data},{status:error?503:200});
}
export async function PUT(request: NextRequest) {
 const user=await getRequestSessionUser(request);
 if(user?.role!=="admin" || user.isDemo) return NextResponse.json({error:"Administrator required."},{status:403});
 const input=z.object({id:z.uuid(),role:z.enum(["student","teacher","admin"])}).safeParse(await request.json().catch(()=>null));
 if(!input.success) return NextResponse.json({error:"Invalid role selection."},{status:400});
 const db=await createSupabaseServerClient(); const {error}=await db.rpc("set_admin_user_role",{p_user:input.data.id,p_role:input.data.role});
 return NextResponse.json(error?{error:"Only verified accounts can change roles. You cannot remove your own admin access."}:{ok:true},{status:error?400:200});
}

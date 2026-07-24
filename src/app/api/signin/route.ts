import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/server";
import { dailySignin } from "../signin-action";

export const dynamic = "force-dynamic";

/**
 * POST /api/signin
 * 每日签到（需登录）
 * Header: Authorization: Bearer <token>
 */
export async function POST(req: NextRequest) {
  try {
    // 1. 认证
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const supabase = await createServerSupabase();
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

    if (authErr || !user) {
      return NextResponse.json({ error: "登录已过期" }, { status: 401 });
    }

    // 2. 执行签到
    const result = await dailySignin(user.id);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/signin] error:", err);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

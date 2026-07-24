import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/server";
import { spendCoinsByToken } from "@/lib/coin-system";

export const dynamic = "force-dynamic";

/**
 * POST /api/spend-coins
 * 按 token 用量扣积分（核心计费接口）
 *
 * Body: {
 *   model: string,        // 模型 key，如 "claude-sonnet-4"
 *   input_tokens: number,
 *   output_tokens: number,
 *   description?: string  // 可选描述
 * }
 *
 * Header: Authorization: Bearer <token>
 */
export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json().catch(() => ({}));
    const modelKey = String(body.model || "").trim();
    const inputTokens = Math.max(0, Math.floor(Number(body.input_tokens) || 0));
    const outputTokens = Math.max(0, Math.floor(Number(body.output_tokens) || 0));

    if (!modelKey) {
      return NextResponse.json({ error: "model 必填" }, { status: 400 });
    }

    if (inputTokens === 0 && outputTokens === 0) {
      return NextResponse.json({ error: "input_tokens 和 output_tokens 不能同时为 0" }, { status: 400 });
    }

    const result = await spendCoinsByToken(
      user.id,
      modelKey,
      inputTokens,
      outputTokens,
      body.description
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/spend-coins] error:", err);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

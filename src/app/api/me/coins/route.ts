import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/server";
import { getUserBalance, getUserTransactions } from "@/lib/coin-system";

export const dynamic = "force-dynamic";

/**
 * GET /api/me/coins
 * 查询当前用户积分余额 + 最近流水
 * Header: Authorization: Bearer <token>
 */
export async function GET(req: NextRequest) {
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

    // 并行查余额 + 流水
    const [balance, transactions] = await Promise.all([
      getUserBalance(user.id),
      getUserTransactions(user.id, 20),
    ]);

    return NextResponse.json({
      user: { id: user.id, email: user.email },
      balance: balance?.balance ?? 0,
      totalEarned: balance?.total_earned ?? 0,
      totalSpent: balance?.total_spent ?? 0,
      lastSignin: balance?.last_signin ?? null,
      streak: balance?.signin_streak ?? 0,
      transactions: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        source: t.source,
        description: t.description,
        createdAt: t.created_at,
      })),
    });
  } catch (err) {
    console.error("[/api/me/coins] error:", err);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

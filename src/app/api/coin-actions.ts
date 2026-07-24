"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getConfig, getUserBalance } from "@/lib/coin-system";

/**
 * 用户注册/首次登录奖励积分
 * 在 auth.users 触发器或登录回调中调用
 * 幂等：已奖励过则跳过
 */
export async function grantSignupBonus(userId: string): Promise<{ success: boolean; amount: number; balanceAfter: number }> {
  const sb = supabaseAdmin();

  // 1. 查是否已奖励过
  const { data: existing } = await sb
    .from("coin_transactions")
    .select("id")
    .eq("user_id", userId)
    .eq("source", "signup_bonus")
    .maybeSingle();

  if (existing) {
    // 已奖励过，返回当前余额
    const balance = await getUserBalance(userId);
    return { success: true, amount: 0, balanceAfter: balance?.balance ?? 0 };
  }

  // 2. 读注册奖励配置
  const cfg = await getConfig("coin.signin_reward");
  const signupAmount = (cfg?.value as Record<string, number>)?.free ?? 100; // 默认注册送 100 无为币

  // 3. 查当前余额
  const current = await getUserBalance(userId);
  const newBalance = (current?.balance ?? 0) + signupAmount;

  // 4. 更新余额
  const { error: upsertErr } = await sb
    .from("user_coin_balance")
    .upsert({
      user_id: userId,
      balance: newBalance,
      total_earned: (current?.total_earned ?? 0) + signupAmount,
      total_spent: current?.total_spent ?? 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  if (upsertErr) throw new Error(`发放注册奖励失败: ${upsertErr.message}`);

  // 5. 写流水
  await sb.from("coin_transactions").insert({
    user_id: userId,
    type: "earn",
    amount: signupAmount,
    balance_after: newBalance,
    source: "signup_bonus",
    description: "新用户注册奖励",
    meta: { trigger: "signup" },
    created_at: new Date().toISOString(),
  });

  return { success: true, amount: signupAmount, balanceAfter: newBalance };
}

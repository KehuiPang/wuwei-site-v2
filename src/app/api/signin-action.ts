"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { getConfig, getUserBalance } from "@/lib/coin-system";

export interface SigninResult {
  success: boolean;
  amount: number;
  balanceAfter: number;
  streak: number;
  message: string;
}

/**
 * 每日签到送积分
 * 幂等：同一天已签到则返回已签状态
 */
export async function dailySignin(userId: string): Promise<SigninResult> {
  const sb = supabaseAdmin();
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // 1. 查用户余额记录
  const balance = await getUserBalance(userId);

  // 2. 检查今天是否已签到
  if (balance?.last_signin === today) {
    return {
      success: false,
      amount: 0,
      balanceAfter: balance.balance,
      streak: balance.signin_streak,
      message: "今日已签到，明天再来吧",
    };
  }

  // 3. 计算连续签到
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const isConsecutive = balance?.last_signin === yesterday;
  const newStreak = isConsecutive ? (balance?.signin_streak ?? 0) + 1 : 1;

  // 4. 读签到奖励配置
  const cfg = await getConfig("coin.signin_reward");
  const rewardConfig = cfg?.value as { free?: number; pro?: number; pro_annual?: number } | undefined;

  // 基础奖励（免费用户）
  let baseReward = rewardConfig?.free ?? 10;

  // 连续签到加成：每满 7 天额外 +50%
  const streakBonus = newStreak > 0 && newStreak % 7 === 0 ? Math.ceil(baseReward * 0.5) : 0;
  const totalReward = baseReward + streakBonus;

  // 5. 更新余额 + 签到记录
  const currentBalance = balance?.balance ?? 0;
  const newBalance = currentBalance + totalReward;

  const { error: upsertErr } = await sb
    .from("user_coin_balance")
    .upsert({
      user_id: userId,
      balance: newBalance,
      total_earned: (balance?.total_earned ?? 0) + totalReward,
      total_spent: balance?.total_spent ?? 0,
      last_signin: today,
      signin_streak: newStreak,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

  if (upsertErr) throw new Error(`签到失败: ${upsertErr.message}`);

  // 6. 写流水
  await sb.from("coin_transactions").insert({
    user_id: userId,
    type: "earn",
    amount: totalReward,
    balance_after: newBalance,
    source: "signin",
    description: streakBonus > 0 ? `连续签到 ${newStreak} 天奖励（含加成）` : `每日签到奖励`,
    meta: { streak: newStreak, base: baseReward, bonus: streakBonus },
    created_at: new Date().toISOString(),
  });

  return {
    success: true,
    amount: totalReward,
    balanceAfter: newBalance,
    streak: newStreak,
    message: streakBonus > 0
      ? `🎉 连续签到 ${newStreak} 天！获得 ${totalReward} 无为币（含 ${streakBonus} 加成）`
      : `签到成功！获得 ${totalReward} 无为币`,
  };
}

"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  getAllConfigs,
  getConfigsByCategory,
  updateConfig,
  getUserBalance,
  getUserTransactions,
  adjustUserBalance,
  getOperationLogs,
  getDailyCoinStats,
  getCoinBySource,
  getUserCoinRank,
  updatePricing,
  getAllPricing,
  type ConfigCategory,
} from "@/lib/coin-system";
import { getAdmin } from "@/lib/supabase-server";

// ============================================================
// 权限校验辅助
// ============================================================

async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) {
    throw new Error("未登录或无权限访问");
  }
  return admin;
}

// ============================================================
// 1. 配置管理 Actions
// ============================================================

/** 读取所有配置 */
export async function getConfigsAction() {
  await requireAdmin();
  return getAllConfigs();
}

/** 按分类读取配置 */
export async function getConfigsByCategoryAction(category: ConfigCategory) {
  await requireAdmin();
  return getConfigsByCategory(category);
}

/** 更新单个配置 */
export async function updateConfigAction(formData: FormData) {
  const admin = await requireAdmin();
  const key = String(formData.get("key") ?? "");
  const valueJson = String(formData.get("value") ?? "{}");

  if (!key) throw new Error("配置键不能为空");

  let value: Record<string, unknown>;
  try {
    value = JSON.parse(valueJson);
  } catch {
    throw new Error("配置值 JSON 格式无效");
  }

  await updateConfig(key, value, admin.email);
  revalidatePath("/admin/operations", "page");
  return { ok: true, key };
}

// ============================================================
// 2. 用户积分管理 Actions
// ============================================================

/** 查询用户余额 */
export async function getUserBalanceAction(userId: string) {
  await requireAdmin();
  return getUserBalance(userId);
}

/** 查询用户流水 */
export async function getUserTransactionsAction(userId: string, limit = 50, offset = 0) {
  await requireAdmin();
  return getUserTransactions(userId, limit, offset);
}

/** 手动调整积分 */
export async function adjustBalanceAction(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  const reason = String(formData.get("reason") ?? "");

  if (!userId) throw new Error("用户 ID 不能为空");
  if (amount === 0) throw new Error("调整金额不能为 0");
  if (!reason) throw new Error("调整原因不能为空");

  const newBalance = await adjustUserBalance(userId, amount, reason, admin.email);
  revalidatePath("/admin/operations", "page");
  return { ok: true, userId, newBalance };
}

// ============================================================
// 3. 操作日志 Actions
// ============================================================

/** 查询操作日志 */
export async function getOperationLogsAction(limit = 100, offset = 0) {
  await requireAdmin();
  return getOperationLogs(limit, offset);
}

// ============================================================
// 4. 数据看板 Actions
// ============================================================

/** 每日积分统计 */
export async function getDailyStatsAction(days = 30) {
  await requireAdmin();
  return getDailyCoinStats(days);
}

/** 按来源统计 */
export async function getSourceStatsAction() {
  await requireAdmin();
  return getCoinBySource();
}

/** 用户积分排行 */
export async function getUserRankAction(limit = 100) {
  await requireAdmin();
  return getUserCoinRank(limit);
}

// ============================================================
// 5. 定价管理 Actions
// ============================================================

/** 读取所有定价 */
export async function getAllPricingAction() {
  await requireAdmin();
  return getAllPricing();
}

/** 更新定价 */
export async function updatePricingAction(formData: FormData) {
  const admin = await requireAdmin();
  const region = String(formData.get("region") ?? "") as "cn" | "global";
  const planKey = String(formData.get("planKey") ?? "");
  const price = Number(formData.get("price") ?? 0);
  const originalPrice = formData.get("originalPrice")
    ? Number(formData.get("originalPrice"))
    : null;
  const badge = String(formData.get("badge") ?? "");
  const isActive = formData.get("isActive") === "on";

  if (!region || !planKey) throw new Error("地区和套餐不能为空");

  const updates: Record<string, unknown> = {
    price,
    original_price: originalPrice,
    badge: badge || null,
    is_active: isActive,
  };

  await updatePricing(region, planKey, updates, admin.email);
  revalidatePath("/admin/operations", "page");
  return { ok: true, region, planKey };
}

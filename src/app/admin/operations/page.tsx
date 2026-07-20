import { notFound } from "next/navigation";
import { getAdmin } from "@/lib/supabase-server";
import {
  getConfigsAction,
  getAllPricingAction,
  getDailyStatsAction,
  getSourceStatsAction,
  getUserRankAction,
  getOperationLogsAction,
} from "./actions";
import { ConfigPanel } from "./components/ConfigPanel";
import { PricingPanel } from "./components/PricingPanel";
import { UsersPanel } from "./components/UsersPanel";
import { DashboardPanel } from "./components/DashboardPanel";
import { LogsPanel } from "./components/LogsPanel";
import type { OperationConfig } from "@/lib/coin-system";
import type { Plan } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "后台 · 运营配置",
  robots: { index: false, follow: false },
};

const TABS = [
  { id: "config", label: "积分配置", icon: "🪙" },
  { id: "pricing", label: "定价管理", icon: "💰" },
  { id: "users", label: "用户积分", icon: "👤" },
  { id: "dashboard", label: "数据看板", icon: "📊" },
  { id: "logs", label: "操作日志", icon: "📝" },
];

export default async function OperationsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string; tab?: string; ok?: string; err?: string }>;
}) {
  const sp = await searchParams;
  const key = typeof sp.key === "string" ? sp.key : "";
  const activeTab = sp.tab || "config";

  // —— 权限校验：必须是已登录的管理员 ——
  const admin = await getAdmin();
  if (!admin) {
    notFound();
  }

  // 并行拉取数据
  const [configs, pricing, dailyStats, sourceStats, userRank, logs] = await Promise.all([
    getConfigsAction().catch(() => []),
    getAllPricingAction().catch(() => []),
    getDailyStatsAction(30).catch(() => []),
    getSourceStatsAction().catch(() => []),
    getUserRankAction(50).catch(() => []),
    getOperationLogsAction(50).catch(() => []),
  ]);

  // 配置按分类分组
  const configsByCategory: Record<string, OperationConfig[]> = configs.reduce((acc, cfg) => {
    const cat = cfg.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(cfg);
    return acc;
  }, {} as Record<string, OperationConfig[]>);

  // 定价按地区分组
  const pricingByRegion: Record<string, Plan[]> = pricing.reduce((acc, plan) => {
    if (!acc[plan.region]) acc[plan.region] = [];
    acc[plan.region].push(plan);
    return acc;
  }, {} as Record<string, Plan[]>);

  return (
    <div style={pageWrap}>
      {/* 顶部导航 */}
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🎛️</span>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
              无为 · 运营配置中心
            </h1>
            <p style={{ fontSize: 13, color: "var(--color-dim)", margin: "4px 0 0" }}>
              管理员：{admin.email} · {admin.role === "admin" ? "超级管理员" : "查看者"}
            </p>
          </div>
        </div>
        <a
          href={`/admin?key=${encodeURIComponent(key)}`}
          style={backLinkStyle}
        >
          ← 返回主题控制
        </a>
      </header>

      {/* Tab 导航 */}
      <nav style={tabNavStyle}>
        {TABS.map((tab) => (
          <a
            key={tab.id}
            href={`/admin/operations?key=${encodeURIComponent(key)}&tab=${tab.id}`}
            style={{
              ...tabStyle,
              ...(activeTab === tab.id ? activeTabStyle : {}),
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </a>
        ))}
      </nav>

      {/* 消息提示 */}
      {sp.ok ? (
        <div style={successBanner}>✅ 操作成功：{sp.ok}</div>
      ) : null}
      {sp.err ? (
        <div style={errorBanner}>⚠️ 错误：{sp.err}</div>
      ) : null}

      {/* 内容区 */}
      <div style={{ marginTop: 24 }}>
        {activeTab === "config" && (
          <ConfigPanel configsByCategory={configsByCategory} adminKey={key} />
        )}
        {activeTab === "pricing" && (
          <PricingPanel pricingByRegion={pricingByRegion} adminKey={key} />
        )}
        {activeTab === "users" && (
          <UsersPanel userRank={userRank} adminKey={key} />
        )}
        {activeTab === "dashboard" && (
          <DashboardPanel
            dailyStats={dailyStats}
            sourceStats={sourceStats}
            userRank={userRank}
          />
        )}
        {activeTab === "logs" && <LogsPanel logs={logs} />}
      </div>
    </div>
  );
}

// ============================================================
// 样式
// ============================================================

const pageWrap: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "32px 24px 64px",
  fontFamily: "var(--font-sans)",
  color: "var(--color-ink)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24,
  paddingBottom: 16,
  borderBottom: "1px solid var(--color-border)",
};

const backLinkStyle: React.CSSProperties = {
  fontSize: 14,
  color: "var(--color-water)",
  textDecoration: "none",
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid var(--color-border)",
};

const tabNavStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  borderBottom: "1px solid var(--color-border)",
  paddingBottom: 1,
};

const tabStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 500,
  color: "var(--color-dim)",
  textDecoration: "none",
  borderRadius: "8px 8px 0 0",
  border: "1px solid transparent",
  borderBottom: "none",
};

const activeTabStyle: React.CSSProperties = {
  color: "var(--color-ink)",
  background: "var(--color-surface)",
  borderColor: "var(--color-border)",
  borderBottom: "1px solid var(--color-surface)",
  marginBottom: -1,
  fontWeight: 600,
};

const successBanner: React.CSSProperties = {
  marginTop: 16,
  padding: "12px 16px",
  borderRadius: 8,
  background: "#E8F5E9",
  color: "#5C8A73",
  fontSize: 14,
};

const errorBanner: React.CSSProperties = {
  marginTop: 16,
  padding: "12px 16px",
  borderRadius: 8,
  background: "#FFEBEE",
  color: "#B4483A",
  fontSize: 14,
};

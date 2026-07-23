import { notFound, redirect } from "next/navigation";
import { getDashboard } from "@/lib/analytics";
import { getAdmin } from "@/lib/supabase-server";

// 后台统计看板：访问/下载/激活/登录 数据汇总
export const dynamic = "force-dynamic";

export const metadata = {
  title: "后台 · 访问统计",
  robots: { index: false, follow: false },
};

export default async function AnalyticsPage() {
  // 服务端鉴权（fail-closed）：未登录 → 跳登录页；登录但不在 admin_users 白名单 → 404
  const admin = await getAdmin();
  if (!admin) {
    // 区分未登录 vs 非白名单：未登录跳登录页，非白名单 404（不暴露后台存在）
    const { supabaseServer } = await import("@/lib/supabase-server");
    const sb = await supabaseServer();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) redirect("/admin/login");
    notFound();
  }

  let dashboard;
  try {
    dashboard = await getDashboard(30);
  } catch {
    dashboard = null;
  }

  if (!dashboard) {
    return (
      <main style={wrap}>
        <h1>后台 · 访问统计</h1>
        <p style={{ color: "var(--color-dim)" }}>
          数据加载失败。请确认 Supabase 连接和 v_daily_stats 视图已创建。
        </p>
      </main>
    );
  }

  const { totals, daily, loginsByDay, topReferers, topCountries, topLanding, clientVersions } = dashboard;

  return (
    <main style={wrap}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
        后台 · 访问统计
      </h1>
      <p style={{ color: "var(--color-dim)", fontSize: 14, marginBottom: 24 }}>
        近 {dashboard.windowDays} 天数据汇总 · 实时更新
      </p>

      {/* 汇总卡片 */}
      <div style={cards}>
        <StatCard title="页面访问(PV)" value={totals.pv.toLocaleString()} icon="👁️" />
        <StatCard title="独立访客(UV)" value={totals.uv.toLocaleString()} icon="👤" />
        <StatCard title="下载次数" value={totals.downloads.toLocaleString()} icon="⬇️" />
        <StatCard title="客户端登录" value={totals.logins.toLocaleString()} icon="🔑" />
      </div>

      {/* 每日趋势 */}
      <div style={card}>
        <div style={cardHeader}>📈 每日访问/下载趋势</div>
        {daily.length === 0 ? (
          <Empty />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>日期</th>
                  <th style={th}>PV</th>
                  <th style={th}>UV</th>
                  <th style={th}>下载</th>
                </tr>
              </thead>
              <tbody>
                {daily.map((d) => (
                  <tr key={d.day}>
                    <td style={td}>{d.day}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{d.pv.toLocaleString()}</td>
                    <td style={td}>{d.uv.toLocaleString()}</td>
                    <td style={{ ...td, color: "var(--color-spark)", fontWeight: 600 }}>
                      {d.downloads.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 客户端登录趋势 */}
      {loginsByDay.length > 0 && (
        <div style={card}>
          <div style={cardHeader}>🔑 客户端登录趋势</div>
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>日期</th>
                  <th style={th}>登录次数</th>
                </tr>
              </thead>
              <tbody>
                {loginsByDay.map((d) => (
                  <tr key={d.key}>
                    <td style={td}>{d.key}</td>
                    <td style={{ ...td, fontWeight: 600, color: "var(--color-bamboo)" }}>
                      {d.count.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 来源分布 */}
      {topReferers.length > 0 && (
        <div style={card}>
          <div style={cardHeader}>🔗 来源分布 Top 8</div>
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>来源</th>
                  <th style={th}>次数</th>
                </tr>
              </thead>
              <tbody>
                {topReferers.map((r) => (
                  <tr key={r.key}>
                    <td style={td}>{r.key}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{r.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 国家分布 */}
      {topCountries.length > 0 && (
        <div style={card}>
          <div style={cardHeader}>🌍 国家/地区分布 Top 8</div>
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>国家/地区</th>
                  <th style={th}>访问次数</th>
                </tr>
              </thead>
              <tbody>
                {topCountries.map((c) => (
                  <tr key={c.key}>
                    <td style={td}>{c.key}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{c.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 落地页分布 */}
      {topLanding.length > 0 && (
        <div style={card}>
          <div style={cardHeader}>📄 落地页分布 Top 8</div>
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>页面</th>
                  <th style={th}>访问次数</th>
                </tr>
              </thead>
              <tbody>
                {topLanding.map((l) => (
                  <tr key={l.key}>
                    <td style={td}>{l.key}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{l.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 客户端版本分布 */}
      {clientVersions.length > 0 && (
        <div style={card}>
          <div style={cardHeader}>📦 客户端版本分布</div>
          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>版本</th>
                  <th style={th}>登录次数</th>
                </tr>
              </thead>
              <tbody>
                {clientVersions.map((v) => (
                  <tr key={v.key}>
                    <td style={td}>{v.key}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{v.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div style={statCard}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "var(--color-ink)" }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--color-mute)", marginTop: 8 }}>{title}</div>
    </div>
  );
}

function Empty() {
  return (
    <div style={{ textAlign: "center", padding: 40, color: "var(--color-mute)" }}>
      暂无数据
    </div>
  );
}

// ============================================================
// 样式
// ============================================================

const wrap: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "32px 24px 64px",
  fontFamily: "var(--font-sans)",
  color: "var(--color-ink)",
};

const cards: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginBottom: 24,
};

const card: React.CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  padding: 20,
  marginBottom: 16,
};

const cardHeader: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  marginBottom: 16,
  paddingBottom: 12,
  borderBottom: "1px solid var(--color-border)",
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const th: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: 12,
  color: "var(--color-dim)",
  borderBottom: "1px solid var(--color-border)",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid var(--color-border)",
  verticalAlign: "top",
};

const statCard: React.CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  padding: 20,
  textAlign: "center",
};

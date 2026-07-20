import { notFound } from "next/navigation";
import { getSiteTheme } from "@/lib/site-config";
import { updateThemeAction } from "./actions";

// 后台主题控制台。始终动态渲染（读 ?key= 做访问校验 + 读当前主题）。
export const dynamic = "force-dynamic";

export const metadata = {
  title: "后台 · 主题控制",
  robots: { index: false, follow: false }, // 后台不进搜索引擎
};

type SP = { key?: string; ok?: string; err?: string };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const key = typeof sp.key === "string" ? sp.key : "";

  // —— 最简访问保护：?key= 必须等于 server-only 的 ADMIN_ACCESS_KEY，否则当作不存在 ——
  const expected = process.env.ADMIN_ACCESS_KEY ?? "";
  if (!expected || key !== expected) {
    notFound();
  }

  const theme = await getSiteTheme();
  const isDark = theme === "dark";

  const wrap: React.CSSProperties = {
    maxWidth: 520,
    margin: "0 auto",
    padding: "56px 24px",
    fontFamily: "var(--font-sans)",
    color: "var(--color-ink)",
  };
  const card: React.CSSProperties = {
    border: "1px solid var(--color-border)",
    background: "var(--color-surface)",
    borderRadius: 16,
    padding: 28,
  };
  const btnBase: React.CSSProperties = {
    flex: 1,
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid var(--color-border-strong)",
  };

  return (
    <main style={wrap}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
        无为 · 后台主题控制
      </h1>
      <p style={{ color: "var(--color-dim)", fontSize: 14, marginBottom: 24 }}>
        一键切换前台官网的深色 / 亮色外观。约 60s 内整站生效。
      </p>

      <div style={card}>
        <div style={{ fontSize: 15, marginBottom: 20 }}>
          当前主题：
          <strong style={{ color: "var(--color-water)" }}>
            {isDark ? "深色" : "亮色"}
          </strong>
        </div>

        {sp.ok ? (
          <p
            style={{
              color: "var(--color-success)",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            ✅ 已切换为{sp.ok === "dark" ? "深色" : "亮色"}（前台约 60s 内生效）
          </p>
        ) : null}
        {sp.err === "bad" ? (
          <p
            style={{ color: "var(--color-error)", fontSize: 13, marginBottom: 16 }}
          >
            ⚠️ 主题参数无效
          </p>
        ) : null}

        <form action={updateThemeAction} style={{ display: "flex", gap: 12 }}>
          {/* key 随表单回传，Server Action 会再次校验 */}
          <input type="hidden" name="key" value={key} />
          <button
            type="submit"
            name="theme"
            value="dark"
            disabled={isDark}
            style={{
              ...btnBase,
              background: isDark ? "var(--color-bg-soft)" : "var(--color-ink)",
              color: isDark ? "var(--color-mute)" : "#F4F6F8",
              cursor: isDark ? "not-allowed" : "pointer",
            }}
          >
            切深色
          </button>
          <button
            type="submit"
            name="theme"
            value="light"
            disabled={!isDark}
            style={{
              ...btnBase,
              background: !isDark ? "var(--color-bg-soft)" : "var(--color-paper)",
              color: !isDark ? "var(--color-mute)" : "var(--color-ink)",
              cursor: !isDark ? "not-allowed" : "pointer",
            }}
          >
            切亮色
          </button>
        </form>
      </div>

      <div style={card}>
        <div style={{ fontSize: 15, marginBottom: 20 }}>
          快捷入口
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a
            href={`/admin/operations?key=${encodeURIComponent(key)}`}
            style={{
              ...btnBase,
              background: "var(--color-water)",
              color: "#F4F6F8",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            🎛️ 运营配置
          </a>
          <a
            href={`/admin/analytics?key=${encodeURIComponent(key)}`}
            style={{
              ...btnBase,
              background: "var(--color-bamboo)",
              color: "#F4F6F8",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            📊 访问统计
          </a>
        </div>
      </div>

      <p style={{ color: "var(--color-mute)", fontSize: 12, marginTop: 20 }}>
        访问受 ADMIN_ACCESS_KEY 保护，请勿分享带 key 的链接。
      </p>
    </main>
  );
}

"use client";

import { useState } from "react";
import { adjustBalanceAction } from "../actions";

interface UserBalance {
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  last_signin: string | null;
  signin_streak: number;
  created_at: string;
  updated_at: string;
}

export function UsersPanel({
  userRank,
  adminKey,
}: {
  userRank: UserBalance[];
  adminKey: string;
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAdjust(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    try {
      const result = await adjustBalanceAction(formData);
      if (result.ok) {
        setMessage(`✅ 已调整，新余额：${result.newBalance} 无为币`);
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setMessage(`❌ ${err instanceof Error ? err.message : "操作失败"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 style={sectionTitle}>用户积分管理</h2>
      <p style={sectionDesc}>查看用户积分余额、手动调整积分（补偿/活动奖励）。</p>

      {/* 手动调整积分 */}
      <div style={categoryCard}>
        <div style={categoryHeader}>
          <span>⚡ 手动调整积分</span>
        </div>
        <form
          onSubmit={handleAdjust}
          style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}
        >
          <div style={{ flex: 2, minWidth: 200 }}>
            <label style={labelStyle}>用户 ID</label>
            <input
              type="text"
              name="userId"
              placeholder="输入用户 UUID"
              required
              style={inputStyle}
            />
          </div>
          <div style={{ width: 120 }}>
            <label style={labelStyle}>调整金额</label>
            <input
              type="number"
              name="amount"
              placeholder="+100 或 -50"
              required
              style={inputStyle}
            />
          </div>
          <div style={{ flex: 2, minWidth: 200 }}>
            <label style={labelStyle}>原因</label>
            <input
              type="text"
              name="reason"
              placeholder="如：活动奖励、补偿"
              required
              style={inputStyle}
            />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {message && (
                <span
                  style={{
                    fontSize: 13,
                    color: message.startsWith("✅")
                      ? "var(--color-bamboo)"
                      : "var(--color-error)",
                  }}
                >
                  {message}
                </span>
              )}
              <button
                type="submit"
                disabled={saving}
                style={{
                  ...saveBtn,
                  opacity: saving ? 0.6 : 1,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "⚡ 执行中..." : "⚡ 执行调整"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 用户积分排行 */}
      <div style={categoryCard}>
        <div style={categoryHeader}>
          <span>🏆 积分排行（Top 50）</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>排名</th>
                <th style={thStyle}>用户 ID</th>
                <th style={thStyle}>当前余额</th>
                <th style={thStyle}>累计获得</th>
                <th style={thStyle}>累计消耗</th>
                <th style={thStyle}>最后更新</th>
              </tr>
            </thead>
            <tbody>
              {userRank.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      padding: 40,
                      color: "var(--color-mute)",
                    }}
                  >
                    暂无数据
                  </td>
                </tr>
              ) : (
                userRank.map((user, i) => (
                  <tr key={user.user_id}>
                    <td style={tdStyle}>#{i + 1}</td>
                    <td
                      style={{
                        ...tdStyle,
                        fontFamily: "monospace",
                        fontSize: 12,
                      }}
                    >
                      {user.user_id.slice(0, 8)}...{user.user_id.slice(-4)}
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: 600,
                        color: "var(--color-bamboo)",
                      }}
                    >
                      {user.balance.toLocaleString()}
                    </td>
                    <td style={tdStyle}>{user.total_earned.toLocaleString()}</td>
                    <td style={tdStyle}>{user.total_spent.toLocaleString()}</td>
                    <td
                      style={{
                        ...tdStyle,
                        fontSize: 12,
                        color: "var(--color-dim)",
                      }}
                    >
                      {user.updated_at
                        ? new Date(user.updated_at).toLocaleString("zh-CN")
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 700,
  margin: "0 0 8px",
};

const sectionDesc: React.CSSProperties = {
  fontSize: 13,
  color: "var(--color-dim)",
  margin: "0 0 20px",
};

const categoryCard: React.CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  padding: 20,
  marginBottom: 16,
};

const categoryHeader: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 15,
  fontWeight: 600,
  marginBottom: 16,
  paddingBottom: 12,
  borderBottom: "1px solid var(--color-border)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--color-dim)",
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid var(--color-border-strong)",
  borderRadius: 6,
  fontSize: 14,
  background: "var(--color-surface)",
  color: "var(--color-ink)",
};

const saveBtn: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 6,
  border: "none",
  background: "var(--color-ink)",
  color: "var(--color-paper)",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 13,
};

const thStyle: React.CSSProperties = {
  padding: "10px 12px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: 12,
  color: "var(--color-dim)",
  borderBottom: "1px solid var(--color-border)",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid var(--color-border)",
  verticalAlign: "top",
};

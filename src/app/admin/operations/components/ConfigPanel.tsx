"use client";

import { useState } from "react";
import { updateConfigAction } from "../actions";

const CATEGORY_LABELS: Record<string, string> = {
  coin: "积分配置",
  pricing: "定价配置",
  model: "模型消耗",
  promotion: "促销配置",
  general: "通用配置",
};

const CATEGORY_ICONS: Record<string, string> = {
  coin: "🪙",
  pricing: "💰",
  model: "🤖",
  promotion: "🎁",
  general: "⚙️",
};

interface Config {
  key: string;
  value: Record<string, unknown>;
  category: string;
  label: string;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

export function ConfigPanel({
  configsByCategory,
  adminKey,
}: {
  configsByCategory: Record<string, Config[]>;
  adminKey: string;
}) {
  const categories = Object.keys(configsByCategory).sort();
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, key: string) {
    e.preventDefault();
    setSaving((p) => ({ ...p, [key]: true }));
    setMessages((p) => ({ ...p, [key]: "" }));

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await updateConfigAction(formData);
      if (result.ok) {
        setMessages((p) => ({ ...p, [key]: "✅ 已保存" }));
      }
    } catch (err) {
      setMessages((p) => ({
        ...p,
        [key]: `❌ ${err instanceof Error ? err.message : "保存失败"}`,
      }));
    } finally {
      setSaving((p) => ({ ...p, [key]: false }));
    }
  }

  return (
    <div>
      <h2 style={sectionTitle}>积分 & 运营配置</h2>
      <p style={sectionDesc}>
        调整积分参数、模型消耗比例、促销策略。修改后实时生效，无需重启。
      </p>

      {categories.map((cat) => (
        <div key={cat} style={categoryCard}>
          <div style={categoryHeader}>
            <span style={{ fontSize: 20 }}>{CATEGORY_ICONS[cat] || "⚙️"}</span>
            <span style={{ fontWeight: 600, fontSize: 16 }}>
              {CATEGORY_LABELS[cat] || cat}
            </span>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {configsByCategory[cat].map((cfg) => {
              const valueStr = JSON.stringify(cfg.value, null, 2);
              return (
                <form
                  key={cfg.key}
                  onSubmit={(e) => handleSubmit(e, cfg.key)}
                  style={configItemStyle}
                >
                  <input type="hidden" name="key" value={cfg.key} />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{cfg.label}</div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--color-dim)",
                          marginTop: 2,
                        }}
                      >
                        {cfg.description}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--color-mute)",
                          marginTop: 4,
                          fontFamily: "monospace",
                        }}
                      >
                        {cfg.key}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--color-mute)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {cfg.updated_at
                        ? new Date(cfg.updated_at).toLocaleString("zh-CN")
                        : "未修改"}
                      {cfg.updated_by ? ` · ${cfg.updated_by}` : ""}
                    </div>
                  </div>

                  <textarea
                    name="value"
                    defaultValue={valueStr}
                    style={textareaStyle}
                    rows={Math.min(8, valueStr.split("\n").length + 1)}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 12,
                      marginTop: 8,
                    }}
                  >
                    {messages[cfg.key] && (
                      <span
                        style={{
                          fontSize: 13,
                          color: messages[cfg.key].startsWith("✅")
                            ? "var(--color-bamboo)"
                            : "var(--color-error)",
                        }}
                      >
                        {messages[cfg.key]}
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={saving[cfg.key]}
                      style={{
                        ...saveBtn,
                        opacity: saving[cfg.key] ? 0.6 : 1,
                        cursor: saving[cfg.key] ? "not-allowed" : "pointer",
                      }}
                    >
                      {saving[cfg.key] ? "💾 保存中..." : "💾 保存修改"}
                    </button>
                  </div>
                </form>
              );
            })}
          </div>
        </div>
      ))}
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

const configItemStyle: React.CSSProperties = {
  background: "var(--color-field)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  padding: 16,
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 12,
  padding: 10,
  border: "1px solid var(--color-border-strong)",
  borderRadius: 6,
  fontFamily: "monospace",
  fontSize: 12,
  background: "var(--color-surface)",
  color: "var(--color-ink)",
  resize: "vertical",
  minHeight: 60,
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

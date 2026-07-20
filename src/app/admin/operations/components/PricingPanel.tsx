"use client";

import { useState } from "react";
import { updatePricingAction } from "../actions";

interface Plan {
  plan_key: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  original_price: number | null;
  badge: string | null;
  features: string[];
  sort_order: number;
  is_active: boolean;
  region: string;
}

export function PricingPanel({
  pricingByRegion,
  adminKey,
}: {
  pricingByRegion: Record<string, Plan[]>;
  adminKey: string;
}) {
  const regionLabels: Record<string, string> = {
    cn: "🇨🇳 国内定价",
    global: "🌍 海外定价",
  };

  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setSaving((p) => ({ ...p, [id]: true }));
    setMessages((p) => ({ ...p, [id]: "" }));

    const formData = new FormData(e.currentTarget);
    try {
      const result = await updatePricingAction(formData);
      if (result.ok) {
        setMessages((p) => ({ ...p, [id]: "✅ 已保存" }));
      }
    } catch (err) {
      setMessages((p) => ({
        ...p,
        [id]: `❌ ${err instanceof Error ? err.message : "保存失败"}`,
      }));
    } finally {
      setSaving((p) => ({ ...p, [id]: false }));
    }
  }

  return (
    <div>
      <h2 style={sectionTitle}>定价管理</h2>
      <p style={sectionDesc}>调整国内/海外各档位定价。修改后前台实时生效。</p>

      {Object.entries(pricingByRegion).map(([region, plans]) => (
        <div key={region} style={categoryCard}>
          <div style={categoryHeader}>
            <span>{regionLabels[region] || region}</span>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {plans.map((plan) => {
              const id = `${region}.${plan.plan_key}`;
              return (
                <form
                  key={id}
                  onSubmit={(e) => handleSubmit(e, id)}
                  style={configItemStyle}
                >
                  <input type="hidden" name="region" value={region} />
                  <input type="hidden" name="planKey" value={plan.plan_key} />

                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                      alignItems: "flex-end",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 120 }}>
                      <label style={labelStyle}>套餐</label>
                      <div style={{ fontWeight: 600 }}>{plan.name}</div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--color-mute)",
                        }}
                      >
                        {plan.plan_key}
                      </div>
                    </div>

                    <div style={{ width: 100 }}>
                      <label style={labelStyle}>价格</label>
                      <input
                        type="number"
                        name="price"
                        defaultValue={plan.price}
                        min={0}
                        step={plan.currency === "CNY" ? 1 : 0.01}
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ width: 80 }}>
                      <label style={labelStyle}>货币</label>
                      <div style={{ padding: "8px 0", fontSize: 14 }}>
                        {plan.currency}
                      </div>
                    </div>

                    <div style={{ width: 100 }}>
                      <label style={labelStyle}>原价</label>
                      <input
                        type="number"
                        name="originalPrice"
                        defaultValue={plan.original_price ?? ""}
                        placeholder="无"
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ width: 120 }}>
                      <label style={labelStyle}>徽章</label>
                      <input
                        type="text"
                        name="badge"
                        defaultValue={plan.badge ?? ""}
                        placeholder="如：早鸟价"
                        style={inputStyle}
                      />
                    </div>

                    <div style={{ width: 80 }}>
                      <label style={labelStyle}>状态</label>
                      <div>
                        <input
                          type="checkbox"
                          name="isActive"
                          defaultChecked={plan.is_active}
                          style={{ width: 18, height: 18 }}
                        />{" "}
                        上架
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {messages[id] && (
                          <span
                            style={{
                              fontSize: 12,
                              color: messages[id].startsWith("✅")
                                ? "var(--color-bamboo)"
                                : "var(--color-error)",
                            }}
                          >
                            {messages[id]}
                          </span>
                        )}
                        <button
                          type="submit"
                          disabled={saving[id]}
                          style={{
                            ...saveBtn,
                            opacity: saving[id] ? 0.6 : 1,
                            cursor: saving[id] ? "not-allowed" : "pointer",
                          }}
                        >
                          {saving[id] ? "💾 保存中..." : "💾 保存"}
                        </button>
                      </div>
                    </div>
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

"use client";

import { useState } from "react";
import type { VisitorRow } from "@/lib/analytics";

type Tag = "self" | "bot" | "real";

const TAG_META: Record<Tag, { label: string; bg: string; fg: string }> = {
  self: { label: "本人/测试", bg: "rgba(122,133,144,.25)", fg: "#9AA5B1" },
  bot: { label: "爬虫/机器人", bg: "rgba(192,95,60,.22)", fg: "#E08A6A" },
  real: { label: "真实用户", bg: "rgba(92,138,115,.25)", fg: "#7FB89E" },
};

function fmtTime(iso: string): string {
  return iso.slice(0, 16).replace("T", " ");
}

export function IpVisitorTable({ rows: initialRows }: { rows: VisitorRow[] }) {
  const [rows, setRows] = useState<VisitorRow[]>(initialRows);
  // 当前打开下拉菜单的 row index
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  // 正在提交的 ip（防重复点击）
  const [pendingIp, setPendingIp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function applyTag(ip: string, tag: Tag | null) {
    setPendingIp(ip);
    setError(null);
    try {
      const res = await fetch("/admin/api/ip-tags", {
        method: tag ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tag ? { ip_address: ip, tag } : { ip_address: ip }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      // 本地状态更新：该 IP 的所有行同步刷新
      setRows((prev) =>
        prev.map((r) => (r.ip_address === ip ? { ...r, tag } : r))
      );
      setOpenIdx(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "操作失败");
    } finally {
      setPendingIp(null);
    }
  }

  if (rows.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--adm-dim)", fontSize: 13 }}>
        <div style={{ fontSize: 24, marginBottom: 8, opacity: 0.4 }}>🔍</div>
        <div>暂无 IP 访问记录</div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      {error && (
        <div style={{ color: "#E08A6A", fontSize: 12, marginBottom: 8 }}>
          ⚠️ {error}
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              {["IP 地址", "标签", "UA", "国家", "路径", "最近时间", ""].map((h, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: "left",
                    padding: "8px 10px",
                    color: "var(--adm-dim)",
                    fontWeight: 500,
                    borderBottom: "1px solid var(--adm-border)",
                    whiteSpace: "nowrap",
                    fontSize: 12,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const tag = (r.tag as Tag | null) ?? null;
              const meta = tag ? TAG_META[tag] : null;
              return (
                <tr key={idx} style={{ borderBottom: "1px solid var(--adm-border)" }}>
                  <td style={{ padding: "8px 10px", fontFamily: "ui-monospace, monospace", whiteSpace: "nowrap" }}>
                    {r.ip_address ?? "—"}
                  </td>
                  <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>
                    {meta ? (
                      <span
                        title={r.tag_note ?? undefined}
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: 12,
                          background: meta.bg,
                          color: meta.fg,
                        }}
                      >
                        {meta.label}
                      </span>
                    ) : (
                      <span style={{ color: "var(--adm-dim)", fontSize: 12 }}>未标记</span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "8px 10px",
                      color: "var(--adm-dim)",
                      maxWidth: 260,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={r.ua ?? undefined}
                  >
                    {r.ua ? r.ua.slice(0, 50) : "—"}
                  </td>
                  <td style={{ padding: "8px 10px", whiteSpace: "nowrap" }}>{r.country ?? "—"}</td>
                  <td
                    style={{
                      padding: "8px 10px",
                      color: "var(--adm-dim)",
                      maxWidth: 220,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={r.path ?? undefined}
                  >
                    {r.path ?? "—"}
                  </td>
                  <td style={{ padding: "8px 10px", whiteSpace: "nowrap", color: "var(--adm-dim)" }}>
                    {fmtTime(r.created_at)}
                  </td>
                  <td style={{ padding: "8px 10px", position: "relative", whiteSpace: "nowrap" }}>
                    {r.ip_address && (
                      <>
                        <button
                          onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                          disabled={pendingIp === r.ip_address}
                          style={{
                            background: "var(--adm-surface2)",
                            border: "1px solid var(--adm-border)",
                            borderRadius: 4,
                            color: "var(--adm-paper)",
                            fontSize: 12,
                            padding: "3px 10px",
                            cursor: "pointer",
                            opacity: pendingIp === r.ip_address ? 0.5 : 1,
                          }}
                        >
                          {pendingIp === r.ip_address ? "…" : "标签"}
                        </button>
                        {openIdx === idx && (
                          <div
                            style={{
                              position: "absolute",
                              right: 10,
                              top: "100%",
                              zIndex: 20,
                              background: "var(--adm-surface2)",
                              border: "1px solid var(--adm-border)",
                              borderRadius: 6,
                              padding: 4,
                              minWidth: 120,
                              boxShadow: "0 8px 24px rgba(0,0,0,.45)",
                            }}
                          >
                            {(Object.keys(TAG_META) as Tag[]).map((t) => (
                              <button
                                key={t}
                                onClick={() => applyTag(r.ip_address!, t)}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  textAlign: "left",
                                  background: "transparent",
                                  border: "none",
                                  color: TAG_META[t].fg,
                                  fontSize: 12,
                                  padding: "6px 10px",
                                  cursor: "pointer",
                                  borderRadius: 4,
                                }}
                              >
                                {TAG_META[t].label}
                              </button>
                            ))}
                            {tag && (
                              <button
                                onClick={() => applyTag(r.ip_address!, null)}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  textAlign: "left",
                                  background: "transparent",
                                  border: "none",
                                  borderTop: "1px solid var(--adm-border)",
                                  color: "var(--adm-dim)",
                                  fontSize: 12,
                                  padding: "6px 10px",
                                  cursor: "pointer",
                                }}
                              >
                                清除标签
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

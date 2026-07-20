interface Log {
  id: number;
  admin_email: string;
  action: string;
  target_table: string | null;
  target_key: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
}

export function LogsPanel({ logs }: { logs: Log[] }) {
  return (
    <div>
      <h2 style={sectionTitle}>操作日志</h2>
      <p style={sectionDesc}>
        记录所有配置变更和积分调整操作，支持审计追踪。
      </p>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>时间</th>
              <th style={thStyle}>操作人</th>
              <th style={thStyle}>动作</th>
              <th style={thStyle}>目标</th>
              <th style={thStyle}>旧值</th>
              <th style={thStyle}>新值</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "var(--color-mute)",
                  }}
                >
                  暂无操作记录
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id}>
                  <td
                    style={{
                      ...tdStyle,
                      fontSize: 12,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(log.created_at).toLocaleString("zh-CN")}
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12 }}>
                    {log.admin_email}
                  </td>
                  <td style={tdStyle}>
                    <span style={actionBadgeStyle(log.action)}>
                      {log.action}
                    </span>
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      fontSize: 12,
                    }}
                  >
                    {log.target_table}
                    {log.target_key ? ` · ${log.target_key}` : ""}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      fontSize: 11,
                      fontFamily: "monospace",
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {log.old_value
                      ? JSON.stringify(log.old_value).slice(0, 60)
                      : "-"}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      fontSize: 11,
                      fontFamily: "monospace",
                      maxWidth: 150,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {log.new_value
                      ? JSON.stringify(log.new_value).slice(0, 60)
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function actionBadgeStyle(action: string): React.CSSProperties {
  const colors: Record<string, { bg: string; color: string }> = {
    update_config: { bg: "#E8F4FD", color: "#274A63" },
    update_pricing: { bg: "#FFF3E0", color: "#C8933F" },
    adjust_balance: { bg: "#E8F5E9", color: "#5C8A73" },
  };
  const c = colors[action] || { bg: "#F5F5F5", color: "#666" };
  return {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    background: c.bg,
    color: c.color,
  };
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

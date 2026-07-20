interface DailyStats {
  day: string;
  earn_count: number;
  earn_total: number;
  spend_count: number;
  spend_total: number;
  adjust_count: number;
  adjust_total: number;
}

interface SourceStats {
  source: string;
  tx_count: number;
  total_amount: number;
  avg_amount: number;
}

interface UserBalance {
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
}

export function DashboardPanel({
  dailyStats,
  sourceStats,
  userRank,
}: {
  dailyStats: DailyStats[];
  sourceStats: SourceStats[];
  userRank: UserBalance[];
}) {
  const totalEarned = dailyStats.reduce(
    (sum, d) => sum + (Number(d.earn_total) || 0),
    0
  );
  const totalSpent = dailyStats.reduce(
    (sum, d) => sum + (Number(d.spend_total) || 0),
    0
  );
  const totalUsers = userRank.length;
  const avgBalance =
    totalUsers > 0
      ? Math.round(userRank.reduce((sum, u) => sum + u.balance, 0) / totalUsers)
      : 0;

  return (
    <div>
      <h2 style={sectionTitle}>数据看板</h2>
      <p style={sectionDesc}>积分发放、消耗、用户统计概览。</p>

      {/* 汇总卡片 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard
          title="30日累计发放"
          value={totalEarned.toLocaleString()}
          unit="无为币"
          icon="🪙"
        />
        <StatCard
          title="30日累计消耗"
          value={totalSpent.toLocaleString()}
          unit="无为币"
          icon="🔥"
        />
        <StatCard
          title="积分用户总数"
          value={totalUsers.toLocaleString()}
          unit="人"
          icon="👥"
        />
        <StatCard
          title="平均余额"
          value={avgBalance.toLocaleString()}
          unit="无为币"
          icon="💎"
        />
      </div>

      {/* 每日趋势 */}
      <div style={{ ...categoryCard, marginTop: 24 }}>
        <div style={categoryHeader}>
          <span>📈 每日积分趋势（近30天）</span>
        </div>
        {dailyStats.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "var(--color-mute)",
            }}
          >
            暂无数据
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>日期</th>
                  <th style={thStyle}>发放笔数</th>
                  <th style={thStyle}>发放总量</th>
                  <th style={thStyle}>消耗笔数</th>
                  <th style={thStyle}>消耗总量</th>
                  <th style={thStyle}>调整笔数</th>
                </tr>
              </thead>
              <tbody>
                {dailyStats.slice(0, 30).map((d) => (
                  <tr key={String(d.day)}>
                    <td style={tdStyle}>
                      {new Date(String(d.day)).toLocaleDateString("zh-CN")}
                    </td>
                    <td style={tdStyle}>{d.earn_count}</td>
                    <td
                      style={{
                        ...tdStyle,
                        color: "var(--color-bamboo)",
                        fontWeight: 600,
                      }}
                    >
                      +{Number(d.earn_total).toLocaleString()}
                    </td>
                    <td style={tdStyle}>{d.spend_count}</td>
                    <td
                      style={{
                        ...tdStyle,
                        color: "var(--color-spark)",
                        fontWeight: 600,
                      }}
                    >
                      -{Number(d.spend_total).toLocaleString()}
                    </td>
                    <td style={tdStyle}>{d.adjust_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 按来源统计 */}
      <div style={{ ...categoryCard, marginTop: 24 }}>
        <div style={categoryHeader}>
          <span>🎯 按来源消耗分布</span>
        </div>
        {sourceStats.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "var(--color-mute)",
            }}
          >
            暂无数据
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>来源</th>
                  <th style={thStyle}>笔数</th>
                  <th style={thStyle}>总消耗</th>
                  <th style={thStyle}>平均消耗</th>
                </tr>
              </thead>
              <tbody>
                {sourceStats.map((s) => (
                  <tr key={s.source}>
                    <td style={tdStyle}>{s.source}</td>
                    <td style={tdStyle}>{s.tx_count}</td>
                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: 600,
                        color: "var(--color-spark)",
                      }}
                    >
                      {Number(s.total_amount).toLocaleString()}
                    </td>
                    <td style={tdStyle}>
                      {Number(s.avg_amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  unit,
  icon,
}: {
  title: string;
  value: string;
  unit: string;
  icon: string;
}) {
  return (
    <div style={statCardStyle}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "var(--color-ink)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "var(--color-dim)",
          marginTop: 4,
        }}
      >
        {unit}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--color-mute)",
          marginTop: 8,
        }}
      >
        {title}
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

const statCardStyle: React.CSSProperties = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 12,
  padding: 20,
  textAlign: "center",
};

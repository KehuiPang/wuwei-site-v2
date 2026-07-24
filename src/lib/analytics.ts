import { supabaseAdmin } from "./supabase";

// 看板聚合（需求③⑤，方案 §6）。只在服务端(admin，service key)调用。
// MVP：v_daily_stats 视图给 pv/uv/downloads 日趋势；其余维度在有界拉取后 JS 聚合。
// 演进（方案 §3.4）：数据量上百万后改物化视图 + 定时 refresh；UA 过滤 bot 防污染。

export type DailyStat = { day: string; pv: number; uv: number; downloads: number };
export type Bar = { key: string; count: number };

export type Dashboard = {
  totals: { pv: number; uv: number; downloads: number; logins: number; activations: number; usageEvents: number };
  daily: DailyStat[]; // 近 N 天 pv/uv/下载
  loginsByDay: Bar[]; // 近 N 天客户端登录
  activationsByDay: Bar[]; // 近 N 天客户端激活
  usageByDay: Bar[]; // 近 N 天客户端使用事件
  downloadToActivateRate: number; // 下载→激活转化率 (0-100)
  dau: number; // 今日活跃客户端（去重 anon_id）
  topReferers: Bar[];
  topCountries: Bar[];
  topLanding: Bar[];
  clientVersions: Bar[];
  windowDays: number;
};

const BOT_UA = /bot|crawler|spider|slurp|bingpreview|yandex|ahrefs|semrush|lighthouse|headlesschrome/i;

function refererHost(r: string | null): string {
  if (!r) return "(直接访问)";
  try {
    return new URL(r).hostname.replace(/^www\./, "");
  } catch {
    return "(其他)";
  }
}

function topN(map: Map<string, number>, n: number): Bar[] {
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

function dayKey(iso: string): string {
  return iso.slice(0, 10); // YYYY-MM-DD
}

export async function getDashboard(windowDays = 30): Promise<Dashboard> {
  const sb = supabaseAdmin();
  const since = new Date(Date.now() - windowDays * 86400_000).toISOString();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  const [dailyRes, evRes, loginRes, activateRes, usageRes, dauRes] = await Promise.all([
    sb.from("v_daily_stats").select("day,pv,uv,downloads").limit(windowDays),
    sb
      .from("analytics_events")
      .select("event_type,anon_id,country,referer,path,ua,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10000),
    sb
      .from("client_events")
      .select("anon_id,version,platform,created_at")
      .eq("event", "login")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10000),
    // 客户端激活事件（analytics_events 表）
    sb
      .from("analytics_events")
      .select("anon_id,created_at")
      .eq("event_type", "client_activate")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10000),
    // 客户端使用事件（analytics_events 表）
    sb
      .from("analytics_events")
      .select("anon_id,created_at")
      .eq("event_type", "client_usage")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(10000),
    // 今日 DAU：client_events 表今日有任意事件的匿名 ID 去重
    sb
      .from("client_events")
      .select("anon_id")
      .gte("created_at", todayISO)
      .limit(5000),
  ]);

  const daily: DailyStat[] = (dailyRes.data ?? []).map((d) => ({
    day: dayKey(String(d.day)),
    pv: Number(d.pv) || 0,
    uv: Number(d.uv) || 0,
    downloads: Number(d.downloads) || 0,
  }));

  // —— analytics_events 有界聚合（过滤 bot 防污染）——
  const ev = (evRes.data ?? []).filter((e) => !BOT_UA.test(e.ua || ""));
  const pvUsers = new Set<string>();
  let pv = 0,
    downloads = 0;
  const refs = new Map<string, number>();
  const countries = new Map<string, number>();
  const landing = new Map<string, number>();
  for (const e of ev) {
    if (e.event_type === "pageview") {
      pv++;
      if (e.anon_id) pvUsers.add(e.anon_id);
      refs.set(refererHost(e.referer), (refs.get(refererHost(e.referer)) || 0) + 1);
      const path = e.path || "/";
      landing.set(path, (landing.get(path) || 0) + 1);
    }
    if (e.event_type === "download") downloads++;
    const c = e.country || "(未知)";
    if (e.event_type === "pageview") countries.set(c, (countries.get(c) || 0) + 1);
  }

  // —— client_events 登录聚合 ——
  const logins = loginRes.data ?? [];
  const loginDay = new Map<string, number>();
  const versions = new Map<string, number>();
  for (const l of logins) {
    const d = dayKey(String(l.created_at));
    loginDay.set(d, (loginDay.get(d) || 0) + 1);
    const v = l.version || "(未知)";
    versions.set(v, (versions.get(v) || 0) + 1);
  }

  // —— 客户端激活聚合 ——
  const activations = activateRes.data ?? [];
  const activationDay = new Map<string, number>();
  for (const a of activations) {
    const d = dayKey(String(a.created_at));
    activationDay.set(d, (activationDay.get(d) || 0) + 1);
  }

  // —— 客户端使用聚合 ——
  const usageEvents = usageRes.data ?? [];
  const usageDay = new Map<string, number>();
  for (const u of usageEvents) {
    const d = dayKey(String(u.created_at));
    usageDay.set(d, (usageDay.get(d) || 0) + 1);
  }

  // —— 下载→激活转化率 ——
  const downloadToActivateRate = downloads > 0 ? Math.round((activations.length / downloads) * 1000) / 10 : 0;

  // —— 今日 DAU ——
  const dauSet = new Set<string>();
  for (const r of dauRes.data ?? []) {
    if (r.anon_id) dauSet.add(r.anon_id);
  }

  return {
    totals: { pv, uv: pvUsers.size, downloads, logins: logins.length, activations: activations.length, usageEvents: usageEvents.length },
    daily,
    loginsByDay: [...loginDay.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => (a.key < b.key ? 1 : -1))
      .slice(0, windowDays),
    activationsByDay: [...activationDay.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => (a.key < b.key ? 1 : -1))
      .slice(0, windowDays),
    usageByDay: [...usageDay.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => (a.key < b.key ? 1 : -1))
      .slice(0, windowDays),
    downloadToActivateRate,
    dau: dauSet.size,
    topReferers: topN(refs, 8),
    topCountries: topN(countries, 8),
    topLanding: topN(landing, 8),
    clientVersions: topN(versions, 8),
    windowDays,
  };
}

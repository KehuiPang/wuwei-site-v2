import type { Metadata } from "next";
import "../landing.css";
import { getPricing, getLatestReleases, type Plan, type Release } from "@/lib/data";
import { FALLBACK_PLANS_CN } from "@/lib/fallback-pricing";
import { Track } from "@/components/Track";
import { Reveal } from "@/components/Reveal";
import { LandNav } from "@/components/LandNav";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "定价 · 无为 WUWEI | 免费开始，用顺了再说",
  description: "无为定价：免费版开箱即用，Pro 版托管额度更省心。免费开始，一步都不勉强。",
  alternates: {
    canonical: "https://wuweiai.io/pricing",
    languages: {
      "zh-CN": "https://wuweiai.io/pricing",
      en: "https://wuweiai.io/en/pricing",
      "x-default": "https://wuweiai.io/pricing",
    },
  },
};

function WuMark({ className, stroke = 12, dot = 10 }: { className?: string; stroke?: number; dot?: number }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-label="无为">
      <g transform="rotate(-8 120 118)">
        <path d="M152.04 193.48 A82 82 0 1 1 195.48 150.04" fill="none"
          stroke="var(--color-paper)" strokeWidth={stroke} strokeLinecap="round" />
        <circle cx="195.48" cy="150.04" r={dot} fill="var(--color-spark)" />
      </g>
    </svg>
  );
}

const PLAN_COPY: Record<string, { pd: string; note: string }> = {
  free: { pd: "开箱即用，体验无为的全部核心能力", note: "无需注册，下载即用" },
  pro: { pd: "托管额度 + 增强能力，省去自配 key 的麻烦", note: "随时可升级 / 取消" },
  annual: { pd: "按年付更划算，长期用无为的省心之选", note: "付 10 月送 2 月" },
};

function symbolOf(currency: string) { return currency === "USD" ? "$" : currency === "CNY" ? "¥" : ""; }
function periodOf(period: string) { return period === "year" ? " / 年" : period === "month" ? " / 月" : ""; }

export default async function PricingPage() {
  let plans: Plan[] = [];
  let releases: Record<string, Release> = {};

  try {
    [plans, releases] = await Promise.all([getPricing("cn", "wuwei"), getLatestReleases()]);
  } catch (e) {
    console.error("Failed to fetch pricing:", e);
  }

  if (!plans || plans.length === 0) {
    plans = FALLBACK_PLANS_CN as Plan[];
  }

  const hasRelease = Object.keys(releases).length > 0;

  return (
    <div className="wu-land">
      <Track path="/pricing" />
      <Reveal />
      <LandNav locale="zh" />
      <span id="top"></span>

      <header className="hero" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <WuMark className="logo" stroke={9} dot={7.4} />
          <h1>免费开始，<span className="spark">用顺了再说</span>。</h1>
          <div className="en">START FREE. DECIDE LATER.</div>
          <p className="vp">
            <span className="dim">下载即用，先免费体验它怎么替你干活。用出感觉、额度不够了，再登录升级——一步都不勉强。</span>
          </p>
        </div>
      </header>

      <section className="sec" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="prices">
            {plans.map((p) => {
              const feat = p.plan_key === "pro";
              const copy = PLAN_COPY[p.plan_key] ?? { pd: "", note: "" };
              const sym = symbolOf(p.currency);
              const per = p.price > 0 ? periodOf(p.period) : "";
              return (
                <div key={p.plan_key} className={"price rv" + (feat ? " feat" : "")}>
                  {feat && <div className="badge">最受欢迎</div>}
                  <div className="pn">{p.name}</div>
                  <div className="pd">{copy.pd}</div>
                  <div className="amt">{sym}{p.price}{per && <span>{per}</span>}</div>
                  <ul>{(p.features ?? []).map((f, i) => <li key={i}>{f}</li>)}</ul>
                  {p.plan_key === "free" ? (
                    hasRelease
                      ? <a className="btn btn-g" href="/api/download?platform=windows">免费下载</a>
                      : <span className="btn btn-g btn-disabled">即将上线</span>
                  ) : (
                    <a className={"btn " + (feat ? "btn-p" : "btn-g")} href="/login">
                      {feat ? "升级 Pro" : "选择年付"}
                    </a>
                  )}
                  <div className="note">{copy.note}</div>
                </div>
              );
            })}
            {plans.length === 0 && (
              <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--mist2)" }}>定价加载中…</p>
            )}
          </div>
        </div>
      </section>

      <footer className="land-footer">
        <div className="wrap">
          <div className="frow2">
            <div className="fbrand"><WuMark stroke={12} dot={10} />无为 · WUWEI</div>
            <div className="fmenu">
              <a href="/">首页</a>
              <a href="/shot">无为截</a>
              <a href="/voice">无为念</a>
              <a href="/pricing">定价</a>
            </div>
          </div>
          <div className="copy">一念既出，万事自成 · One intention. Everything done. · © 2026 无为 Wuwei</div>
        </div>
      </footer>
    </div>
  );
}

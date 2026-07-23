import type { Metadata } from "next";
import "../../landing.css";
import { getPricing, getLatestReleases, type Plan, type Release } from "@/lib/data";
import { FALLBACK_PLANS_EN } from "@/lib/fallback-pricing";
import { Track } from "@/components/Track";
import { Reveal } from "@/components/Reveal";
import { LandNav } from "@/components/LandNav";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Pricing · Wuwei | Start free, decide later",
  description: "Wuwei pricing: free tier out of the box, Pro with hosted credits. Start free — no pressure.",
  alternates: {
    canonical: "https://wuweiai.io/en/pricing",
    languages: {
      "zh-CN": "https://wuweiai.io/pricing",
      en: "https://wuweiai.io/en/pricing",
      "x-default": "https://wuweiai.io/en/pricing",
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
  free: { pd: "Everything you need, right out of the box.", note: "No sign-up. Download and go." },
  pro: { pd: "Hosted credits + more power — skip bringing your own key.", note: "Upgrade or cancel anytime." },
  annual: { pd: "Pay yearly, save more — the no-fuss choice for regulars.", note: "Pay 10 months, get 2 free." },
};

function symbolOf(currency: string) { return currency === "USD" ? "$" : currency === "CNY" ? "¥" : ""; }
function periodOf(period: string) { return period === "year" ? " / yr" : period === "month" ? " / mo" : ""; }

export default async function EnPricingPage() {
  let plans: Plan[] = [];
  let releases: Record<string, Release> = {};

  try {
    [plans, releases] = await Promise.all([getPricing("global", "wuwei"), getLatestReleases()]);
  } catch (e) {
    console.error("Failed to fetch pricing:", e);
  }

  if (!plans || plans.length === 0) {
    plans = FALLBACK_PLANS_EN as Plan[];
  }

  const hasRelease = Object.keys(releases).length > 0;

  return (
    <div className="wu-land">
      <Track path="/en/pricing" />
      <Reveal />
      <LandNav locale="en" />
      <span id="top"></span>

      <header className="hero" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <WuMark className="logo" stroke={9} dot={7.4} />
          <h1>Start free, <span className="spark">decide later</span>.</h1>
          <div className="en">FREE TO START. UPGRADE WHEN READY.</div>
          <p className="vp">
            <span className="dim">Download and use — feel how it works for you first, free. When you need more, sign in and upgrade. Never forced.</span>
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
                  {feat && <div className="badge">MOST POPULAR</div>}
                  <div className="pn">{p.name}</div>
                  <div className="pd">{copy.pd}</div>
                  <div className="amt">{sym}{p.price}{per && <span>{per}</span>}</div>
                  <ul>{(p.features ?? []).map((f, i) => <li key={i}>{f}</li>)}</ul>
                  {p.plan_key === "free" ? (
                    hasRelease
                      ? <a className="btn btn-g" href="/api/download?platform=windows">Download Free</a>
                      : <span className="btn btn-g btn-disabled">Coming soon</span>
                  ) : (
                    <a className={"btn " + (feat ? "btn-p" : "btn-g")} href="/login">
                      {feat ? "Upgrade to Pro" : "Choose annual"}
                    </a>
                  )}
                  <div className="note">{copy.note}</div>
                </div>
              );
            })}
            {plans.length === 0 && (
              <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--mist2)" }}>Loading pricing…</p>
            )}
          </div>
        </div>
      </section>

      <footer className="land-footer">
        <div className="wrap">
          <div className="frow2">
            <div className="fbrand"><WuMark stroke={12} dot={10} />Wuwei · 无为</div>
            <div className="fmenu">
              <a href="/en">Home</a>
              <a href="/en/shot">Shot</a>
              <a href="/en/voice">Voice</a>
              <a href="/en/pricing">Pricing</a>
            </div>
          </div>
          <div className="copy">One intention. Everything done. · 无为 Wuwei · © 2026</div>
        </div>
      </footer>
    </div>
  );
}

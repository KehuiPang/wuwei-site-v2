"use client";
// 🌐 全站共享导航（深色落地页版）—— 首页/产品页统一用这一套
// 包含：品牌 logo + 产品链接 + 定价链接 + 🌐地球语言切换 + 登录/头像下拉
// 深色 VI：玄墨黑底 / 月白字 / 靛青 hover

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LandLangSwitch } from "./LandLangSwitch";
import { AuthButton } from "./AuthButton";
import type { Locale } from "@/lib/site";

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

export type LandNavProps = {
  locale: Locale;
  /** 产品页专用：显示产品名（如"无为截"） */
  productPage?: {
    name: string;
    nameEn: string;
    downloadHref: string;
  };
};

export function LandNav({ locale, productPage }: LandNavProps) {
  const pathname = usePathname();
  const isEn = locale === "en";
  const homeHref = isEn ? "/en" : "/";

  // 导航链接（产品页显示功能/怎么用/故事，首页显示产品链接）
  const navLinks = productPage
    ? [
        { href: "#feature", label: isEn ? "Features" : "功能" },
        { href: "#how", label: isEn ? "How it works" : "怎么用" },
        { href: "#story", label: isEn ? "Story" : productPage.nameEn === "WUWEI SHOT" ? "无为·截" : productPage.nameEn === "WUWEI VOICE" ? "无为·念" : "无为·道" },
      ]
    : [
        { href: "/shot", label: isEn ? "Shot" : "无为截" },
        { href: "/voice", label: isEn ? "Voice" : "无为念" },
        { href: isEn ? "/en/pricing" : "/pricing", label: isEn ? "Pricing" : "定价" },
      ];

  return (
    <nav className="nav">
      <div className="wrap">
        <Link href={homeHref} className="brand">
          <WuMark stroke={12} dot={10} />
          <span>
            <span className="zh">{productPage ? productPage.name : isEn ? "Wuwei" : "无为"}</span>{" "}
            <span className="en">{productPage ? productPage.nameEn : "WUWEI"}</span>
          </span>
        </Link>
        <div className="nav-right">
          <div className="nav-links">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-paper transition">
                {link.label}
              </a>
            ))}
          </div>
          <LandLangSwitch current={locale} />
          <AuthButton locale={isEn ? "en" : "zh"} />
        </div>
      </div>
    </nav>
  );
}

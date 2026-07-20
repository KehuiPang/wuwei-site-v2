import type { Metadata } from "next";
import { PRODUCT_CONTENT } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";

// 无为·念（AI 时代语音输入）
const c = PRODUCT_CONTENT.nian.zh;

export const revalidate = 60;

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: {
    canonical: "https://wuweiai.io/nian",
    languages: {
      "zh-CN": "https://wuweiai.io/nian",
      en: "https://wuweiai.io/en/voice",
      "x-default": "https://wuweiai.io/en/voice",
    },
  },
  openGraph: {
    title: c.meta.title,
    description: c.meta.description,
    url: "https://wuweiai.io/nian",
    siteName: "无为念",
  },
  twitter: {
    card: "summary_large_image",
    title: c.meta.title,
    description: c.meta.description,
  },
  keywords: [
    "无为念",
    "语音输入",
    "AI语音",
    "语音转文字",
    "免费语音输入",
    "跨平台语音输入",
    "本地语音识别",
    "中文语音输入",
    "AI听写",
    "按住说话",
  ],
};

export default function Page() {
  return <ProductPage content={c} locale="zh" trackPath="/nian" downloadHref="/api/download?product=nian&platform=windows" />;
}

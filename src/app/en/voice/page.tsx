import type { Metadata } from "next";
import { PRODUCT_CONTENT } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";

// 无为念英文版 /en/voice
const c = PRODUCT_CONTENT.nian.en;

export const revalidate = 60;

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: {
    canonical: "https://wuweiai.io/en/voice",
    languages: {
      "zh-CN": "https://wuweiai.io/nian",
      en: "https://wuweiai.io/en/voice",
      "x-default": "https://wuweiai.io/en/voice",
    },
  },
  openGraph: {
    title: c.meta.title,
    description: c.meta.description,
    url: "https://wuweiai.io/en/voice",
    siteName: "Wuwei Voice",
  },
  twitter: {
    card: "summary_large_image",
    title: c.meta.title,
    description: c.meta.description,
  },
  keywords: [
    "Wuwei Voice",
    "voice input",
    "AI dictation",
    "speech to text",
    "free voice typing",
    "cross-platform dictation",
    "local voice recognition",
    "Chinese voice input",
    "AI transcription",
    "push to talk",
  ],
};

export default function Page() {
  return <ProductPage content={c} locale="en" trackPath="/en/voice" downloadHref="/api/download?product=nian&platform=windows" />;
}

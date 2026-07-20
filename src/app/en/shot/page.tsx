import type { Metadata } from "next";
import { PRODUCT_CONTENT } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";

// 无为截英文版 /en/shot
const c = PRODUCT_CONTENT.shot.en;

export const revalidate = 60;

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: {
    canonical: "https://wuweiai.io/en/shot",
    languages: {
      "zh-CN": "https://wuweiai.io/shot",
      en: "https://wuweiai.io/en/shot",
      "x-default": "https://wuweiai.io/en/shot",
    },
  },
  openGraph: {
    title: c.meta.title,
    description: c.meta.description,
    url: "https://wuweiai.io/en/shot",
    siteName: "Wuwei Shot",
  },
  twitter: {
    card: "summary_large_image",
    title: c.meta.title,
    description: c.meta.description,
  },
  keywords: [
    "Wuwei Shot",
    "AI screenshot",
    "smart screenshot",
    "screenshot OCR",
    "screenshot translation",
    "screen capture tool",
    "free screenshot tool",
    "cross-platform screenshot",
    "AI screen reader",
    "screenshot annotation",
  ],
};

export default function Page() {
  return <ProductPage content={c} locale="en" trackPath="/en/shot" downloadHref="/api/download?product=shot&platform=windows" />;
}

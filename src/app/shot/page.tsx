import type { Metadata } from "next";
import { PRODUCT_CONTENT } from "@/lib/products";
import { ProductPage } from "@/components/ProductPage";

// 无为·截（会思考的截图）
const c = PRODUCT_CONTENT.shot.zh;

export const revalidate = 60;

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  alternates: {
    canonical: "https://wuweiai.io/shot",
    languages: {
      "zh-CN": "https://wuweiai.io/shot",
      en: "https://wuweiai.io/en/shot",
      "x-default": "https://wuweiai.io/en/shot",
    },
  },
  openGraph: {
    title: c.meta.title,
    description: c.meta.description,
    url: "https://wuweiai.io/shot",
    siteName: "无为截",
  },
  twitter: {
    card: "summary_large_image",
    title: c.meta.title,
    description: c.meta.description,
  },
  keywords: [
    "无为截",
    "AI截图",
    "智能截图",
    "截图OCR",
    "截图翻译",
    "屏幕截图工具",
    "免费截图工具",
    "跨平台截图",
    "AI屏幕识别",
    "截图标注",
  ],
};

export default function Page() {
  return <ProductPage content={c} locale="zh" trackPath="/shot" downloadHref="/api/download?product=shot&platform=windows" />;
}

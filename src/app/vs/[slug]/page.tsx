import type { Metadata } from "next";
import { VS_PAGES } from "@/lib/vs";
import { VsLanding, notFound } from "@/components/VsLanding";

export const revalidate = 3600; // 对标文案属常青内容，1h ISR 足够

export function generateStaticParams() {
  return Object.keys(VS_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = VS_PAGES[slug];
  if (!p) return {};
  const url = `https://wuweiai.io/vs/${slug}`;
  // 中文主页；同名英文对标页在 /en/vs/[slug]，有则互标 hreflang
  return {
    title: p.meta.title,
    description: p.meta.description,
    alternates: {
      canonical: url,
      ...(p.hasEn
        ? { languages: { "zh-CN": url, en: `https://wuweiai.io/en/vs/${slug}` } }
        : {}),
    },
    // 门禁页（wuwei-vs-claude-code）待 CEO 终检前不被索引
    robots: p.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: p.meta.title, description: p.meta.description, url },
  };
}

export default async function VsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = VS_PAGES[slug];
  if (!p) notFound();
  return <VsLanding page={p} pathBase="/vs" />;
}

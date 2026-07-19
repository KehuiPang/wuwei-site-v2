import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "无为 WUWEI · 一念既出，万事自成 | 人人可用的 AI 提效客户端",
  description:
    "无为（WUWEI）——人人可用的 AI 提效客户端。你只管起念，把执行交给无为：真读写文件、精确编辑、跑命令、联网搜索，带权限确认。自带你的 key，接 Claude / OpenAI / 本地与国产大模型一键切换。免费开始，开箱即用。Mac / Windows / Linux。",
  openGraph: {
    title: "无为 WUWEI · 一念既出，万事自成",
    description:
      "人人可用的 AI 提效客户端——你只管起念，把执行交给无为。自带 key，开箱即用。",
    type: "website",
  },
};

export default function ZhLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div lang="zh-CN">{children}</div>;
}

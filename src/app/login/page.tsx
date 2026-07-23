import type { Metadata } from "next";
import Link from "next/link";
import SignInClient from "./client";

export const metadata: Metadata = {
  title: "登录",
  description: "登录无为账号。",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-paper hover:opacity-80 transition">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" aria-hidden>
              <circle cx="24" cy="24" r="18" stroke="#F4F6F8" strokeWidth="2.5"
                strokeLinecap="round" strokeDasharray="102 8" transform="rotate(-90 24 24)" />
              <circle cx="24" cy="10.5" r="3" fill="#C05F3C" />
            </svg>
            <span className="text-xl font-semibold tracking-wider">无为</span>
          </Link>
        </div>
        <div className="bg-[#1A1F26] border border-[#2C343E] rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold text-paper text-center">登录无为</h1>
          <p className="mt-2 text-sm text-[#A8B0B8] text-center">
            用谷歌账号或邮箱链接登录，无需记忆密码。
          </p>
          <SignInClient next={sp.next} initialError={sp.error} />
        </div>
        <p className="mt-6 text-center text-sm text-[#7A828A]">
          <Link href="/" className="hover:text-paper transition">← 返回首页</Link>
        </p>
      </div>
    </div>
  );
}

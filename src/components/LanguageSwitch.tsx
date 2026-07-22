"use client";
// 「中文 | EN」分段文字切换（当前语言高亮），与产品链接/CTA 视觉区隔。
// 写 cookie 记住选择（middleware 以 cookie 为准），再跳到对方语言页。
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { LANG_COOKIE, type Locale } from "@/lib/site";

export function LanguageSwitch({ current }: { current: Locale }) {
  const router = useRouter();
  const go = useCallback(
    (to: Locale) => {
      if (to === current) return;
      document.cookie = `${LANG_COOKIE}=${to}; path=/; max-age=31536000; samesite=lax`;
      router.push(to === "en" ? "/en" : "/");
    },
    [current, router],
  );

  const seg = (active: boolean) =>
    `px-2.5 py-1 rounded-md text-sm transition ${
      active ? "bg-ink text-paper font-semibold" : "text-inkmute hover:text-water"
    }`;

  return (
    <div
      className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded-lg border border-mist bg-surface"
      role="group"
      aria-label="语言 / Language"
    >
      <button onClick={() => go("zh")} className={seg(current === "zh")} aria-label="切换到中文">
        中文
      </button>
      <span className="text-mute text-xs select-none" aria-hidden>
        |
      </span>
      <button onClick={() => go("en")} className={seg(current === "en")} aria-label="Switch to English">
        EN
      </button>
    </div>
  );
}

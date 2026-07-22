"use client";
// 深色落地页的中/EN 切换：「中文 | EN」分段文字，当前语言高亮（月白底玄墨字药丸），
// 写 cookie 记住选择（middleware 以 cookie 为准），再跳到对方语言页。
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { LANG_COOKIE, type Locale } from "@/lib/site";

export function LandLangSwitch({ current }: { current: Locale }) {
  const router = useRouter();
  const go = useCallback(
    (to: Locale) => {
      if (to === current) return;
      document.cookie = `${LANG_COOKIE}=${to}; path=/; max-age=31536000; samesite=lax`;
      router.push(to === "en" ? "/en" : "/");
    },
    [current, router],
  );

  return (
    <div className="lang-switch" role="group" aria-label="语言 / Language">
      <button
        type="button"
        className={current === "zh" ? "on" : ""}
        onClick={() => go("zh")}
        aria-label="切换到中文"
      >
        中文
      </button>
      <span className="lang-sep" aria-hidden>
        |
      </span>
      <button
        type="button"
        className={current === "en" ? "on" : ""}
        onClick={() => go("en")}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}

"use client";
// Hero 视觉焦点 · 终端流式演示（打字机）——一句人话，活自己干完。
// 复用 landing.css 的 .mock 终端样式（玻璃+外发光），纯前端循环，无外部依赖。
// 尊重 prefers-reduced-motion：减少动态时直接整屏呈现、不逐字。
import { useEffect, useRef, useState } from "react";

export type DemoLine = { role: "you" | "wu" | "sub" | "ok"; text: string };

const CLS: Record<DemoLine["role"], string> = { you: "u", wu: "g", sub: "d", ok: "ok" };

export function HeroDemo({ title, lines }: { title: string; lines: DemoLine[] }) {
  const [shown, setShown] = useState(0); // 已完整显示的行数
  const [typed, setTyped] = useState(""); // 当前行已打出的文本
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      setShown(lines.length);
      return;
    }

    let li = 0; // 当前行
    let ci = 0; // 当前字符
    const step = () => {
      if (li >= lines.length) {
        // 全部打完，停留后重置循环
        timer.current = setTimeout(() => {
          li = 0;
          ci = 0;
          setShown(0);
          setTyped("");
          timer.current = setTimeout(step, 400);
        }, 2600);
        return;
      }
      const full = lines[li].text;
      if (ci <= full.length) {
        setTyped(full.slice(0, ci));
        ci += 1;
        timer.current = setTimeout(step, 26);
      } else {
        // 本行打完，落定，进入下一行
        setShown(li + 1);
        setTyped("");
        li += 1;
        ci = 0;
        timer.current = setTimeout(step, 360);
      }
    };
    timer.current = setTimeout(step, 500);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [lines]);

  return (
    <div className="hero-demo rv in" aria-hidden="true">
      <div className="mock">
        <div className="bar">
          <i style={{ background: "#e0645a" }}></i>
          <i style={{ background: "#e2b34a" }}></i>
          <i style={{ background: "#5fb87a" }}></i>
          <span className="t">{title}</span>
        </div>
        <div className="body hd-body">
          {lines.slice(0, shown).map((l, i) => (
            <div key={i} className={CLS[l.role]}>
              {l.text}
            </div>
          ))}
          {shown < lines.length && (
            <div className={CLS[lines[shown].role]}>{typed}</div>
          )}
        </div>
      </div>
    </div>
  );
}

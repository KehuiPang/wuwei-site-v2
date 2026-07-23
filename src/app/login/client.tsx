"use client";

import { useState, type FormEvent } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Status = "idle" | "loading" | "sent" | "error";

export default function SignInClient({
  next,
  initialError,
}: {
  next?: string;
  initialError?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>(initialError ? "error" : "idle");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState(
    initialError === "callback" ? "登录链接已失效或过期，请重试。" : ""
  );

  const nextParam = next ? `?next=${encodeURIComponent(next)}` : "";

  async function signInWithGoogle() {
    if (googleLoading || status === "loading") return;
    setGoogleLoading(true);
    setMessage("");
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback${nextParam}`,
      },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      setGoogleLoading(false);
    }
    // 成功会自动跳转到 Google
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setStatus("loading");
    setMessage("");
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback${nextParam}`,
      },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="mt-6 rounded-xl border border-[#2C343E] bg-[#151A20] p-6 text-center">
        <div className="text-3xl">📧</div>
        <h2 className="mt-3 font-semibold text-paper">请查收邮件</h2>
        <p className="mt-2 text-sm text-[#A8B0B8] leading-relaxed">
          我们已向 <strong className="text-paper">{email}</strong> 发送了登录链接。
          点击邮件中的链接即可继续，链接 1 小时内有效。
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={googleLoading || status === "loading"}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#2C343E] bg-[#151A20] px-4 py-3 text-sm font-medium text-paper hover:bg-[#1E242C] hover:border-[#35414d] transition disabled:opacity-60"
      >
        <GoogleIcon />
        {googleLoading ? "正在跳转谷歌…" : "使用谷歌账号登录"}
      </button>

      <div className="flex items-center gap-3 text-xs text-[#7A828A]">
        <span className="h-px flex-1 bg-[#2C343E]" />
        或
        <span className="h-px flex-1 bg-[#2C343E]" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-paper">邮箱地址</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-xl border border-[#2C343E] bg-[#151A20] px-4 py-3 text-sm text-paper placeholder-[#7A828A] focus:border-[#274A63] focus:outline-none focus:ring-1 focus:ring-[#274A63] transition"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading" || googleLoading || !email.trim()}
          className="w-full rounded-xl bg-spark px-4 py-3 text-sm font-medium text-white hover:bg-spark-hover transition disabled:opacity-50"
        >
          {status === "loading" ? "发送中…" : "发送登录链接"}
        </button>
      </form>

      {message && status === "error" && (
        <p className="text-sm text-[#B4483A] text-center">{message}</p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

export function AuthButton({ locale = "zh" }: { locale?: "zh" | "en" }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  }

  if (loading) {
    return (
      <span className="text-sm text-[#7A828A]">
        {locale === "zh" ? "…" : "…"}
      </span>
    );
  }

  if (user) {
    const email = user.email ?? "";
    const short = email.length > 20 ? email.slice(0, 18) + "…" : email;
    return (
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-sm text-[#A8B0B8] max-w-[140px] truncate" title={email}>
          {short}
        </span>
        <button
          onClick={signOut}
          className="text-sm text-[#A8B0B8] hover:text-paper transition border border-[#2C343E] rounded-lg px-3 py-1.5 hover:border-[#35414d]"
        >
          {locale === "zh" ? "退出" : "Sign out"}
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm text-[#A8B0B8] hover:text-paper transition border border-[#2C343E] rounded-lg px-3 py-1.5 hover:border-[#35414d]"
    >
      {locale === "zh" ? "登录" : "Sign in"}
    </Link>
  );
}

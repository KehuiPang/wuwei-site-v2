import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { LANG_COOKIE } from "@/lib/site";

// 中英地理分流（方案 §2.3）：
// - 只作用于根路径 "/"（中文站）；产品/对标/英文页各有独立稳定 URL，不动。
// - 手动切换写的 cookie 优先（尊重用户选择，也让 SEO URL 稳定）。
// - 爬虫 UA 一律放行不跳转：中/英是两套独立 URL 互打 hreflang，绝不按 IP 302 跟随爬虫，
//   否则 Google 只能爬到一套（§2.3 SEO 正确姿势）。
// - 真人首访无 cookie：CN → 留中文 /；非 CN → 跳 /en。
// - 14 语言 cookie：zh → /，en/ja/ko/de/... → /en（本期非 zh 一律跳英文兜底）。

const BOT_UA =
  /bot|crawler|spider|slurp|bingpreview|googlebot|baiduspider|yandex|duckduckbot|facebookexternalhit|embedly|quora|pinterest|slackbot|twitterbot|whatsapp|telegrambot|discordbot|applebot|ia_archiver|semrush|ahrefs|mj12bot|lighthouse|headlesschrome/i;

// —— /admin/* 服务端鉴权（安全红线，2026-07-26）——
// 第一道门：middleware 拦截所有 /admin/*（除 /admin/login），未登录一律 302 跳登录页。
// 第二道门：各 admin 页内 getAdmin()/role 校验（白名单/角色），纵深防御。
// 注意：middleware 只校验"是否登录"（session 存在），白名单校验留给页面内 getAdmin()
// （middleware 里查库会增加每请求延迟，且 admin_users 查询需要 service key）。
async function guardAdmin(req: NextRequest): Promise<NextResponse | null> {
  const { pathname } = req.nextUrl;

  // 登录页本身放行（否则死循环）
  if (pathname === "/admin/login") return null;

  // 校验 Supabase session cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll() {
          // middleware 里不写 cookie（token 刷新由页面内 server client 处理）
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // 未登录 → 302 跳登录页，带 next 参数登录后跳回
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 已登录 → 放行（白名单/role 校验由页面内 getAdmin() 兜底）
  return null;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin/* 先过鉴权门
  if (pathname.startsWith("/admin")) {
    const blocked = await guardAdmin(req);
    if (blocked) return blocked;
    return NextResponse.next();
  }

  // —— 以下为根路径 "/" 的中英地理分流 ——
  const ua = req.headers.get("user-agent") || "";
  if (BOT_UA.test(ua)) return NextResponse.next();

  // 手动选择优先
  const chosen = req.cookies.get(LANG_COOKIE)?.value;
  if (chosen === "zh") return NextResponse.next();
  if (chosen && chosen !== "zh") {
    // en/ja/ko/de/... 本期一律跳英文站
    return NextResponse.redirect(new URL("/en", req.url));
  }

  // 首访：按地理头分流。Vercel 提供 x-vercel-ip-country；CF 橙云代理提供 cf-ipcountry。
  const country = (
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    ""
  ).toUpperCase();

  // 有明确国别且非中国大陆 → 英文站；CN / 未知 → 留中文（默认）。
  if (country && country !== "CN") {
    return NextResponse.redirect(new URL("/en", req.url));
  }
  return NextResponse.next();
}

// matcher：根路径分流 + /admin/* 鉴权
export const config = {
  matcher: ["/", "/admin/:path*"],
};

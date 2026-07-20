import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabasePublic, supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || "wuwei";
  return createHash("sha256").update(salt + ip).digest("hex").slice(0, 32);
}

const PLATFORMS = new Set(["windows", "macos", "linux"]);
const PRODUCTS = new Set(["wuwei", "nian", "shot"]);

// GitHub Release 下载地址映射
const GITHUB_RELEASES: Record<string, Record<string, string>> = {
  wuwei: {
    windows: "https://github.com/wuwei-io/wuwei-pro/releases/download/v1.3.3/wuwei-pro-1.3.3-setup.exe",
    macos: "https://github.com/wuwei-io/wuwei-pro/releases/download/v1.3.3/Pro-1.3.3.dmg",
    linux: "https://github.com/wuwei-io/wuwei-pro/releases/download/v1.3.3/wuwei-pro_1.3.3_amd64.deb",
  },
  nian: {
    windows: "https://github.com/wuwei-io/wuwei-pro/releases/download/v1.3.3/wuwei-pro-1.3.3-setup.exe",
    macos: "https://github.com/wuwei-io/wuwei-pro/releases/download/v1.3.3/Pro-1.3.3.dmg",
    linux: "https://github.com/wuwei-io/wuwei-pro/releases/download/v1.3.3/wuwei-pro_1.3.3_amd64.deb",
  },
  shot: {
    windows: "https://github.com/wuwei-io/wuwei-shot/releases/download/v2.0.0/wuwei-shot-Windows-x64.exe",
    macos: "https://github.com/wuwei-io/wuwei-shot/releases/download/v2.0.0/wuwei-shot-macOS-x64.zip",
    linux: "https://github.com/wuwei-io/wuwei-shot/releases/download/v2.0.0/wuwei-shot-Linux-x64.AppImage",
  },
};

// 版本号映射
const VERSIONS: Record<string, string> = {
  wuwei: "1.3.3",
  nian: "1.3.3",
  shot: "2.0.0",
};

// 下载跳转：优先 GitHub Release → 回退数据库 → 404
export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get("platform") || "";
  const product = req.nextUrl.searchParams.get("product") || "wuwei";

  if (!PLATFORMS.has(platform)) {
    return NextResponse.json({ error: "bad platform" }, { status: 400 });
  }
  if (!PRODUCTS.has(product)) {
    return NextResponse.json({ error: "bad product" }, { status: 400 });
  }

  let fileUrl: string | null = null;
  let version = VERSIONS[product] || "latest";

  // 1) 先查 GitHub Release 映射
  const ghUrl = GITHUB_RELEASES[product]?.[platform];
  if (ghUrl) {
    fileUrl = ghUrl;
  } else {
    // 2) 回退查数据库
    const { data } = await supabasePublic()
      .from("releases")
      .select("version,file_url")
      .eq("platform", platform)
      .eq("product", product)
      .eq("is_published", true)
      .eq("channel", "stable")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.file_url) {
      fileUrl = data.file_url;
      version = data.version;
    }
  }

  if (!fileUrl) {
    return NextResponse.json({ error: "no release yet" }, { status: 404 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    null;

  // 埋点（失败不挡下载）
  await supabaseAdmin()
    .from("analytics_events")
    .insert({
      event_type: "download",
      path: `/api/download?product=${product}&platform=${platform}`,
      platform,
      product,
      country,
      ip_hash: hashIp(ip),
      ua: req.headers.get("user-agent")?.slice(0, 400) ?? null,
      meta: { version, product },
    })
    .then(() => {}, () => {});

  return NextResponse.redirect(fileUrl, 302);
}

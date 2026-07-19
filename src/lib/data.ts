import { supabasePublic } from "./supabase";

export type Region = "cn" | "global";

export type Plan = {
  plan_key: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  original_price: number | null;
  badge: string | null;
  features: string[];
  sort_order: number;
};

export type Release = {
  version: string;
  platform: "windows" | "macos" | "linux";
  arch: string;
  file_url: string;
  file_name: string | null;
  file_size: number | null;
  created_at: string;
};

// 取某地区在售定价。Supabase 挂掉/env 缺失时返回空数组（页面有空态），绝不 throw 拖垮渲染
export async function getPricing(region: Region): Promise<Plan[]> {
  try {
    const sb = supabasePublic();
    const { data } = await sb
      .from("pricing_plans")
      .select("plan_key,name,price,currency,period,original_price,badge,features,sort_order")
      .eq("region", region)
      .eq("is_active", true)
      .order("sort_order");
    return (data as Plan[]) ?? [];
  } catch {
    return [];
  }
}

// 取三平台各自"最新已发布"版本（首页真实下载）。失败返回空表，页面降级为静态链接
export async function getLatestReleases(): Promise<Record<string, Release>> {
  try {
    const sb = supabasePublic();
    const { data } = await sb
      .from("releases")
      .select("version,platform,arch,file_url,file_name,file_size,created_at")
      .eq("is_published", true)
      .eq("channel", "stable")
      .order("created_at", { ascending: false });
    const byPlatform: Record<string, Release> = {};
    for (const r of (data as Release[]) ?? []) {
      if (!byPlatform[r.platform]) byPlatform[r.platform] = r;
    }
    return byPlatform;
  } catch {
    return {};
  }
}

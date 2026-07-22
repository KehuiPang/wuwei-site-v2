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
  is_active: boolean;
  region: string;
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

// 取某地区在售定价（可按产品过滤）
export async function getPricing(region: Region, product?: string): Promise<Plan[]> {
  const sb = supabasePublic();
  let query = sb
    .from("pricing_plans")
    .select("plan_key,name,price,currency,period,original_price,badge,features,sort_order")
    .eq("region", region)
    .eq("is_active", true)
    .order("sort_order");
  
  const { data } = await query;
  let plans = (data as Plan[]) ?? [];
  
  // 按产品过滤：plan_key 前缀匹配（free/pro/annual=本尊，shot_*=无为截，voice_*=无为念）
  if (product) {
    plans = plans.filter((p) => {
      if (product === "wuwei") {
        return ["free", "pro", "annual"].includes(p.plan_key);
      }
      return p.plan_key.startsWith(product + "_");
    });
  }
  
  return plans;
}

// 取三平台各自"最新已发布"版本（首页真实下载）
export async function getLatestReleases(): Promise<Record<string, Release>> {
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
}

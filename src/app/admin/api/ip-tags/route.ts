/**
 * /admin/api/ip-tags
 * IP 标签 CRUD（后台自用，service role 鉴权）
 *
 * GET    ?ip=<ip>        单个 IP 标签查询
 * GET    ?all=1          全部标签列表
 * POST   { ip_address, tag, note }   创建或更新标签（upsert）
 * DELETE { ip_address }              删除标签
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

// 标签类型
const VALID_TAGS = ["self", "bot", "real"] as const;
type Tag = (typeof VALID_TAGS)[number];

/** 中文标签名映射（展示用） */
export const TAG_LABELS: Record<Tag, string> = {
  self: "本人/测试",
  bot:  "爬虫/机器人",
  real: "真实用户",
};

/** GET /admin/api/ip-tags */
export async function GET(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const ip  = searchParams.get("ip");
  const all = searchParams.get("all");

  const sb = supabaseAdmin();

  if (ip) {
    const { data, error } = await sb
      .from("ip_tags")
      .select("*")
      .eq("ip_address", ip)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ tag: data ?? null });
  }

  if (all) {
    const { data, error } = await sb
      .from("ip_tags")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ tags: data ?? [] });
  }

  return NextResponse.json({ error: "需要 ?ip= 或 ?all=1 参数" }, { status: 400 });
}

/** POST /admin/api/ip-tags — upsert */
export async function POST(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const ip_address = String(body.ip_address || "").trim();
  const tag        = String(body.tag || "") as Tag;
  const note       = body.note != null ? String(body.note).slice(0, 200) : null;

  if (!ip_address) return NextResponse.json({ error: "ip_address 必填" }, { status: 400 });
  if (!VALID_TAGS.includes(tag)) {
    return NextResponse.json(
      { error: `tag 必须是 ${VALID_TAGS.join(" / ")} 之一` },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin()
    .from("ip_tags")
    .upsert(
      { ip_address, tag, note, updated_at: new Date().toISOString() },
      { onConflict: "ip_address" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, tag: data });
}

/** DELETE /admin/api/ip-tags */
export async function DELETE(req: NextRequest) {
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ error: "未授权" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const ip_address = String(body.ip_address || "").trim();
  if (!ip_address) return NextResponse.json({ error: "ip_address 必填" }, { status: 400 });

  const { error } = await supabaseAdmin()
    .from("ip_tags")
    .delete()
    .eq("ip_address", ip_address);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

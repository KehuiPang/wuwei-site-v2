-- p5_ip_tags.sql
-- 1. analytics_events 加明文 IP 字段
-- 2. 新建 ip_tags 表（IP 打标签系统）
-- 执行方式：在 Supabase Dashboard → SQL Editor 粘贴执行

-- ============================================
-- 1. analytics_events 加 ip_address 列
-- ============================================
ALTER TABLE public.analytics_events
  ADD COLUMN IF NOT EXISTS ip_address text;

-- 加索引加速按 IP 查询
CREATE INDEX IF NOT EXISTS idx_analytics_events_ip_address
  ON public.analytics_events (ip_address);

-- ============================================
-- 2. ip_tags 表：持久化 IP 标签
-- ============================================
CREATE TABLE IF NOT EXISTS public.ip_tags (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip_address  text   NOT NULL UNIQUE,           -- 被打标签的 IP（明文）
  tag         text   NOT NULL                   -- 标签类型
              CHECK (tag IN ('self', 'bot', 'real')),
              -- self = 本人/测试  bot = 爬虫/机器人  real = 真实用户
  note        text,                             -- 备注（可选）
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 按标签类型查询加速
CREATE INDEX IF NOT EXISTS idx_ip_tags_tag
  ON public.ip_tags (tag);

-- 只有服务端可读写（service role），RLS 关掉 anon 访问
ALTER TABLE public.ip_tags ENABLE ROW LEVEL SECURITY;

-- 不开 anon / user 策略，全靠 service role key 访问（后台用）

-- p6_feature_flag_rules.sql
-- 无为客户端订阅版灰度开关：规则表
-- 执行方式：在 Supabase Dashboard → SQL Editor 粘贴执行
-- 背景：GET /api/me 按此表判定 flags 字段，命中即返回 ["subscription"]

-- ============================================
-- 1. feature_flag_rules 表
-- ============================================
CREATE TABLE IF NOT EXISTS public.feature_flag_rules (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

  -- 要放开的 feature flag（目前只有 "subscription"）
  flag        text   NOT NULL DEFAULT 'subscription',

  -- 匹配维度（三选一，运营时按需填）
  -- 优先级：user_id > device_id > ip（GET /api/me 判定时依序查）
  user_id     uuid   REFERENCES auth.users ON DELETE CASCADE,
  device_id   text,  -- 客户端 X-Device-Id 头，wd_ 前缀 32hex
  ip          text,  -- 粗粒度兜底（CIDR 或精确 IP，当前仅精确匹配）

  -- 约束：三个维度至少填一个
  CONSTRAINT flag_has_target CHECK (
    user_id IS NOT NULL OR device_id IS NOT NULL OR ip IS NOT NULL
  ),

  note        text,                             -- 运营备注（谁的机器/测试目的等）
  created_at  timestamptz NOT NULL DEFAULT now(),
  created_by  text,                             -- 操作人邮箱（后台记录）

  -- 防重复：同一 flag + 同一目标只一条规则
  UNIQUE NULLS NOT DISTINCT (flag, user_id, device_id, ip)
);

-- 按维度查询加速
CREATE INDEX IF NOT EXISTS idx_ffr_user_id   ON public.feature_flag_rules (user_id)   WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ffr_device_id ON public.feature_flag_rules (device_id) WHERE device_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ffr_ip        ON public.feature_flag_rules (ip)        WHERE ip IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ffr_flag      ON public.feature_flag_rules (flag);

-- 只有 service role 可读写（后台自用），关掉 anon / 用户级 RLS
ALTER TABLE public.feature_flag_rules ENABLE ROW LEVEL SECURITY;
-- 无需 anon policy；后台和 /api/me 用 service key 访问

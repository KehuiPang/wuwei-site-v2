-- P3 · 无为币积分体系 + 运营配置表
-- 目标：让运营人员随时调整积分参数，无需改代码
-- 跑法：Session pooler(5432) 连接后执行；或 Supabase SQL Editor 粘贴

-- ============ 1. 积分核心配置（运营后台可改） ============
-- 用 site_config 扩展，key 以 "wuwei_coin." 为前缀
-- 也可独立建表，这里先沿用 site_config 键值设计（已有 infrastructure）

-- 但为了更好的类型安全和查询效率，新建专门的运营配置表

create table if not exists operation_config (
  key        text primary key,                          -- 配置键
  value      jsonb not null,                            -- 配置值（结构化 JSON）
  category   text not null default 'general',           -- 分类：coin / pricing / model / promotion
  label      text not null,                             -- 中文显示名
  description text,                                     -- 说明
  updated_at timestamptz not null default now(),
  updated_by text                                        -- 最后修改人邮箱
);

-- 允许服务端 service key 读写，前台匿名只读（通过 RLS）
alter table operation_config enable row level security;

-- 匿名只读（前台展示用）
create policy if not exists "anon_read_operation_config"
  on operation_config for select to anon using (true);

-- 认证用户只读

create policy if not exists "auth_read_operation_config"
  on operation_config for select to authenticated using (true);

-- 写操作只有 service_role（服务端 Server Action）能做，不建 policy = 默认拒绝

-- ============ 2. 积分流水表 ============
create table if not exists coin_transactions (
  id           bigint generated always as identity primary key,
  user_id      uuid not null,                           -- 关联 auth.users
  type         text not null check (type in ('earn','spend','adjust','expire','refund','gift')),
  amount       integer not null,                        -- 正=增加，负=减少
  balance_after integer not null,                        -- 变动后余额
  source       text not null,                           -- 来源：signin / pro_gift / recharge / model_usage / file_analysis / web_search / code_exec / manual / invite / promo
  description  text,                                    -- 描述
  meta         jsonb not null default '{}'::jsonb,      -- 扩展信息
  created_at   timestamptz not null default now()
);
create index if not exists idx_ct_user on coin_transactions (user_id, created_at desc);
create index if not exists idx_ct_type on coin_transactions (type, created_at desc);
create index if not exists idx_ct_source on coin_transactions (source, created_at desc);

-- 积分流水：用户自己可见
alter table coin_transactions enable row level security;
create policy if not exists "user_own_transactions"
  on coin_transactions for select to authenticated using (user_id = auth.uid());

-- ============ 3. 用户积分余额表（冗余，避免频繁聚合） ============
create table if not exists user_coin_balance (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  balance      integer not null default 0,             -- 当前余额
  total_earned integer not null default 0,             -- 累计获得
  total_spent  integer not null default 0,             -- 累计消耗
  last_signin  date,                                    -- 最后签到日
  signin_streak integer not null default 0,            -- 连续签到天数
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table user_coin_balance enable row level security;
create policy if not exists "user_own_balance"
  on user_coin_balance for select to authenticated using (user_id = auth.uid());

-- ============ 4. 操作日志表（记录所有配置变更） ============
create table if not exists operation_logs (
  id           bigint generated always as identity primary key,
  admin_email  text not null,                           -- 操作人
  action       text not null,                           -- 动作：update_config / adjust_balance / 等
  target_table text,                                    -- 目标表
  target_key   text,                                    -- 目标键
  old_value    jsonb,                                   -- 旧值
  new_value    jsonb,                                   -- 新值
  ip_hash      text,                                    -- 操作人 IP 哈希
  user_agent   text,                                    -- UA
  created_at   timestamptz not null default now()
);
create index if not exists idx_ol_admin on operation_logs (admin_email, created_at desc);
create index if not exists idx_ol_action on operation_logs (action, created_at desc);

-- 操作日志：只有服务端 service key 可读写，不建 policy = 默认拒绝
alter table operation_logs enable row level security;

-- ============ 5. 模型消耗配置（运营可调整各模型积分消耗比例） ============
-- 也走 operation_config，key = model_cost.claude / model_cost.gpt 等
-- 但为了更好的结构，这里定义标准 key 格式

-- ============ 6. 种子数据：积分体系默认配置 ============
insert into operation_config (key, value, category, label, description) values
  -- 积分兑换
  ('coin.exchange_rate', '{"cny_per_coin": 0.01, "coins_per_yuan": 100}'::jsonb, 'coin', '积分兑换比例', '1元 = 100无为币'),
  ('coin.signin_reward', '{"free": 10, "pro": 20, "pro_annual": 30}'::jsonb, 'coin', '每日签到奖励', '免费版/Pro月付/Pro年付 每日签到奖励无为币数'),
  ('coin.pro_gift', '{"monthly": 1000, "annual": 12000}'::jsonb, 'coin', 'Pro赠送额度', 'Pro月付/年付 每月赠送无为币数'),
  ('coin.expiry', '{"free_days": 30, "recharge_permanent": true}'::jsonb, 'coin', '积分有效期', '免费获取积分有效期(天)，付费充值永久有效'),
  
  -- 促销配置
  ('promotion.first_month', '{"discount_percent": 20, "enabled": true}'::jsonb, 'promotion', '首月优惠', '首月订阅折扣百分比'),
  ('promotion.renewal', '{"discount_percent": 10, "enabled": false}'::jsonb, 'promotion', '续费折扣', '续费折扣百分比'),
  ('promotion.invite', '{"inviter_reward": 100, "invitee_reward": 50, "enabled": true}'::jsonb, 'promotion', '邀请返利', '邀请人/被邀请人奖励无为币'),
  
  -- 模型消耗比例（以 1 次标准对话 = 1 无为币 为基准）
  ('model_cost.claude', '{"name": "Claude", "cost_per_msg": 1.5, "cost_per_1k_tokens": 0.5}'::jsonb, 'model', 'Claude 消耗', 'Claude 模型每次对话/每千 token 消耗'),
  ('model_cost.gpt', '{"name": "GPT", "cost_per_msg": 1.0, "cost_per_1k_tokens": 0.3}'::jsonb, 'model', 'GPT 消耗', 'GPT 模型每次对话/每千 token 消耗'),
  ('model_cost.kimi', '{"name": "Kimi", "cost_per_msg": 0.8, "cost_per_1k_tokens": 0.2}'::jsonb, 'model', 'Kimi 消耗', 'Kimi 模型每次对话/每千 token 消耗'),
  ('model_cost.deepseek', '{"name": "DeepSeek", "cost_per_msg": 0.5, "cost_per_1k_tokens": 0.1}'::jsonb, 'model', 'DeepSeek 消耗', 'DeepSeek 模型每次对话/每千 token 消耗'),
  
  -- 功能额外消耗
  ('feature_cost.file_analysis', '{"cost_per_file": 2, "enabled": true}'::jsonb, 'model', '文件分析消耗', '每次文件分析额外消耗无为币'),
  ('feature_cost.web_search', '{"cost_per_search": 3, "enabled": true}'::jsonb, 'model', '联网搜索消耗', '每次联网搜索额外消耗无为币'),
  ('feature_cost.code_exec', '{"cost_per_exec": 1, "enabled": true}'::jsonb, 'model', '代码执行消耗', '每次代码执行额外消耗无为币')

on conflict (key) do update set
  value = excluded.value,
  category = excluded.category,
  label = excluded.label,
  description = excluded.description,
  updated_at = now();

-- ============ 7. 看板视图 ============
-- 每日积分发放统计
create or replace view v_coin_daily_stats as
select date_trunc('day', created_at) as day,
       count(*) filter (where type = 'earn') as earn_count,
       sum(amount) filter (where type = 'earn') as earn_total,
       count(*) filter (where type = 'spend') as spend_count,
       sum(abs(amount)) filter (where type = 'spend') as spend_total,
       count(*) filter (where type = 'adjust') as adjust_count,
       sum(amount) filter (where type = 'adjust') as adjust_total
from coin_transactions
group by 1 order by 1 desc;

-- 按来源统计积分消耗
create or replace view v_coin_by_source as
select source,
       count(*) as tx_count,
       sum(abs(amount)) as total_amount,
       avg(abs(amount)) as avg_amount
from coin_transactions
where type = 'spend'
group by source
order by total_amount desc;

-- 用户积分排行（Top 100）
create or replace view v_user_coin_rank as
select user_id, balance, total_earned, total_spent, updated_at
from user_coin_balance
order by balance desc
limit 100;

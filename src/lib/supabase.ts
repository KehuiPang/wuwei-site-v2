import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// Vercel 生产配的是 SUPABASE_SECRET_KEY；旧名 SUPABASE_SERVICE_ROLE_KEY 做兼容兜底
const serviceKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 前台只读（匿名 key）。env 缺失时用占位值避免模块加载 throw，查询失败由 data.ts 兜底
export const supabasePublic = () =>
  createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'missing-anon-key',
    { auth: { persistSession: false } }
  )

// 服务端写入（service key，只在 route handler / server 用，绝不下发浏览器）
// env 缺失时用占位 key 创建（createClient 本身不 throw），查询会失败并由调用方
// 既有的 try/catch 降级——绝不因配置缺失让模块加载或页面渲染炸掉
export const supabaseAdmin = () =>
  createClient(supabaseUrl || 'https://placeholder.supabase.co', serviceKey || 'missing-service-key', {
    auth: { persistSession: false },
  })

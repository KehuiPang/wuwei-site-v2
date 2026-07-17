"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setSiteTheme, type Theme } from "@/lib/site-config";

// 后台改主题的 Server Action —— 全程在服务端执行：
//   · 口令校验用 ADMIN_ACCESS_KEY（server-only env，绝不下发浏览器）
//   · setSiteTheme 用 service key 写 site_config.theme（server-only）
//   · 写完 revalidatePath('/', 'layout') 让 layout(读主题) + 所有页面重渲染
// 安全：service key / 口令都只在此服务端函数内使用，浏览器 bundle 拿不到。
export async function updateThemeAction(formData: FormData) {
  const key = String(formData.get("key") ?? "");
  const theme = String(formData.get("theme") ?? "") as Theme;

  const expected = process.env.ADMIN_ACCESS_KEY ?? "";
  // 口令错：回登录态(不带 key)，避免把错误 key 拼回 URL。
  if (!expected || key !== expected) {
    redirect("/admin?err=auth");
  }
  if (theme !== "dark" && theme !== "light") {
    redirect(`/admin?key=${encodeURIComponent(key)}&err=bad`);
  }

  await setSiteTheme(theme);
  // 整站换肤：layout 读 site_config.theme，重验证根 layout 下全部路由
  revalidatePath("/", "layout");
  // 保留 key，让跳转回的 /admin 仍能通过访问校验
  redirect(`/admin?key=${encodeURIComponent(key)}&ok=${theme}`);
}

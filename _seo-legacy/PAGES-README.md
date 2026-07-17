# 无为官网落地页 · 骨架说明（给文案 & CEO）

**性质**：本周救急 5 页的**可落地骨架**，管线已跑通。文案（小文）直接往标注区填/改即可，无需碰结构与样式。**未部署上线**，等文案 + CEO 终检。

## 目录结构（零构建纯静态，clean URL）
```
wuwei-site/
├─ assets/vi.css                        # 全站共享 VI 设计系统（改色/组件只动这里）
├─ index.html                           # 现有首页（保留）
├─ wuwei-vs-claude-code/index.html      # ★样板页(中) 已跑通，含事实区+对比表+CTA
├─ en/wuwei-vs-claude-code/index.html   # ★样板页(英) 演示中英分流
├─ claude-code-account-banned/index.html      # 骨架(中)
├─ claude-code-free-alternative/index.html    # 骨架(中) 含对比表
├─ claude-code-alternative/index.html         # 骨架(英)
├─ wispr-flow-free-alternative/index.html     # 骨架(中) 含对比表
├─ sitemap.xml  robots.txt              # SEO 基建
└─ PAGES-README.md
```
- 每个 slug 一个目录 + `index.html` → 访问 `/wuwei-vs-claude-code` 即命中（CF Pages 自动把 `/x/index.html` 映射到 `/x`）。
- 中文页在根 slug，英文页在 `/en/`（或按救急页 3 的英文根 slug）。

## 文案怎么填
1. 找带 `data-fill` 标记或 `[文案：...]` 占位的地方，替换成正式文案。填完把 `data-fill` 属性删掉（编辑期它会显示虚线框提示，上线前应清掉）。
2. **改文字就好，别动标签结构和 class**。
3. 每页 `<head>` 里的 `<title>` / `description` 是 SEO 命门——按目标关键词写，title ≤60 字、description ≤155 字。

## 品牌红线（VI + 文案，来自作战清单〇章，务必守）
- **朱色 `#C05F3C` 只给"那一个"主 CTA 按钮**（免费下载）。全站朱色面积 ≤10%，别乱用。次要动作用描边 `.btn-ghost`。
- 色板：玄墨黑 `#16191E` 底、月白 `#F4F6F8` 字、靛青 `#274A63`/竹青 `#5C8A73` 点缀。大留白、禁花哨渐变/重阴影。
- 文案：返璞归真、不叫卖；免费讲成"应当如此"；杜绝"史上最强/秒杀/吊打"。
- **信任对比页事实区**：只引用报告 H 章一手来源，"据公开报道"客观陈述——**上线前 CEO 必须逐句过一遍事实与措辞**（法律与品牌风险）。当前事实区已挂 3 条真实来源链接（Tom's Hardware / 观察者网 / BigGo），措辞是占位，待 CEO 核。
- 交回 CEO 时附一句"已过品牌自检"。

## CTA 落点（download 链接待定）
当前 CTA 指向 `/#download`（本尊）与 `/#download-voice`（Voice），是占位锚点。等下载页/下载区就绪后统一替换真实下载地址。

## 部署（CF Pages，等 CEO 放行，先别上线）
1. Cloudflare Dashboard → Pages → Create → 连 GitHub 仓 `wuwei-site`（迁到组织后连组织下的仓）。
2. 框架预设：**None（纯静态）**；Build command：留空；Build output directory：`/`（仓库根）。
3. 自定义域 `wuweiai.io` 绑定到该 Pages 项目。
4. 部署后 Google Search Console 提交 `sitemap.xml`，盯这批页收录。

## 本地预览
```bash
cd wuwei-site && python3 -m http.server 5188
# 浏览器开 http://localhost:5188/wuwei-vs-claude-code/
```

## 待补（非本周阻塞）
- OG 分享大图（现仅文字 og）、真实下载链接、docs/ 截图/演示图、favicon 换正式 logo。

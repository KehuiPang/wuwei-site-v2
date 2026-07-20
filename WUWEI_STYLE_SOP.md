# 无为官网式风格 · 设计 SOP

> 版本：v1.0 · 2026-07-20
> 定位：所有无为系产品落地页/官网的**统一视觉与结构标准**
> 铁律：不读此 SOP，不动手做新页面

---

## 一、风格定义

**「无为官网式风格」** = 暗色玄墨为底、月白为字、一点朱为火种，空灵留白、premium 质感、高辨识度的东方科技美学。

**核心气质**：空 · 静 · 深 · 暖（一点朱）

---

## 二、色彩系统（Design Tokens）

所有颜色必须从 `brand-tokens.css` 取用，禁止自造色值。

### 品牌五色（权威）

| 名称 | 变量 | 色值 | 用途 |
|---|---|---|---|
| 玄墨黑 | `--color-ink` | #16191E | 页面底色（暗色主题） |
| 月白 | `--color-paper` | #F4F6F8 | 主文字 |
| 靛青 | `--color-water` | #274A63 | 链接 / 导航 / 水意 |
| 淡青 | `--color-water-light` | #6F9FAD | hover / focus / info / eyebrow |
| 竹青 | `--color-bamboo` | #5C8A73 | 成功 / 生机（约10%） |
| 一点朱 | `--color-spark` | #C05F3C | CTA / 火种 / 强调（≤10%面积） |

### 暗色主题扩展色

| 用途 | 变量 | 色值 |
|---|---|---|
| 次文字 | `--mist` | #B7C0C7 |
| 三级文字 | `--mist2` | #8B949D |
| 弱文字 | `--mute` | #6E7780 |
| 描边 | `--line` | #242B34 |
| 描边2 | `--line2` | #2C343E |
| 卡片面 | `--surface` | rgba(26,31,38,.5) |
| 导航底 | `--nav-bg` | rgba(20,23,28,.72) |
| 光晕 | `--hero-glow` | #1D2630 |

### 铁律

- **一点朱 ≤10% 面积**：仅用于单个 CTA、强调字、图标激活态
- **终端 mock 窗口**：两套主题都保持深色（产品截图观感）
- **禁止**：高饱和亮色、纯白底（暗色主题下）、多彩渐变

---

## 三、页面结构（固定板块）

所有落地页必须按此顺序组织，可增删但不可乱序：

```
┌─────────────────────────────────────┐
│  1. Nav 导航（毛玻璃 sticky）        │
│     - 品牌 Logo + 名称               │
│     - 锚点链接（功能/怎么用/故事/定价）│
│     - 语言切换 + CTA 按钮            │
├─────────────────────────────────────┤
│  2. Hero 首屏（冲击力核心）          │
│     - 大 Logo（带光晕）              │
│     - H1 渐变标题 + 朱色强调字        │
│     - 英文 slogan（淡青，大写字距）   │
│     - 价值主张（VP）                 │
│     - 标签云（claims）               │
│     - 双按钮：主CTA(朱) + 次按钮(描边) │
│     - 平台支持说明                    │
│     - 【可选】产品演示 mock 窗口       │
│     - 信任背书（模型/技术 logos）      │
├─────────────────────────────────────┤
│  3. Turn 转折（对比冲击）            │
│     - 旧方式 vs 新方式 左右对比        │
│     - 箭头 → 强调转变                 │
├─────────────────────────────────────┤
│  4. Why 价值区块（3列）              │
│     - eyebrow + H2 + lead            │
│     - 3 个核心价值卡片（编号+标题+描述）│
├─────────────────────────────────────┤
│  5. Features 功能详解（交替布局）      │
│     - 每功能：tag + H3 + 描述 + 列表   │
│     - 右侧/左侧：终端 mock 窗口        │
│     - 交替反转（rev）                 │
├─────────────────────────────────────┤
│  6. How 三步流程                     │
│     - 数字编号（一/二/三）            │
│     - 简洁步骤说明                    │
├─────────────────────────────────────┤
│  7. Scenarios 场景（4列图标卡片）     │
│     - 图标 + 人群 + 场景描述          │
├─────────────────────────────────────┤
│  8. Compare 对比（2列）              │
│     - 他们 vs 我们                   │
│     - 我们侧用朱色强调                │
├─────────────────────────────────────┤
│  9. Story 品牌故事（光晕背景）        │
│     - 圆相符号 + 品牌哲学             │
│     - 签名收尾                        │
├─────────────────────────────────────┤
│  10. Pricing 定价（3卡片）            │
│      - 免费/Pro/年付                  │
│      - Pro 卡片突出（feat）           │
├─────────────────────────────────────┤
│  11. Final 最终 CTA                  │
│      - 大标题 + 副文案 + 双按钮        │
├─────────────────────────────────────┤
│  12. Footer 页脚                     │
│      - 品牌 + 锚点菜单 + 版权         │
└─────────────────────────────────────┘
```

---

## 四、组件规范

### 1. 按钮

```css
/* 主按钮 · 一点朱 */
.btn-p {
  background: var(--color-spark);
  color: #fff;
  padding: 15px 30px;
  border-radius: 13px;
  box-shadow: 0 10px 30px -8px rgba(192,95,60,.6);
}
.btn-p:hover {
  background: var(--color-spark-hover);
  transform: translateY(-2px);
}

/* 次按钮 · 描边 */
.btn-g {
  border: 1px solid var(--line2);
  color: #DDE3E8;
  padding: 15px 26px;
  border-radius: 13px;
}
.btn-g:hover {
  border-color: var(--color-water-light);
  background: rgba(111,159,173,.08);
}
```

### 2. 标题

```css
/* H1 · 渐变 + 朱色强调 */
.hero h1 {
  font-size: clamp(38px, 8vw, 72px);
  font-weight: 600;
  letter-spacing: clamp(3px, 1.3vw, 10px);
  background: linear-gradient(92deg, #F4F6F8, #AEB8C0);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero h1 .spark {
  color: var(--color-spark);
  -webkit-text-fill-color: var(--color-spark);
}

/* H2 · 区块标题 */
.h2 {
  font-size: clamp(26px, 4.4vw, 42px);
  font-weight: 600;
  letter-spacing: 2px;
}
.h2 .zhu { color: var(--color-spark); }
```

### 3. 卡片

```css
/* 价值卡片 */
.val {
  background: linear-gradient(180deg, var(--card-a), var(--card-b));
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 28px;
}

/* 场景卡片 */
.scene {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 24px;
  text-align: center;
}
```

### 4. 终端 Mock 窗口

```css
.mock {
  background: #1a1f26;  /* 固定深色，不随主题变 */
  border: 1px solid var(--line2);
  border-radius: 12px;
  overflow: hidden;
}
.mock .bar {
  background: rgba(0,0,0,.3);
  padding: 10px 14px;
  display: flex;
  gap: 6px;
}
.mock .bar i {
  width: 10px; height: 10px; border-radius: 50%;
}
/* 三色点：红 #e0645a / 黄 #e2b34a / 绿 #5fb87a */
```

### 5. 动画

```css
/* Reveal 入场 */
.rv {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity .7s ease, transform .7s ease;
}
.rv.in {
  opacity: 1;
  transform: none;
}
```

---

## 五、文案规范

### 字体

```css
font-family: "Noto Sans CJK SC", "Source Han Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
```

### 字阶

| 层级 | 大小 | 字重 | 用途 |
|---|---|---|---|
| H1 | clamp(38px, 8vw, 72px) | 600 | Hero 大标题 |
| H2 | clamp(26px, 4.4vw, 42px) | 600 | 区块标题 |
| H3 | 20-24px | 600 | 功能标题 |
| H4 | 16-18px | 600 | 卡片标题 |
| body | 15-16px | 400 | 正文 |
| lead | clamp(15px, 2.3vw, 18px) | 400 | 区块导语 |
| small | 13-14px | 400 | 辅助说明 |

### 文案调性

- **东方哲学**：圆相、一念、无为、事成
- **简洁有力**：短句、不啰嗦、有节奏感
- **对比冲击**：旧 vs 新、他们 vs 我们
- **口语化**：说人话、不装、亲切

---

## 六、布局参数

| 参数 | 值 |
|---|---|
| 最大宽度 | 1180px |
| 水平内边距 | clamp(20px, 5vw, 60px) |
| 区块垂直间距 | clamp(60px, 10vw, 100px) |
| 卡片圆角 | 12-16px |
| 按钮圆角 | 13px |
| 描边宽度 | 1px |

---

## 七、响应式断点

```css
/* 移动端优先 */
@media (max-width: 768px) {
  .nav-links { display: none; }  /* 隐藏锚点，保留 CTA */
  .frow { flex-direction: column; }  /* 功能区块垂直堆叠 */
  .vals, .scenes { grid-template-columns: 1fr; }  /* 单列 */
  .cmp { grid-template-columns: 1fr; }  /* 对比垂直 */
}
```

---

## 八、文件组织

```
src/app/
├── brand-tokens.css      # 色彩真源（所有页面必引）
├── landing.css           # 官网式风格样式（可复用/扩展）
├── page.tsx              # 官网首页（基准参考）
├── voice/                # 新产品：语音工具
│   └── page.tsx          # 按本 SOP 实现
├── shot/                 # 新产品：截图工具
│   └── page.tsx          # 按本 SOP 实现
└── [product]/            # 未来新产品
    └── page.tsx          # 按本 SOP 实现
```

---

## 九、检查清单（Go/No-Go）

新页面上线前，必须逐项核对：

- [ ] 使用 `brand-tokens.css` 色彩，无自造色值
- [ ] 暗色主题：玄墨黑底 + 月白字
- [ ] 一点朱 ≤10% 面积，仅用于 CTA/强调
- [ ] 12 个板块按序排列（可减不可乱）
- [ ] H1 渐变 + 朱色强调字
- [ ] 毛玻璃 sticky 导航
- [ ] 终端 mock 窗口深色固定
- [ ] Reveal 入场动画
- [ ] 响应式移动端适配
- [ ] 文案调性符合东方哲学 + 简洁有力
- [ ] `next build` 通过

---

## 十、参考实现

- **基准页面**：`/src/app/page.tsx`（官网首页）
- **样式真源**：`/src/app/landing.css`
- **色彩真源**：`/src/app/brand-tokens.css`
- **文案参考**：知识宫殿 `0.无为品牌中心/产品中心/落地页文案/`

---

> 一念既出，万事自成。风格既定，万物可生。

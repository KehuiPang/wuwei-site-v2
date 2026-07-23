// 定价 fallback 数据（数据库不可用时兜底）
export const FALLBACK_PLANS_CN = [
  {
    plan_key: "free",
    name: "免费版",
    price: 0,
    currency: "CNY",
    period: "month",
    features: ["核心功能全开", "自带自己的 key", "永久免费"],
  },
  {
    plan_key: "pro",
    name: "无为 Pro",
    price: 29,
    currency: "CNY",
    period: "month",
    features: ["托管额度", "更长上下文", "更高并发"],
    badge: "最受欢迎",
  },
  {
    plan_key: "annual",
    name: "无为 Pro 年付",
    price: 288,
    currency: "CNY",
    period: "year",
    features: ["≈¥24/月", "付10月送2月"],
  },
];

export const FALLBACK_PLANS_EN = [
  {
    plan_key: "free",
    name: "Free",
    price: 0,
    currency: "USD",
    period: "month",
    features: ["All core features", "Bring your own key", "Free forever"],
  },
  {
    plan_key: "pro",
    name: "Wuwei Pro",
    price: 4.99,
    currency: "USD",
    period: "month",
    features: ["Hosted credits", "Longer context", "Higher concurrency"],
    badge: "Most popular",
  },
  {
    plan_key: "annual",
    name: "Wuwei Pro Annual",
    price: 49,
    currency: "USD",
    period: "year",
    features: ["≈$4.08/mo", "Pay 10 months, get 2 free"],
  },
];

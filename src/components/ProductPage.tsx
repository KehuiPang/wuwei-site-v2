// 三产品详情页共享骨架（服务端渲染）。内容来自 lib/products.ts（非机翻，源自品牌中心）。
// 结构：品牌壳(SiteHeader) + hero(可选 opening 引子 + 圆相 + h1 + sub + 主CTA + 次级链接)
//       + 5 卖点卡 + 收尾 + SiteFooter。VI token 全走 spark/water/bamboo，一点朱只给主 CTA。
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { CircleMark, FeatureCard, TextLink } from "./ui";
import { CTAButton } from "./CTAButton";
import { Track } from "./Track";
import type { ProductContent } from "@/lib/products";
import type { Locale } from "@/lib/site";

export function ProductPage({
  content,
  locale,
  trackPath,
  downloadHref,
}: {
  content: ProductContent;
  locale: Locale;
  trackPath: string;
  downloadHref: string; // 主 CTA 去处（默认回首页下载区）
}) {
  const { hero, cta, secondary, features, closing } = content;
  return (
    <>
      <SiteHeader locale={locale} />
      <Track path={trackPath} />

      <main className="flex-1">
        {/* ————— Hero ————— */}
        <section className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center rise">
          {/* 引子（无为念/无为截 有故事式开场；无为本尊无） */}
          {hero.opening && hero.opening.length > 0 && (
            <div className="mb-10 space-y-2 text-inkmute leading-relaxed">
              {hero.opening.map((line, i) => (
                <p key={i} className={i === hero.opening!.length - 1 ? "text-ink font-medium" : ""}>
                  {line}
                </p>
              ))}
            </div>
          )}

          <div className="flex justify-center mb-9"><CircleMark size={52} /></div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-ink leading-[1.12]">
            {hero.h1}
          </h1>
          <p className="mt-7 text-lg text-inkmute leading-relaxed max-w-2xl mx-auto">
            {hero.sub}
          </p>

          {/* 主 CTA —— 唯一朱赭实心按钮 */}
          <div className="mt-11 flex flex-col items-center gap-4">
            <CTAButton href={downloadHref} label={`${trackPath}#cta`}>{cta}</CTAButton>
            {secondary && (
              <TextLink href={secondary.href}>{secondary.label}</TextLink>
            )}
          </div>
        </section>

        {/* ————— 5 卖点 ————— */}
        <section className="max-w-4xl mx-auto px-6 py-16 border-t border-mist">
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} title={f.t} desc={f.d} />
            ))}
          </div>
        </section>

        {/* ————— 场景展示（无为念专属） ————— */}
        {trackPath === "/nian" && (
          <section className="max-w-4xl mx-auto px-6 py-16 border-t border-mist">
            <h2 className="text-2xl font-semibold text-ink text-center mb-12">它这样帮你</h2>
            <div className="space-y-12">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-water mb-2">写代码注释，说到哪写到哪</h3>
                  <p className="text-inkmute leading-relaxed">写函数注释、提交信息，不用停下手去敲键盘。按住说话，字直接落进编辑器，思路不断。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-surface rounded-xl border border-mist flex items-center justify-center text-mute text-sm">场景示意</div>
              </div>
              <div className="flex flex-col sm:flex-row-reverse items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-water mb-2">回消息写文档，说话成文</h3>
                  <p className="text-inkmute leading-relaxed">微信回复、邮件、文档初稿，说出来就是一段能直接发的文字。口误、重复、缺的标点，它顺手补齐。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-surface rounded-xl border border-mist flex items-center justify-center text-mute text-sm">场景示意</div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-water mb-2">中英文混说，它都接得住</h3>
                  <p className="text-inkmute leading-relaxed">技术名词、英文术语、人名地名，混着说也能准确识别。自带私人记忆库，越用越懂你。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-surface rounded-xl border border-mist flex items-center justify-center text-mute text-sm">场景示意</div>
              </div>
            </div>
          </section>
        )}

        {/* ————— 对比（无为念专属） ————— */}
        {trackPath === "/nian" && (
          <section className="max-w-3xl mx-auto px-6 py-16 border-t border-mist">
            <h2 className="text-2xl font-semibold text-ink text-center mb-8">和打字，不一样</h2>
            <div className="overflow-x-auto rounded-2xl border border-mist">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bg-soft">
                    <th className="px-4 py-3 text-left font-semibold text-ink">你在乎的</th>
                    <th className="px-4 py-3 text-left font-semibold text-spark">无为念</th>
                    <th className="px-4 py-3 text-left font-semibold text-ink">传统打字</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-mist">
                    <td className="px-4 py-3 align-top font-medium text-ink">速度</td>
                    <td className="px-4 py-3 align-top text-water">说话多快，字就多快</td>
                    <td className="px-4 py-3 align-top text-inkmute">一分钟几十字，手酸</td>
                  </tr>
                  <tr className="border-t border-mist">
                    <td className="px-4 py-3 align-top font-medium text-ink">思路</td>
                    <td className="px-4 py-3 align-top text-water">说话不断，思路不断</td>
                    <td className="px-4 py-3 align-top text-inkmute">打字打断思考，卡壳</td>
                  </tr>
                  <tr className="border-t border-mist">
                    <td className="px-4 py-3 align-top font-medium text-ink">修改</td>
                    <td className="px-4 py-3 align-top text-water">AI 自动润色，直接能发</td>
                    <td className="px-4 py-3 align-top text-inkmute">自己删改，来回折腾</td>
                  </tr>
                  <tr className="border-t border-mist">
                    <td className="px-4 py-3 align-top font-medium text-ink">价格</td>
                    <td className="px-4 py-3 align-top text-water">免费，开源</td>
                    <td className="px-4 py-3 align-top text-inkmute">输入法会员、语音转写收费</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ————— 场景展示（无为念专属） ————— */}
        {trackPath === "/nian" && (
          <section className="max-w-4xl mx-auto px-6 py-16 border-t border-mist">
            <h2 className="text-2xl font-semibold text-ink text-center mb-12">它这样帮你</h2>
            <div className="space-y-12">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-water mb-2">写代码注释，说到哪写到哪</h3>
                  <p className="text-inkmute leading-relaxed">写函数注释、提交信息，不用停下手去敲键盘。按住说话，字直接落进编辑器，思路不断。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-surface rounded-xl border border-mist flex items-center justify-center text-mute text-sm">场景示意</div>
              </div>
              <div className="flex flex-col sm:flex-row-reverse items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-water mb-2">回消息写文档，说话成文</h3>
                  <p className="text-inkmute leading-relaxed">微信回复、邮件、文档初稿，说出来就是一段能直接发的文字。口误、重复、缺的标点，它顺手补齐。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-surface rounded-xl border border-mist flex items-center justify-center text-mute text-sm">场景示意</div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-water mb-2">中英文混说，它都接得住</h3>
                  <p className="text-inkmute leading-relaxed">技术名词、英文术语、人名地名，混着说也能准确识别。自带私人记忆库，越用越懂你。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-surface rounded-xl border border-mist flex items-center justify-center text-mute text-sm">场景示意</div>
              </div>
            </div>
          </section>
        )}

        {/* ————— 对比（无为念专属） ————— */}
        {trackPath === "/nian" && (
          <section className="max-w-3xl mx-auto px-6 py-16 border-t border-mist">
            <h2 className="text-2xl font-semibold text-ink text-center mb-8">和打字，不一样</h2>
            <div className="overflow-x-auto rounded-2xl border border-mist">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bg-soft">
                    <th className="px-4 py-3 text-left font-semibold text-ink">你在乎的</th>
                    <th className="px-4 py-3 text-left font-semibold text-spark">无为念</th>
                    <th className="px-4 py-3 text-left font-semibold text-ink">传统打字</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-mist">
                    <td className="px-4 py-3 align-top font-medium text-ink">速度</td>
                    <td className="px-4 py-3 align-top text-water">说话多快，字就多快</td>
                    <td className="px-4 py-3 align-top text-inkmute">一分钟几十字，手酸</td>
                  </tr>
                  <tr className="border-t border-mist">
                    <td className="px-4 py-3 align-top font-medium text-ink">思路</td>
                    <td className="px-4 py-3 align-top text-water">说话不断，思路不断</td>
                    <td className="px-4 py-3 align-top text-inkmute">打字打断思考，卡壳</td>
                  </tr>
                  <tr className="border-t border-mist">
                    <td className="px-4 py-3 align-top font-medium text-ink">修改</td>
                    <td className="px-4 py-3 align-top text-water">AI 自动润色，直接能发</td>
                    <td className="px-4 py-3 align-top text-inkmute">自己删改，来回折腾</td>
                  </tr>
                  <tr className="border-t border-mist">
                    <td className="px-4 py-3 align-top font-medium text-ink">价格</td>
                    <td className="px-4 py-3 align-top text-water">免费，开源</td>
                    <td className="px-4 py-3 align-top text-inkmute">输入法会员、语音转写收费</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ————— 场景展示（截图工具专属） ————— */}
        {trackPath === "/shot" && (
          <section className="max-w-4xl mx-auto px-6 py-16 border-t border-mist">
            <h2 className="text-2xl font-semibold text-ink text-center mb-12">它这样帮你</h2>
            <div className="space-y-12">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-water mb-2">看外文资料，一框就译</h3>
                  <p className="text-inkmute leading-relaxed">看到一段英文文档、日文说明，不用切翻译软件。框住它，译文直接浮在原文旁边，看完即走。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-surface rounded-xl border border-mist flex items-center justify-center text-mute text-sm">场景示意</div>
              </div>
              <div className="flex flex-col sm:flex-row-reverse items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-water mb-2">报错信息，一框就懂</h3>
                  <p className="text-inkmute leading-relaxed">终端里蹦出一串报错，不用复制去搜。框住它，AI 直接告诉你什么意思、怎么修。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-surface rounded-xl border border-mist flex items-center justify-center text-mute text-sm">场景示意</div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-water mb-2">图表数据，一框就解</h3>
                  <p className="text-inkmute leading-relaxed">看到一张图表、一个数据看板，框住它，AI 帮你解读趋势、提取关键数字。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-surface rounded-xl border border-mist flex items-center justify-center text-mute text-sm">场景示意</div>
              </div>
            </div>
          </section>
        )}

        {/* ————— 对比（截图工具专属） ————— */}
        {trackPath === "/shot" && (
          <section className="max-w-3xl mx-auto px-6 py-16 border-t border-mist">
            <h2 className="text-2xl font-semibold text-ink text-center mb-8">和传统截图，不一样</h2>
            <div className="overflow-x-auto rounded-2xl border border-mist">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-bg-soft">
                    <th className="px-4 py-3 text-left font-semibold text-ink">你在乎的</th>
                    <th className="px-4 py-3 text-left font-semibold text-spark">无为截</th>
                    <th className="px-4 py-3 text-left font-semibold text-ink">传统截图</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-mist">
                    <td className="px-4 py-3 align-top font-medium text-ink">截完能干嘛</td>
                    <td className="px-4 py-3 align-top text-water">翻译、识别、问 AI、直接行动</td>
                    <td className="px-4 py-3 align-top text-inkmute">只能复制粘贴，自己看懂</td>
                  </tr>
                  <tr className="border-t border-mist">
                    <td className="px-4 py-3 align-top font-medium text-ink">外文内容</td>
                    <td className="px-4 py-3 align-top text-water">一框就译，不用切软件</td>
                    <td className="px-4 py-3 align-top text-inkmute">截完再开翻译软件，复制粘贴</td>
                  </tr>
                  <tr className="border-t border-mist">
                    <td className="px-4 py-3 align-top font-medium text-ink">报错/代码</td>
                    <td className="px-4 py-3 align-top text-water">一框就懂，直接给解决方案</td>
                    <td className="px-4 py-3 align-top text-inkmute">截完去搜索引擎，慢慢翻</td>
                  </tr>
                  <tr className="border-t border-mist">
                    <td className="px-4 py-3 align-top font-medium text-ink">价格</td>
                    <td className="px-4 py-3 align-top text-water">免费，开源</td>
                    <td className="px-4 py-3 align-top text-inkmute">部分功能收费，或捆绑销售</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ————— 收尾 ————— */}
        <section className="max-w-2xl mx-auto px-6 py-20 border-t border-mist text-center">
          <p className="text-lg text-inkmute leading-relaxed">{closing}</p>
          <div className="mt-9 flex justify-center">
            <CTAButton href={downloadHref} label={`${trackPath}#closing-cta`}>{cta}</CTAButton>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}

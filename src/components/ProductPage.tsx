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
        {/* ————— Hero（跟官网首页风格统一） ————— */}
        <section className="relative text-center pt-24 pb-20 px-6 overflow-hidden" style={{background: 'radial-gradient(1100px 620px at 50% 8%, #1D2630 0%, rgba(20, 23, 28, 0) 60%)'}}>
          <div className="relative max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <CircleMark size={64} />
            </div>
            
            <h1 className="font-semibold tracking-wide leading-[1.2] mb-4" style={{fontSize: 'clamp(38px, 8vw, 72px)', letterSpacing: 'clamp(3px, 1.3vw, 10px)', background: 'linear-gradient(92deg, #F4F6F8, #AEB8C0)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              {hero.h1}
            </h1>
            
            <p className="text-sm tracking-widest mb-6" style={{color: '#8FA3B0', letterSpacing: 'clamp(3px, 1vw, 6px)'}}>
              AI SCREENSHOT TOOL
            </p>
            
            <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-8" style={{color: '#8B949D'}}>
              {hero.sub}
            </p>

            {/* 核心卖点标签 */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {['一框就译', '一框就懂', '一框就解', '免费开源'].map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium" style={{border: '1px solid rgba(192, 95, 60, 0.3)', background: 'rgba(192, 95, 60, 0.1)', color: '#F4F6F8'}}>
                  <span className="w-2 h-2 rounded-full" style={{background: '#C05F3C', boxShadow: '0 0 8px 1px rgba(192, 95, 60, 0.65)'}}></span>
                  {tag}
                </span>
              ))}
            </div>

            {/* 双按钮 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <CTAButton href={downloadHref} label={`${trackPath}#cta`}>{cta}</CTAButton>
              {secondary && (
                <a href={secondary.href} className="px-6 py-3 rounded-lg border transition-colors hover:border-[#C05F3C] hover:text-[#F4F6F8]" style={{borderColor: '#35414d', color: '#8B949D'}}>
                  {secondary.label}
                </a>
              )}
            </div>

            <p className="text-sm" style={{color: '#6E7780'}}>
              支持 Windows / macOS / Linux
            </p>
          </div>
        </section>

        {/* ————— 5 卖点（卡片式，跟官网风格统一） ————— */}
        <section className="max-w-5xl mx-auto px-6 py-16" style={{borderTop: '1px solid #242B34'}}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="rounded-2xl p-6 transition-colors" style={{background: 'rgba(26, 31, 38, 0.5)', border: '1px solid #242B34'}}>
                <h3 className="text-lg font-semibold mb-3" style={{color: '#F4F6F8'}}>{f.t}</h3>
                <p className="leading-relaxed text-sm" style={{color: '#8B949D'}}>{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ————— 场景展示（无为本尊专属） ————— */}
        {trackPath === "/wuwei" && (
          <section className="max-w-4xl mx-auto px-6 py-16 border-t border-[#242B34]">
            <h2 className="text-2xl font-semibold text-[#F4F6F8] text-center mb-12">它这样帮你</h2>
            <div className="space-y-12">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#6F9FAD] mb-2">改 bug，一句话的事</h3>
                  <p className="text-[#8B949D] leading-relaxed">报错贴给它，说「修一下」。它读代码、找原因、改好、跑测试，你只管验收。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-[rgba(26,31,38,0.5)] rounded-xl border border-[#242B34] flex items-center justify-center text-[#6E7780] text-sm">场景示意</div>
              </div>
              <div className="flex flex-col sm:flex-row-reverse items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#6F9FAD] mb-2">写功能，从想法到代码</h3>
                  <p className="text-[#8B949D] leading-relaxed">说「加个登录功能」，它搭框架、写逻辑、接数据库，一整套跑通给你看。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-[rgba(26,31,38,0.5)] rounded-xl border border-[#242B34] flex items-center justify-center text-[#6E7780] text-sm">场景示意</div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#6F9FAD] mb-2">读陌生代码，像读自己写的</h3>
                  <p className="text-[#8B949D] leading-relaxed">接手老项目，让它带你逛代码库。哪块是干嘛的、怎么串起来的，一讲就明白。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-[rgba(26,31,38,0.5)] rounded-xl border border-[#242B34] flex items-center justify-center text-[#6E7780] text-sm">场景示意</div>
              </div>
            </div>
          </section>
        )}

        {/* ————— 对比（无为本尊专属） ————— */}
        {trackPath === "/wuwei" && (
          <section className="max-w-3xl mx-auto px-6 py-16 border-t border-[#242B34]">
            <h2 className="text-2xl font-semibold text-[#F4F6F8] text-center mb-8">和 Claude Code，不一样</h2>
            <div className="overflow-x-auto rounded-2xl border border-[#242B34]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#12161C]">
                    <th className="px-4 py-3 text-left font-semibold text-[#F4F6F8]">你在乎的</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#C05F3C]">无为</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#F4F6F8]">Claude Code</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#242B34]">
                    <td className="px-4 py-3 align-top font-medium text-[#F4F6F8]">价格</td>
                    <td className="px-4 py-3 align-top text-[#6F9FAD]">免费，开源</td>
                    <td className="px-4 py-3 align-top text-[#8B949D]">$20/月，订阅制</td>
                  </tr>
                  <tr className="border-t border-[#242B34]">
                    <td className="px-4 py-3 align-top font-medium text-[#F4F6F8]">代码安全</td>
                    <td className="px-4 py-3 align-top text-[#6F9FAD]">本地优先，代码不出你电脑</td>
                    <td className="px-4 py-3 align-top text-[#8B949D]">云端处理，代码上传到 Anthropic</td>
                  </tr>
                  <tr className="border-t border-[#242B34]">
                    <td className="px-4 py-3 align-top font-medium text-[#F4F6F8]">模型选择</td>
                    <td className="px-4 py-3 align-top text-[#6F9FAD]">Claude、GPT、国产模型，随便换</td>
                    <td className="px-4 py-3 align-top text-[#8B949D]">锁定 Claude，不能换</td>
                  </tr>
                  <tr className="border-t border-[#242B34]">
                    <td className="px-4 py-3 align-top font-medium text-[#F4F6F8]">生态</td>
                    <td className="px-4 py-3 align-top text-[#6F9FAD]">开源，可审计，可定制</td>
                    <td className="px-4 py-3 align-top text-[#8B949D]">闭源，黑盒，不可控</td>
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
          <section className="max-w-4xl mx-auto px-6 py-16 border-t border-[#242B34]">
            <h2 className="text-2xl font-semibold text-[#F4F6F8] text-center mb-12">它这样帮你</h2>
            <div className="space-y-12">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#6F9FAD] mb-2">看外文资料，一框就译</h3>
                  <p className="text-[#8B949D] leading-relaxed">看到一段英文文档、日文说明，不用切翻译软件。框住它，译文直接浮在原文旁边，看完即走。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-[rgba(26,31,38,0.5)] rounded-xl border border-[#242B34] flex items-center justify-center text-[#6E7780] text-sm">场景示意</div>
              </div>
              <div className="flex flex-col sm:flex-row-reverse items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#6F9FAD] mb-2">报错信息，一框就懂</h3>
                  <p className="text-[#8B949D] leading-relaxed">终端里蹦出一串报错，不用复制去搜。框住它，AI 直接告诉你什么意思、怎么修。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-[rgba(26,31,38,0.5)] rounded-xl border border-[#242B34] flex items-center justify-center text-[#6E7780] text-sm">场景示意</div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#6F9FAD] mb-2">图表数据，一框就解</h3>
                  <p className="text-[#8B949D] leading-relaxed">看到一张图表、一个数据看板，框住它，AI 帮你解读趋势、提取关键数字。</p>
                </div>
                <div className="w-full sm:w-80 h-48 bg-[rgba(26,31,38,0.5)] rounded-xl border border-[#242B34] flex items-center justify-center text-[#6E7780] text-sm">场景示意</div>
              </div>
            </div>
          </section>
        )}

        {/* ————— 对比（截图工具专属） ————— */}
        {trackPath === "/shot" && (
          <section className="max-w-3xl mx-auto px-6 py-16 border-t border-[#242B34]">
            <h2 className="text-2xl font-semibold text-[#F4F6F8] text-center mb-8">和传统截图，不一样</h2>
            <div className="overflow-x-auto rounded-2xl border border-[#242B34]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#12161C]">
                    <th className="px-4 py-3 text-left font-semibold text-[#F4F6F8]">你在乎的</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#C05F3C]">无为截</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#F4F6F8]">传统截图</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#242B34]">
                    <td className="px-4 py-3 align-top font-medium text-[#F4F6F8]">截完能干嘛</td>
                    <td className="px-4 py-3 align-top text-[#6F9FAD]">翻译、识别、问 AI、直接行动</td>
                    <td className="px-4 py-3 align-top text-[#8B949D]">只能复制粘贴，自己看懂</td>
                  </tr>
                  <tr className="border-t border-[#242B34]">
                    <td className="px-4 py-3 align-top font-medium text-[#F4F6F8]">外文内容</td>
                    <td className="px-4 py-3 align-top text-[#6F9FAD]">一框就译，不用切软件</td>
                    <td className="px-4 py-3 align-top text-[#8B949D]">截完再开翻译软件，复制粘贴</td>
                  </tr>
                  <tr className="border-t border-[#242B34]">
                    <td className="px-4 py-3 align-top font-medium text-[#F4F6F8]">报错/代码</td>
                    <td className="px-4 py-3 align-top text-[#6F9FAD]">一框就懂，直接给解决方案</td>
                    <td className="px-4 py-3 align-top text-[#8B949D]">截完去搜索引擎，慢慢翻</td>
                  </tr>
                  <tr className="border-t border-[#242B34]">
                    <td className="px-4 py-3 align-top font-medium text-[#F4F6F8]">价格</td>
                    <td className="px-4 py-3 align-top text-[#6F9FAD]">免费，开源</td>
                    <td className="px-4 py-3 align-top text-[#8B949D]">部分功能收费，或捆绑销售</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ————— 收尾 ————— */}
        <section className="max-w-2xl mx-auto px-6 py-20 border-t border-[#242B34] text-center">
          <p className="text-lg text-[#8B949D] leading-relaxed">{closing}</p>
          <div className="mt-9 flex justify-center">
            <CTAButton href={downloadHref} label={`${trackPath}#closing-cta`}>{cta}</CTAButton>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}

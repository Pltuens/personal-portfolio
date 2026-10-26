import { Link } from 'react-router-dom'
import { Arrow, Label, PageHeader, Reveal, SectionHeading, useMeta } from '../components/ui'
import { contact, pivots, profile, skillGroups, timeline } from '../data/profile'

const principles = [
  {
    title: '先定判定',
    text: '任何战斗都能被拆成「状态怎么存、什么能打断什么、什么时候算命中」。这三件事没定，表现做得再多也是返工。',
  },
  {
    title: '再做减法',
    text: '先砍到只剩一条核心规则，确认它成立，再决定加多少包装。加法很便宜，回滚很贵。',
  },
  {
    title: '留出验证',
    text: '能在脚本里跑一遍的东西不要靠手感判断。可解性、平衡、异常态，越早用工具筛掉越省事。',
  },
]

const tools = [
  'Unreal Engine 5',
  'Gameplay Ability System',
  'IK Retargeter',
  'MotionWarping',
  'Behavior Tree / AI Perception',
  'Chaos 物理破碎',
  '飞书文档',
  'Git / GitHub',
]

export default function About() {
  useMeta('关于 — Pan Wangkun', '玩法与系统策划：工作方法、能力范围与个人支点。')

  return (
    <>
      <PageHeader
        eyebrow="About"
        index="02"
        title={
          <>
            先想清楚判定，
            <br />
            再谈表现。
          </>
        }
        lead={profile.lead}
        right={
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            <div>
              <dt>方向</dt>
              <dd className="mt-1 font-sans text-[12.5px] normal-case tracking-normal text-ink">
                {profile.role}
              </dd>
            </div>
            <div>
              <dt>意向</dt>
              <dd className="mt-1 font-sans text-[12.5px] normal-case tracking-normal text-ink">
                {profile.seeking}
              </dd>
            </div>
          </dl>
        }
      />

      {/* 方法 */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="Method" title="我怎么工作" />
        <div className="grid gap-10 md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 70}>
              <div className="border-t border-ink/20 pt-4">
                <span className="font-mono text-[11px] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-display text-[19px]">{p.title}</h3>
                <p className="mt-3 text-[13.5px] leading-[1.9] text-ink-soft">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 能力 */}
      <section className="border-y border-line bg-surface/60">
        <div className="container-page py-16">
          <SectionHeading eyebrow="Capability" title="能力范围" />
          <div className="divide-y divide-line">
            {skillGroups.map((g) => (
              <div key={g.title} className="grid gap-3 py-6 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-3">
                  <h3 className="font-display text-[17px]">{g.title}</h3>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                    {g.en}
                  </span>
                </div>
                <ul className="flex flex-wrap gap-x-6 gap-y-2 md:col-span-9">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="text-[13.5px] leading-relaxed text-ink-soft before:mr-2 before:text-line before:content-['／']"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 个人支点 */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="Pivots" title="个人支点" />
        <p className="mb-8 max-w-[62ch] text-[13.5px] leading-[1.9] text-muted">
          比起罗列技能，我更愿意说清楚「哪些东西在长期支撑我做设计」。这六条基本决定了我在项目里
          会先看什么、先改什么。
        </p>
        <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {pivots.map((p) => (
            <div key={p.name} className="group bg-paper p-6 transition-colors hover:bg-surface">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-[17px]">{p.name}</h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  {p.en}
                </span>
              </div>
              <p className="mt-3 text-[13.5px] leading-[1.85] text-ink">{p.oneLine}</p>
              <p className="mt-3 border-t border-line-soft pt-3 text-[12.5px] leading-[1.8] text-muted">
                {p.link}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 经历 */}
      <section className="container-page pb-16">
        <SectionHeading eyebrow="Timeline" title="经历" />
        {timeline.length > 0 ? (
          <ol className="divide-y divide-line border-t border-line">
            {timeline.map((t) => (
              <li key={t.title} className="grid gap-3 py-6 md:grid-cols-12 md:gap-8">
                <span className="font-mono text-[11px] text-muted md:col-span-2">
                  {t.period}
                </span>
                <div className="md:col-span-6">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display text-[17px]">{t.title}</h3>
                    {t.current && (
                      <span className="inline-flex items-center gap-1.5 border border-accent/40 px-2 py-[2px] font-mono text-[11px] tracking-[0.12em] text-accent">
                        <span className="h-1 w-1 animate-pulse rounded-full bg-accent" />
                        NOW
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[12.5px] text-muted">{t.org}</p>
                </div>
                {t.detail && (
                  <p className="text-[13px] leading-[1.85] text-ink-soft md:col-span-4">
                    {t.detail}
                  </p>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <div className="border border-dashed border-line px-6 py-14 text-center">
            <p className="font-display text-[18px]">经历条目待补充</p>
            <p className="mx-auto mt-3 max-w-[52ch] text-[13px] leading-[1.85] text-muted">
              学校、实习与团队经历尚未提供，所以这里留空。空着比编一条更有用——
              需要时我可以在 `src/data/profile.ts` 的 `timeline` 里补上，页面会自动渲染成时间线。
            </p>
          </div>
        )}
      </section>

      {/* 工具 */}
      <section className="container-page pb-16">
        <SectionHeading eyebrow="Tools" title="工具链" />
        <ul className="flex flex-wrap gap-2">
          {tools.map((t) => (
            <li
              key={t}
              className="border border-line px-3 py-1.5 font-mono text-[12px] text-ink-soft"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pb-6">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-ink/70 pt-8 sm:flex-row sm:items-end">
          <div>
            <Label>Next</Label>
            <p className="display-m mt-3">看看具体案例，或直接联系。</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/works"
              className="group inline-flex items-center gap-2 border border-ink px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-paper"
            >
              作品
              <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              联系
            </Link>
          </div>
        </div>
        {contact.email === '' && (
          <p className="mt-6 font-mono text-[11px] tracking-wide text-muted">
            * 邮箱尚未填写，页面不会显示虚构联系方式。
          </p>
        )}
      </section>
    </>
  )
}

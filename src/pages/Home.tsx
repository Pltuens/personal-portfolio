import { Link } from 'react-router-dom'
import { ProjectArt } from '../components/ProjectArt'
import { Arrow, DemoBadge, Label, Reveal, SectionHeading, useMeta } from '../components/ui'
import { articles } from '../data/articles'
import { profile, skillGroups } from '../data/profile'
import { projects } from '../data/projects'

export default function Home() {
  useMeta(
    'Pan Wangkun — 游戏策划作品集',
    '玩法与系统策划方向的作品集：三个玩法案例与设计笔记，讲清楚判定、状态与配置化交付。',
  )

  const featured = projects[0]
  const rest = projects.slice(1)

  return (
    <>
      {/* ------------------------------------------------------------ 首屏 */}
      <section className="border-b border-line">
        <div className="container-page grid gap-10 pt-12 pb-14 md:grid-cols-12 md:gap-8 md:pt-20 md:pb-20">
          <div className="md:col-span-8">
            <Label>Game Design Portfolio — 2026</Label>
            <h1 className="display-xl mt-6 whitespace-pre-line">{profile.headline}</h1>
          </div>
          <div className="flex flex-col justify-end gap-7 md:col-span-4 md:border-l md:border-line md:pl-8">
            <p className="text-[14.5px] leading-[1.95] text-ink-soft">{profile.lead}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/works"
                className="group inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors hover:bg-transparent hover:text-ink"
              >
                查看作品
                <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                关于我
              </Link>
            </div>
          </div>
        </div>

        <div className="container-page">
          <dl className="grid grid-cols-2 gap-px border-t border-line md:grid-cols-4">
            {profile.facts.map((f) => (
              <div key={f.label} className="py-5 pr-4">
                <dt className="label">{f.label}</dt>
                <dd className="mt-2 text-[13.5px] leading-snug text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------------ 作品 */}
      <section className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow="Selected"
          title="精选作品"
          action={{ label: '全部作品', to: '/works' }}
        />

        <Reveal>
          <Link
            to={`/works/${featured.slug}`}
            className="group grid border border-line bg-surface transition-colors hover:border-ink/40 md:grid-cols-12"
          >
            <div className="overflow-hidden border-b border-line md:col-span-7 md:order-2 md:border-b-0 md:border-l">
              <ProjectArt
                art={featured.art}
                className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col justify-between gap-8 p-6 md:col-span-5 md:p-9">
              <div>
                <div className="flex items-center justify-between">
                  <Label>{featured.index} / Featured</Label>
                  <DemoBadge />
                </div>
                <h3 className="display-l mt-6">{featured.title}</h3>
                <p className="mt-2 text-[14px] text-muted">{featured.subtitle}</p>
                <p className="mt-6 max-w-[42ch] text-[14.5px] leading-[1.9] text-ink-soft">
                  {featured.summary}
                </p>
              </div>
              <div>
                <div className="flex flex-wrap gap-2">
                  {featured.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="border border-line px-2 py-1 font-mono text-[10.5px] text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
                  查看案例
                  <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        <div className="mt-4">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <Link
                to={`/works/${p.slug}`}
                className="group relative grid grid-cols-[auto_1fr_auto] items-baseline gap-4 border-b border-line py-7 md:gap-8"
              >
                <span className="font-mono text-[11px] text-muted">{p.index}</span>
                <div className="min-w-0">
                  <h3 className="display-m transition-colors group-hover:text-accent">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] text-muted">{p.subtitle}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="hidden font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted sm:inline">
                    {p.category}
                  </span>
                  <Arrow className="h-4 w-4 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>

                <div className="pointer-events-none absolute right-24 bottom-full z-10 hidden w-64 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
                  <div className="border border-ink/20 bg-surface p-1.5 shadow-[0_18px_50px_-24px_rgba(23,21,15,0.5)]">
                    <ProjectArt art={p.art} className="h-36 w-full" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 max-w-[62ch] font-mono text-[11.5px] leading-relaxed tracking-wide text-muted">
          说明：以上条目为版面结构演示，标注「示例条目」的项目内容不代表真实项目成果，正式资料替换后角标会移除。
        </p>
      </section>

      {/* ------------------------------------------------------------ 能力 */}
      <section className="border-y border-line bg-surface/60">
        <div className="container-page py-16 md:py-20">
          <SectionHeading eyebrow="Capability" title="我能交付什么" />
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {skillGroups.map((g, i) => (
              <Reveal key={g.title} delay={i * 60}>
                <div className="border-t border-ink/15 pt-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-[17px]">{g.title}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                      {g.en}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {g.items.map((it) => (
                      <li key={it} className="flex gap-3 text-[13.5px] leading-relaxed text-ink-soft">
                        <span className="mt-[9px] h-[4px] w-[4px] shrink-0 bg-ink/40" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ 笔记 */}
      <section className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow="Writing"
          title="设计笔记"
          action={{ label: '全部笔记', to: '/writing' }}
        />
        <ul>
          {articles.slice(0, 3).map((a, i) => (
            <Reveal as="li" key={a.slug} delay={i * 60}>
              <Link
                to={`/writing/${a.slug}`}
                className="group grid gap-3 border-b border-line py-6 md:grid-cols-[auto_1fr_auto] md:items-baseline md:gap-8"
              >
                <span className="font-mono text-[11px] text-muted">{a.index}</span>
                <div>
                  <h3 className="font-display text-[19px] leading-snug transition-colors group-hover:text-accent md:text-[21px]">
                    {a.title}
                  </h3>
                  <p className="mt-2 max-w-[64ch] text-[13.5px] leading-relaxed text-muted">
                    {a.summary}
                  </p>
                </div>
                <span className="whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">
                  {a.category} · {a.readTime}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ------------------------------------------------------------ 联系 */}
      <section className="container-page pb-4">
        <div className="bg-ink px-6 py-12 text-paper md:px-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper/50">
                Contact
              </p>
              <h2 className="display-l mt-4 text-paper">想聊玩法，直接找我。</h2>
              <p className="mt-4 max-w-[46ch] text-[14px] leading-[1.9] text-paper/70">
                目前关注玩法与系统策划方向的机会。看作品、聊设计、或需要补充材料，都可以直接联系。
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-paper px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink transition-colors hover:bg-accent hover:text-paper"
              >
                联系方式
                <Arrow className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

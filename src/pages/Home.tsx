import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import KnowledgeSphere from '../components/KnowledgeSphere'
import { ProjectArt } from '../components/ProjectArt'
import {
  Arrow,
  Glitch,
  Label,
  Reveal,
  SectionHeading,
  Spotlight,
  StatusBadge,
  Ticker,
  useMeta,
} from '../components/ui'
import { contact, profile, skillGroups } from '../data/profile'
import { projects } from '../data/projects'

export default function Home() {
  useMeta(
    `${profile.nameEn} — 玩法 / 系统 / 战斗策划`,
    '湖北师范大学软件工程 2028 届。作品集：鸣潮声骸系统拆解、基于 GAS 的 ARPG 原型 Aura、开放世界类魂原型 Slash。',
  )

  const featured = projects[0]
  const rest = projects.slice(1)

  // 实时时钟：首屏状态条上的"在运行"感
  const [clock, setClock] = useState('--:--:--')
  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const tick = () => {
      const d = new Date()
      setClock(
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
      )
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <>
      {/* ------------------------------------------------------------ 首屏 */}
      <section id="top" className="relative border-b border-line">
        {/* 状态条 */}
        <div className="border-b border-line-soft">
          <div className="container-page flex h-10 items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.16em]">
            <span className="flex items-center gap-2 text-accent/85">
              <span className="h-[5px] w-[5px] animate-pulse bg-accent" />
              portfolio os / v2.6
            </span>
            <span className="text-muted">
              <span className="sm:hidden">{clock.slice(-8)}</span>
              <span className="hidden sm:inline">{clock} CST</span>
            </span>
            <span className="flex items-center gap-2 text-muted">
              <span className="sm:hidden">online</span>
              <span className="hidden sm:inline">system online</span>
              <span className="text-accent">●</span>
            </span>
          </div>
        </div>

        <div className="container-page grid gap-12 pt-10 pb-14 md:grid-cols-12 md:gap-8 md:pt-16 md:pb-16">
          {/* 左：索引导轨 */}
          <nav className="hidden md:col-span-2 md:block" aria-label="页面索引">
            <ol className="rail space-y-4">
              {[
                { n: '01', label: '身份', href: '#top' },
                { n: '02', label: '知识', href: '#knowledge' },
                { n: '03', label: '作品', href: '#works' },
                { n: '04', label: '能力', href: '#capability' },
                { n: '05', label: '联系', href: '#contact' },
              ].map((it) => (
                <li key={it.n}>
                  <a
                    href={it.href}
                    className="group flex items-baseline gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
                  >
                    <span className="text-accent/60 group-hover:text-accent">{it.n}</span>
                    <span className="font-sans text-[12px] normal-case tracking-normal">
                      {it.label}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* 中：标题 */}
          <div className="md:col-span-7">
            <div className="flex items-center gap-3">
              <Label>Game Design Portfolio</Label>
              <span className="font-mono text-[11px] text-accent/55">/</span>
              <span className="font-mono text-[11px] tracking-[0.16em] text-muted">2026</span>
            </div>
            <h1 className="display-hero mt-5">
              {profile.headline.split('\n').map((line) => (
                <span key={line} className="block">
                  <Glitch text={line} />
                </span>
              ))}
            </h1>
            <p className="mt-7 max-w-[46ch] text-[14.5px] leading-[1.95] text-ink-soft">
              {profile.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/works"
                className="group inline-flex items-center gap-2 border border-accent bg-accent px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#04121a] transition-colors hover:bg-transparent hover:text-accent"
              >
                查看作品
                <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 border border-line px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-accent/50 hover:text-accent"
              >
                发邮件
              </a>
            </div>
          </div>

          {/* 右：状态面板 */}
          <aside className="md:col-span-3">
            <div className="dotgrid border border-line bg-surface/30">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent/80">
                  Status
                </span>
                <span className="font-mono text-[11px] text-muted">
                  {String(profile.facts.length).padStart(2, '0')}
                </span>
              </div>
              <dl className="divide-y divide-line-soft">
                {profile.facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-baseline justify-between gap-3 px-4 py-3"
                  >
                    <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      {f.label}
                    </dt>
                    <dd className="text-right text-[12.5px] leading-snug text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  Email
                </span>
                <a
                  href={`mailto:${contact.email}`}
                  className="link-underline font-mono text-[11px] text-accent"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          </aside>
        </div>

        <div className="container-page pb-5">
          <div className="ruler-lg" />
        </div>
      </section>

      <Ticker
        items={[
          'COMBAT LOOP',
          'STATE MACHINE',
          'STAMINA ECONOMY',
          'GAS FRAMEWORK',
          'SYSTEM TEARDOWN',
          'MOTION WARPING',
          'AI BEHAVIOR TREE',
          'LEVEL PACING',
        ]}
      />

      {/* ------------------------------------------------------------ 知识链路 */}
      <section id="knowledge" className="container-page scroll-mt-20 pt-16 md:pt-20">
        <SectionHeading eyebrow="Knowledge" title="我掌握的东西，连起来长这样" />
        <p className="mb-8 max-w-[64ch] text-[13.5px] leading-[1.9] text-muted">
          球面上的点是我现在真正能用上的知识块，连线表示它们在实际项目里怎么互相支撑：
          拆解得到的判断会落到数值与系统，数值要靠战斗框架兑现，最后都回到玩法本身。拖一下，能看到背后的部分。
        </p>
        <Reveal>
          <KnowledgeSphere />
        </Reveal>
      </section>

      {/* ------------------------------------------------------------ 作品 */}
      <section id="works" className="container-page scroll-mt-20 py-16 md:py-20">
        <SectionHeading
          eyebrow="Selected"
          title="精选作品"
          action={{ label: '全部作品', to: '/works' }}
        />

        <Reveal>
          <Link
            to={`/works/${featured.slug}`}
            className="tech-card group grid border border-line bg-surface md:grid-cols-12"
          >
            <div className="hud-frame scan overflow-hidden border-b border-line md:col-span-7 md:order-2 md:border-b-0 md:border-l">
              <ProjectArt
                art={featured.art}
                fit="meet"
                className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-col justify-between gap-8 p-6 md:col-span-5 md:p-9">
              <div>
                <div className="flex items-center justify-between">
                  <Label>{featured.index} / Featured</Label>
                  <StatusBadge>{featured.status}</StatusBadge>
                </div>
                <h3 className="mt-6 font-display text-[clamp(1.6rem,2.6vw,2.1rem)] leading-[1.18] font-medium tracking-[-0.02em]">
                  <Glitch text={featured.title} />
                </h3>
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
                      className="border border-line px-2 py-1 font-mono text-[11px] text-muted"
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
                  <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-muted sm:inline">
                    {p.category}
                  </span>
                  <Arrow className="h-4 w-4 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>

                <div className="pointer-events-none absolute right-24 bottom-full z-10 hidden w-64 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 lg:block">
                  <div className="hud-frame border border-ink/20 bg-surface p-1.5 shadow-[0_18px_50px_-24px_rgba(23,21,15,0.5)]">
                    <ProjectArt art={p.art} className="h-36 w-full" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ 能力 */}
      <section id="capability" className="glow-panel scroll-mt-20 border-y border-line">
        <div className="container-page py-16 md:py-20">
          <SectionHeading eyebrow="Capability" title="我能交付什么" />
          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {skillGroups.map((g, i) => (
              <Reveal key={g.title} delay={i * 60}>
                <div className="border-t border-ink/15 pt-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-display text-[17px]">{g.title}</h3>
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
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

      {/* ------------------------------------------------------------ 联系 */}
      <section id="contact" className="container-page scroll-mt-20 py-16 md:py-20">
        <Spotlight className="scan overflow-hidden px-6 py-12 md:px-12 md:py-16">
          <div className="relative z-10 grid gap-8 md:grid-cols-[1.35fr_1fr] md:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent/70">
                Contact / 2028 届
              </p>
              <h2 className="display-l mt-4 text-ink">
                <Glitch text="在找能做战斗的策划？" />
              </h2>
              <p className="mt-4 max-w-[46ch] text-[14px] leading-[1.9] text-ink-soft">
                作品、拆解文档和演示视频都可以直接看；如果需要更细的设计过程，我可以按项目补材料。
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <a
                href={`mailto:${contact.email}`}
                className="group inline-flex items-center gap-2 bg-accent px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#04121a] transition-colors hover:bg-accent-soft"
              >
                发邮件
                <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <span className="font-mono text-[11px] tracking-[0.1em] text-muted">
                {contact.email}
              </span>
            </div>
          </div>

          <div className="relative z-10 mt-10 grid grid-cols-2 gap-4 border-t border-line pt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted sm:grid-cols-4">
            <span>03 cases</span>
            <span>UE5 / GAS</span>
            <span>Teardown → Build</span>
            <span>Hubei Normal Univ.</span>
          </div>
        </Spotlight>
      </section>
    </>
  )
}

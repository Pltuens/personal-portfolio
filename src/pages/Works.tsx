import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProjectArt } from '../components/ProjectArt'
import { Arrow, Label, PageHeader, Reveal, StatusBadge, useMeta } from '../components/ui'
import { categories, projects } from '../data/projects'

export default function Works() {
  useMeta(
    '作品 — Pluents',
    '三个项目：鸣潮声骸系统拆解、基于 GAS 的 ARPG 原型 Aura、开放世界类魂原型 Slash。',
  )
  const [active, setActive] = useState<(typeof categories)[number]>('全部')

  const list = useMemo(
    () => (active === '全部' ? projects : projects.filter((p) => p.category === active)),
    [active],
  )

  return (
    <>
      <PageHeader
        eyebrow="Works — 03 Projects"
        index="01"
        title={
          <>
            拆过系统，
            <br />
            也做过战斗。
          </>
        }
        lead="三个项目分别对应三种能力：把竞品系统拆到可复用的框架、把战斗系统在引擎里实现出来、把关卡与节奏调成一整套体验。"
        right={
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            2024 — 2026
          </div>
        }
      />

      {/* 索引条：筛选即"档案筛选"，带上序号更像目录 */}
      <section className="border-b border-line bg-surface/30">
        <div className="container-page flex flex-wrap items-center gap-x-3 gap-y-2 py-4">
          <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Filter
          </span>
          {categories.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={`group flex items-baseline gap-1.5 border px-3 py-1.5 font-mono text-[11px] tracking-wide transition-colors ${
                active === c
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-line text-muted hover:border-accent/40 hover:text-accent'
              }`}
            >
              <span className={active === c ? 'text-accent/60' : 'text-muted/60'}>
                {String(i).padStart(2, '0')}
              </span>
              {c}
            </button>
          ))}
          <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            {String(list.length).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>
      </section>

      <section className="container-page">
        <div className="border-t border-line">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <Link
                to={`/works/${p.slug}`}
                className="group relative grid grid-cols-1 items-start gap-5 border-b border-line py-8 transition-colors hover:bg-surface/50 md:grid-cols-12 md:items-center md:gap-6 md:py-11"
              >
                {/* 大编号 */}
                <span
                  aria-hidden="true"
                  className="font-mono md:col-span-1 text-[clamp(1.6rem,3vw,2.6rem)] leading-none text-accent/50 md:self-start md:pt-1 transition-colors duration-300 group-hover:text-accent"
                >
                  {p.index}
                </span>

                {/* 标题与标签 */}
                <div className="min-w-0 md:col-span-7">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                    <h2 className="display-l transition-colors duration-300 group-hover:text-accent">
                      {p.title}
                    </h2>
                    <StatusBadge>{p.status}</StatusBadge>
                  </div>
                  <p className="mt-2 text-[14px] text-muted">{p.subtitle}</p>
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="border border-line px-2 py-[3px] font-mono text-[11px] text-muted transition-colors group-hover:border-accent/30 group-hover:text-ink-soft"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 元信息 */}
                <div className="flex items-end md:col-span-4 justify-between gap-4 border-t border-line-soft pt-4 md:flex-col md:items-end md:gap-2 md:border-t-0 md:pt-0 md:text-right">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-muted">{p.kind}</span>
                  <span className="flex items-center gap-3 font-mono text-[11px] tracking-[0.12em] text-muted">
                    {p.period}
                    <Arrow className="h-3.5 w-3.5 -translate-x-1 opacity-40 transition-all duration-300 group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100" />
                  </span>
                </div>

                {/* 悬停时从右侧滑入的缩略图 */}
                <div className="pointer-events-none absolute top-1/2 right-[16%] hidden w-[236px] -translate-y-1/2 translate-x-5 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100 lg:block">
                  <div className="hud-frame border border-accent/30 bg-paper-deep p-1 shadow-[0_24px_60px_-30px_rgba(53,226,255,0.6)]">
                    <ProjectArt art={p.art} fit="meet" className="h-[124px] w-full" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {list.length === 0 && (
          <div className="border-b border-line py-20 text-center">
            <p className="font-display text-[18px]">这个分类下还没有项目</p>
            <button
              type="button"
              onClick={() => setActive('全部')}
              className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-accent"
            >
              查看全部
            </button>
          </div>
        )}

        <div className="mt-14 grid gap-8 border-t border-line pt-8 md:grid-cols-[1fr_1.4fr]">
          <div>
            <Label>关于这些材料</Label>
            <div className="ruler mt-4 hidden md:block" />
          </div>
          <div className="space-y-3 text-[13.5px] leading-[1.9] text-ink-soft">
            <p>
              拆解案以飞书文档交付，演示视频为原型录屏。站内只讲方法与取舍，不放内部数值与原文档全文。
            </p>
            <p>需要看完整文档或视频，可以直接联系，我会按项目提供链接。</p>
          </div>
        </div>
      </section>
    </>
  )
}

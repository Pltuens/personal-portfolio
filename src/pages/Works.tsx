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

      <section className="container-page py-10 md:py-14">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="按类型筛选">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={`border px-3.5 py-1.5 font-mono text-[11px] tracking-wide transition-colors ${
                active === c
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-line text-muted hover:border-accent/40 hover:text-accent'
              }`}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            {String(list.length).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        <div className="mt-10 space-y-4">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <Link
                to={`/works/${p.slug}`}
                className="tech-card group grid border border-line bg-surface md:grid-cols-12"
              >
                <div
                  className={`hud-frame scan overflow-hidden border-b border-line md:col-span-5 md:border-b-0 ${
                    i % 2 === 1 ? 'md:order-2 md:border-l' : 'md:order-1 md:border-r'
                  }`}
                >
                  <ProjectArt
                    art={p.art}
                    fit="meet"
                    className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-between gap-8 p-6 md:col-span-7 md:p-9">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Label>
                        {p.index} / {p.category}
                      </Label>
                      <StatusBadge>{p.status}</StatusBadge>
                    </div>
                    <h2 className="display-l mt-5 transition-colors group-hover:text-accent">
                      {p.title}
                    </h2>
                    <p className="mt-2 text-[14px] text-muted">{p.subtitle}</p>
                    <p className="mt-5 max-w-[56ch] text-[14px] leading-[1.9] text-ink-soft">
                      {p.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <dl className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-[11px] tracking-wide text-muted sm:grid-cols-3">
                      <div>
                        <dt className="uppercase">类型</dt>
                        <dd className="mt-1 font-sans text-[12.5px] tracking-normal text-ink-soft">
                          {p.kind}
                        </dd>
                      </div>
                      <div>
                        <dt className="uppercase">职责</dt>
                        <dd className="mt-1 font-sans text-[12.5px] tracking-normal text-ink-soft">
                          {p.role}
                        </dd>
                      </div>
                    </dl>
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
                      案例详情
                      <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {list.length === 0 && (
          <div className="mt-10 border border-dashed border-line py-20 text-center">
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
          <Label>关于这些材料</Label>
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

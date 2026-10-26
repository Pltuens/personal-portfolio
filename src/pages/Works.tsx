import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProjectArt } from '../components/ProjectArt'
import { Arrow, DemoBadge, Label, PageHeader, Reveal, useMeta } from '../components/ui'
import { categories, projects } from '../data/projects'

export default function Works() {
  useMeta(
    '作品 — Pan Wangkun',
    '玩法设计案例：叙事拼接解谜、三杯倒水解谜、小游戏需求拆解。',
  )
  const [active, setActive] = useState<(typeof categories)[number]>('全部')

  const list = useMemo(
    () => (active === '全部' ? projects : projects.filter((p) => p.category === active)),
    [active],
  )

  return (
    <>
      <PageHeader
        eyebrow="Works — 03 Cases"
        title={
          <>
            三个案例，
            <br />
            三种讲清玩法的方式。
          </>
        }
        lead="每个案例都按「问题 → 规则 → 交付」的顺序写，重点放在判定怎么定、边界在哪、最后交给程序的是什么。"
        right={
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            含示例条目
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
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line text-muted hover:border-ink hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
          <span className="ml-auto font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted">
            {String(list.length).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        <div className="mt-10 space-y-4">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <Link
                to={`/works/${p.slug}`}
                className="group grid border border-line bg-surface transition-colors hover:border-ink/40 md:grid-cols-12"
              >
                <div
                  className={`overflow-hidden border-b border-line md:col-span-5 md:border-b-0 ${
                    i % 2 === 1
                      ? 'md:order-2 md:border-l'
                      : 'md:order-1 md:border-r'
                  }`}
                >
                  <ProjectArt
                    art={p.art}
                    className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-col justify-between gap-8 p-6 md:col-span-7 md:p-9">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <Label>
                        {p.index} / {p.category}
                      </Label>
                      <DemoBadge>{p.status}</DemoBadge>
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
                    <dl className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-[10.5px] tracking-wide text-muted sm:grid-cols-3">
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
            <p className="font-display text-[18px]">这个分类下还没有案例</p>
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
          <Label>关于这些条目</Label>
          <div className="space-y-3 text-[13.5px] leading-[1.9] text-ink-soft">
            <p>
              当前三个案例是版面结构演示，用来展示我会怎么组织一个玩法案例：先交代约束，再落规则，最后给交付物。
              它们被显式标注为「示例条目」，不代表已上线的商业项目。
            </p>
            <p>
              真实项目资料替换后，角标会移除；替换方式见仓库 README 的「内容维护」一节。
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

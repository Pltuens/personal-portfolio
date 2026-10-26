import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Arrow, DemoBadge, PageHeader, Reveal, useMeta } from '../components/ui'
import { articleCategories, articles } from '../data/articles'

export default function Writing() {
  useMeta('笔记 — Pan Wangkun', '机制拆解、关卡验证、配置化与设计思考笔记。')
  const [active, setActive] = useState<(typeof articleCategories)[number]>('全部')

  const list = useMemo(
    () =>
      active === '全部' ? articles : articles.filter((a) => a.category === active),
    [active],
  )

  return (
    <>
      <PageHeader
        eyebrow="Writing — 04 Notes"
        title={
          <>
            写下来的，
            <br />
            才是想清楚的。
          </>
        }
        lead="把玩到的机制拆到状态与判定层，把做过的验证过程记下来。这些笔记更多是给自己留档，也顺便说明我判断问题的顺序。"
      />

      <section className="container-page py-10 md:py-14">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="按分类筛选">
          {articleCategories.map((c) => (
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
        </div>

        <ul className="mt-8">
          {list.map((a, i) => (
            <Reveal as="li" key={a.slug} delay={i * 50}>
              <Link
                to={`/writing/${a.slug}`}
                className="group grid gap-8 border-b border-line py-8 md:grid-cols-12"
              >
                <div className="flex gap-4 md:col-span-2 md:block">
                  <span className="font-mono text-[11px] text-muted">{a.index}</span>
                  <span className="ml-auto block font-mono text-[10px] uppercase tracking-[0.12em] text-muted md:mt-2">
                    {a.date}
                  </span>
                </div>

                <div className="md:col-span-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
                      {a.kicker}
                    </span>
                    <DemoBadge />
                  </div>
                  <h2 className="mt-3 font-display text-[clamp(1.25rem,2.4vw,1.7rem)] leading-snug transition-colors group-hover:text-accent">
                    {a.title}
                  </h2>
                  <p className="mt-3 max-w-[62ch] text-[13.5px] leading-[1.85] text-ink-soft">
                    {a.summary}
                  </p>
                </div>

                <div className="flex items-start justify-between md:col-span-2 md:justify-end">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    {a.readTime}
                  </span>
                  <Arrow className="ml-4 h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        {list.length === 0 && (
          <div className="mt-8 border border-dashed border-line py-20 text-center">
            <p className="font-display text-[18px]">这个分类下还没有笔记</p>
            <button
              type="button"
              onClick={() => setActive('全部')}
              className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-accent"
            >
              查看全部
            </button>
          </div>
        )}
      </section>
    </>
  )
}

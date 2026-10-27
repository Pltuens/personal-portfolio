import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ZoomFrame from '../components/ArtZoom'
import { Blocks } from '../components/Blocks'
import { HeroArt } from '../components/ProjectArt'
import VideoPlayer from '../components/VideoPlayer'
import { Arrow, Label, Reveal, StatusBadge, useMeta } from '../components/ui'
import { getProject, nextProject } from '../data/projects'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProject(slug)

  useMeta(
    project ? `${project.title} — Pan Wangkun` : '案例未找到 — Pan Wangkun',
    project?.summary,
    project ? `/og/${project.slug}.jpg` : undefined,
  )

  const sections = project?.sections
  const toc = useMemo(
    () => [
      ...(project?.video ? [{ id: 'demo', num: '00', title: '演示视频' }] : []),
      ...(sections ?? []).map((s, i) => ({
        id: s.id,
        num: String(i + 1).padStart(2, '0'),
        title: s.title,
      })),
    ],
    [project, sections],
  )

  // 目录当前位置：取「顶边已经越过阅读线」的最后一节
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const ids = toc.map((t) => t.id)
    if (!ids.length) return
    let raf = 0

    const update = () => {
      raf = 0
      let cur = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) cur = id
      }
      setActiveId(cur)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [toc])

  if (!project) return <NotFound />

  const next = nextProject(project.slug)

  return (
    <article>
      <header className="relative overflow-hidden border-b border-line pt-10 md:pt-14">
        <span className="tech-line absolute inset-x-0 top-0" />
        <span
          aria-hidden="true"
          className="watermark pointer-events-none absolute -top-6 right-2 hidden text-[clamp(6rem,13vw,11rem)] md:block"
        >
          {project.index}
        </span>

        <div className="container-page relative">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/works"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent"
            >
              <Arrow className="h-3.5 w-3.5 rotate-180" />
              全部作品
            </Link>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              {project.index} / 03 · {project.period}
            </span>
          </div>

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <Label>{project.category}</Label>
              <StatusBadge>{project.status}</StatusBadge>
            </div>
            <h1 className="display-xl mt-5">{project.title}</h1>
            <p className="mt-5 max-w-[44ch] font-display text-[clamp(1.15rem,2.2vw,1.5rem)] leading-snug text-ink-soft">
              {project.subtitle}
            </p>
          </div>

          {/* 档案数据带 */}
          <dl className="mt-10 grid grid-cols-2 gap-px border-y border-line bg-line md:grid-cols-4">
            {[
              ['类型', project.kind],
              ['职责', project.role],
              ['交付', project.scope],
              ['时间', project.period],
            ].map(([k, v]) => (
              <div key={k} className="bg-paper px-4 py-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  {k}
                </dt>
                <dd className="mt-1.5 text-[13px] leading-snug text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="container-page pt-8">
        <div className="hud-frame scan overflow-hidden border border-line bg-paper-deep">
          <ZoomFrame art={project.art} label={`${project.title} · 结构示意`}>
            <HeroArt art={project.art} />
          </ZoomFrame>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[12px] tracking-wide text-muted">
            图示为原创结构示意，非项目截图 · 点击可放大
          </p>
          {project.links && (
            <div className="flex flex-wrap gap-2">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-2 border border-ink px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper"
                >
                  {l.label}
                  <Arrow className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 站内演示视频 */}
      {project.video && (
        <div id="demo" className="container-page scroll-mt-24 pt-12 md:pt-14">
          <div className="mx-auto w-full max-w-[920px]">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent/80">
                Demo
              </span>
              <h2 className="display-m">演示视频</h2>
            </div>
            <VideoPlayer {...project.video} />
          </div>
        </div>
      )}

      <div className="container-page grid gap-12 pt-12 md:grid-cols-12 md:gap-8 md:pt-16">
        <aside className="md:col-span-3">
          <div className="md:sticky md:top-24">
            <Label>Contents</Label>
            <ol className="mt-4 space-y-2">
              {toc.map((t) => {
                const active = activeId === t.id
                return (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      data-active={active ? '' : undefined}
                      aria-current={active ? 'true' : undefined}
                      className="group -ml-3 flex items-baseline gap-3 border-l border-transparent pl-3 text-[12.5px] text-muted transition-colors hover:text-ink data-[active]:border-accent/60 data-[active]:text-ink"
                    >
                      <span
                        className={`font-mono text-[11px] transition-colors ${
                          active ? 'text-accent' : 'text-muted/50 group-hover:text-accent'
                        }`}
                      >
                        {t.num}
                      </span>
                      {t.title}
                    </a>
                  </li>
                )
              })}
            </ol>
            <div className="mt-8 hidden border-t border-line pt-4 md:block">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                Tags
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="border border-line px-2 py-[3px] font-mono text-[11px] text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* 正文 */}
        <div className="min-w-0 md:col-span-9">
          <p className="mb-12 max-w-[60ch] border-l-2 border-ink pl-5 text-[15px] leading-[1.9] text-ink">
            {project.summary}
          </p>

          {project.sections.map((section, i) => (
            <Reveal key={section.id}>
              <section id={section.id} className="scroll-mt-24 border-t border-line py-10">
                <div className="mb-7 flex items-baseline gap-4">
                  <span className="font-mono text-[11px] text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="display-m">{section.title}</h2>
                  {section.en && (
                    <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                      {section.en}
                    </span>
                  )}
                </div>
                <Blocks blocks={section.blocks} />
              </section>
            </Reveal>
          ))}

          <div className="mt-6 border-t border-accent/25 pt-8">
            <Label>Takeaways</Label>
            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              {project.takeaways.map((t, i) => (
                <li key={i} className="border-t border-line pt-3 text-[13px] leading-[1.8] text-ink-soft">
                  <span className="mb-2 block font-mono text-[11px] text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 下一个 */}
      <div className="container-page mt-16">
        <Link
          to={`/works/${next.slug}`}
          className="group flex flex-col justify-between gap-4 border-t border-line py-8 sm:flex-row sm:items-end"
        >
          <div>
            <Label>Next Case</Label>
            <p className="display-l mt-3 transition-colors group-hover:text-accent">
              {next.title}
            </p>
            <p className="mt-2 text-[13.5px] text-muted">{next.subtitle}</p>
          </div>
          <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  )
}

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

/* ---------------------------------------------------------------- 入场动画 */

export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'header'
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // 已经在首屏内的元素直接显示，避免刷新后首屏空白
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 1.05) {
      setSeen(true)
      return
    }

    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true)
            io.disconnect()
          }
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    io.observe(el)

    // 兜底：观察器失效或元素尺寸为 0 时，3 秒后无条件显示
    const fallback = window.setTimeout(() => setSeen(true), 1500)

    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  const Comp = Tag as any
  return (
    <Comp
      ref={ref}
      className={`reveal ${seen ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Comp>
  )
}

/* ------------------------------------------------------------------ 元信息 */

export const SITE_URL = 'https://pluents.pages.dev'

/** 写一个 meta 标签，不存在就建一个 */
function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = value
}

/**
 * 页面标题、描述与分享卡片。
 * ------------------------------------------------------------------
 * 注意：这里改的是运行时 DOM，社交平台的爬虫大多不执行 JS。
 * 真正对外生效的是构建时预渲染出来的静态 HTML（scripts/prerender.mjs），
 * 这里保证在支持 JS 的客户端（内嵌浏览器、预览面板）里也是对的。
 */
export function useMeta(title: string, description?: string, image?: string) {
  useEffect(() => {
    document.title = title

    const path = window.location.pathname.replace(/\/+$/, '')
    const url = SITE_URL + path
    const img = SITE_URL + (image ?? '/og/default.jpg')

    if (description) setMeta('name', 'description', description)
    if (description) setMeta('property', 'og:description', description)
    if (description) setMeta('name', 'twitter:description', description)

    setMeta('property', 'og:title', title)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:image', img)

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = url
  }, [title, description, image])
}

/* -------------------------------------------------------------------- 原子 */

export function Label({ children }: { children: ReactNode }) {
  return <span className="label">{children}</span>
}

export function StatusBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-accent/25 bg-accent/[0.06] px-2 py-[3px] font-mono text-[11px] uppercase tracking-[0.14em] text-accent-soft">
      <span className="h-1 w-1 rounded-full bg-accent" />
      {children}
    </span>
  )
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border border-line px-2.5 py-1 font-mono text-[11px] tracking-wide text-ink-soft">
      {children}
    </span>
  )
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

/** 悬停/聚焦时的色散故障效果，纯 CSS 实现 */
export function Glitch({
  text,
  className = '',
}: {
  text: string
  className?: string
}) {
  return (
    <span className={`glitch ${className}`} data-text={text}>
      {text}
    </span>
  )
}

/** 滚动信息条 */
export function Ticker({ items }: { items: string[] }) {
  const row = [...items, ...items]
  return (
    <div
      className="ticker overflow-hidden border-y border-line bg-paper-deep py-2.5"
      aria-hidden="true"
    >
      <div className="ticker-track flex w-max items-center">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-6 pr-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
          >
            {t}
            <span className="text-accent/70">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/** 跟随鼠标的暗场区块 */
export function Spotlight({
  children,
  className = '',
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div
      ref={ref}
      id={id}
      onMouseMove={onMove}
      className={`spotlight cyber-grid ${className}`}
    >
      {children}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string
  title: string
  action?: { label: string; to: string }
}) {
  return (
    <div className="relative mb-8 flex items-end justify-between gap-6 pb-4">
      <span className="tech-line absolute inset-x-0 bottom-0" />
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[11px] text-accent">//</span>
        <Label>{eyebrow}</Label>
        <h2 className="display-m">{title}</h2>
      </div>
      {action && (
        <Link
          to={action.to}
          className="link-underline hidden shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-ink sm:flex"
        >
          {action.label}
          <Arrow className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  right,
  index,
}: {
  eyebrow: string
  title: ReactNode
  lead?: string
  right?: ReactNode
  /** 右上角的巨型描边编号，纯装饰 */
  index?: string
}) {
  return (
    <header className="relative overflow-hidden border-b border-line pt-14 pb-6 md:pt-20 md:pb-8">
      <span className="tech-line absolute inset-x-0 top-0" />
      {index && (
        <span
          aria-hidden="true"
          className="watermark pointer-events-none absolute -top-4 right-2 hidden text-[clamp(7rem,15vw,13rem)] md:block"
        >
          {index}
        </span>
      )}
      <div className="container-page relative">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl">
            <Label>{eyebrow}</Label>
            <h1 className="mt-4 font-display text-[clamp(2.05rem,4.2vw,3.5rem)] leading-[1.06] font-medium tracking-[-0.025em]">
              {title}
            </h1>
            {lead && (
              <p className="serif-accent mt-6 max-w-2xl text-[16px] leading-[1.9] text-ink-soft md:text-[17px]">
                {lead}
              </p>
            )}
          </div>
          {right}
        </div>
        <div className="ruler mt-8" />
      </div>
    </header>
  )
}

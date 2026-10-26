import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { contact, profile } from '../data/profile'
import { Arrow, Label } from './ui'

const NAV = [
  { to: '/works', label: '作品', en: 'Works' },
  { to: '/writing', label: '笔记', en: 'Writing' },
  { to: '/about', label: '关于', en: 'About' },
  { to: '/contact', label: '联系', en: 'Contact' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        跳到主要内容
      </a>

      <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-6">
          <Link to="/" className="group flex items-baseline gap-3" aria-label="返回首页">
            <span className="font-display text-[19px] tracking-tight">
              {profile.nameEn}
            </span>
            <span className="hidden font-mono text-[10px] tracking-[0.18em] text-muted sm:inline">
              PORTFOLIO
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="主导航">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group relative flex items-baseline gap-2 py-1 text-[14px] transition-colors ${
                    isActive ? 'text-ink' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-60">
                      {item.en}
                    </span>
                    <span
                      className={`absolute -bottom-[1px] left-0 h-px w-full origin-left bg-ink transition-transform duration-500 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
            <a
              href={contact.github}
              target="_blank"
              rel="noreferrer noopener"
              className="ml-2 flex items-center gap-2 border border-ink px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-paper"
            >
              GitHub
              <Arrow className="h-3 w-3" />
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-9 w-9 items-center justify-center border border-line md:hidden"
          >
            <span className="sr-only">{open ? '关闭菜单' : '打开菜单'}</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M4 8h16M4 16h16" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div id="mobile-nav" className="border-t border-line bg-paper md:hidden">
            <nav className="container-page flex flex-col py-2" aria-label="移动端导航">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-baseline justify-between border-b border-line-soft py-4 text-[15px] ${
                      isActive ? 'text-ink' : 'text-muted'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em]">
                    {item.en}
                  </span>
                </NavLink>
              ))}
              <a
                href={contact.github}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-between py-4 text-[15px] text-muted"
              >
                GitHub
                <Arrow className="h-4 w-4" />
              </a>
            </nav>
          </div>
        )}
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-deep/40">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-tight">
              {profile.nameEn}
            </p>
            <p className="mt-2 text-[13px] text-muted">{profile.role}</p>
            <p className="mt-6 max-w-sm font-display text-[15px] leading-relaxed text-ink-soft">
              「{profile.tagline}」
            </p>
          </div>

          <div>
            <Label>Index</Label>
            <ul className="mt-4 space-y-2 text-[13.5px] text-ink-soft">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="link-underline">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Label>Elsewhere</Label>
            <ul className="mt-4 space-y-2 text-[13.5px] text-ink-soft">
              <li>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline"
                >
                  {contact.githubLabel}
                </a>
              </li>
              {contact.email ? (
                <li>
                  <a href={`mailto:${contact.email}`} className="link-underline">
                    {contact.email}
                  </a>
                </li>
              ) : (
                <li className="text-muted">
                  邮箱 <span className="font-mono text-[11px]">待填写</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 {profile.nameEn}</span>
          <span className="normal-case tracking-normal">
            站内带「示例条目」角标的内容为结构演示，非真实项目成果
          </span>
          <span>React · Vite · Static</span>
        </div>
      </div>
    </footer>
  )
}

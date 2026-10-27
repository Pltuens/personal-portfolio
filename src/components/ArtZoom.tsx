import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ART_LABEL, ProjectArt } from './ProjectArt'
import type { ArtKey } from '../data/projects'

/**
 * 图示放大
 * ------------------------------------------------------------------
 * 1200×760 的 SVG 塞进手机屏幕只剩 1/3 宽，图里的标注基本没法读。
 * 包一层：点击后在浮层里按原尺寸完整展示（窄屏横向滚动）。
 * 用 portal 挂到 body，避免被外层 hud-frame 的 overflow:hidden 裁掉。
 */
export default function ZoomFrame({
  art,
  label,
  children,
}: {
  art: ArtKey
  /** 覆盖浮层标题，默认用图示自带的名字 */
  label?: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const title = label ?? ART_LABEL[art]

  // 窄屏横向滚动时从图心开始，一打开就能看到主要部分
  useEffect(() => {
    if (!open) return
    const box = scrollRef.current
    if (!box) return
    box.scrollLeft = (box.scrollWidth - box.clientWidth) / 2
    box.scrollTop = (box.scrollHeight - box.clientHeight) / 2
  }, [open])

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      triggerRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`放大查看：${title}`}
        className="group relative block w-full overflow-hidden text-left"
      >
        {children}
        <span className="pointer-events-none absolute right-2.5 bottom-2.5 flex items-center gap-1.5 border border-line bg-paper/90 px-2 py-1 font-mono text-[11px] tracking-[0.1em] text-muted transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden="true">
            <path
              d="M14 4h6v6M10 20H4v-6M20 4l-6 6M4 20l6-6"
              stroke="currentColor"
              strokeWidth="1.6"
            />
          </svg>
          放大
        </span>
      </button>

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] flex flex-col bg-paper/95 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-6">
              <span className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.16em] text-accent/80">
                Figure / {title}
              </span>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.1em] text-muted/70 sm:hidden">
                  左右滑动看全图
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 whitespace-nowrap border border-line px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-muted transition-colors hover:border-accent/50 hover:text-accent"
                >
                  关闭
                  <span className="text-[11px] opacity-60">ESC</span>
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-auto p-3 md:flex md:items-center md:justify-center md:p-6">
              <ProjectArt
                art={art}
                fit="meet"
                className="mx-auto block h-auto w-full min-w-[900px] max-w-[1120px] border border-line"
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

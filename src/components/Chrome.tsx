import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * 外层 HUD 装饰：
 * - Cursor：桌面端准星光标（四角括号 + 中心点，悬停可交互元素时张开）
 * - ScrollProgress：顶部滚动进度条
 * - BackToTop：滚过一屏后出现的回顶按钮（详情页动辄 5000px+）
 * 都只在精确指针设备上生效或尊重 prefers-reduced-motion。
 */

export function Cursor() {
  const ringRef = useRef<HTMLDivElement | null>(null)
  const dotRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    document.body.classList.add('has-crosshair')

    // 初始放到视口外，等第一次 pointermove 再进场，避免停在屏幕正中
    let mx = -200
    let my = -200
    let rx = mx
    let ry = my
    let raf = 0
    let hovering = false

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`

      const t = e.target as Element | null
      const next = Boolean(t?.closest?.('a, button, [role="button"], [data-cursor="hot"]'))
      if (next !== hovering) {
        hovering = next
        ring.dataset.hot = next ? '1' : '0'
      }
    }

    // 系统光标全站关掉了，可拖拽区域的「按住」反馈要由准星补上
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null
      if (t?.closest?.('[data-drag]')) ring.dataset.grab = '1'
    }
    const onUp = () => {
      if (ring.dataset.grab) delete ring.dataset.grab
    }

    const loop = () => {
      rx += (mx - rx) * 0.22
      ry += (my - ry) * 0.22
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      cancelAnimationFrame(raf)
      document.body.classList.remove('has-crosshair')
    }
  }, [])

  // 挂到 body 上：Layout 根节点是 `relative z-10`，自成层叠上下文，
  // 准星留在里面会永远压在欢迎页（z-80）下面 —— 而系统光标已经全站关掉，
  // 那样欢迎页就变成「屏幕上没有光标」。
  return createPortal(
    <>
      <div
        ref={ringRef}
        data-hot="0"
        aria-hidden="true"
        className="crosshair"
        style={{ transform: 'translate3d(-200px,-200px,0)' }}
      >
        <div className="crosshair-ring relative h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2">
          {[
            'left-0 top-0 border-l border-t',
            'right-0 top-0 border-r border-t',
            'left-0 bottom-0 border-l border-b',
            'right-0 bottom-0 border-r border-b',
          ].map((pos) => (
            <span
              key={pos}
              className={`crosshair-corner absolute h-[7px] w-[7px] ${pos}`}
            />
          ))}
        </div>
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="crosshair"
        style={{ transform: 'translate3d(-200px,-200px,0)' }}
      >
        <span className="block h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      </div>
    </>,
    document.body,
  )
}

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    let raf = 0

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      bar.style.transform = `scaleX(${p})`
      raf = 0
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
  }, [])

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="scroll-progress w-full"
      style={{ transform: 'scaleX(0)' }}
    />
  )
}

/** 滚过一屏后出现的回顶按钮 */
export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let raf = 0
    const update = () => {
      setShow(window.scrollY > window.innerHeight * 0.9)
      raf = 0
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
  }, [])

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`fixed right-4 bottom-5 z-40 flex items-center justify-center gap-2 border border-line bg-paper/95 p-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted backdrop-blur-md transition-all duration-300 hover:border-accent/50 hover:text-accent sm:right-6 sm:px-3 sm:py-2 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 -rotate-90 sm:h-3.5 sm:w-3.5" fill="none" aria-hidden="true">
        <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      <span className="hidden sm:inline">回到顶部</span>
      <span className="sr-only sm:hidden">回到顶部</span>
    </button>
  )
}

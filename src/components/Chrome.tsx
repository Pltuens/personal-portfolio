import { useEffect, useRef } from 'react'

/**
 * 外层 HUD 装饰：
 * - Cursor：桌面端准星光标（四角括号 + 中心点，悬停可交互元素时张开）
 * - ScrollProgress：顶部滚动进度条
 * 两者都只在精确指针设备上生效，并尊重 prefers-reduced-motion。
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
      const next = Boolean(t?.closest?.('a, button, [role="button"]'))
      if (next !== hovering) {
        hovering = next
        ring.dataset.hot = next ? '1' : '0'
      }
    }

    const loop = () => {
      rx += (mx - rx) * 0.22
      ry += (my - ry) * 0.22
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      document.body.classList.remove('has-crosshair')
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        data-hot="0"
        aria-hidden="true"
        className="crosshair group/ring"
        style={{ transform: 'translate3d(-200px,-200px,0)' }}
      >
        <div className="relative h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[hot='1]/ring:scale-[1.6]">
          {[
            'left-0 top-0 border-l border-t',
            'right-0 top-0 border-r border-t',
            'left-0 bottom-0 border-l border-b',
            'right-0 bottom-0 border-r border-b',
          ].map((pos) => (
            <span
              key={pos}
              className={`absolute h-[7px] w-[7px] border-accent/70 transition-colors duration-300 ${pos} group-data-[hot='1]/ring:border-accent`}
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
    </>
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

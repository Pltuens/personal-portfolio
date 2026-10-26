import { useEffect, useRef, useState } from 'react'
import IntroBackdrop from './IntroBackdrop'

/**
 * 入场欢迎页（启动画面）
 * ------------------------------------------------------------------
 * 只在一次会话里出现一次（sessionStorage 标记），
 * 表现是一条"系统启动"序列：横线展开 → 名字逐字出现 → 进度跑满 → 整体上移淡出。
 * 点击 / 任意键立刻跳过；prefers-reduced-motion 下直接不显示。
 * 页脚留了重看入口，通过 window 事件 `pluents:replay-intro` 触发。
 */

export const INTRO_KEY = 'pluents:intro-shown'
const TOTAL = 2500
const PROGRESS = 1500

export default function Intro({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [label, setLabel] = useState('BOOTING KERNEL')
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      onDone()
      return
    }

    document.body.style.overflow = 'hidden'

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      document.body.style.overflow = ''
      onDone()
    }

    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / PROGRESS)
      setPct(Math.round(p * 100))
      if (p > 0.28) setLabel('LOADING CASES')
      if (p > 0.62) setLabel('CALIBRATING HUD')
      if (p > 0.92) setLabel('SYSTEM ONLINE')
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const outAt = window.setTimeout(() => setLeaving(true), TOTAL - 520)
    const endAt = window.setTimeout(finish, TOTAL)

    const skip = () => {
      window.clearTimeout(outAt)
      window.clearTimeout(endAt)
      setLeaving(true)
      window.setTimeout(finish, 420)
    }

    window.addEventListener('pointerdown', skip, { once: true })
    window.addEventListener('keydown', skip, { once: true })

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(outAt)
      window.clearTimeout(endAt)
      window.removeEventListener('pointerdown', skip)
      window.removeEventListener('keydown', skip)
      document.body.style.overflow = ''
    }
  }, [onDone])

  return (
    <div
      className={`intro ${leaving ? 'is-out' : ''}`}
      role="status"
      aria-label="正在进入作品集"
    >
      <div className="intro-aurora" aria-hidden="true" />
      <div className="intro-aurora intro-aurora--2" aria-hidden="true" />
      <IntroBackdrop boost={leaving} />
      <div className={`intro-flash ${leaving ? 'is-on' : ''}`} aria-hidden="true" />

      <span className="intro-corner intro-corner--tl" aria-hidden="true" />
      <span className="intro-corner intro-corner--tr" aria-hidden="true" />
      <span className="intro-corner intro-corner--bl" aria-hidden="true" />
      <span className="intro-corner intro-corner--br" aria-hidden="true" />

      <div className="intro-inner relative">
        <p className="intro-eyebrow">
          Portfolio System <span className="text-muted">/ 2026</span>
        </p>

        <span className="intro-rule" aria-hidden="true" />

        <h1 className="intro-title" aria-label="Pluents">
          {'PLUENTS'.split('').map((c, i) => (
            <span key={i} style={{ ['--i' as string]: i }}>
              {c}
            </span>
          ))}
        </h1>

        <p className="intro-sub">潘旺坤 · 玩法 / 系统 / 战斗策划</p>

        <div className="intro-bar">
          <i style={{ width: `${pct}%` }} />
        </div>

        <div className="intro-meta">
          <span>{label}</span>
          <span className="tabular-nums">{String(pct).padStart(3, '0')}</span>
        </div>

        <p className="intro-skip">点击任意处跳过</p>
      </div>
    </div>
  )
}

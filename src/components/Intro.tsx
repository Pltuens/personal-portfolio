import { useCallback, useEffect, useRef, useState } from 'react'
import HoloField from './HoloField'
import IntroBackdrop from './IntroBackdrop'

/**
 * 入场欢迎页（启动画面）
 * ------------------------------------------------------------------
 * 只在一次会话里出现一次（sessionStorage 标记）。
 * 表现是一条"系统启动"序列：横线展开 → 名字逐字出现 → 进度跑满 → 亮起进入提示。
 *
 * **进度跑满后不会自动进入**，必须由用户点击（或按键）才会推开门，
 * 这样首屏始终有明确的"进入"动作，而不是被动跳转。
 * prefers-reduced-motion 下不播动画，但同样需要点击。
 * 页脚留了重看入口，通过 window 事件 `pluents:replay-intro` 触发。
 */

export const INTRO_KEY = 'pluents:intro-shown'
const PROGRESS = 1400
/**
 * 退场总时长 = 粒子动画的总时长（见 HoloField 的 TOTAL）。
 * 粒子层是入场的最后一段，它跑完才卸载整张欢迎页。
 */
const EXIT = 2050
/** 减少动效时只有一次 0.3s 的整体淡出，不必等满整套逐字退场 */
const EXIT_REDUCED = 420

export default function Intro({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const [label, setLabel] = useState('BOOTING KERNEL')
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const canEnterRef = useRef(true)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  const enter = useCallback(() => {
    if (!canEnterRef.current) return
    canEnterRef.current = false
    setReady(true)
    setLeaving(true)
    const wait = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? EXIT_REDUCED
      : EXIT
    window.setTimeout(() => onDoneRef.current(), wait)
  }, [])

  const enterRef = useRef(enter)
  enterRef.current = enter

  useEffect(() => {
    // 锁滚动交给 body.intro-open 这个 class，不要写 inline style
    document.body.classList.add('intro-open')

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0

    if (reduce) {
      setPct(100)
      setLabel('SYSTEM ONLINE')
      setReady(true)
    } else {
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / PROGRESS)
        setPct(Math.round(p * 100))
        if (p > 0.28) setLabel('LOADING CASES')
        if (p > 0.62) setLabel('CALIBRATING HUD')
        if (p >= 1) {
          setLabel('SYSTEM ONLINE')
          setReady(true)
        }
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    // 键盘兜底：任意键（Tab 除外）等同于点击
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') return
      enterRef.current()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('intro-open')
    }
  }, [])

  return (
    <div
      className={`intro ${leaving ? 'is-out' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="欢迎页，按任意键或点击进入作品集"
      onClick={enter}
    >
      <div className="intro-sky" aria-hidden="true" />
      <div className="intro-aurora" aria-hidden="true" />
      <div className="intro-aurora intro-aurora--2" aria-hidden="true" />
      <IntroBackdrop boost={leaving} />
      <HoloField run={leaving} sourceRef={titleRef} />

      <span className="intro-corner intro-corner--tl" aria-hidden="true" />
      <span className="intro-corner intro-corner--tr" aria-hidden="true" />
      <span className="intro-corner intro-corner--bl" aria-hidden="true" />
      <span className="intro-corner intro-corner--br" aria-hidden="true" />

      <div className="intro-inner relative">
        <p className="intro-eyebrow">
          Portfolio System <span className="text-muted">/ 2026</span>
        </p>

        <span className="intro-rule" aria-hidden="true" />

        <h1 ref={titleRef} className="intro-title" aria-label="Pluents">
          {'PLUENTS'.split('').map((c, i) => (
            <span key={i} style={{ ['--i' as string]: i }}>
              {c}
            </span>
          ))}
        </h1>

        <div className="intro-sub-wrap">
          <p className="intro-role" data-hidden={ready}>
            潘旺坤 · 玩法 / 系统 / 战斗策划
          </p>
          <p className="intro-greet" data-shown={ready}>
            欢迎你，来访者
          </p>
        </div>

        <div className="intro-bar">
          <i style={{ width: `${pct}%` }} />
        </div>

        <div className="intro-meta">
          <span>{label}</span>
          <span className="tabular-nums">{String(pct).padStart(3, '0')}</span>
        </div>

        <p className={`intro-continue ${ready ? 'is-ready' : ''}`} aria-live="polite">
          {ready ? (
            <>
              <span className="pointer-only">按任意键继续</span>
              <span className="touch-only">点击任意处继续</span>
              <i className="intro-caret" aria-hidden="true" />
            </>
          ) : (
            '正在载入'
          )}
        </p>
      </div>
    </div>
  )
}

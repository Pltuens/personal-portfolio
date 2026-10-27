import { useLayoutEffect, useRef } from 'react'

/**
 * 星门穿越
 * ------------------------------------------------------------------
 * 这版只做**一个动作**：镜头向前推进。
 *
 *   星星从远处的星野加速 → 拉成穿过镜头的长光带 → 穿出后减速落回星空
 *   欢迎页的字同时往前飞（scale 放大 + 虚化），被甩到镜头后面
 *   站点页面从 1.1 倍缩回 1 倍浮出来，像穿越结束时视野重新稳定
 *
 * 三条运动方向一致，所以读起来是一次换场，而不是两段特效各播各的。
 *
 * 深度用 d 表示（d = 1 时星星刚好落在屏幕边缘，越小越近）。
 * 速度单位是 d/秒 —— 线性推进等于匀速靠近，投影到屏幕上自然是指数加速，
 * 穿越感就是这条投影关系给的，不用另外造缓动曲线。
 */

type Star = {
  /** -1..1，单位是「屏幕半宽」 */
  x: number
  y: number
  /** 当前深度 */
  d: number
  /** 上一帧深度，用来画拖尾 */
  pd: number
  tone: number
}

const TONES = ['214, 250, 255', '53, 226, 255', '167, 139, 250']
const FILLS = TONES.map((t) => `rgb(${t})`)

/** 最近的深度，再近就重生到远处 */
const D_NEAR = 0.03
const D_FAR = 1

/** 全程时长：要和 Intro 的 EXIT、以及 CSS 里 warp-* 的延迟对齐 */
export const WARP_MS = 2150
const FADE_IN = 240
const RUSH_START = 200
const RUSH_MS = 780
const BRAKE_AT = 1150
const BRAKE_MS = 520
const FADE_OUT_AT = 1620
const FADE_OUT_MS = 480

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** 当前帧的推进速度（d/秒） */
function speedAt(t: number) {
  const rush = clamp01((t - RUSH_START) / RUSH_MS)
  const brake = t < BRAKE_AT ? 1 : Math.max(0, 1 - (t - BRAKE_AT) / BRAKE_MS)
  return 0.6 + 6.2 * rush * rush * brake
}

export default function WarpField({ run }: { run: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useLayoutEffect(() => {
    if (!run) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    let cx = 0
    let cy = 0
    let target = 0

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      cx = w / 2
      cy = h / 2
      // d = 1 时星星落在 cx ± target，刚好铺满屏幕
      target = w * 0.52
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const count = w < 760 ? 260 : 620
    const stars: Star[] = []
    for (let i = 0; i < count; i++) {
      const d = D_NEAR + Math.random() * (D_FAR - D_NEAR)
      stars.push({
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        d,
        pd: d,
        tone: Math.random() < 0.62 ? 0 : Math.random() < 0.55 ? 1 : 2,
      })
    }
    // 按色板排序，draw 时 fillStyle 每组只切一次
    stars.sort((a, b) => a.tone - b.tone)

    const draw = (t: number) => {
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'

      const fade = Math.min(clamp01(t / FADE_IN), 1 - clamp01((t - FADE_OUT_AT) / FADE_OUT_MS))
      if (fade <= 0) return

      const boost = (speedAt(t) - 0.6) / 6.2

      // 隧道尽头的光：峰值时最亮，只给一点辉光，不做满屏白
      if (boost > 0.02) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.62)
        g.addColorStop(0, `rgba(150, 240, 255, ${0.1 * boost})`)
        g.addColorStop(0.45, `rgba(53, 226, 255, ${0.04 * boost})`)
        g.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.globalAlpha = 1
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      }

      let tone = -1
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        if (s.tone !== tone) {
          tone = s.tone
          ctx.fillStyle = FILLS[tone]
          ctx.strokeStyle = FILLS[tone]
        }

        const near = 1 - s.d
        const a = (0.32 + 0.68 * near * near) * fade
        const hx = cx + s.x * (target / s.d)
        const hy = cy + s.y * (target / s.d)

        // 拖尾：深度差越大越长，加速时自然拉成光带
        if (s.pd - s.d > 0.0006) {
          ctx.globalAlpha = a * 0.72
          ctx.lineWidth = 0.55 + near * near * 3.1
          ctx.beginPath()
          ctx.moveTo(cx + s.x * (target / s.pd), cy + s.y * (target / s.pd))
          ctx.lineTo(hx, hy)
          ctx.stroke()
        }

        const r = 0.55 + near * 1.7
        if (near > 0.82) {
          ctx.globalAlpha = a * 0.16
          ctx.beginPath()
          ctx.arc(hx, hy, r * 3.2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = a
        ctx.beginPath()
        ctx.arc(hx, hy, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    /** 先推进再画，保证拖尾用的是「上一帧 → 这一帧」的真实位移 */
    const step = (t: number, dt: number) => {
      const v = speedAt(t)
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        s.pd = s.d
        s.d -= v * dt
        if (s.d <= D_NEAR) {
          s.d = D_FAR
          s.pd = D_FAR
          s.x = Math.random() * 2 - 1
          s.y = Math.random() * 2 - 1
        }
      }
      draw(t)
    }

    document.body.classList.add('is-warp')

    const onResize = () => resize()
    window.addEventListener('resize', onResize)

    const t0 = performance.now()
    let last = t0
    let raf = 0
    let done = false

    const stop = () => {
      if (done) return
      done = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.clearRect(0, 0, w, h)
      document.body.classList.remove('is-warp')
    }

    const tick = (now: number) => {
      // 掉帧时不让星星瞬移，也不让整段变慢
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = now - t0
      step(t, dt)
      if (t >= WARP_MS) stop()
      else raf = requestAnimationFrame(tick)
    }

    // 第一帧同步画出来，接住刚被 CSS 推远的文字
    draw(0)
    raf = requestAnimationFrame(tick)

    return () => {
      done = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.body.classList.remove('is-warp')
    }
  }, [run])

  return <canvas ref={canvasRef} className="warp-field" aria-hidden="true" />
}

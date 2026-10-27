import { useEffect, useRef } from 'react'

/**
 * 欢迎页背景：长曝光星轨（star trails）
 * ------------------------------------------------------------------
 * 参考"繁星驱动 · 逆转时空"的观感，构成是三层：
 *   1. 同心星轨 —— 绕天极旋转的弧光，半径越大弧越长，密集叠加成星轨盘；
 *   2. 斜向流星 —— 少量高亮拖尾高速划过，制造穿越感；
 *   3. 细尘星点 —— 静态微光，填补轨道之间的空隙。
 * 极光与深青底色交给 CSS 层（.intro-aurora），canvas 自身透明，
 * 这样星轨才能叠在极光"上方"而不是把它盖住。
 */

type Trail = {
  r: number // 距天极半径
  a: number // 当前角度
  span: number // 拖尾角跨度
  w: number // 线宽
  alpha: number
  tint: string
}

type Streak = {
  x: number
  y: number
  vx: number
  vy: number
  len: number
  life: number
  max: number
  alpha: number
}

type Dust = { x: number; y: number; s: number; phase: number; spd: number }

const TINTS = [
  'rgba(214, 245, 255, 1)', // 冷白
  'rgba(168, 232, 255, 1)', // 淡青
  'rgba(196, 190, 255, 1)', // 淡紫
  'rgba(255, 246, 224, 1)', // 微暖
]

export default function IntroBackdrop({ boost = false }: { boost?: boolean }) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const boostRef = useRef(boost)
  boostRef.current = boost

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let cx = 0
    let cy = 0
    let maxR = 0
    let trails: Trail[] = []
    let dust: Dust[] = []
    let streaks: Streak[] = []
    let omega = 1
    let raf = 0
    let last = 0

    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const pick = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0]

    const makeTrail = (): Trail => {
      const r = maxR * rand(0.07, 1.02)
      return {
        r,
        a: rand(0, Math.PI * 2),
        // 越靠外弧越长；用随机量保证参差
        span: rand(0.1, 0.42) * (0.55 + (r / maxR) * 1.1),
        w: rand(0.5, 1.6),
        alpha: rand(0.24, 0.82),
        tint: Math.random() > 0.12 ? pick(TINTS) : 'rgba(120, 255, 214, 1)',
      }
    }

    const makeStreak = (fresh = false): Streak => {
      const dir = Math.random() > 0.35 ? 1 : -1
      const sp = rand(1.5, 3.1)
      const max = rand(26, 46)
      return {
        x: dir > 0 ? rand(-w * 0.25, w * 0.95) : rand(w * 0.05, w * 1.25),
        y: rand(-h * 0.2, h * 0.75),
        vx: dir * sp * 1.55,
        vy: sp * 1.15,
        len: rand(90, 240),
        life: fresh ? rand(0, max * 0.6) : 0,
        max,
        alpha: rand(0.4, 0.95),
      }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = w * 0.5
      cy = h * 0.58
      maxR = Math.max(
        Math.hypot(cx, cy),
        Math.hypot(w - cx, cy),
        Math.hypot(cx, h - cy),
        Math.hypot(w - cx, h - cy),
      )
    }

    const spawn = () => {
      // 线密度按屏幕面积走，小屏少画一些
      const count = Math.min(460, Math.max(170, Math.round((w * h) / 3000)))
      trails = Array.from({ length: count }, makeTrail)
      dust = Array.from({ length: Math.min(90, Math.round(count * 0.34)) }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        s: rand(0.5, 1.5),
        phase: rand(0, Math.PI * 2),
        spd: rand(0.0006, 0.0018),
      }))
      streaks = Array.from({ length: w > 900 ? 4 : 3 }, () => makeStreak(true))
    }

    const drawTrails = () => {
      ctx.globalCompositeOperation = 'lighter'
      for (const t of trails) {
        const edge = 0.55 + (t.r / maxR) * 0.75 // 越靠外越亮，模拟银河边缘的密集感

        // 光晕副本：宽而极淡，负责"发光"而不是"线"
        ctx.strokeStyle = t.tint
        ctx.globalAlpha = t.alpha * 0.1 * edge
        ctx.lineWidth = t.w * 4.2
        ctx.beginPath()
        ctx.arc(cx, cy, t.r, t.a - t.span, t.a)
        ctx.stroke()

        // 长而暗的尾巴
        ctx.globalAlpha = t.alpha * 0.5 * edge
        ctx.lineWidth = t.w
        ctx.beginPath()
        ctx.arc(cx, cy, t.r, t.a - t.span, t.a)
        ctx.stroke()

        // 亮头，让弧线有"方向"
        ctx.globalAlpha = Math.min(1, t.alpha * 1.15 * edge)
        ctx.lineWidth = t.w * 1.3
        ctx.beginPath()
        ctx.arc(cx, cy, t.r, t.a - t.span * 0.16, t.a)
        ctx.stroke()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const drawDust = (now: number) => {
      for (const d of dust) {
        const tw = 0.45 + 0.55 * Math.sin(now * d.spd + d.phase)
        ctx.globalAlpha = Math.max(0, tw) * 0.7
        ctx.fillStyle = 'rgba(220, 244, 255, 1)'
        ctx.fillRect(d.x, d.y, d.s, d.s)
      }
    }

    const drawStreaks = () => {
      for (const s of streaks) {
        const k = s.life / s.max
        // 起手渐亮、收尾渐暗
        const a = Math.sin(Math.min(1, k) * Math.PI) * s.alpha
        const x0 = s.x - s.vx * s.len * 0.06
        const y0 = s.y - s.vy * s.len * 0.06
        const g = ctx.createLinearGradient(x0, y0, s.x, s.y)
        g.addColorStop(0, 'rgba(160, 236, 255, 0)')
        g.addColorStop(0.72, `rgba(190, 244, 255, ${0.5 * a})`)
        g.addColorStop(1, `rgba(255, 255, 255, ${a})`)

        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = 1
        ctx.strokeStyle = g
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(s.x, s.y)
        ctx.stroke()

        // 亮头
        ctx.fillStyle = `rgba(240, 253, 255, ${a})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
      }
    }

    const step = (dt: number, now: number) => {
      const target = boostRef.current ? 5.2 : 1
      omega += (target - omega) * 0.1

      const dTheta = dt * 0.00019 * omega
      for (const t of trails) {
        t.a -= dTheta
        if (t.a < -Math.PI * 2) t.a += Math.PI * 2
      }

      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i]
        s.x += s.vx * (dt / 16) * omega
        s.y += s.vy * (dt / 16) * omega
        s.life += dt / 16
        if (s.life > s.max || s.y > h + 260 || s.x < -320 || s.x > w + 320) {
          streaks[i] = makeStreak()
        }
      }

      ctx.clearRect(0, 0, w, h)
      drawTrails()
      drawDust(now)
      drawStreaks()
      ctx.globalAlpha = 1
    }

    resize()
    spawn()

    if (reduce) {
      ctx.clearRect(0, 0, w, h)
      drawTrails()
      drawDust(0)
      ctx.globalAlpha = 1
      return
    }

    ctx.clearRect(0, 0, w, h)
    const loop = (now: number) => {
      const dt = Math.min(now - last, 48)
      last = now
      step(dt, now)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    let rt = 0
    const onResize = () => {
      window.clearTimeout(rt)
      rt = window.setTimeout(() => {
        resize()
        spawn()
      }, 200)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(rt)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="intro-backdrop absolute inset-0 h-full w-full" />
}

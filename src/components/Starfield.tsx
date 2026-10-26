import { useEffect, useRef } from 'react'

/**
 * 星空背景层
 * ------------------------------------------------------------------
 * 全屏 fixed canvas，画三层东西：
 * 1. 均匀散布的星点（缓慢闪烁 + 极慢漂移）
 * 2. 一条斜向的"银河"亮带（一部分星星按斜线分布，密一点）
 * 3. 少数亮星带十字光晕
 *
 * 性能：星星数按屏幕面积算（上限 240），用 fillRect 而不是 arc，
 * 帧率节流到约 30fps；prefers-reduced-motion 下只画一帧静态。
 */

type Star = {
  x: number
  y: number
  size: number
  base: number
  phase: number
  speed: number
  drift: number
  tint: string
  bright: boolean
}

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let stars: Star[] = []
    let raf = 0
    let last = 0

    // 流星：隔几秒划一颗，方向固定右上到左下之外，用右下
    type Meteor = { x: number; y: number; vx: number; vy: number; life: number; max: number }
    let meteor: Meteor | null = null
    let nextMeteor = 2200

    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(520, Math.max(160, Math.round((w * h) / 3400)))
      const milky = Math.round(count * 0.32)

      stars = Array.from({ length: count }, (_, i) => {
        const inBelt = i < milky
        // 银河：沿一条斜带分布，越靠带中心越密
        let x: number
        let y: number
        if (inBelt) {
          x = Math.random()
          const center = 0.16 + x * 0.44
          y = center + (Math.random() + Math.random() - 1) * 0.17
          y = Math.min(0.95, Math.max(0.03, y))
        } else {
          x = Math.random()
          y = Math.random()
        }
        const bright = Math.random() > 0.94
        return {
          x,
          y,
          size: bright ? rand(1.9, 2.9) : rand(0.8, 1.7),
          base: inBelt ? rand(0.55, 1) : rand(0.28, 0.8),
          phase: Math.random() * Math.PI * 2,
          speed: rand(0.0006, 0.0022),
          drift: rand(0.000002, 0.000012),
          tint:
            Math.random() > 0.86
              ? 'rgba(178, 156, 255, 1)' // 少量偏紫
              : Math.random() > 0.7
                ? 'rgba(150, 226, 255, 1)' // 偏青
                : 'rgba(226, 240, 255, 1)',
          bright,
        }
      })
    }

    const paint = (t: number) => {
      ctx.clearRect(0, 0, w, h)

      if (!reduce) {
        if (!meteor && t > nextMeteor) {
          meteor = {
            x: rand(0.02, 0.72) * w,
            y: rand(0.0, 0.28) * h,
            vx: rand(3.4, 5.6),
            vy: rand(1.7, 2.9),
            life: 0,
            max: rand(52, 84),
          }
        }
        if (meteor) {
          meteor.life += 1
          meteor.x += meteor.vx
          meteor.y += meteor.vy
          if (meteor.life >= meteor.max) {
            meteor = null
            nextMeteor = t + rand(4200, 11000)
          }
        }
      }
      for (const s of stars) {
        const twinkle = reduce ? 1 : 0.68 + 0.32 * Math.sin(t * s.speed + s.phase)
        const a = s.base * twinkle
        if (a <= 0.01) continue
        const x = s.x * w
        const y = ((s.y + (reduce ? 0 : t * s.drift)) % 1) * h

        if (s.bright) {
          // 亮星：核心 + 细十字星芒（不要大圆盘，否则会变成灰色圆环）
          ctx.globalAlpha = a
          ctx.fillStyle = s.tint
          ctx.beginPath()
          ctx.arc(x, y, s.size * 0.85, 0, Math.PI * 2)
          ctx.fill()

          ctx.globalAlpha = a * 0.42
          ctx.fillRect(x - s.size * 4.2, y - 0.3, s.size * 8.4, 0.6)
          ctx.fillRect(x - 0.3, y - s.size * 4.2, 0.6, s.size * 8.4)
        }

        ctx.globalAlpha = a
        ctx.fillStyle = s.tint
        ctx.fillRect(x, y, s.size, s.size)
      }
      // 流星：渐隐拖尾
      if (meteor) {
        const p = meteor.life / meteor.max
        const fade = p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8
        const tailX = meteor.x - meteor.vx * 22
        const tailY = meteor.y - meteor.vy * 22
        const g = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y)
        g.addColorStop(0, 'rgba(150, 230, 255, 0)')
        g.addColorStop(0.75, `rgba(190, 240, 255, ${0.55 * fade})`)
        g.addColorStop(1, `rgba(255, 255, 255, ${fade})`)
        ctx.strokeStyle = g
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(meteor.x, meteor.y)
        ctx.stroke()

        // 头部亮点
        ctx.globalAlpha = fade
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(meteor.x, meteor.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      }

      ctx.globalAlpha = 1
    }

    const loop = (now: number) => {
      if (now - last >= 33) {
        last = now
        paint(now)
      }
      raf = requestAnimationFrame(loop)
    }

    build()
    if (reduce) {
      paint(0)
    } else {
      raf = requestAnimationFrame(loop)
    }

    let rt = 0
    const onResize = () => {
      window.clearTimeout(rt)
      rt = window.setTimeout(() => {
        build()
        if (reduce) paint(0)
      }, 200)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(rt)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  )
}

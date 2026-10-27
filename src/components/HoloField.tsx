import { useLayoutEffect, useRef, type RefObject } from 'react'

/**
 * 全息重组粒子层
 * ------------------------------------------------------------------
 * 欢迎页退场时接管画面，分两幕：
 *
 *   1. 崩解（0 → 900ms）
 *      把 PLUENTS 的字形按像素采样成点阵粒子。先"停留"一小会（pow(k, 2.4)
 *      让前 150ms 几乎不动，能看清字形），然后向外炸开、上飘、熄灭。
 *      标题本身在同一帧被 CSS 隐藏，粒子第一帧就画在字形原位上，看不出接缝。
 *
 *   2. 重组（520 → 1440ms）
 *      从屏幕外飞入的第二批粒子，落点取 #main 里每个文字块的均匀网格。
 *      与此同时 CSS 让 #main 从很淡的底噪收敛到实体（holo-materialize），
 *      粒子正好压在它上面落位 —— 于是"页面是从粒子里长出来的"。
 *
 *   3. 余辉（1460 → 1800ms）
 *      页面已经实了，多出来的光点散掉，避免和正文抢注意力。
 *
 * 时间轴必须和 Intro 的 EXIT、以及 index.css 里 holo-materialize 的延迟对齐。
 */

type Pt = { x: number; y: number }

type Base = {
  /** 上一帧位置，用来画运动拖尾 */
  px: number
  py: number
  x: number
  y: number
  /** 核心半径 */
  r: number
  /** 色板下标，数组按它排过序，绘制时按组切 fillStyle */
  tone: number
}

type TextP = Base & {
  sx: number
  sy: number
  ax: number
  ay: number
  speed: number
  lift: number
  /** 起飞延迟：从左到右扫过去，字形是一段一段化掉的，不是整体一起炸 */
  delay: number
  dur: number
  ph: number
  curl: number
}

type SiteP = Base & {
  sx: number
  sy: number
  ex: number
  ey: number
  qx: number
  qy: number
  delay: number
  ph: number
}

const TAU = Math.PI * 2
const TONES = ['53, 226, 255', '167, 139, 250', '214, 250, 255']
const FILLS = TONES.map((t) => `rgb(${t})`)

/** 字形崩解的总窗口（最后一颗粒子熄灭的时刻） */
const TEXT_MS = 940
/** 解体波从左扫到右用多久 */
const WAVE = 200
/** 网站粒子起飞时刻（要早于字形完全散尽，两幕才连得上） */
const SITE_START = 520
/** 单颗网站粒子的飞行时长（不含随机延迟） */
const SITE_MS = 760
/** 全部落位，开始收余辉 */
const HOLD_UNTIL = 1460
const SITE_FADE = 340
/** 整层结束。Intro 的 EXIT 比它多 50ms，留一帧余量 */
const TOTAL = 2000
/** 扫描线自上而下把页面"打"出来，和粒子落位同一段时间 */
const SCAN_DELAY = 560
const SCAN_MS = 700

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** 把标题的字形按像素采样成点阵。逐字用 span 的真实 rect 定位，字形和屏幕上完全重合 */
function sampleGlyphs(el: HTMLElement): Pt[] {
  const cs = getComputedStyle(el)
  const spans = Array.from(el.querySelectorAll<HTMLElement>('span'))
  const parts = (
    spans.length
      ? spans.map((s) => ({ ch: (s.textContent ?? '').trim(), r: s.getBoundingClientRect() }))
      : [
          {
            ch: (el.getAttribute('aria-label') ?? el.textContent ?? '').trim(),
            r: el.getBoundingClientRect(),
          },
        ]
  ).filter((p) => p.ch && p.r.width > 0 && p.r.height > 0)
  if (!parts.length) return []

  const left = Math.min(...parts.map((p) => p.r.left))
  const top = Math.min(...parts.map((p) => p.r.top))
  const right = Math.max(...parts.map((p) => p.r.right))
  const bottom = Math.max(...parts.map((p) => p.r.bottom))
  const pad = 12
  const w = Math.ceil(right - left) + pad * 2
  const h = Math.ceil(bottom - top) + pad * 2
  if (w <= 0 || h <= 0) return []

  const cv = document.createElement('canvas')
  cv.width = w
  cv.height = h
  const g = cv.getContext('2d')
  if (!g) return []

  g.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillStyle = '#fff'
  for (const p of parts) {
    g.fillText(
      p.ch,
      p.r.left - left + pad + p.r.width / 2,
      p.r.top - top + pad + p.r.height / 2,
    )
  }

  const data = g.getImageData(0, 0, w, h).data
  const collect = (step: number) => {
    const out: Pt[] = []
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        if (data[(y * w + x) * 4 + 3] > 150) out.push({ x: left - pad + x, y: top - pad + y })
      }
    }
    return out
  }

  // 自适应步长：大字少取、小字多取，总点数封顶
  let step = 3
  let pts = collect(step)
  while (pts.length > 1000 && step < 16) {
    step += 1
    pts = collect(step)
  }
  return pts
}

/** 把页面上的文字块打成点阵。
 *  点数按面积分配（不是每块固定几个），这样整页的密度是均匀的 ——
 *  看起来才像一张正在对齐的全息网格，而不是几块随机光斑。 */
function sampleBoxes(boxes: DOMRect[], gap: number, budget: number): Pt[] {
  const uniq: DOMRect[] = []
  for (const b of boxes) {
    if (b.width < 6 || b.height < 6) continue
    // li / p / a 会互相套着，重复采样会让同一块地方密度翻倍
    const dup = uniq.some(
      (s) =>
        Math.abs(s.left - b.left) < 3 &&
        Math.abs(s.top - b.top) < 3 &&
        Math.abs(s.width - b.width) < 3 &&
        Math.abs(s.height - b.height) < 3,
    )
    if (!dup) uniq.push(b)
  }

  let area = 0
  for (const b of uniq) area += b.width * b.height
  if (!area) return []

  const out: Pt[] = []
  for (const b of uniq) {
    const n = Math.max(3, Math.round(((b.width * b.height) / area) * budget))
    const cols = Math.max(1, Math.round(b.width / gap))
    const rows = Math.max(1, Math.round(b.height / gap))
    const stride = Math.max(1, Math.ceil((cols * rows) / n))
    const sx = b.width / cols
    const sy = b.height / rows
    let i = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (i++ % stride) continue
        out.push({
          x: b.left + sx * (c + 0.5) + (Math.random() - 0.5) * sx * 0.45,
          y: b.top + sy * (r + 0.5) + (Math.random() - 0.5) * sy * 0.45,
        })
      }
    }
  }
  return out
}

export default function HoloField({
  run,
  sourceRef,
}: {
  run: boolean
  sourceRef: RefObject<HTMLElement | null>
}) {
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
    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // 落点必须在 #main 被加上缩放动画之前量，否则会有 1.5% 的偏移
    const boxes = Array.from(
      document.querySelectorAll<HTMLElement>(
        '#main h1, #main h2, #main h3, #main p, #main a, #main button, #main li, #main img',
      ),
    )
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 6 && r.height > 6 && r.bottom > 8 && r.top < h - 8)
      .slice(0, 46)

    const glyphs = sourceRef.current ? sampleGlyphs(sourceRef.current) : []

    const cx = w / 2
    const cy = h / 2
    const far = Math.max(w, h) * 0.78

    const gx0 = glyphs.length ? Math.min(...glyphs.map((p) => p.x)) : 0
    const gx1 = glyphs.length ? Math.max(...glyphs.map((p) => p.x)) : 1
    const gw = Math.max(1, gx1 - gx0)

    const textP: TextP[] = glyphs.map((p) => {
      // 方向偏上半球：碎屑主要往上飘，不会糊在接着浮现的首页大标题上
      const a = Math.random() * TAU
      const ax0 = Math.cos(a)
      const ay0 = Math.sin(a) * 0.55 - 0.8
      const len = Math.hypot(ax0, ay0) || 1
      return {
        px: p.x,
        py: p.y,
        x: p.x,
        y: p.y,
        sx: p.x,
        sy: p.y,
        ax: ax0 / len,
        ay: ay0 / len,
        speed: 90 + Math.random() * 300,
        lift: 26 + Math.random() * 120,
        delay: ((p.x - gx0) / gw) * WAVE + Math.random() * 70,
        dur: 480 + Math.random() * 180,
        ph: Math.random() * TAU,
        curl: 12 + Math.random() * 30,
        r: 0.85 + Math.random() * 1.55,
        tone: Math.floor(Math.random() * 3),
      }
    })

    const siteP: SiteP[] = sampleBoxes(boxes, 11, 820).map((p) => {
      // 起点在屏幕外：以终点相对画面中心的方向再往外推，形成"从四周收拢"
      const ang = Math.atan2(p.y - cy, p.x - cx) + (Math.random() - 0.5) * 1.25
      const rad = far * (0.72 + Math.random() * 0.6)
      const sx = cx + Math.cos(ang) * rad
      const sy = cy + Math.sin(ang) * rad
      const nx = -(p.y - sy)
      const ny = p.x - sx
      const nl = Math.hypot(nx, ny) || 1
      const curve = (Math.random() - 0.5) * 260
      return {
        px: sx,
        py: sy,
        x: sx,
        y: sy,
        sx,
        sy,
        ex: p.x,
        ey: p.y,
        qx: (sx + p.x) / 2 + (nx / nl) * curve,
        qy: (sy + p.y) / 2 + (ny / nl) * curve,
        delay: Math.random() * 170,
        ph: Math.random() * TAU,
        r: 0.7 + Math.random() * 1.3,
        tone: Math.random() < 0.74 ? 0 : Math.random() < 0.62 ? 1 : 2,
      }
    })

    // 按色板排序，绘制时 fillStyle 每组只切一次
    const byTone = (a: Base, b: Base) => a.tone - b.tone
    textP.sort(byTone)
    siteP.sort(byTone)

    /** 计算位置 + 返回透明度，然后画「拖尾 + 光晕 + 核心」 */
    const drawAll = (arr: Base[], step: (p: Base) => number) => {
      let tone = -1
      for (let i = 0; i < arr.length; i++) {
        const p = arr[i]
        const a = step(p)
        if (a <= 0.004) continue
        if (p.tone !== tone) {
          tone = p.tone
          ctx.fillStyle = FILLS[tone]
          ctx.strokeStyle = FILLS[tone]
        }

        const dx = p.x - p.px
        const dy = p.y - p.py
        if (dx * dx + dy * dy > 2.6) {
          ctx.globalAlpha = a * 0.5
          ctx.lineWidth = p.r * 1.15
          ctx.beginPath()
          ctx.moveTo(p.px, p.py)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
        }

        ctx.globalAlpha = a * 0.14
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 2.9, 0, TAU)
        ctx.fill()

        ctx.globalAlpha = a
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, TAU)
        ctx.fill()
      }
    }

    const render = (t: number) => {
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      ctx.lineCap = 'round'

      // 一幕：字形从左到右一段段化开，带着一点旋度往上飘
      if (t <= TEXT_MS) {
        drawAll(textP, (p) => {
          const tp = p as TextP
          tp.px = tp.x
          tp.py = tp.y
          const k = clamp01((t - tp.delay) / tp.dur)
          const e = Math.pow(k, 1.75)
          const d = tp.speed * e
          const curl = Math.sin(tp.ph + k * 4.2) * tp.curl * e
          tp.x = tp.sx + tp.ax * d - tp.ay * curl
          tp.y = tp.sy + tp.ay * d * 0.62 - tp.lift * e * e + tp.ax * curl
          return 1 - Math.pow(k, 1.4)
        })
      }

      // 二幕：网站重组
      if (t >= SITE_START) {
        const out = 1 - clamp01((t - HOLD_UNTIL) / SITE_FADE)
        if (out > 0) {
          drawAll(siteP, (p) => {
            const sp = p as SiteP
            sp.px = sp.x
            sp.py = sp.y
            const k = clamp01((t - SITE_START - sp.delay) / SITE_MS)
            const e = 1 - Math.pow(1 - k, 3)
            const u = 1 - e
            sp.x = u * u * sp.sx + 2 * u * e * sp.qx + e * e * sp.ex
            sp.y = u * u * sp.sy + 2 * u * e * sp.qy + e * e * sp.ey
            // 落位后轻微呼吸，像还没稳定的投影
            if (k >= 1) {
              sp.x += Math.sin(t * 0.011 + sp.ph) * 0.75
              sp.y += Math.cos(t * 0.013 + sp.ph) * 0.75
            }
            // 快落位时有一下闪光，像投影对齐的瞬间
            const flash = 1 + 0.6 * Math.exp(-Math.pow((k - 0.9) / 0.13, 2))
            const a = (0.2 + 0.8 * Math.min(1, k * 4)) * out * flash
            return a > 1 ? 1 : a
          })
        }
      }

      // 三幕：投影扫描线
      drawScan(t)

      ctx.globalAlpha = 1
    }

    /** 投影仪开机那一下：一条亮线从上扫到下，扫过的地方页面才"长实" */
    const drawScan = (t: number) => {
      const k = clamp01((t - SCAN_DELAY) / SCAN_MS)
      if (k <= 0 || k >= 1) return
      const y = -80 + k * (h + 160)
      const g = ctx.createLinearGradient(0, y - 130, 0, y)
      g.addColorStop(0, 'rgba(53, 226, 255, 0)')
      g.addColorStop(0.85, 'rgba(53, 226, 255, 0.035)')
      g.addColorStop(1, 'rgba(140, 238, 255, 0.13)')
      ctx.globalAlpha = 1 - k * 0.2
      ctx.fillStyle = g
      ctx.fillRect(0, y - 130, w, 130)
      // 线本身用三层叠出软边，一条 1px 硬线在暗底上会像渲染接缝
      for (const [dy, a, hh] of [
        [-2.4, 0.05, 4.8],
        [-1.2, 0.09, 2.4],
        [0, 0.16, 1.1],
      ] as const) {
        ctx.globalAlpha = (1 - k * 0.2) * a
        ctx.fillStyle = 'rgba(206, 250, 255, 1)'
        ctx.fillRect(0, y + dy, w, hh)
      }
      ctx.globalAlpha = 1
    }

    // 让 CSS 知道可以开始"实体化"了
    document.body.classList.add('is-holo')

    const onResize = () => {
      resize()
    }
    window.addEventListener('resize', onResize)

    const t0 = performance.now()
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
      document.body.classList.remove('is-holo')
      canvas.style.display = 'none'
    }

    const tick = (now: number) => {
      const t = now - t0
      render(t)
      if (t >= TOTAL) stop()
      else raf = requestAnimationFrame(tick)
    }

    // 同步画第一帧：这一帧标题刚被 CSS 隐藏，点阵必须同时出现
    render(0)
    raf = requestAnimationFrame(tick)

    return () => {
      done = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.body.classList.remove('is-holo')
    }
  }, [run, sourceRef])

  return <canvas ref={canvasRef} className="holo-field" aria-hidden="true" />
}

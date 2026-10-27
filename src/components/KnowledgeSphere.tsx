import { useEffect, useMemo, useRef, useState } from 'react'
import { groupMeta, knowledgeLinks, knowledgeNodes, type KnowledgeGroup } from '../data/knowledge'

/**
 * 3D 知识球
 * ------------------------------------------------------------------
 * 用 canvas 2D 手绘一个球面点云：节点按斐波那契分布铺在球面上，
 * 鼠标拖动改变两个旋转角，透视投影后按深度决定大小与透明度，
 * 前后分层绘制，读起来就像在转一个地球仪。
 * 不引第三方 3D 库，构建体积和首屏都省下来。
 */

type Vec3 = { x: number; y: number; z: number }
type Proj = { x: number; y: number; z: number; s: number }

const NODE_COUNT = knowledgeNodes.length

// 斐波那契球：让节点在球面上均匀分布，不会在极点附近挤成一堆
const spherePoints: Vec3[] = Array.from({ length: NODE_COUNT }, (_, i) => {
  const y = 1 - (i / (NODE_COUNT - 1)) * 2
  const r = Math.sqrt(Math.max(0, 1 - y * y))
  const phi = i * 2.399963229728653
  return { x: Math.cos(phi) * r, y, z: Math.sin(phi) * r }
})

const indexOf = new Map(knowledgeNodes.map((n, i) => [n.id, i]))
const edges = knowledgeLinks
  .map(([a, b]) => [indexOf.get(a), indexOf.get(b)] as const)
  .filter((e): e is readonly [number, number] => e[0] !== undefined && e[1] !== undefined)

export default function KnowledgeSphere() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [hovered, setHovered] = useState(-1)
  const hoverRef = useRef(-1)

  const related = useMemo(() => {
    if (hovered < 0) return []
    const id = knowledgeNodes[hovered].id
    return knowledgeLinks
      .filter(([a, b]) => a === id || b === id)
      .map(([a, b]) => knowledgeNodes[indexOf.get(a === id ? b : a) ?? 0].label)
  }, [hovered])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let cx = 0
    let cyc = 0
    let R = 0
    let raf = 0
    let last = performance.now()

    // 跟踪球：维护一个累积旋转矩阵，每次拖拽都绕"屏幕轴"左乘。
    // 这样无论球转到什么姿态，位移和球的移动方向永远一致，也不会在极点卡住。
    type Mat3 = [number, number, number, number, number, number, number, number, number]
    const mul = (a: Mat3, b: Mat3): Mat3 => [
      a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
      a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
      a[0] * b[2] + a[1] * b[5] + a[2] * b[8],
      a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
      a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
      a[3] * b[2] + a[4] * b[5] + a[5] * b[8],
      a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
      a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
      a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
    ]
    const rotX = (t: number): Mat3 => {
      const c = Math.cos(t)
      const s = Math.sin(t)
      return [1, 0, 0, 0, c, -s, 0, s, c]
    }
    const rotY = (t: number): Mat3 => {
      const c = Math.cos(t)
      const s = Math.sin(t)
      return [c, 0, s, 0, 1, 0, -s, 0, c]
    }

    let M: Mat3 = mul(rotX(-0.24), rotY(-0.5))
    let velX = 0 // 绕屏幕 X 轴角速度（上下）
    let velY = 0 // 绕屏幕 Y 轴角速度（左右）

    const drag = { active: false, x: 0, y: 0 }
    const projected: Proj[] = spherePoints.map(() => ({ x: 0, y: 0, z: 0, s: 1 }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = wrap.clientWidth
      h = wrap.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cx = w / 2
      cyc = h / 2
      R = Math.min(w, h) * (w < 520 ? 0.38 : 0.4)
    }

    const FOV = 3.1
    const project = (p: Vec3): Proj => {
      const x1 = M[0] * p.x + M[1] * p.y + M[2] * p.z
      const y1 = M[3] * p.x + M[4] * p.y + M[5] * p.z
      const z1 = M[6] * p.x + M[7] * p.y + M[8] * p.z
      const s = FOV / (FOV - z1)
      return { x: cx + x1 * R * s, y: cyc + y1 * R * s, z: z1, s }
    }

    // 逐段判断前后，背面的经纬线自然变淡，球才有厚度
    const ring = (points: Vec3[]) => {
      ctx.lineWidth = 1
      for (let i = 0; i < points.length; i++) {
        const a = project(points[i])
        const b = project(points[(i + 1) % points.length])
        const z = (a.z + b.z) / 2
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle =
          z >= 0 ? 'rgba(53, 226, 255, 0.16)' : 'rgba(53, 226, 255, 0.055)'
        ctx.stroke()
      }
    }

    const SEG = 72
    // 经线：过极点的 6 个大圆
    const meridians: Vec3[][] = Array.from({ length: 6 }, (_, k) => {
      const a = (k * Math.PI) / 6
      return Array.from({ length: SEG }, (_, i) => {
        const t = (i / SEG) * Math.PI * 2
        return { x: Math.cos(t) * Math.sin(a), y: Math.sin(t), z: Math.cos(t) * Math.cos(a) }
      })
    })
    // 纬线：y = 0 与 ±0.55
    const parallels: Vec3[][] = [0, 0.55, -0.55].map((c) => {
      const r = Math.sqrt(Math.max(0, 1 - c * c))
      return Array.from({ length: SEG }, (_, i) => {
        const t = (i / SEG) * Math.PI * 2
        return { x: Math.cos(t) * r, y: c, z: Math.sin(t) * r }
      })
    })

    const compact = () => w < 560

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // 外发光
      const glow = ctx.createRadialGradient(cx, cyc, R * 0.1, cx, cyc, R * 1.55)
      glow.addColorStop(0, 'rgba(53, 226, 255, 0.13)')
      glow.addColorStop(0.55, 'rgba(53, 226, 255, 0.035)')
      glow.addColorStop(1, 'rgba(53, 226, 255, 0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cyc, R * 1.55, 0, Math.PI * 2)
      ctx.fill()

      // 球体骨架
      ctx.beginPath()
      ctx.arc(cx, cyc, R, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(53, 226, 255, 0.22)'
      ctx.lineWidth = 1
      ctx.stroke()

      for (const m of meridians) ring(m)
      for (const p of parallels) ring(p)

      // 投影全部节点
      for (let i = 0; i < NODE_COUNT; i++) projected[i] = project(spherePoints[i])

      const dim = (z: number) => 0.18 + ((z + 1) / 2) ** 1.6 * 0.82

      // 背面连线
      const drawEdges = (front: boolean) => {
        for (const [a, b] of edges) {
          const pa = projected[a]
          const pb = projected[b]
          const z = (pa.z + pb.z) / 2
          if (front !== z >= 0) continue
          const on = hoverRef.current === a || hoverRef.current === b
          ctx.beginPath()
          ctx.moveTo(pa.x, pa.y)
          ctx.lineTo(pb.x, pb.y)
          ctx.strokeStyle = on
            ? `rgba(53, 226, 255, ${front ? 0.85 : 0.3})`
            : `rgba(130, 200, 226, ${((z + 1) / 2) * (front ? 0.3 : 0.12)})`
          ctx.lineWidth = on ? 1.5 : 1
          ctx.stroke()
        }
      }

      drawEdges(false)

      const order = Array.from({ length: NODE_COUNT }, (_, i) => i).sort(
        (a, b) => projected[a].z - projected[b].z,
      )

      const drawNodes = (front: boolean) => {
        for (const i of order) {
          const p = projected[i]
          if (front !== p.z >= 0) continue
          const node = knowledgeNodes[i]
          const color = groupMeta[node.group].color
          const on = hoverRef.current === i
          const r = (1.5 + (node.weight ?? 1) * 1.6) * p.s

          ctx.beginPath()
          ctx.arc(p.x, p.y, on ? r + 1.6 : r, 0, Math.PI * 2)
          ctx.fillStyle = on ? '#ffffff' : color
          ctx.globalAlpha = front ? dim(p.z) : dim(p.z) * 0.55
          ctx.fill()
          ctx.globalAlpha = 1

          if (on || (front && p.z > 0)) {
            ctx.beginPath()
            ctx.arc(p.x, p.y, r + 3.5, 0, Math.PI * 2)
            ctx.strokeStyle = color
            ctx.globalAlpha = on ? 0.55 : 0.14
            ctx.lineWidth = 1
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      drawNodes(false)
      drawEdges(true)
      drawNodes(true)

      // 标签：只标正面，且做一次贪心避让，宁可少标也不叠在一起
      const small = compact()
      ctx.textBaseline = 'middle'
      const placed: { x0: number; y0: number; x1: number; y1: number }[] = []
      const labels: {
        i: number
        x: number
        y: number
        text: string
        size: number
        align: 'left' | 'right'
        color: string
        alpha: number
        on: boolean
        box: { x0: number; y0: number; x1: number; y1: number }
      }[] = []

      for (let k = order.length - 1; k >= 0; k--) {
        const i = order[k]
        const p = projected[i]
        const node = knowledgeNodes[i]
        const on = hoverRef.current === i
        const weight = node.weight ?? 1
        if (!on) {
          if (p.z < -0.05) continue
          if (small && weight < 1.15) continue
        }

        const t = (p.z + 1) / 2
        const size = Math.round(11 + t * 1.5)
        const r = (1.5 + weight * 1.6) * p.s
        const right = p.x < cx
        ctx.font = `${size}px ui-monospace, "SF Mono", Consolas, monospace`
        const tw = ctx.measureText(node.label).width
        const lx = p.x + (right ? r + 7 : -(r + 7))
        const x0 = right ? lx : lx - tw
        const box = { x0: x0 - 5, y0: p.y - size * 1.05, x1: x0 + tw + 5, y1: p.y + size * 1.05 }

        if (!on) {
          const clash = placed.some(
            (q) => box.x0 < q.x1 && box.x1 > q.x0 && box.y0 < q.y1 && box.y1 > q.y0,
          )
          if (clash) continue
        }

        placed.push(box)
        labels.push({
          i,
          x: lx,
          y: p.y + 0.5,
          text: node.label,
          size,
          align: right ? 'left' : 'right',
          color: groupMeta[node.group].color,
          alpha: on ? 1 : 0.42 + t * 0.55,
          on,
          box,
        })
      }

      labels.sort((a, b) => Number(a.on) - Number(b.on))
      for (const l of labels) {
        if (l.on) {
          ctx.fillStyle = 'rgba(5, 8, 13, 0.9)'
          ctx.fillRect(l.box.x0, l.box.y0, l.box.x1 - l.box.x0, l.box.y1 - l.box.y0)
        }
        ctx.font = `${l.size}px ui-monospace, "SF Mono", Consolas, monospace`
        ctx.textAlign = l.align
        ctx.fillStyle = l.on ? '#ffffff' : l.color
        ctx.globalAlpha = l.alpha
        ctx.fillText(l.text, l.x, l.y)
        ctx.globalAlpha = 1
      }
    }

    const tick = (now: number) => {
      const dt = Math.min(now - last, 48)
      last = now

      if (!drag.active) {
        if (velX || velY) {
          M = mul(mul(rotX(velX), rotY(velY)), M)
          velX *= 0.9
          velY *= 0.9
          if (Math.abs(velX) < 2e-5) velX = 0
          if (Math.abs(velY) < 2e-5) velY = 0
        }
        // 自转始终绕屏幕竖直轴，视觉上就是地球仪在原地转
        if (!reduce) M = mul(rotY(dt * 0.00016), M)
      }

      draw()
      raf = requestAnimationFrame(tick)
    }

    const pick = (mx: number, my: number) => {
      let best = -1
      let bestD = 30
      for (let i = 0; i < NODE_COUNT; i++) {
        const p = projected[i]
        if (p.z < -0.15) continue
        const d = Math.hypot(p.x - mx, p.y - my)
        if (d < bestD) {
          bestD = d
          best = i
        }
      }
      return best
    }

    const localPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const onDown = (e: PointerEvent) => {
      drag.active = true
      drag.x = e.clientX
      drag.y = e.clientY
      velX = 0
      velY = 0
      canvas.setPointerCapture(e.pointerId)
    }

    const onMove = (e: PointerEvent) => {
      const { x, y } = localPos(e)
      if (drag.active) {
        const dx = e.clientX - drag.x
        const dy = e.clientY - drag.y
        drag.x = e.clientX
        drag.y = e.clientY
        // 向右拖 → 前表面跟着向右；向下拖 → 前表面跟着向下
        const K = 0.0075
        M = mul(mul(rotX(-dy * K), rotY(dx * K)), M)
        // 松手后的惯性，用最后一段位移估速度，掐掉过猛的甩动
        const cap = 0.06
        velX = Math.max(-cap, Math.min(cap, -dy * K * 0.2))
        velY = Math.max(-cap, Math.min(cap, dx * K * 0.2))
        return
      }
      const hit = pick(x, y)
      if (hit !== hoverRef.current) {
        hoverRef.current = hit
        setHovered(hit)
      }
    }

    const onUp = (e: PointerEvent) => {
      drag.active = false
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
    }

    const onLeave = () => {
      if (hoverRef.current !== -1) {
        hoverRef.current = -1
        setHovered(-1)
      }
    }

    resize()
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('pointerleave', onLeave)

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  const active = hovered >= 0 ? knowledgeNodes[hovered] : null
  const groups = Object.keys(groupMeta) as KnowledgeGroup[]

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px] lg:gap-8">
      <div className="hud-frame relative overflow-hidden border border-line bg-paper-deep">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 font-mono text-[11px] uppercase tracking-[0.16em]">
          <span className="text-accent/75">Knowledge Graph</span>
          <span className="text-muted">
            {NODE_COUNT} nodes · {edges.length} links
          </span>
        </div>

        <div ref={wrapRef} className="h-[360px] w-full sm:h-[440px] lg:h-[500px]">
          <canvas
            ref={canvasRef}
            className="block touch-pan-y"
            data-cursor="hot"
            data-drag=""
            role="img"
            aria-label={`知识链路球体：${NODE_COUNT} 个节点，${edges.length} 条连线，可拖动旋转`}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-4 py-3 font-mono text-[11px] tracking-[0.14em] text-muted">
          <span>拖动旋转 · 悬停查看关联</span>
          <span className="hidden sm:block">Drag / Hover</span>
        </div>
      </div>

      {/* 侧栏：图例 + 悬停读数 */}
      <div className="flex flex-col gap-5 lg:h-full lg:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Legend</p>
          <ul className="mt-3 space-y-2">
            {groups.map((g) => (
              <li key={g} className="flex items-center gap-2.5 text-[12.5px] text-ink-soft">
                <span
                  className="h-[7px] w-[7px] shrink-0 rounded-full"
                  style={{ background: groupMeta[g].color }}
                />
                {groupMeta[g].name}
                <span className="ml-auto font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  {groupMeta[g].en}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-h-[104px] border-t border-line pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            {active ? 'Selected' : 'Hover a node'}
          </p>
          {active ? (
            <>
              <p
                className="mt-2 font-display text-[17px]"
                style={{ color: groupMeta[active.group].color }}
              >
                {active.label}
              </p>
              <p className="mt-2 text-[12.5px] leading-[1.7] text-muted">
                关联 {related.length} 项：{related.join('、')}
              </p>
            </>
          ) : (
            <p className="mt-2 text-[12.5px] leading-[1.7] text-muted">
              球面上的点是我现在掌握的知识块，连线表示它们在实际项目里怎么互相支撑。
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

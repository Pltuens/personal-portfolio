/**
 * 原创封面图形（纯 SVG，无外部素材）
 * 三套构图对应三种玩法类型：分镜格 / 三只杯 / 分层结构。
 */

import type { ArtKey } from '../data/projects'

const C = {
  paper: '#f3f0e8',
  deep: '#e8e2d4',
  surface: '#fbfaf5',
  ink: '#17150f',
  line: '#d8d1bf',
  accent: '#a8432a',
  jade: '#2d4a44',
  muted: '#6d6858',
}

export function ProjectArt({
  art,
  className = '',
}: {
  art: ArtKey
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 1200 760"
      className={className}
      role="img"
      aria-label={LABEL[art]}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="1200" height="760" fill={C.deep} />
      <Grid />
      {art === 'grid' && <GridScene />}
      {art === 'vessel' && <VesselScene />}
      {art === 'layer' && <LayerScene />}
    </svg>
  )
}

const LABEL: Record<ArtKey, string> = {
  grid: '分镜格与事件传播示意',
  vessel: '三只杯的水位与刻度示意',
  layer: '分层结构的堆叠示意',
}

function Grid() {
  return (
    <g stroke={C.line} strokeWidth="0.7" opacity="0.55">
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={`v${i}`} x1={60 + i * 108} y1="0" x2={60 + i * 108} y2="760" />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={70 + i * 108} x2="1200" y2={70 + i * 108} />
      ))}
    </g>
  )
}

function GridScene() {
  const frames = [130, 470, 810]
  return (
    <g>
      <rect x="90" y="120" width="1020" height="520" fill={C.surface} stroke={C.ink} strokeWidth="1.6" />
      {frames.map((x, i) => (
        <g key={x}>
          <rect x={x} y="180" width="260" height="330" fill="none" stroke={C.ink} strokeWidth="1.2" />
          <text
            x={x + 14}
            y="212"
            fontFamily="Georgia, serif"
            fontSize="17"
            letterSpacing="2"
            fill={C.muted}
          >
            {String(i + 1).padStart(2, '0')}
          </text>
        </g>
      ))}

      {/* 格 1：两个人 */}
      <g stroke={C.ink} strokeWidth="1.6" fill="none">
        <circle cx="215" cy="330" r="20" />
        <path d="M215 352v58m0-34-26 16m26-16 24 14" />
        <circle cx="315" cy="336" r="20" />
        <path d="M315 358v52m0-30-22 14m22-14 20 12" />
      </g>
      <line x1="240" y1="392" x2="290" y2="392" stroke={C.jade} strokeWidth="2" />
      <text x="260" y="424" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="13" fill={C.jade}>
        关系 +1
      </text>

      {/* 格 2：单人 + 道具 */}
      <g stroke={C.ink} strokeWidth="1.6" fill="none">
        <circle cx="600" cy="334" r="20" />
        <path d="M600 356v54m0-32-24 12m24-12 22 10" />
        <path d="M566 430h68l-8 26h-52z" fill={C.accent} stroke={C.accent} />
      </g>

      {/* 格 3：两人对峙 */}
      <g stroke={C.ink} strokeWidth="1.6" fill="none">
        <circle cx="905" cy="330" r="20" />
        <path d="M905 352v60m0-36 26-16" />
        <circle cx="985" cy="336" r="20" />
        <path d="M985 358v54m0-30-22 12" />
      </g>
      <path d="M950 318h14" stroke={C.accent} strokeWidth="2.4" />

      {/* 传播箭头 */}
      {[
        [392, 345, 466, 345],
        [732, 345, 806, 345],
      ].map(([x1, y1, x2, y2]) => (
        <g key={x1}>
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={C.accent}
            strokeWidth="1.4"
            strokeDasharray="7 6"
          />
          <path d={`M${x2} ${y2}l-9,-5v10z`} fill={C.accent} />
        </g>
      ))}

      {/* 终态判定 */}
      <line x1="130" y1="556" x2="1070" y2="556" stroke={C.line} strokeWidth="1" />
      <text x="130" y="594" fontFamily="ui-monospace, monospace" fontSize="13" letterSpacing="3" fill={C.muted}>
        GOAL · 终态匹配
      </text>
      <g transform="translate(880,570)">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 62},0)`}>
            <circle cx="14" cy="14" r="11" fill="none" stroke={C.ink} strokeWidth="1.3" />
            <path d="M9 14l4 4 7-8" stroke={C.ink} strokeWidth="1.6" fill="none" />
          </g>
        ))}
      </g>
    </g>
  )
}

function VesselScene() {
  const cups = [
    { x: 300, cap: 240, level: 0.72, tick: false },
    { x: 600, cap: 300, level: 0.44, tick: true },
    { x: 900, cap: 200, level: 0.86, tick: false },
  ]
  return (
    <g>
      {/* 镜面弧 */}
      <path
        d="M140 620C240 330 420 250 600 250s360 80 460 370"
        fill="none"
        stroke={C.ink}
        strokeWidth="1.2"
        strokeDasharray="10 9"
        opacity="0.55"
      />
      <text x="150" y="668" fontFamily="ui-monospace, monospace" fontSize="12" letterSpacing="3" fill={C.muted}>
        MIRROR · 镜面伪装
      </text>

      {cups.map((c) => {
        const top = 620 - c.cap
        const waterTop = 620 - c.cap * c.level
        return (
          <g key={c.x}>
            {/* 杯体 */}
            <path
              d={`M${c.x - 66} ${top} L${c.x - 52} 620 H${c.x + 52} L${c.x + 66} ${top} Z`}
              fill={C.surface}
              stroke={C.ink}
              strokeWidth="1.7"
            />
            {/* 水 */}
            <path
              d={`M${c.x - 63.2} ${waterTop} L${c.x - 52} 620 H${c.x + 52} L${c.x + 63.2} ${waterTop} Z`}
              fill={C.jade}
              opacity="0.18"
            />
            <line
              x1={c.x - 63.2}
              y1={waterTop}
              x2={c.x + 63.2}
              y2={waterTop}
              stroke={C.jade}
              strokeWidth="2"
            />
            {/* 杯脚 */}
            <path
              d={`M${c.x} 620v34`}
              stroke={C.ink}
              strokeWidth="1.7"
              fill="none"
            />
            <path d={`M${c.x - 46} 656h92`} stroke={C.ink} strokeWidth="1.7" />
            {/* 刻度 */}
            {c.tick &&
              Array.from({ length: 9 }).map((_, i) => {
                const y = 620 - ((i + 1) * c.cap) / 10
                const w = (i + 1) % 5 === 0 ? 22 : 12
                return (
                  <g key={i}>
                    <line
                      x1={c.x + 64 - 6}
                      y1={y}
                      x2={c.x + 64 - 6 - w}
                      y2={y}
                      stroke={C.ink}
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  </g>
                )
              })}
            {c.tick && (
              <text
                x={c.x + 78}
                y={waterTop + 5}
                fontFamily="ui-monospace, monospace"
                fontSize="14"
                fill={C.accent}
              >
                T
              </text>
            )}
          </g>
        )
      })}

      <line x1="120" y1="700" x2="1080" y2="700" stroke={C.line} strokeWidth="1" />
      <text x="120" y="726" fontFamily="ui-monospace, monospace" fontSize="12" letterSpacing="3" fill={C.muted}>
        左 · 满 ／ 中 · 空 ／ 右 · 满
      </text>
    </g>
  )
}

function LayerScene() {
  const slabs = [
    { y: 470, w: 420, label: '01' },
    { y: 400, w: 360, label: '02' },
    { y: 330, w: 300, label: '03' },
    { y: 260, w: 240, label: '04' },
  ]
  return (
    <g>
      <ellipse cx="600" cy="612" rx="300" ry="46" fill="none" stroke={C.line} strokeDasharray="8 8" />
      {slabs.map((s, i) => {
        const x = 600
        const h = 22
        const dx = s.w / 2
        return (
          <g key={s.label} opacity={0.95 - i * 0.05}>
            <path
              d={`M${x - dx} ${s.y} L${x} ${s.y - 34} L${x + dx} ${s.y} L${x} ${s.y + 34} Z`}
              fill={i % 2 === 0 ? C.surface : C.paper}
              stroke={C.ink}
              strokeWidth="1.6"
            />
            <path
              d={`M${x - dx} ${s.y}v${h} L${x} ${s.y + 34 + h} V${s.y + 34} Z`}
              fill={C.deep}
              stroke={C.ink}
              strokeWidth="1.4"
            />
            <path
              d={`M${x + dx} ${s.y}v${h} L${x} ${s.y + 34 + h}`}
              fill="none"
              stroke={C.ink}
              strokeWidth="1.4"
            />
            <text
              x={x}
              y={s.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Georgia, serif"
              fontSize="18"
              letterSpacing="3"
              fill={C.muted}
            >
              {s.label}
            </text>
          </g>
        )
      })}
      {/* 输送线 */}
      <path
        d="M180 596h220c40 0 40-60 80-60"
        stroke={C.accent}
        strokeWidth="1.4"
        fill="none"
        strokeDasharray="7 6"
      />
      <text x="132" y="640" fontFamily="ui-monospace, monospace" fontSize="12" letterSpacing="3" fill={C.muted}>
        逐层确认
      </text>
      <g transform="translate(840,300)" stroke={C.ink} strokeWidth="1.4" fill="none">
        <rect x="0" y="0" width="180" height="120" />
        <line x1="0" y1="30" x2="180" y2="30" />
        {[0, 1, 2].map((i) => (
          <line key={i} x1="16" y1={56 + i * 22} x2={i === 2 ? 110 : 150} y2={56 + i * 22} />
        ))}
        <circle cx="158" cy="16" r="5" fill={C.accent} stroke="none" />
      </g>
    </g>
  )
}

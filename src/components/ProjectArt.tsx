/**
 * 原创封面图形（纯 SVG，无外部素材）
 * systemmap — 系统结构拆解
 * gas       — 战斗状态机
 * souls     — 魂系推拉循环
 */

import type { ArtKey } from '../data/projects'

const C = {
  paper: '#0a1119',
  deep: '#080d14',
  surface: '#0c141d',
  ink: '#dbe8f4',
  line: '#1e2c3a',
  accent: '#35e2ff',
  jade: '#a78bfa',
  muted: '#74818f',
}

const LABEL: Record<ArtKey, string> = {
  systemmap: '系统结构拆解示意',
  gas: '战斗状态机示意',
  souls: '魂系战斗推拉循环示意',
}

export function ProjectArt({
  art,
  className = '',
  fit = 'slice',
}: {
  art: ArtKey
  className?: string
  /** slice = 裁切铺满（缩略图）；meet = 完整显示（大图与正文图示） */
  fit?: 'slice' | 'meet'
}) {
  return (
    <svg
      viewBox="0 0 1200 760"
      className={className}
      role="img"
      aria-label={LABEL[art]}
      preserveAspectRatio={fit === 'meet' ? 'xMidYMid meet' : 'xMidYMid slice'}
    >
      <rect width="1200" height="760" fill={C.deep} />
      <Grid />
      {art === 'systemmap' && <SystemMap />}
      {art === 'gas' && <GasStates />}
      {art === 'souls' && <SoulsLoop />}
    </svg>
  )
}

function Grid() {
  return (
    <g stroke={C.line} strokeWidth="0.7" opacity="0.5">
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={`v${i}`} x1={60 + i * 108} y1="0" x2={60 + i * 108} y2="760" />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={70 + i * 108} x2="1200" y2={70 + i * 108} />
      ))}
    </g>
  )
}

/* ------------------------------------------------------------ 系统结构拆解 */

function SystemMap() {
  const nodes = [
    { x: 300, y: 226, title: 'ACQUIRE', cn: '获取链路', rows: 3 },
    { x: 300, y: 462, title: 'GROWTH', cn: '养成消耗', rows: 4 },
    { x: 800, y: 226, title: 'STATS', cn: '词条数值', rows: 3 },
    { x: 800, y: 462, title: 'BUILD', cn: '战斗构筑', rows: 4 },
  ]
  return (
    <g>
      <g>
        <rect x="510" y="320" width="180" height="120" fill="#0a1a24" stroke={C.accent} strokeWidth="1.4" />
        <text x="600" y="368" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="24" letterSpacing="2" fill={C.accent}>
          ECHO
        </text>
        <text x="600" y="392" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="13" letterSpacing="3" fill={C.muted}>
          CORE SYSTEM
        </text>
        <line x1="546" y1="410" x2="654" y2="410" stroke={C.accent} strokeWidth="2" />
      </g>

      {nodes.map((n) => (
        <g key={n.title}>
          <rect x={n.x} y={n.y} width="240" height="120" fill={C.surface} stroke={C.ink} strokeWidth="1.4" />
          <text x={n.x + 16} y={n.y + 26} fontFamily="ui-monospace, monospace" fontSize="14" letterSpacing="2.5" fill={C.muted}>
            {n.title}
          </text>
          <text x={n.x + 16} y={n.y + 54} fontFamily="Georgia, serif" fontSize="24" fill={C.ink}>
            {n.cn}
          </text>
          {Array.from({ length: n.rows }).map((_, i) => (
            <line
              key={i}
              x1={n.x + 16}
              y1={n.y + 76 + i * 12}
              x2={n.x + 16 + (i % 2 === 0 ? 150 : 108)}
              y2={n.y + 76 + i * 12}
              stroke={C.line}
              strokeWidth="3"
            />
          ))}
        </g>
      ))}

      <g stroke={C.accent} strokeWidth="1.2" fill="none" strokeDasharray="6 5">
        <path d="M510 360h-30v-74h60" />
        <path d="M690 360h30v-74h-60" />
        <path d="M510 400h-30v74h60" />
        <path d="M690 400h30v74h-60" />
      </g>

      <text x="120" y="650" fontFamily="ui-monospace, monospace" fontSize="15" letterSpacing="3" fill={C.muted}>
        DECOMPOSE · 拆解维度
      </text>
    </g>
  )
}

/* -------------------------------------------------------------- 状态机 */

function GasStates() {
  const states = [
    { x: 120, label: 'IDLE', cn: '待机' },
    { x: 390, label: 'MOVE', cn: '移动' },
    { x: 660, label: 'CAST', cn: '施法' },
    { x: 930, label: 'HIT', cn: '受击' },
  ]
  return (
    <g>
      <g transform="translate(120,110)">
        <text fontFamily="ui-monospace, monospace" fontSize="14" letterSpacing="2.5" fill={C.muted}>
          ATTRIBUTE SET
        </text>
        {['HEALTH', 'STAMINA', 'POISE'].map((a, i) => (
          <g key={a} transform={`translate(0,${30 + i * 32})`}>
            <text fontFamily="ui-monospace, monospace" fontSize="14" fill={C.muted}>
              {a}
            </text>
            <rect x="96" y="-9" width="200" height="8" fill={C.surface} stroke={C.ink} strokeWidth="1" />
            <rect x="96" y="-9" width={[176, 132, 82][i]} height="8" fill={i === 2 ? C.accent : C.jade} opacity="0.55" />
          </g>
        ))}
      </g>

      <g transform="translate(120,286)">
        <text fontFamily="ui-monospace, monospace" fontSize="14" letterSpacing="2.5" fill={C.muted}>
          EFFECT STACK
        </text>
        {Array.from({ length: 5 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 44},22)`}>
            <rect width="32" height="32" fill={C.surface} stroke={C.ink} strokeWidth="1.2" />
            <line x1="8" y1="16" x2="24" y2="16" stroke={i < 3 ? C.jade : C.accent} strokeWidth="2" />
            <line x1="16" y1="8" x2="16" y2="24" stroke={i < 3 ? C.jade : C.accent} strokeWidth="2" opacity={i >= 3 ? 1 : 0} />
          </g>
        ))}
      </g>

      {states.map((s) => (
        <g key={s.label}>
          <rect x={s.x} y="466" width="180" height="94" fill={C.surface} stroke={C.ink} strokeWidth="1.5" />
          <text x={s.x + 90} y="508" textAnchor="middle" fontFamily="Georgia, serif" fontSize="26" letterSpacing="1" fill={C.ink}>
            {s.label}
          </text>
          <text x={s.x + 90} y="534" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="15" fill={C.muted}>
            {s.cn}
          </text>
        </g>
      ))}

      {[300, 570, 840].map((x) => (
        <g key={x}>
          <line x1={x} y1="513" x2={x + 88} y2="513" stroke={C.ink} strokeWidth="1.3" />
          <path d={`M${x + 88} 513l-9,-4v8z`} fill={C.ink} />
        </g>
      ))}

      <path d="M1020 466V424H300v42" fill="none" stroke={C.accent} strokeWidth="1.3" strokeDasharray="7 5" />
      <path d="M300 466l-4,-9h8z" fill={C.accent} />
      <text x="620" y="418" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="14" letterSpacing="2.5" fill={C.accent}>
        INTERRUPT · 状态打断
      </text>

      <text x="120" y="650" fontFamily="ui-monospace, monospace" fontSize="15" letterSpacing="3" fill={C.muted}>
        STATE MACHINE · 状态优先级
      </text>
    </g>
  )
}

/* ------------------------------------------------------------ 耐力循环 */

function SoulsLoop() {
  return (
    <g>
      <g transform="translate(600,356)">
        <g stroke={C.ink} strokeWidth="2" fill="none">
          <path d="M0 -196 L14 -152 L8 0 L-8 0 L-14 -152 Z" />
          <line x1="-54" y1="16" x2="54" y2="16" strokeWidth="6" />
          <line x1="0" y1="16" x2="0" y2="88" strokeWidth="7" />
          <circle cx="0" cy="98" r="9" fill={C.accent} stroke={C.accent} />
        </g>
        <text y="142" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="14" letterSpacing="3" fill={C.muted}>
          STAMINA LOOP
        </text>
      </g>

      <path d="M600 140a216 216 0 0 1 187 108" fill="none" stroke={C.accent} strokeWidth="1.4" strokeDasharray="8 6" />
      <path d="M787 248l3,-13 10,9z" fill={C.accent} />
      <text x="700" y="122" fontFamily="ui-monospace, monospace" fontSize="15" letterSpacing="2.5" fill={C.ink}>
        ATTACK
      </text>

      <path d="M787 464a216 216 0 0 1-187 108" fill="none" stroke={C.accent} strokeWidth="1.4" strokeDasharray="8 6" />
      <path d="M600 572l13,-4-6,10z" fill={C.accent} />
      <text x="712" y="602" fontFamily="ui-monospace, monospace" fontSize="15" letterSpacing="2.5" fill={C.ink}>
        REPRISE
      </text>

      <path d="M413 464a216 216 0 0 1 0-216" fill="none" stroke={C.line} strokeWidth="1.2" strokeDasharray="5 7" />

      <g transform="translate(120,300)">
        <text fontFamily="ui-monospace, monospace" fontSize="14" letterSpacing="2.5" fill={C.muted}>
          STAMINA
        </text>
        <rect x="0" y="18" width="120" height="14" fill={C.surface} stroke={C.ink} strokeWidth="1.2" />
        <rect x="0" y="18" width="78" height="14" fill={C.jade} opacity="0.35" />
        <rect x="0" y="18" width="30" height="14" fill={C.accent} opacity="0.75" />
        <text y="54" fontFamily="ui-monospace, monospace" fontSize="14" fill={C.muted}>
          COST · 刚性卡点
        </text>
        <rect x="0" y="72" width="120" height="14" fill="none" stroke={C.line} strokeDasharray="4 4" />
        <text y="108" fontFamily="ui-monospace, monospace" fontSize="14" fill={C.muted}>
          REGEN · 自动回复
        </text>
      </g>

      <g transform="translate(880,250)" stroke={C.ink} strokeWidth="1.3" fill="none">
        <rect x="0" y="0" width="180" height="34" fill={C.surface} />
        <text x="90" y="22" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="14" letterSpacing="1.5" fill={C.ink}>
          PERCEPTION
        </text>
        <line x1="90" y1="34" x2="90" y2="56" />
        {['PATROL', 'CHASE', 'ATTACK', 'LOSE'].map((t, i) => (
          <g key={t}>
            <line x1="90" y1="56" x2={22 + i * 46} y2="76" />
            <rect x={i * 45} y={76} width="40" height="24" fill={C.paper} />
            <text x={i * 45 + 20} y="92" textAnchor="middle" fontFamily="ui-monospace, monospace" fontSize="10" fill={C.muted}>
              {t}
            </text>
          </g>
        ))}
      </g>

      <text x="120" y="650" fontFamily="ui-monospace, monospace" fontSize="15" letterSpacing="3" fill={C.muted}>
        PUSH &amp; PULL · 攻防节奏
      </text>
    </g>
  )
}

/**
 * 详情页头部大图：桌面端定高裁切（内容刚好填满），
 * 手机端改用完整显示，避免两侧被切掉。
 */
export function HeroArt({ art }: { art: ArtKey }) {
  return (
    <>
      <ProjectArt art={art} fit="meet" className="h-auto w-full md:hidden" />
      <ProjectArt
        art={art}
        fit="slice"
        className="hidden h-[clamp(320px,44vw,560px)] w-full md:block"
      />
    </>
  )
}

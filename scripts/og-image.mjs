/**
 * 生成分享卡片（OG image）
 * ------------------------------------------------------------------
 * 1200×630，与站内欢迎页同一套视觉语言：长曝光星轨 + 底部极光 + 深青底。
 * 输出到 public/og/ 下，构建时随 dist 一起发布。
 *
 *   node _og.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync, readFileSync } from 'node:fs'

const W = 1200
const H = 630

const b64 = (p) => readFileSync(p).toString('base64')
const FONT_DISPLAY = b64('public/fonts/chakrapetch-700.woff2')
const FONT_DISPLAY_MD = b64('public/fonts/chakrapetch-600.woff2')
const FONT_MONO = b64('public/fonts/jetbrainsmono-400.woff2')

/* 固定种子的伪随机，保证每次生成的星轨完全一致 */
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** 同心星轨：绕画面下方的天极旋转，弧线向上拱起 */
function starTrails(seed = 7) {
  const rand = rng(seed)
  const cx = 600
  const cy = 1120
  const out = []
  for (let i = 0; i < 96; i++) {
    const r = 190 + Math.pow(rand(), 1.35) * 1080
    // 越靠外的弧越长、越亮
    const edge = 0.35 + (r / 1270) * 0.85
    const span = (14 + rand() * 52) * edge
    // 天极在画面下方，取负 90° 附近的角度让弧线落在视口内
    const a0 = -180 + rand() * 180
    const a1 = a0 + span
    const w = 0.55 + rand() * 1.25
    const op = Math.min(0.9, (0.16 + rand() * 0.5) * edge * 1.5)
    const tint = rand() > 0.72 ? '196,246,255' : '150,232,255'
    const rad = (d) => (d * Math.PI) / 180
    const x0 = cx + r * Math.cos(rad(a0))
    const y0 = cy + r * Math.sin(rad(a0))
    const x1 = cx + r * Math.cos(rad(a1))
    const y1 = cy + r * Math.sin(rad(a1))
    const large = span > 180 ? 1 : 0
    out.push(
      `<path d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}" stroke="rgba(${tint},${op.toFixed(3)})" stroke-width="${w.toFixed(2)}" stroke-linecap="round" fill="none"/>`,
    )
  }
  return out.join('')
}

/** 细尘：静态星点 */
function dust(seed = 21) {
  const rand = rng(seed)
  let s = ''
  for (let i = 0; i < 150; i++) {
    const x = rand() * W
    const y = rand() * H * 0.92
    const r = rand() * 1.15 + 0.25
    const o = 0.15 + rand() * 0.6
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="rgba(214,245,255,${o.toFixed(2)})"/>`
  }
  return s
}

function card({ eyebrow, title, sub, meta, chips, watermark }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
@font-face{font-family:'CP';src:url(data:font/woff2;base64,${FONT_DISPLAY}) format('woff2');font-weight:700}
@font-face{font-family:'CP';src:url(data:font/woff2;base64,${FONT_DISPLAY_MD}) format('woff2');font-weight:600}
@font-face{font-family:'JB';src:url(data:font/woff2;base64,${FONT_MONO}) format('woff2');font-weight:400}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;position:relative;
  background:radial-gradient(125% 105% at 50% -12%, #12414f 0%, #0a2a36 32%, #061a24 62%, #040e15 100%);
  font-family:'Microsoft YaHei','PingFang SC',sans-serif;color:#eef8ff}
.aurora{position:absolute;left:-16%;right:-16%;bottom:0;height:76%;
  background:
    radial-gradient(46% 62% at 16% 100%, rgba(52,226,182,.6), transparent 64%),
    radial-gradient(54% 72% at 50% 100%, rgba(86,240,194,.7), transparent 62%),
    radial-gradient(44% 58% at 84% 99%, rgba(104,214,255,.52), transparent 64%),
    radial-gradient(30% 42% at 36% 92%, rgba(206,255,240,.3), transparent 68%);
  filter:blur(42px) saturate(150%)}
.aurora2{position:absolute;left:-20%;right:-20%;top:-22%;height:66%;
  background:radial-gradient(46% 56% at 66% 36%, rgba(53,226,255,.16), transparent 70%),
             radial-gradient(38% 46% at 26% 52%, rgba(120,200,255,.12), transparent 72%);
  filter:blur(60px)}
svg.trails{position:absolute;inset:0;width:${W}px;height:${H}px}
.vignette{position:absolute;inset:0;
  background:radial-gradient(78% 72% at 50% 46%, rgba(3,12,18,.55), rgba(3,12,18,.18) 60%, transparent 82%)}
.grid{position:absolute;inset:0;opacity:.05;
  background-image:linear-gradient(rgba(120,220,255,.5) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(120,220,255,.5) 1px,transparent 1px);
  background-size:60px 60px}

.wrap{position:absolute;inset:0;padding:62px 76px 56px;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;align-items:center;justify-content:space-between;font-family:'JB';font-size:13px;letter-spacing:.3em;text-transform:uppercase;color:rgba(150,224,246,.72)}
.top .r{letter-spacing:.18em}
.dot{display:inline-block;width:6px;height:6px;border-radius:1px;background:#35e2ff;box-shadow:0 0 10px #35e2ff;margin-right:12px;vertical-align:middle}

.mid{}
.eyebrow{display:flex;align-items:center;gap:14px;margin-bottom:24px}
.eyebrow b{font-family:'CP';font-weight:600;font-size:13px;letter-spacing:.34em;color:rgba(53,226,255,.9);text-transform:uppercase}
.eyebrow i{display:block;width:52px;height:1px;background:linear-gradient(90deg,rgba(53,226,255,.75),transparent)}
h1{font-size:${title.length > 12 ? 62 : 74}px;line-height:1.16;font-weight:700;letter-spacing:-.018em;
   color:#f4fbff;text-shadow:0 0 70px rgba(53,226,255,.35);max-width:940px}
.sub{margin-top:24px;font-size:19px;letter-spacing:.04em;color:#a8c6d6;max-width:820px;line-height:1.6}
.meta{margin-top:14px;font-family:'JB';font-size:13px;letter-spacing:.16em;color:rgba(140,180,200,.85);text-transform:uppercase}

.bot{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
.chips{display:flex;gap:10px;flex-wrap:wrap}
.chip{font-family:'JB';font-size:13px;letter-spacing:.08em;color:rgba(190,232,246,.9);
  border:1px solid rgba(53,226,255,.24);background:rgba(53,226,255,.06);padding:7px 13px}
.name{display:flex;align-items:baseline;gap:14px}
.name b{font-family:'CP';font-weight:700;font-size:34px;letter-spacing:.04em;color:#fff}
.name span{font-size:15px;color:#9fc2d3;letter-spacing:.1em}

.corner{position:absolute;width:18px;height:18px;border-color:rgba(53,226,255,.5)}
.c1{top:26px;left:26px;border-top:1px solid;border-left:1px solid}
.c2{top:26px;right:26px;border-top:1px solid;border-right:1px solid}
.c3{bottom:26px;left:26px;border-bottom:1px solid;border-left:1px solid}
.c4{bottom:26px;right:26px;border-bottom:1px solid;border-right:1px solid}
.watermark{position:absolute;right:86px;bottom:104px;font-family:'CP';font-weight:700;font-size:190px;
  line-height:1;color:transparent;-webkit-text-stroke:1.5px rgba(53,226,255,.2)}

/* 亮星：十字星芒 + 软光晕，给右侧负空间一个视觉落点 */
.star{position:absolute;left:986px;top:206px;width:0;height:0}
.star::before{content:'';position:absolute;left:-82px;top:-82px;width:164px;height:164px;border-radius:50%;
  background:radial-gradient(circle, rgba(214,250,255,.85) 0%, rgba(140,232,255,.28) 22%, rgba(90,200,255,.06) 46%, transparent 68%)}
.star i{position:absolute;background:linear-gradient(90deg,transparent,rgba(255,255,255,.95),transparent)}
.star i.h{left:-104px;top:-0.5px;width:208px;height:1px}
.star i.v{left:-0.5px;top:-104px;height:208px;width:1px;
  background:linear-gradient(180deg,transparent,rgba(255,255,255,.95),transparent)}
.star b{position:absolute;left:-2.5px;top:-2.5px;width:5px;height:5px;border-radius:50%;background:#fff;
  box-shadow:0 0 16px 4px rgba(180,240,255,.85)}
</style></head>
<body>
  <div class="grid"></div>
  <div class="aurora2"></div>
  <div class="aurora"></div>
  <svg class="trails" viewBox="0 0 ${W} ${H}">${starTrails()}</svg>
  <svg class="trails" viewBox="0 0 ${W} ${H}">${dust()}</svg>
  <div class="vignette"></div>
  <div class="star"><i class="h"></i><i class="v"></i><b></b></div>
  ${watermark ? `<div class="watermark">${watermark}</div>` : ''}

  <span class="corner c1"></span><span class="corner c2"></span>
  <span class="corner c3"></span><span class="corner c4"></span>

  <div class="wrap">
    <div class="top">
      <span><i class="dot"></i>${eyebrow}</span>
      <span class="r">pluents.pages.dev</span>
    </div>

    <div class="mid">
      <div class="eyebrow"><b>Pluents</b><i></i></div>
      <h1>${title}</h1>
      <p class="sub">${sub}</p>
      <p class="meta">${meta}</p>
    </div>

    <div class="bot">
      <div class="chips">${chips.map((c) => `<span class="chip">${c}</span>`).join('')}</div>
      <div class="name"><b>PLUENTS</b><span>潘旺坤</span></div>
    </div>
  </div>
</body></html>`
}

const CARDS = [
  {
    file: 'public/og/default.jpg',
    label: '首页',
    eyebrow: 'Portfolio System / 2026',
    title: '把战斗拆开看，<br/>再动手做出来。',
    sub: '玩法 / 系统 / 战斗策划 · 湖北师范大学 软件工程 2028 届',
    meta: 'System Teardown · Combat Prototype · Level Loop',
    chips: ['《鸣潮》声骸系统拆解', 'Aura · GAS', 'Slash · 类魂原型'],
  },
  {
    file: 'public/og/wuwa-echo-teardown.jpg',
    label: '项目 01',
    eyebrow: 'Case 01 / System Teardown',
    title: '《鸣潮》<br/>声骸系统拆解',
    sub: '把一套养成系统拆成可复用的分析框架：获取、养成、词条数值到战斗构筑。',
    meta: '2026.04 · 拆解分析案',
    chips: ['养成链路', '词条数值', '战斗构筑'],
    watermark: '01',
  },
  {
    file: 'public/og/aura-gas-arpg.jpg',
    label: '项目 02',
    eyebrow: 'Case 02 / Combat System',
    title: 'Aura<br/>GAS 战斗原型',
    sub: '基于 UE5 与 GAS 的硬核 ARPG 原型：属性、技能状态、Buff 与受击状态机。',
    meta: '2025.06 — 2026.05 · UE5 原型',
    chips: ['GAS', '状态机', 'MotionWarping'],
    watermark: '02',
  },
  {
    file: 'public/og/slash-soulslike.jpg',
    label: '项目 03',
    eyebrow: 'Case 03 / Level Loop',
    title: 'Slash<br/>开放世界类魂原型',
    sub: '用耐力卡点强制攻防博弈，用行为树与物理破坏把探索反馈打通。',
    meta: '2024 — 2025 · UE5.6 原型',
    chips: ['弹反节奏', '耐力系统', '行为树'],
    watermark: '03',
  },
]

mkdirSync('public/og', { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', args: ['--no-proxy-server'] })
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 })

for (const c of CARDS) {
  const html = card(c)
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(260)
  await page.screenshot({ path: c.file, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: W, height: H } })
  console.log('✓', c.label, '→', c.file)
}

await browser.close()

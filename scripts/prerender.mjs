/**
 * 构建期预渲染（只处理 <head>）
 * ------------------------------------------------------------------
 * 为什么需要它：React 在运行时改 `document.title` 和 og:* 对社交爬虫无效，
 * 因为微信 / 飞书 / X 的抓取器都不执行 JS，只看服务器返回的 HTML。
 * 所以构建完成后，为每条路由生成一份带着正确 <head> 的静态 HTML。
 *
 * 只替换 head，不预渲染 body —— 页面仍然由 React 正常接管，
 * 因此不会出现水合不一致，单页体量也不受影响。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { projects } from '../src/data/projects.ts'

const SITE = 'https://pluents.pages.dev'
const DIST = 'dist'

const esc = (s = '') =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** 每条路由的标题 / 描述 / 卡片图，与各页面 useMeta 的入参保持一致 */
const ROUTES = [
  {
    path: '/',
    title: 'Pluents — 玩法 / 系统 / 战斗策划',
    description:
      '湖北师范大学软件工程 2028 届，现于深圳腾娱互动武汉分公司任策划培训生。玩法 / 系统 / 战斗策划作品集：《鸣潮》声骸系统拆解、基于 GAS 的 ARPG 原型 Aura、开放世界类魂原型 Slash。',
    image: '/og/default.jpg',
    imageAlt: '深空星轨背景上的作品集封面：把战斗拆开看，再动手做出来。',
  },
  {
    path: '/works',
    title: '作品 — Pluents',
    description:
      '三个项目：鸣潮声骸系统拆解、基于 GAS 的 ARPG 原型 Aura、开放世界类魂原型 Slash。',
    image: '/og/default.jpg',
    imageAlt: '作品列表封面',
  },
  ...projects.map((p) => ({
    path: `/works/${p.slug}`,
    title: `${p.title} — Pan Wangkun`,
    description: p.summary,
    image: `/og/${p.slug}.jpg`,
    imageAlt: `${p.title}：${p.subtitle}`,
  })),
  {
    path: '/about',
    title: '关于 — Pan Wangkun',
    description: '玩法与系统策划：工作方法、能力范围与个人支点。',
    image: '/og/default.jpg',
    imageAlt: '关于页封面',
  },
  {
    path: '/contact',
    title: '联系 — Pan Wangkun',
    description: '作品集联系方式：邮箱、GitHub 与可提供的补充材料。',
    image: '/og/default.jpg',
    imageAlt: '联系页封面',
  },
]

/**
 * 只替换已有标签的内容，**不要重建整段 head**。
 * Vite 会把入口 <script type="module"> 和样式 <link> 注入到 <head> 里，
 * 整段替换会连它们一起删掉，页面直接白屏 —— 踩过一次，这里加了断言兜底。
 */
function applyMeta(source, route, url) {
  let html = source
  const t = esc(route.title)
  const d = esc(route.description)
  const img = SITE + route.image

  const setMeta = (attr, key, value) => {
    const re = new RegExp(`(<meta\\s+${attr}="${key}"\\s+content=")[\\s\\S]*?(")`)
    if (!re.test(html)) throw new Error(`模板里找不到 meta ${attr}="${key}"`)
    html = html.replace(re, (_, a, b) => a + value + b)
  }

  html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${t}</title>`)

  setMeta('name', 'description', d)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:title', t)
  setMeta('property', 'og:description', d)
  setMeta('property', 'og:image', img)
  setMeta('property', 'og:image:alt', esc(route.imageAlt))
  setMeta('name', 'twitter:title', t)
  setMeta('name', 'twitter:description', d)
  setMeta('name', 'twitter:image', img)

  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, (_, a, b) => a + url + b)
  return html
}

const templatePath = join(DIST, 'index.html')
if (!existsSync(templatePath)) {
  console.error('✗ 找不到 dist/index.html，请先跑 vite build')
  process.exit(1)
}
const template = readFileSync(templatePath, 'utf8')

// 构建产物里必须有入口脚本，否则说明 Vite 还没注入，后面的替换没有意义
if (!/<script[^>]+type="module"/.test(template)) {
  console.error('✗ dist/index.html 里没有入口脚本，构建产物异常')
  process.exit(1)
}

let count = 0
for (const route of ROUTES) {
  const url = SITE + (route.path === '/' ? '/' : route.path)
  const html = applyMeta(template, route, url)

  if (!/<script[^>]+type="module"/.test(html)) {
    console.error(`✗ ${route.path} 生成后入口脚本丢失`)
    process.exit(1)
  }

  // 输出成扁平的 <path>.html，而不是 <path>/index.html。
  // 目录形式会被 Cloudflare Pages 以 308 补成带斜杠的地址，
  // 结果 canonical 和用户实际打开的 URL 不一致；扁平文件可以直接命中，无跳转。
  const out =
    route.path === '/' ? templatePath : join(DIST, `${route.path.replace(/^\//, '')}.html`)

  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html, 'utf8')
  console.log(`✓ ${route.path.padEnd(28)} → ${out}`)
  count++
}

/* sitemap：爬虫从 robots.txt 里找到这条 */
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (r) =>
    `  <url><loc>${SITE}${r.path === '/' ? '/' : r.path}</loc><changefreq>monthly</changefreq></url>`,
).join('\n')}
</urlset>
`
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8')
console.log(`✓ /sitemap.xml (${ROUTES.length} 条)`)

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`
writeFileSync(join(DIST, 'robots.txt'), robots, 'utf8')
console.log('✓ /robots.txt')

console.log(`\n预渲染完成：${count} 条路由`)

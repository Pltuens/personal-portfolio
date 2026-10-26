# Pan Wangkun — 游戏策划作品集

一个静态的个人作品集站点：玩法案例、设计笔记与个人介绍。
纯前端构建，无后端、无数据库、无付费服务，可直接托管在 Cloudflare Pages。

## 技术栈

| 项 | 选择 | 理由 |
| --- | --- | --- |
| 构建 | Vite | 冷启动快、产物小、配置少 |
| 框架 | React + TypeScript | 组件化 + 类型约束，改内容不易写错 |
| 样式 | Tailwind CSS v4 | 设计令牌集中管理，避免散落的 CSS |
| 路由 | React Router | 客户端路由，配合 `_redirects` 处理刷新 404 |
| 内容 | `src/data/*.ts` | 内容与页面分离，改内容不用动组件 |
| 图形 | 手写 SVG + canvas | 不依赖外部图片，零版权风险、零额外请求 |

没有引入 UI 库、动画库、3D 库、字体 CDN：整站只有 3 个运行时依赖（react、react-dom、react-router-dom），
字体走系统字体栈（系统无衬线 + 等宽体），因此国内网络环境下也能正常显示。
知识球是手写 canvas 2D 球面投影，不引 three.js，省下 600 KB。

## 本地运行

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 产物输出到 dist/
npm run preview    # 本地预览生产构建
npm run lint
```

Node 版本：>= 20（开发时使用 24.x）。

## 目录结构

```text
personal-portfolio/
├── public/
│   ├── _redirects          # Cloudflare Pages 的 SPA 回退规则
│   ├── favicon.svg
│   ├── robots.txt
│   └── videos/             # 站内演示视频（mp4），放这里即可
├── src/
│   ├── components/
│   │   ├── Layout.tsx      # 顶栏 / 页脚 / 移动端菜单
│   │   ├── Blocks.tsx      # 内容块渲染（段落 / 列表 / 表格 / 引用 / 图示）
│   │   ├── ProjectArt.tsx  # 三套原创 SVG 封面
│   │   ├── VideoPlayer.tsx # 站内视频窗口 + 占位态
│   │   ├── KnowledgeSphere.tsx  # 可拖拽的 3D 知识球（canvas）
│   │   └── ui.tsx          # 通用原子组件与 useMeta
│   ├── data/
│   │   ├── profile.ts      # 个人信息、能力、个人支点、经历
│   │   ├── projects.ts     # 作品数据（含视频配置）
│   │   └── knowledge.ts    # 知识球节点与连线
│   ├── pages/              # 首页 / 作品 / 案例 / 关于 / 联系 / 404
│   ├── App.tsx             # 路由
│   ├── index.css           # 设计令牌与特效层
│   └── main.tsx
├── index.html
└── vite.config.ts
```

## 页面清单

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | 首页 | 定位、精选案例、能力、联系入口 |
| `/works` | 作品列表 | 按类型筛选 |
| `/works/:slug` | 案例详情 | 侧边目录 + 站内视频 + 分章节内容 + 沉淀 |
| `/about` | 关于 | 工作方法、能力、知识链路球、经历、工具链 |
| `/contact` | 联系 | 邮箱 / GitHub / 简历 / 可提供材料 |
| `*` | 404 | 兜底页 |

## 内容维护

所有可见内容都在 `src/data/` 里，改完保存即可，不需要动组件。

### 1. 个人信息 — `src/data/profile.ts`

- `nameEn` / `nameCn`：姓名。`nameCn` 留空则不渲染。
- `role` / `seeking`：当前身份与求职意向。
- `headline`：首页大标题，`\n` 表示换行。
- `lead`：首页导语，也用于关于页开头。
- `facts`：首页档案条的 4 个格子。
- `contact`：`email` 留空时页面显示「待填写」，不会生成虚假邮箱；
  `resume` 填 `/files/resume.pdf` 之类的路径（文件放 `public/files/`）即可出现下载入口。
- `skillGroups` / `pivots` / `timeline`：能力分组、个人支点、经历时间线。
  `timeline` 为空数组时，关于页显示空状态而不是编造经历。

### 2. 作品 — `src/data/projects.ts`

一个项目 = 一个对象。章节（`sections`）由内容块组成，可自由增删：

```ts
{ kind: 'p', text: '一段话' }
{ kind: 'list', items: ['…', '…'], ordered: true }
{ kind: 'table', head: ['列 1', '列 2'], rows: [['…', '…']] }
{ kind: 'callout', title: '小标题', text: '…' }
{ kind: 'quote', text: '…' }
{ kind: 'steps', items: [{ title: '…', text: '…' }] }
{ kind: 'figure', art: 'systemmap' | 'gas' | 'souls', caption: '…' }
```

- `art`：选封面图形（`systemmap` 系统结构 / `gas` 状态机 / `souls` 关卡循环）。
- `status` 会渲染成列表与详情页的状态角标（如「已完成」「原型完成」）。
- 新增项目会自动出现在 `/works` 与首页列表，详情页路由自动生成。

`links` 用于外部材料（飞书文档、演示视频），会渲染成详情页头部的按钮。

### 3. 站内演示视频

视频走 `<video>` 原生播放，文件放 `public/videos/`，命名建议与 slug 一致：

```text
public/videos/wuwa-echo-teardown.mp4
public/videos/aura-gas-arpg.mp4
public/videos/slash-soulslike.mp4
```

然后在 `src/data/projects.ts` 对应项目的 `video` 里把 `src` 打开：

```ts
video: {
  src: '/videos/aura-gas-arpg.mp4',   // ← 取消注释即可在站内播放
  poster: '/videos/aura-gas-arpg.jpg', // 可选：封面图
  title: '战斗演示',
  note: '…',
},
```

没配 `src` 或文件读不到时，同一个外框会渲染成「正在整理」的占位态，
并给出 `externalHref` 的外部观看入口，页面不会出现裂图或空洞。

建议编码：H.264 + AAC，1080p，单个文件控制在 20 MB 以内（Cloudflare Pages 单文件上限 25 MB）。

### 4. 知识链路球 — `src/data/knowledge.ts`

关于页的 3D 球由 `nodes`（球面节点）+ `links`（连线）驱动：

- 节点按斐波那契分布自动铺满球面，无需手动写坐标。
- `group` 决定颜色（玩法 / 战斗 / 数值 / 工程 / 方法，图例自动生成）。
- `weight` 控制节点大小，>= 1.15 的节点在手机上也会显示标签。
- 鼠标拖动旋转、悬停高亮并列出关联项；`prefers-reduced-motion` 下停止自转。

### 5. 增删页面

在 `src/pages/` 新建组件，然后在 `src/App.tsx` 的 `<Routes>` 里加一条 `<Route>`，
导航项在 `src/components/Layout.tsx` 的 `NAV` 数组里。

## 设计说明

- 深色科技风：底色近黑（`#05080d`），前景冷白（`#e8f0f8`），
  主强调青色（`#35e2ff`），次强调紫色（`#a78bfa`）只用于故障效果与图示。
- 页面背景带固定的青色调网格与顶部冷光，卡片靠 1px 边框 + 悬停冷光区分层级，
  不用大色块和渐变背景。
- 标题用系统无衬线（600 字重、紧字距），标签与数据统一等宽体，
  形成「HUD / 终端」的观感。
- 封面全部是手写 SVG 结构示意图，不用 AI 生图或他人素材，避免版权与失真问题。
- 特效层：滚动 ticker、扫描线、故障色散、HUD 取景角标、鼠标跟随冷光、3D 知识球；
  全部由 CSS/canvas 手写，无第三方库，并统一响应 `prefers-reduced-motion`（关闭自转与循环动画）。
- 正文最小字号 11px（等宽标签），正文段落 13.5–15px；低对比文字不出现在可读区域。
- 动效只有两处：入场淡入（IntersectionObserver，仅触发一次）与链接下划线的位移，
  并完整响应 `prefers-reduced-motion`。

## 部署到 Cloudflare Pages

**线上地址：https://personal-portfolio-34b.pages.dev**

| 配置项 | 值 |
| --- | --- |
| Cloudflare 项目名 | `personal-portfolio` |
| 生产分支 | `master` |
| 框架预设 | Vite |
| 构建命令 | `npm run build` |
| 输出目录 | `dist` |
| Node 版本 | `20`（或更高） |

`public/_redirects` 已包含 `/*  /index.html  200`，保证刷新 `/works/xxx` 不 404。

### 当前使用的部署方式（手动，已验证可用）

```bash
npm run build
npx wrangler pages deploy dist --project-name personal-portfolio --branch master
```

首次使用需要 `npx wrangler login`（会打开浏览器授权，一次即可）。
部署成功后输出形如 `https://<hash>.personal-portfolio-34b.pages.dev` 的预览链接，
`https://personal-portfolio-34b.pages.dev` 始终指向最新一次生产部署。

### 可选：改成推送即自动发布

1. Cloudflare Dashboard → Workers & Pages → `personal-portfolio` → Settings → Builds & deployments
   → Connect Git，选择 `Pltuens/personal-portfolio`，分支 `master`，填入上表参数。
2. 之后每次 `git push` 自动重新构建发布。

### 注意

- `npx wrangler deploy` 是 Worker 部署命令，静态站必须用 `wrangler pages deploy`。
- 命令行部署不会自动更新 GitHub 仓库，也不会触发 Git 集成；两者是独立通道。

## 已知限制

- 这是一个客户端渲染的 SPA：首屏内容靠 JS 渲染，SEO 依赖基础 meta 标签，
  不适合需要强 SEO 的商业站点。
- 没有后端，因此没有评论、统计、表单提交；联系入口只有 `mailto:` 与外链。

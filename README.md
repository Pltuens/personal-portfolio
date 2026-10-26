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
| 图形 | 手写 SVG | 不依赖外部图片，零版权风险、零额外请求 |

没有引入 UI 库、动画库、字体 CDN：整站只有 3 个运行时依赖（react、react-dom、react-router-dom），
字体走系统字体栈（Georgia / 宋体 / 系统无衬线），因此国内网络环境下也能正常显示。

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
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Layout.tsx      # 顶栏 / 页脚 / 移动端菜单
│   │   ├── Blocks.tsx      # 内容块渲染（段落 / 列表 / 表格 / 引用 / 图示）
│   │   ├── ProjectArt.tsx  # 三套原创 SVG 封面
│   │   └── ui.tsx          # 通用原子组件与 useMeta
│   ├── data/
│   │   ├── profile.ts      # 个人信息、能力、个人支点、经历
│   │   ├── projects.ts     # 作品数据
│   │   └── articles.ts     # 笔记数据
│   ├── pages/              # 首页 / 作品 / 案例 / 笔记 / 关于 / 联系 / 404
│   ├── App.tsx             # 路由
│   ├── index.css           # 设计令牌与基础样式
│   └── main.tsx
├── index.html
└── vite.config.ts
```

## 页面清单

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | 首页 | 定位、精选案例、能力、最新笔记、联系入口 |
| `/works` | 作品列表 | 按类型筛选 |
| `/works/:slug` | 案例详情 | 侧边目录 + 分章节内容 + 沉淀 |
| `/writing` | 笔记列表 | 按分类筛选 |
| `/writing/:slug` | 笔记详情 | 正文 + 相关笔记 |
| `/about` | 关于 | 工作方法、能力、个人支点、经历、工具链 |
| `/contact` | 联系 | 邮箱 / GitHub / 简历 / 可提供材料 / 隐私说明 |
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
{ kind: 'figure', art: 'grid' | 'vessel' | 'layer', caption: '…' }
```

- `art`：选封面图形（`grid` 分镜格 / `vessel` 三只杯 / `layer` 分层堆叠）。
- `demo: true` 会显示「示例条目」角标。换成真实项目后设为 `false`。
- 新增项目会自动出现在 `/works` 与首页列表，详情页路由自动生成。

### 3. 笔记 — `src/data/articles.ts`

字段：`title` / `kicker` / `category` / `date` / `readTime` / `summary` / `blocks`。
`category` 会进入筛选器，新增分类记得同步 `articleCategories`。

### 4. 增删页面

在 `src/pages/` 新建组件，然后在 `src/App.tsx` 的 `<Routes>` 里加一条 `<Route>`，
导航项在 `src/components/Layout.tsx` 的 `NAV` 数组里。

## 设计说明

- 底色是纸感米白（`#f3f0e8`），文字近黑，强调色只用一种朱红（`#a8432a`），
  靠字阶与留白建立层级，不依赖阴影和渐变。
- 标题用衬线体（Georgia + 宋体），正文用系统无衬线，标签用等宽体，
  形成「编辑式排版」而不是「SaaS 落地页」的观感。
- 封面全部是手写 SVG 结构示意图，不用 AI 生图或他人素材，避免版权与失真问题。
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

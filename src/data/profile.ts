/**
 * 站点内容配置：个人信息 / 能力 / 个人支点 / 经历
 * ------------------------------------------------------------------
 * 说明：所有字段都可以直接改这里，页面会自动更新。
 * 留空字符串的字段不会在页面上渲染（不会显示占位符），
 * 需要展示「待填写」时请显式写 `placeholder: true`。
 */

export type Placeholder = { placeholder: true }

export const profile = {
  /** 页面主标题用的英文名 / 拼音 */
  nameEn: 'Pan Wangkun',
  /** 中文名，未确认为空即可 */
  nameCn: '',
  role: '游戏策划 · 玩法与系统方向',
  /** 求职意向 */
  seeking: '战斗策划 / 系统策划 · 实习与校招',
  /** 一句话定位，显示在页脚与首页档案 */
  tagline: '先把判定写清楚，再谈表现。',
  location: '',
  /** 首页大标题，\n 手动换行 */
  headline: '把玩法拆成\n能被验证的规则。',
  /** 首页导语 */
  lead: '我做玩法与系统设计：先把判定、状态和边界写清楚，再去处理表现与包装。这里放着三个玩法案例和若干设计笔记，用来交代我怎么想问题、怎么把想法落成能交付给程序的东西。',
  /** 首页档案条 */
  facts: [
    { label: '方向', value: '玩法 / 系统策划' },
    { label: '方法', value: '先定判定，再做表现' },
    { label: '交付', value: '策划案 · 配表 · 可玩 Demo' },
    { label: '状态', value: '持续更新' },
  ],
}

export const contact = {
  /** 邮箱：填写后首页与联系页自动出现入口 */
  email: '',
  github: 'https://github.com/Pltuens',
  githubLabel: 'github.com/Pltuens',
  /** 其他公开主页（知乎 / B 站 / itch.io 等） */
  links: [] as { label: string; href: string }[],
  /** 简历文件：把 PDF 放进 public/ 后写路径，例如 '/files/resume.pdf' */
  resume: '',
  note: '未提供的联系方式不会自行生成；需要时可直接通过邮件联系。',
}

export type SkillGroup = {
  title: string
  en: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    title: '玩法与系统',
    en: 'Design',
    items: [
      '核心循环拆解与验证',
      '状态机 / 判定条件设计',
      '关卡结构与难度梯度',
      '资源循环与数值初稿',
    ],
  },
  {
    title: '文档与配表',
    en: 'Spec',
    items: [
      '策划案写作（结构 / 边界 / 待决策项）',
      '配置表结构设计与字段约束',
      '指令集与条件表达式建模',
      '校验规则与非法态拦截',
    ],
  },
  {
    title: '实现与验证',
    en: 'Build',
    items: [
      'HTML / JS 玩法原型',
      'Python 脚本穷举验证关卡',
      'Git 版本管理与文档协同',
      '引擎使用（UE 基础，待补充）',
    ],
  },
  {
    title: '表达与协作',
    en: 'Comm',
    items: [
      '机制拆解长文写作',
      '交互流程图与状态图',
      '与程序 / 美术对齐需求口径',
      '需求评审与疑问点收敛',
    ],
  },
]

export type Pivot = {
  name: string
  en: string
  oneLine: string
  link: string
  /** true 表示这条方向还需要我本人确认 */
  draft?: boolean
}

export const pivots: Pivot[] = [
  {
    name: '游戏设计',
    en: 'Design',
    oneLine: '习惯先问「这个玩法到底在考玩家什么」，再决定要加多少表现。',
    link: '决定了我在写方案时会先锁定判定与反馈，而不是先堆功能。',
    draft: true,
  },
  {
    name: '机制拆解',
    en: 'Teardown',
    oneLine: '玩到好机制会拆到状态和判定层，再判断哪些部分可以迁移。',
    link: '让我能把「好玩」翻译成程序看得懂的条件与优先级。',
    draft: true,
  },
  {
    name: '技术实践',
    en: 'Prototype',
    oneLine: '能自己写 HTML Demo 和脚本，把想法先跑起来再讨论。',
    link: '减少「文档写完才发现不可行」的返工。',
    draft: true,
  },
  {
    name: '独立开发',
    en: 'Solo',
    oneLine: '关注小体量、单一机制、能被一个人做完的玩法。',
    link: '影响我做减法：优先保留能撑住体验的核心规则。',
    draft: true,
  },
  {
    name: 'AI 辅助开发',
    en: 'Workflow',
    oneLine: '用 AI 处理配表整理、脚本验证和文档骨架，自己盯判定逻辑。',
    link: '把重复劳动压掉，时间放到关卡和手感上。',
    draft: true,
  },
  {
    name: '逻辑分析',
    en: 'Logic',
    oneLine: '喜欢把模糊的规则写成可校验的表达式。',
    link: '这是我做配置文档时最常用的一项能力。',
    draft: true,
  },
]

export type TimelineItem = {
  period: string
  title: string
  org: string
  detail: string
}

/** 经历条目：留空时页面会显示空状态，不会编造经历 */
export const timeline: TimelineItem[] = []

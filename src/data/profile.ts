/**
 * 站点内容配置：个人信息 / 能力 / 个人支点 / 经历
 * ------------------------------------------------------------------
 * 所有字段改这里即可，页面会自动更新。
 * 留空字符串的字段不会渲染；需要显示「待填写」时显式写 placeholder。
 */

export const profile = {
  /** 显示名 */
  nameEn: 'Pluents',
  /** 中文名，未提供则留空 */
  nameCn: '潘旺坤',
  role: '玩法 / 系统 / 战斗策划',
  /** 求职状态 */
  seeking: '2028 届 · 寻策划实习',
  tagline: '拆得开，也做得出来。',
  location: '',
  /** 首页大标题，\n 手动换行 */
  headline: '把战斗拆开看，\n再动手做出来。',
  /** 首页导语 */
  lead: '湖北师范大学软件工程 2028 届。做玩法、系统与战斗设计，也写实现：能把一套养成系统拆到数值与构筑层，也能用 UE5 + GAS 把战斗原型真的跑起来。',
  /** 首页档案条 */
  facts: [
    { label: '方向', value: '玩法 / 系统 / 战斗' },
    { label: '在读', value: '湖北师范大学 · 软件工程' },
    { label: '现在', value: '腾娱互动 · 策划培训生' },
    { label: '届别', value: '2028 届' },
  ],
}

export const contact = {
  email: '227794090@qq.com',
  github: 'https://github.com/Pltuens',
  githubLabel: 'github.com/Pltuens',
  links: [] as { label: string; href: string }[],
  /** 简历：把 PDF 放进 public/files/ 后填路径，例如 '/files/resume.pdf' */
  resume: '/files/resume.pdf',
  note: '简历为 PDF 版，可直接下载；站内不放私人电话。',
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
      '战斗循环与节奏设计',
      '状态机与判定优先级',
      '技能 / Buff / Debuff 系统',
      '耐力与资源循环',
    ],
  },
  {
    title: '系统拆解',
    en: 'Teardown',
    items: [
      '养成链路还原',
      '词条数值与构筑分析',
      '竞品结构拆解',
      '社区舆情归纳',
    ],
  },
  {
    title: '工程实现',
    en: 'Build',
    items: [
      'UE5 / GAS 框架',
      '动画重定向（IK Retargeter）',
      'MotionWarping 位移修正',
      '行为树 AI / Chaos 物理',
    ],
  },
  {
    title: '文档与协作',
    en: 'Comm',
    items: [
      '拆解分析案写作',
      '需求与状态说明',
      '测试反馈迭代',
      '飞书文档协作',
    ],
  },
]

export type Pivot = {
  name: string
  en: string
  oneLine: string
  link: string
}

export const pivots: Pivot[] = [
  {
    name: '战斗系统',
    en: 'Combat',
    oneLine: '在意「这一刀为什么值得打」，而不是技能特效有多大。',
    link: '所以做战斗时会先定资源与状态，再谈表现。',
  },
  {
    name: '系统拆解',
    en: 'Teardown',
    oneLine: '玩到一套养成会拆到链路和卡点，而不只是记数值。',
    link: '让我能把「不好玩」翻译成具体环节的问题。',
  },
  {
    name: '工程实现',
    en: 'Build',
    oneLine: '自己写实现，能把设计在引擎里先跑一遍。',
    link: '省掉大量「文档写完才发现做不了」的返工。',
  },
  {
    name: '数值观察',
    en: 'Numbers',
    oneLine: '习惯用收益与消耗衡量系统，而不是凭体感下判断。',
    link: '拆解与调优时都靠这套口径对齐讨论。',
  },
  {
    name: '关卡节奏',
    en: 'Pacing',
    oneLine: '相信节奏来自资源约束和空间设计，不来自堆怪。',
    link: '影响我做地牢与战斗遭遇时的取舍。',
  },
  {
    name: '持续迭代',
    en: 'Iterate',
    oneLine: '按测试反馈改，而不是按个人喜好改。',
    link: '原型阶段尤其重要，早改比改得漂亮重要。',
  },
]

export type TimelineItem = {
  period: string
  title: string
  org: string
  detail: string
  /** 正在进行的经历会显示「进行中」标记 */
  current?: boolean
}

export const timeline: TimelineItem[] = [
  {
    period: '2026.09 — 至今',
    title: '策划培训生',
    org: '深圳腾娱互动 · 武汉分公司',
    detail: '',
    current: true,
  },
  {
    period: '2028 届',
    title: '软件工程 · 本科',
    org: '湖北师范大学',
    detail: '在读。专业训练偏工程实现，做策划的同时保持动手能力。',
  },
  {
    period: '2026.04',
    title: '《鸣潮》声骸系统拆解',
    org: '个人项目',
    detail: '战斗策划 / 系统策划：拆解获取、养成、词条与构筑四条链路，输出结构化拆解案。',
  },
  {
    period: '2025.06 — 2026.05',
    title: 'Aura · 基于 GAS 的 ARPG',
    org: '团队原型',
    detail: '客户端开发 / 战斗系统设计：GAS 战斗框架、状态机、MotionWarping 与打击反馈。',
  },
  {
    period: '2024 — 2025',
    title: 'Slash · 开放世界类魂原型',
    org: '团队原型',
    detail: '战斗与关卡循环设计：动画重定向、耐力博弈、行为树 AI 与地牢反馈循环。',
  },
]

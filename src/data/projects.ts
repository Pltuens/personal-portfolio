/**
 * 作品数据
 * ------------------------------------------------------------------
 * 每个项目 = 一个 slug + 一段结构化内容。
 * 章节（sections）的顺序、标题、内容块都可以自由增删。
 */

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'callout'; title?: string; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'steps'; items: { title: string; text: string }[] }
  | { kind: 'figure'; art: ArtKey; caption: string }

export type ArtKey = 'systemmap' | 'gas' | 'souls'

export type Section = {
  id: string
  title: string
  en?: string
  blocks: Block[]
}

export type ProjectLink = { label: string; href: string; note?: string }

/**
 * 站内演示视频
 * ------------------------------------------------------------------
 * 视频文件放在 public/videos/ 下（mp4，H.264），然后填 src 即可直接在页面上播。
 * 没填 src 时页面会渲染成"正在整理"的占位窗口，不会出现裂图。
 */
export type ProjectVideo = {
  src?: string
  poster?: string
  title?: string
  note?: string
  externalHref?: string
  externalLabel?: string
}

export type Project = {
  slug: string
  index: string
  title: string
  subtitle: string
  category: '系统拆解' | '战斗系统' | '关卡循环'
  kind: string
  status: string
  period: string
  role: string
  scope: string
  summary: string
  art: ArtKey
  tags: string[]
  links?: ProjectLink[]
  video?: ProjectVideo
  sections: Section[]
  takeaways: string[]
}

export const categories = ['全部', '系统拆解', '战斗系统', '关卡循环'] as const

export const projects: Project[] = [
  {
    slug: 'wuwa-echo-teardown',
    index: '01',
    title: '《鸣潮》声骸系统拆解',
    subtitle: '把一套养成系统拆成可复用的分析框架',
    category: '系统拆解',
    kind: '竞品系统拆解 · 养成与战斗构筑',
    status: '已完成',
    period: '2026.04',
    role: '战斗策划 / 系统策划',
    scope: '拆解分析案（飞书文档）',
    summary:
      '围绕《鸣潮》核心养成「声骸系统」做全方位拆解：从获取、养成、词条数值到战斗构筑，还原各阶段的成长曲线与资源节奏，并把社区舆情里的痛点收敛成可执行的优化方向。',
    art: 'systemmap',
    tags: ['养成链路', '词条数值', '战斗构筑', '竞品分析'],
    links: [
      {
        label: '拆解文档（飞书）',
        href: 'https://my.feishu.cn/wiki/Wv8CwjQWJiSW6hkIuaectiXhnJf',
        note: '完整拆解案',
      },
    ],
    video: {
      // 视频放好后再打开这行：src: '/videos/wuwa-echo-teardown.mp4',
      title: '系统拆解讲解',
      note: '拆解思路的录屏还在整理，可以先看飞书文档里的完整版。',
      externalHref: 'https://my.feishu.cn/wiki/Wv8CwjQWJiSW6hkIuaectiXhnJf',
      externalLabel: '看拆解文档',
    },
    sections: [
      {
        id: 'context',
        title: '拆解范围',
        en: 'Scope',
        blocks: [
          {
            kind: 'p',
            text: '声骸不是单点玩法：它同时挂着开放世界的探索掉落、角色的战斗构筑，以及一条很长的养成资源线。所以拆解不能停在「怎么刷」，而要把它摊成四条互相咬合的链路——获取、养成、词条、构筑。',
          },
          {
            kind: 'figure',
            art: 'systemmap',
            caption: '四条链路共用一个核心：任一条的改动都会传导到另外三条。',
          },
          {
            kind: 'callout',
            title: '拆解原则',
            text: '先还原结构，再评价好坏。评价必须能落回某一条链路的具体环节，否则只是感想。',
          },
        ],
      },
      {
        id: 'duties',
        title: '我负责的四条线',
        en: 'Duties',
        blocks: [
          {
            kind: 'steps',
            items: [
              {
                title: '流程拆解',
                text: '剖析声骸的获取与养成链路，还原玩家各阶段的成长曲线与资源消耗节奏——重点是「什么时候会卡住、卡在什么资源上」。',
              },
              {
                title: '构筑分析',
                text: '从战斗视角分析 Cost、套装效果、主副词条与角色的适配逻辑，并判断这套适配关系带来的付费潜能。',
              },
              {
                title: '问题归纳',
                text: '结合玩家社区舆情，归纳刷取成本、随机性与养成压力这几类痛点，并输出对应的优化方案。',
              },
              {
                title: '成果沉淀',
                text: '产出结构化竞品拆解文档，把这次的分析过程整理成可复用的系统分析方法论与数值观察模型。',
              },
            ],
          },
        ],
      },
      {
        id: 'framework',
        title: '拆解框架',
        en: 'Framework',
        blocks: [
          {
            kind: 'table',
            head: ['链路', '看什么', '产出'],
            rows: [
              ['获取', '掉落来源、单次收益、体力与时间成本', '单位时间收益与玩家预期的差距'],
              ['养成', '材料种类、阶段门槛、经验与金币消耗', '成长曲线上的卡点位置'],
              ['词条', 'Cost 上限、套装效果、主副词条权重', '随机性与目标可控性的关系'],
              ['构筑', '声骸组合与角色机制的适配面', '抽取价值与付费潜能的判断依据'],
            ],
          },
          {
            kind: 'p',
            text: '这张表的用途是防止拆解跑偏：每写一条结论，都要能指回某一行、某一列。写不回去的，基本就是主观感受。',
          },
        ],
      },
      {
        id: 'findings',
        title: '痛点与优化方向',
        en: 'Findings',
        blocks: [
          {
            kind: 'p',
            text: '玩家侧的负面反馈看起来零散，归到结构上其实是三类问题叠加：',
          },
          {
            kind: 'table',
            head: ['痛点', '结构上的原因', '可动的优化方向'],
            rows: [
              [
                '刷取成本',
                '获取端由体力与随机掉落共同决定，收益不可预期',
                '给出阶段性保底或定向获取，让「刷」有明确终点',
              ],
              [
                '随机性',
                '词条随机叠加在套装与 Cost 约束之上，目标组合命中率低',
                '压缩无效词条池，或提供可继承、可重铸的中间态',
              ],
              [
                '养成压力',
                '材料种类多、阶段门槛集中，长线资源被同时占用',
                '把资源需求分散到不同阶段，避免同一时间多点开花',
              ],
            ],
          },
          {
            kind: 'p',
            text: '优化方向都指向同一件事：把「不可控」换成「可预期」。随机性本身不是问题，没有兜底的随机性才是。',
          },
        ],
      },
      {
        id: 'output',
        title: '交付与沉淀',
        en: 'Output',
        blocks: [
          {
            kind: 'p',
            text: '最终交付是一份结构化的竞品拆解文档，把上面四条链路、卡点位置与优化方向放进同一套框架里。',
          },
          {
            kind: 'p',
            text: '比文档本身更有用的是流程：先定拆解维度，再逐条填证据，最后才下判断。这套顺序后来也被我用来拆自己的项目。',
          },
        ],
      },
    ],
    takeaways: [
      '拆解要能指回具体环节，否则只是感想。',
      '随机性不是问题，缺兜底才是。',
      '先定维度再填证据，结论才不会跑。',
    ],
  },
  {
    slug: 'aura-gas-arpg',
    index: '02',
    title: 'Aura',
    subtitle: '基于 GAS 的硬核 ARPG 战斗原型',
    category: '战斗系统',
    kind: 'UE5 原型 · 客户端开发与战斗设计',
    status: '原型完成',
    period: '2025.06 — 2026.05',
    role: '客户端开发 / 战斗系统设计',
    scope: 'GAS 战斗框架 · 状态机 · 手感优化',
    summary:
      '基于 UE5 与 GAS 框架搭建的硬核 ARPG 原型：从属性、技能状态、Buff/Debuff 这些基础战斗系统，到硬直、受击、施法的状态机，再到 MotionWarping 与自动索敌带来的命中表现。',
    art: 'gas',
    tags: ['GAS', '状态机', 'MotionWarping', '打击反馈'],
    links: [
      { label: '演示视频', href: 'https://easylink.cc/5rvg6g', note: '战斗演示' },
    ],
    video: {
      // 视频放好后再打开这行：src: '/videos/aura-gas-arpg.mp4',
      title: '战斗演示',
      note: 'GAS 战斗原型的连招、受击与状态打断，成片正在压缩，先看外部版本。',
      externalHref: 'https://easylink.cc/5rvg6g',
      externalLabel: '外部观看',
    },
    sections: [
      {
        id: 'position',
        title: '项目定位',
        en: 'Position',
        blocks: [
          {
            kind: 'p',
            text: 'Aura 是一个硬核向的动作 RPG 原型，做的不是完整产品，而是把「动作战斗」这条线做扎实：技能要能连、受击要能看、状态不能互相打架。',
          },
          {
            kind: 'p',
            text: '我在里面同时做客户端开发和战斗系统设计，所以很多决定是在「设计想要什么」和「框架允许什么」之间找平衡。',
          },
        ],
      },
      {
        id: 'framework',
        title: '战斗框架：GAS',
        en: 'Framework',
        blocks: [
          {
            kind: 'p',
            text: '底层用 GAS 搭：属性走 AttributeSet，技能作为独立的 Ability，Buff/Debuff 作为可叠加的 GameplayEffect。这样做的直接好处是「谁在改什么」有明确归属，排查问题时不用翻遍蓝图。',
          },
          {
            kind: 'table',
            head: ['层', '承载', '在项目里的作用'],
            rows: [
              ['属性', 'AttributeSet', '生命、耐力、韧性等基础数值，统一由 GE 修改'],
              ['技能', 'GameplayAbility', '施法流程、消耗、冷却与中断'],
              ['状态', 'GameplayEffect + Tag', 'Buff / Debuff、免疫、硬直与受击的挂载点'],
              ['表现', '动画通知 / 特效', '只做表现，不承载判定'],
            ],
          },
        ],
      },
      {
        id: 'statemachine',
        title: '状态机与状态冲突',
        en: 'States',
        blocks: [
          {
            kind: 'p',
            text: '动作战斗最容易崩的地方不是单个技能，而是状态叠在一起的时候：施法中被受击、受击中想闪避、硬直结束还没落地。这些问题靠「加个 bool 判断」解决不了，必须有明确的优先级。',
          },
          {
            kind: 'figure',
            art: 'gas',
            caption: '状态的进入与打断：先定义谁能打断谁，再写动画。',
          },
          {
            kind: 'list',
            items: [
              '把状态写成互斥的集合，同一时刻只允许一个主动状态。',
              '打断关系单独成表：受击可以打断施法，施法不能打断受击。',
              '动画与判定分离，表现可以延后，判定必须在状态切换的当下完成。',
              '异常态（死亡、落地、脱战）留显式出口，避免状态卡死。',
            ],
          },
        ],
      },
      {
        id: 'feel',
        title: '手感：位移修正与索敌',
        en: 'Feel',
        blocks: [
          {
            kind: 'p',
            text: '近战技能最容易出的问题是「看起来打到了，实际没打到」。引入 MotionWarping 之后，位移由目标位置反推，动画不再和实际位置脱节；再叠一层自动索敌，让攻击在起手阶段就锁定最近的有效目标。',
          },
          {
            kind: 'callout',
            title: '取舍',
            text: '自动索敌会牺牲一部分操作自由度。这里的判断是：原型阶段优先保证命中反馈成立，把「打空」这种负面体验先去掉。',
          },
        ],
      },
      {
        id: 'iteration',
        title: '表现与 UI 迭代',
        en: 'Iteration',
        blocks: [
          {
            kind: 'p',
            text: '测试反馈集中在「看不懂现在什么状态」和「打上去没感觉」。对应做了两件事：把关键状态做成 UI 上能读到的信息，把受击反馈在特效与镜头层面加重。',
          },
          {
            kind: 'list',
            items: [
              '状态信息前置：耐力、韧性、Buff 剩余时间都在固定位置显示。',
              '受击反馈分层：轻击、重击、破防用不同的特效强度与停顿。',
              '按反馈迭代，而不是按喜好迭代。',
            ],
          },
        ],
      },
    ],
    takeaways: [
      '判定与表现必须分开，表现可以晚，判定不能。',
      '状态冲突要用优先级表解决，不是用 bool 堆。',
      '手感问题先看「命中是否成立」，再谈特效。',
    ],
  },
  {
    slug: 'slash-soulslike',
    index: '03',
    title: 'Slash',
    subtitle: '开放世界类魂原型：耐力、动画与地牢循环',
    category: '关卡循环',
    kind: 'UE5.6 原型 · 第三人称硬核动作 RPG',
    status: '原型完成',
    period: '2024 — 2025',
    role: '战斗与关卡循环设计',
    scope: '动画重定向 · 耐力博弈 · AI 与关卡反馈',
    summary:
      '基于 UE5.6 的第三人称魂系原型，聚焦近战节奏、关卡资源推拉与地牢探索：用耐力卡点强制攻防博弈，用行为树与物理破坏把探索反馈打通。',
    art: 'souls',
    tags: ['弹反节奏', '耐力系统', 'IK Retargeter', '行为树'],
    links: [
      { label: '演示视频', href: 'https://easylink.cc/eij9vi', note: '战斗与关卡演示' },
    ],
    video: {
      // 视频放好后再打开这行：src: '/videos/slash-soulslike.mp4',
      title: '战斗与关卡演示',
      note: '耐力博弈与地牢循环的实机演示，成片正在压缩，先看外部版本。',
      externalHref: 'https://easylink.cc/eij9vi',
      externalLabel: '外部观看',
    },
    sections: [
      {
        id: 'position',
        title: '项目定位',
        en: 'Position',
        blocks: [
          {
            kind: 'p',
            text: 'Slash 想验证的是魂系那套「推拉」：玩家的每一次进攻都要付出资源，敌人也不会给你无限窗口。资源紧，节奏才会紧。',
          },
        ],
      },
      {
        id: 'animation',
        title: '动画与武器状态机',
        en: 'Animation',
        blocks: [
          {
            kind: 'p',
            text: '多套资产直接混用必然出问题，所以先用 IKRetargeter 做骨骼绑定修正与动画重定向，把来源不同的动作统一到同一套骨架上。',
          },
          {
            kind: 'list',
            items: [
              '单/双手武器各一套状态机，切换时同步动画层与碰撞体。',
              '用 MotionWarping 做位移修正，让攻击距离和动画表现对齐。',
              '把「能不能接下一段」写成状态条件，而不是靠动画长度估。',
            ],
          },
        ],
      },
      {
        id: 'stamina',
        title: '耐力博弈',
        en: 'Stamina',
        blocks: [
          {
            kind: 'p',
            text: '耐力是这套战斗的核心卡点：消耗刚性、回复可控。玩家必须算清楚「这一刀值不值得」，攻防才会形成来回，而不是一直按攻击。',
          },
          {
            kind: 'figure',
            art: 'souls',
            caption: '耐力在攻防之间循环：消耗端刚性、回复端可预期，节奏才有推拉。',
          },
          {
            kind: 'callout',
            title: '设计判断',
            text: '耐力条不是难度开关。它的作用是让玩家在「多打一刀」和「留着闪避」之间做选择，而不是单纯拖慢节奏。',
          },
        ],
      },
      {
        id: 'ai',
        title: 'AI 与关卡反馈',
        en: 'AI',
        blocks: [
          {
            kind: 'p',
            text: '敌人用感知组件驱动一棵「巡逻 — 追逐 — 攻击 — 脱战」的行为树，保证玩家能在探索时读懂敌人的状态；地牢侧接入 Chaos 物理破碎与双货币拾取，把「打破—拾取—推进」这条反馈链接起来。',
          },
          {
            kind: 'table',
            head: ['模块', '做法', '想解决的问题'],
            rows: [
              ['敌人 AI', '感知 + 四段行为树', '探索时敌人行为可读，不突然开打'],
              ['环境反馈', 'Chaos 物理破碎', '让攻击与破坏有实感'],
              ['资源循环', '双货币拾取', '把探索收益拆成即时与长线两种'],
            ],
          },
        ],
      },
    ],
    takeaways: [
      '节奏来自资源约束，不是来自动作数量。',
      '动画资产统一，才有余力谈手感。',
      'AI 的行为要能被玩家读懂，难度才有意义。',
    ],
  },
]

export const getProject = (slug?: string) =>
  projects.find((p) => p.slug === slug)

export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}

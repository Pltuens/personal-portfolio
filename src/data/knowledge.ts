/**
 * 知识链路数据
 * ------------------------------------------------------------------
 * 节点会被均匀铺在一个球面上，`links` 决定哪些点之间连线。
 * 想加知识点，只需往 nodes 里加一条 + 在 links 里连几条边。
 */

export type KnowledgeGroup = 'design' | 'combat' | 'system' | 'eng' | 'method'

export type KnowledgeNode = {
  id: string
  label: string
  group: KnowledgeGroup
  /** 影响球上节点大小，1 = 常规，1.4 = 主干 */
  weight?: number
}

export const groupMeta: Record<KnowledgeGroup, { name: string; en: string; color: string }> = {
  design: { name: '玩法与系统', en: 'Design', color: '#35e2ff' },
  combat: { name: '战斗实现', en: 'Combat', color: '#a78bfa' },
  system: { name: '数值与养成', en: 'System', color: '#f0b45f' },
  eng: { name: '工程与工具', en: 'Engine', color: '#5eead4' },
  method: { name: '方法与协作', en: 'Method', color: '#8fa3b8' },
}

export const knowledgeNodes: KnowledgeNode[] = [
  // 玩法与系统
  { id: 'gameplay', label: '玩法设计', group: 'design', weight: 1.4 },
  { id: 'system', label: '系统设计', group: 'design', weight: 1.35 },
  { id: 'combat-design', label: '战斗设计', group: 'design', weight: 1.4 },
  { id: 'level', label: '关卡节奏', group: 'design' },
  { id: 'numerics', label: '数值节奏', group: 'design' },

  // 战斗实现
  { id: 'fsm', label: '状态机', group: 'combat', weight: 1.3 },
  { id: 'feel', label: '手感调优', group: 'combat', weight: 1.2 },
  { id: 'hitstop', label: '打击反馈', group: 'combat' },
  { id: 'gas', label: 'GAS', group: 'combat', weight: 1.25 },
  { id: 'attr', label: 'AttributeSet', group: 'combat' },
  { id: 'ge', label: 'GameplayEffect', group: 'combat' },
  { id: 'motionwarp', label: 'MotionWarping', group: 'combat' },
  { id: 'lockon', label: '自动索敌', group: 'combat' },

  // 数值与养成
  { id: 'grow', label: '养成链路', group: 'system', weight: 1.15 },
  { id: 'affix', label: '词条数值', group: 'system' },
  { id: 'resource', label: '资源循环', group: 'system' },

  // 工程与工具
  { id: 'retarget', label: '动画重定向', group: 'eng' },
  { id: 'bt', label: '行为树', group: 'eng' },
  { id: 'perception', label: 'AI 感知', group: 'eng' },
  { id: 'chaos', label: '物理破碎', group: 'eng' },
  { id: 'ue5', label: 'UE5 蓝图', group: 'eng', weight: 1.2 },
  { id: 'cpp', label: 'C++', group: 'eng' },

  // 方法与协作
  { id: 'teardown', label: '竞品拆解', group: 'method', weight: 1.2 },
  { id: 'spec', label: '需求文档', group: 'method' },
  { id: 'data', label: '数据分析', group: 'method' },
  { id: 'collab', label: '团队协作', group: 'method' },
]

/** 无向边：[from, to] */
export const knowledgeLinks: [string, string][] = [
  ['gameplay', 'combat-design'],
  ['gameplay', 'system'],
  ['gameplay', 'level'],
  ['gameplay', 'spec'],
  ['system', 'grow'],
  ['system', 'numerics'],
  ['system', 'resource'],
  ['numerics', 'affix'],
  ['numerics', 'level'],
  ['grow', 'affix'],
  ['grow', 'resource'],
  ['resource', 'level'],
  ['combat-design', 'fsm'],
  ['combat-design', 'feel'],
  ['combat-design', 'hitstop'],
  ['combat-design', 'numerics'],
  ['fsm', 'gas'],
  ['fsm', 'retarget'],
  ['gas', 'attr'],
  ['gas', 'ge'],
  ['gas', 'ue5'],
  ['ge', 'hitstop'],
  ['feel', 'motionwarp'],
  ['feel', 'lockon'],
  ['feel', 'hitstop'],
  ['retarget', 'motionwarp'],
  ['retarget', 'ue5'],
  ['level', 'bt'],
  ['level', 'chaos'],
  ['bt', 'perception'],
  ['bt', 'ue5'],
  ['chaos', 'ue5'],
  ['ue5', 'cpp'],
  ['teardown', 'grow'],
  ['teardown', 'affix'],
  ['teardown', 'data'],
  ['data', 'numerics'],
  ['teardown', 'spec'],
  ['spec', 'collab'],
  ['collab', 'ue5'],
  ['spec', 'level'],
  ['perception', 'lockon'],
]

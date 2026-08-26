export const categories = ['技术笔记', '设计观察', '游戏与像素', '随笔'] as const

export const tags = [
  '像素设计',
  '前端开发',
  'Astro',
  '界面设计',
  '游戏设计',
  '写作',
  '知识管理',
  '个人网站',
] as const

export type Category = (typeof categories)[number]
export type Tag = (typeof tags)[number]

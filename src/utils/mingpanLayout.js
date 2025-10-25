// 紫微斗数命盘布局计算工具

// 十二宫位的定义（按紫微斗数标准顺序）
export const GONG_NAMES = [
  '官禄', '父母', '福德', '田宅', '官禄', '交友',
  '迁移', '疾厄', '财帛', '子女', '夫妻', '兄弟'
]

// 宫位在命盘中的位置映射
// 按照标准紫微斗数命盘的顺时针顺序排列
// 从命宫开始，顺时针：命宫→兄弟→夫妻→子女→财帛→疾厄→迁移→奴仆→官禄→田宅→福德→父母
export const GONG_POSITIONS = [
  { index: 0, row: 2, col: 0, name: '命宫' },      // grid-area: 3 / 1 (左侧中间)
  { index: 1, row: 1, col: 0, name: '兄弟' },      // grid-area: 2 / 1 (左上)
  { index: 2, row: 0, col: 0, name: '夫妻' },      // grid-area: 1 / 1 (左上角)
  { index: 3, row: 0, col: 1, name: '子女' },      // grid-area: 1 / 2 (上左)
  { index: 4, row: 0, col: 2, name: '财帛' },      // grid-area: 1 / 3 (上右)
  { index: 5, row: 0, col: 3, name: '疾厄' },      // grid-area: 1 / 4 (右上角)
  { index: 6, row: 1, col: 3, name: '迁移' },      // grid-area: 2 / 4 (右上)
  { index: 7, row: 2, col: 3, name: '奴仆' },      // grid-area: 3 / 4 (右侧中间)
  { index: 8, row: 3, col: 3, name: '官禄' },      // grid-area: 4 / 4 (右下角)
  { index: 9, row: 3, col: 2, name: '田宅' },      // grid-area: 4 / 3 (下右)
  { index: 10, row: 3, col: 1, name: '福德' },     // grid-area: 4 / 2 (下左)
  { index: 11, row: 3, col: 0, name: '父母' }      // grid-area: 4 / 1 (左下角)
]

// 三方四正的连接关系 - 标准紫微斗数关系
export const SANFANG_SIZHENG = {
  // 命宫：财帛、官禄为三方；夫妻、迁移为四正
  '命宫': {
    sanfang: ['财帛', '官禄'],
    sizheng: ['夫妻', '迁移']
  },
  // 兄弟宫：奴仆、父母为三方；官禄、财帛为四正
  '兄弟': {
    sanfang: ['奴仆', '父母'],
    sizheng: ['官禄', '财帛']
  },
  // 夫妻宫：田宅、福德为三方；命宫、迁移为四正
  '夫妻': {
    sanfang: ['田宅', '福德'],
    sizheng: ['命宫', '迁移']
  },
  // 子女宫：官禄、奴仆为三方；兄弟、财帛为四正
  '子女': {
    sanfang: ['官禄', '奴仆'],
    sizheng: ['兄弟', '财帛']
  },
  // 财帛宫：疾厄、迁移为三方；夫妻、奴仆为四正
  '财帛': {
    sanfang: ['疾厄', '迁移'],
    sizheng: ['夫妻', '奴仆']
  },
  // 疾厄宫：奴仆、官禄为三方；子女、财帛为四正
  '疾厄': {
    sanfang: ['奴仆', '官禄'],
    sizheng: ['子女', '财帛']
  },
  // 迁移宫：官禄、田宅为三方；财帛、疾厄为四正
  '迁移': {
    sanfang: ['官禄', '田宅'],
    sizheng: ['财帛', '疾厄']
  },
  // 奴仆宫：田宅、福德为三方；疾厄、官禄为四正
  '奴仆': {
    sanfang: ['田宅', '福德'],
    sizheng: ['疾厄', '官禄']
  },
  // 官禄宫：奴仆、父母为三方；迁移、兄弟为四正
  '官禄': {
    sanfang: ['奴仆', '父母'],
    sizheng: ['迁移', '兄弟']
  },
  // 田宅宫：福德、兄弟为三方；奴仆、父母为四正
  '田宅': {
    sanfang: ['福德', '兄弟'],
    sizheng: ['奴仆', '父母']
  },
  // 福德宫：兄弟、夫妻为三方；田宅、官禄为四正
  '福德': {
    sanfang: ['兄弟', '夫妻'],
    sizheng: ['田宅', '官禄']
  },
  // 父母宫：夫妻、子女为三方；兄弟、奴仆为四正
  '父母': {
    sanfang: ['夫妻', '子女'],
    sizheng: ['兄弟', '奴仆']
  }
}

// 获取宫位的网格位置
export function getGongPosition(gongIndex) {
  return GONG_POSITIONS[gongIndex] || null
}

// 获取宫位的网格样式
export function getGongGridStyle(gongIndex) {
  const position = getGongPosition(gongIndex)
  if (!position) return {}

  return {
    gridRow: position.row + 1,
    gridColumn: position.col + 1
  }
}

// 获取宫位的CSS grid-area值
export function getGongGridArea(gongIndex) {
  const position = getGongPosition(gongIndex)
  if (!position) return ''

  return `${position.row + 1} / ${position.col + 1}`
}

// 根据宫位名称查找索引
export function getGongIndexByName(name) {
  const position = GONG_POSITIONS.find(pos => pos.name === name)
  return position ? position.index : -1
}

// 判断是否为命宫
export function isMingGong(gongIndex, mingzhuGongIndex) {
  return gongIndex === mingzhuGongIndex
}

// 判断是否为身宫
export function isShenGong(gong, shenGongGongIndex) {
  return gong.shen && gong.gong?.name !== undefined
}

// 计算三方四正的连线 - 以命宫为中心
export function calculateSanfangSizhengLines(mingpan) {
  const lines = []

  if (!mingpan || !mingpan.gongs || !mingpan.mingzhu) {
    return lines
  }

  // 找到命宫
  let minggongIndex = -1
  mingpan.gongs.forEach((gong, index) => {
    if (gong.gong?.name === '命宫') {
      minggongIndex = index
    }
  })

  if (minggongIndex === -1) return lines

  // 获取命宫位置
  const minggongPos = getGongPosition(minggongIndex)
  if (!minggongPos) return lines

  // 计算三方连线 - 命宫的对角线位置
  const sanfangGongs = ['财帛', '官禄']
  sanfangGongs.forEach(gongName => {
    const gongIndex = getGongIndexByName(gongName)
    if (gongIndex !== -1) {
      const gongPos = getGongPosition(gongIndex)
      if (gongPos) {
        const svgLine = generateSvgLine(minggongPos, gongPos, gridSize)
        lines.push({
          ...svgLine,
          type: 'sanfang',
          fromGong: '命宫',
          toGong: gongName
        })
      }
    }
  })

  // 计算四正连线 - 命宫的十字线位置
  const sizhengGongs = ['夫妻', '迁移']
  sizhengGongs.forEach(gongName => {
    const gongIndex = getGongIndexByName(gongName)
    if (gongIndex !== -1) {
      const gongPos = getGongPosition(gongIndex)
      if (gongPos) {
        const svgLine = generateSvgLine(minggongPos, gongPos, gridSize)
        lines.push({
          ...svgLine,
          type: 'sizheng',
          fromGong: '命宫',
          toGong: gongName
        })
      }
    }
  })

  return lines
}

// 基于点击宫位计算动态三方四正连线
export function calculateDynamicConnections(mingpan, clickedGongIndex) {
  const lines = []

  if (!mingpan || !mingpan.gongs || clickedGongIndex === undefined || clickedGongIndex < 0) {
    return lines
  }

  const clickedGong = mingpan.gongs[clickedGongIndex]
  if (!clickedGong || !clickedGong.gong?.name) {
    return lines
  }

  const clickedGongName = clickedGong.gong.name
  const clickedPos = getGongPosition(clickedGongIndex)
  if (!clickedPos) return lines

  // 获取该宫位的三方四正关系
  const relations = SANFANG_SIZHENG[clickedGongName]
  if (!relations) return lines

  // 计算三方连线
  if (relations.sanfang && Array.isArray(relations.sanfang)) {
    relations.sanfang.forEach(targetGongName => {
      const targetIndex = getGongIndexByName(targetGongName)
      if (targetIndex !== -1) {
        const targetPos = getGongPosition(targetIndex)
        if (targetPos) {
          lines.push({
            from: clickedPos,
            to: targetPos,
            type: 'sanfang',
            style: 'stroke: #2196f3; stroke-width: 3; stroke-dasharray: 8, 4;',
            fromGong: clickedGongName,
            toGong: targetGongName
          })
        }
      }
    })
  }

  // 计算四正连线
  if (relations.sizheng && Array.isArray(relations.sizheng)) {
    relations.sizheng.forEach(targetGongName => {
      const targetIndex = getGongIndexByName(targetGongName)
      if (targetIndex !== -1) {
        const targetPos = getGongPosition(targetIndex)
        if (targetPos) {
          lines.push({
            from: clickedPos,
            to: targetPos,
            type: 'sizheng',
            style: 'stroke: #ff9800; stroke-width: 2.5; stroke-dasharray: 6, 3;',
            fromGong: clickedGongName,
            toGong: targetGongName
          })
        }
      }
    })
  }

  return lines
}

// 生成SVG 连线路径
export function generateSvgLine(fromPos, toPos, gridSize = 100) {
  const fromX = fromPos.col * gridSize + gridSize / 2
  const fromY = fromPos.row * gridSize + gridSize / 2
  const toX = toPos.col * gridSize + gridSize / 2
  const toY = toPos.row * gridSize + gridSize / 2

  return {
    x1: fromX,
    y1: fromY,
    x2: toX,
    y2: toY
  }
}

// 获取宫位的特殊样式类
export function getGongSpecialClass(gong, mingzhuGongIndex) {
  const classes = []

  if (isMingGong(gong, mingzhuGongIndex)) {
    classes.push('ming-gong')
  }

  if (isShenGong(gong)) {
    classes.push('shen-gong')
  }

  // 根据宫位类型添加样式
  if (gong.gong?.name) {
    switch (gong.gong.name) {
      case '命宫':
        classes.push('gong-ming')
        break
      case '身宫':
        classes.push('gong-shen')
        break
      case '夫妻':
        classes.push('gong-fuqi')
        break
      case '子女':
        classes.push('gong-zinv')
        break
      case '财帛':
        classes.push('gong-caibo')
        break
      case '疾厄':
        classes.push('gong-jiei')
        break
      case '迁移':
        classes.push('gong-qianyi')
        break
      case '奴仆':
        classes.push('gong-nupu')
        break
      case '官禄':
        classes.push('gong-guanlu')
        break
      case '田宅':
        classes.push('gong-tianzhai')
        break
      case '福德':
        classes.push('gong-fude')
        break
      case '父母':
        classes.push('gong-fumu')
        break
    }
  }

  return classes.join(' ')
}

// 计算宫位的相对位置关系
export function calculateGongRelations(mingpan) {
  const relations = {}

  if (!mingpan || !mingpan.gongs) return relations

  // 这里可以添加更多宫位关系的计算逻辑
  // 例如：六亲关系、冲合关系等

  return relations
}

// 导出所有工具函数
export default {
  GONG_NAMES,
  GONG_POSITIONS,
  SANFANG_SIZHENG,
  getGongPosition,
  getGongGridStyle,
  getGongGridArea,
  getGongIndexByName,
  isMingGong,
  isShenGong,
  calculateSanfangSizhengLines,
  calculateDynamicConnections,
  generateSvgLine,
  getGongSpecialClass,
  calculateGongRelations
}
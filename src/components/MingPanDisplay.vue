<template>
  <div class="mingpan-display">
    <!-- 命盘标题 -->
    <div class="mingpan-header">
      <h2 class="mingpan-title">
        <el-icon><Star /></el-icon>
        紫微斗数命盘
      </h2>
      <div class="mingpan-info">
        <el-tag type="primary" size="large">{{ mingpan.mingzhu.name }}</el-tag>
        <el-tag type="success" size="large">{{ mingpan.mingzhu.yinyang.name }}{{ mingpan.mingzhu.gender.name }}</el-tag>
        <el-tag type="warning" size="large">{{ mingpan.mingzhu.wuxingju.name }}</el-tag>
        <div class="time-info">
          <span>{{ mingpan.mingzhu.nianGan.name }}{{ mingpan.mingzhu.nianZhi.name }}年</span>
          <span>{{ mingpan.mingzhu.yue.name }}{{ mingpan.mingzhu.ri.name }}日</span>
          <span>{{ mingpan.mingzhu.shi.name }}时</span>
        </div>
      </div>
    </div>

    <!-- 命盘网格容器 - 4x4网格布局 -->
    <div class="mingpan-grid">
      <!-- 三方四正连线层 -->
      <svg class="sanfang-sizheng-layer" :width="containerWidth" :height="containerHeight">
        <defs>
          <!-- 定义箭头标记 -->
          <marker
            id="arrowSanfang"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#2196f3" />
          </marker>
          <marker
            id="arrowSizheng"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="#ff9800" />
          </marker>
        </defs>

        <!-- 绘制所有连线（原有连线 + 动态连线） -->
        <g v-for="(line, index) in allConnections" :key="index">
          <line
            :x1="line.x1"
            :y1="line.y1"
            :x2="line.x2"
            :y2="line.y2"
            :stroke="line.type === 'sanfang' ? '#2196f3' : '#ff9800'"
            :stroke-width="line.type === 'sanfang' ? 2 : 1.5"
            :stroke-dasharray="line.type === 'sanfang' ? '5,5' : '3,3'"
            :marker-end="line.type === 'sanfang' ? 'url(#arrowSanfang)' : 'url(#arrowSizheng)'"
            :opacity="0.8"
            class="connection-line"
            :class="{ 'dynamic-connection': isDynamicConnection(line) }"
          />
        </g>

        <!-- 绘制对角线（财帛-官禄，夫妻-迁移） -->
        <g v-if="showDiagonalConnections">
          <line
            v-for="(line, index) in diagonalLines"
            :key="`diagonal-${index}`"
            :x1="line.x1"
            :y1="line.y1"
            :x2="line.x2"
            :y2="line.y2"
            stroke="#9c27b0"
            stroke-width="1"
            stroke-dasharray="2,2"
            opacity="0.4"
            class="diagonal-line"
          />
        </g>
      </svg>

      <!-- 十二宫位 - 按照4x4网格布局 -->
      <GongWei
        v-for="(gong, index) in mingpan.gongs"
        :key="gong.dizhi.name"
        :gong="gong"
        :index="index"
        :mingzhu-gong-index="mingzhuGongIndex"
        @gong-click="handleGongClick"
        :style="getGongStyleByDizhi(gong)"
        class="gongwei-grid-item"
      />

      <!-- 中央天盘信息组件 -->
      <TianPanInfo
        :mingpan="mingpan"
        class="tianpan-info-grid-item"
      />
    </div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <el-card>
        <template #header>
          <span><el-icon><Setting /></el-icon> 显示控制</span>
        </template>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-switch
              v-model="showConnections"
              active-text="三方四正连线"
              inactive-text="隐藏连线"
              @change="toggleConnections"
            />
          </el-col>
          <el-col :span="12">
            <el-switch
              v-model="showDiagonalConnections"
              active-text="对角关系线"
              inactive-text="隐藏对角线"
              @change="toggleDiagonal"
            />
          </el-col>
        </el-row>

        <el-divider />

        <el-row :gutter="16">
          <el-col :span="8">
            <el-button @click="resetView" size="small">
              <el-icon><RefreshLeft /></el-icon>
              重置视图
            </el-button>
          </el-col>
          <el-col :span="8">
            <el-button @click="handleReset" size="small" type="warning">
              <el-icon><RefreshRight /></el-icon>
              重新排盘
            </el-button>
          </el-col>
          <el-col :span="8">
            <el-button @click="handleExport" size="small" type="primary">
              <el-icon><Download /></el-icon>
              导出图片
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 宫位详情弹窗 -->
    <el-dialog
      v-model="showGongDetail"
      :title="`${selectedGong?.gong?.name}宫详情`"
      width="600px"
      destroy-on-close
    >
      <div v-if="selectedGong" class="gong-detail">
        <!-- 基本信息 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item label="宫位">{{ selectedGong.gong?.name }}</el-descriptions-item>
          <el-descriptions-item label="天干地支">
            {{ selectedGong.tiangan?.name }}{{ selectedGong.dizhi?.name }}
          </el-descriptions-item>
          <el-descriptions-item label="长生十二星">
            <el-tag :type="getChangshengTagType(selectedGong.changsheng12Star?.name)">
              {{ selectedGong.changsheng12Star?.name }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="大限">
            {{ selectedGong.daxianStart ? `${selectedGong.daxianStart}-${selectedGong.daxianStart + 9}` : '-' }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 星辰详情 -->
        <div class="stars-detail" v-if="hasAnyStars(selectedGong)">
          <h4>星辰详情</h4>

          <div v-if="selectedGong.jiaStars?.length" class="star-category">
            <h5>甲级星</h5>
            <div class="star-list">
              <el-tag v-for="star in selectedGong.jiaStars" :key="`jia-${star.element.value}`" type="warning">
                {{ star.element?.name }}
                <span v-if="star.light?.name">({{ star.light.name }})</span>
                <span v-if="star.hua?.name">-{{ star.hua.name }}</span>
              </el-tag>
            </div>
          </div>

          <div v-if="selectedGong.yiStars?.length" class="star-category">
            <h5>乙级星</h5>
            <div class="star-list">
              <el-tag v-for="star in selectedGong.yiStars" :key="`yi-${star.element.value}`" type="success">
                {{ star.element?.name }}
                <span v-if="star.light?.name">({{ star.light.name }})</span>
                <span v-if="star.hua?.name">-{{ star.hua.name }}</span>
              </el-tag>
            </div>
          </div>

          <div v-if="selectedGong.bingStars?.length" class="star-category">
            <h5>丙级星</h5>
            <div class="star-list">
              <el-tag v-for="star in selectedGong.bingStars" :key="`bing-${star.element.value}`">
                {{ star.element?.name }}
                <span v-if="star.light?.name">({{ star.light.name }})</span>
                <span v-if="star.hua?.name">-{{ star.hua.name }}</span>
              </el-tag>
            </div>
          </div>

          <div v-if="selectedGong.huaStars?.length" class="star-category">
            <h5>四化星</h5>
            <div class="star-list">
              <el-tag v-for="star in selectedGong.huaStars" :key="`hua-${star.value}`" type="danger">
                {{ star.name }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Star, Setting, RefreshLeft, RefreshRight, Download } from '@element-plus/icons-vue'
import GongWei from './GongWei.vue'
import TianPanInfo from './TianPanInfo.vue'
import {
  calculateSanfangSizhengLines,
  calculateDynamicConnections,
  generateSvgLine,
  getGongPosition,
  isMingGong
} from '../utils/mingpanLayout.js'

// 定义组件属性
const props = defineProps({
  mingpan: {
    type: Object,
    required: true
  }
})

// 定义组件事件
const emit = defineEmits(['reset'])

// 固定的地支 -> CSS Grid 映射表
const dizhiGridMap = {
  '寅': '4 / 1 / 5 / 2', // 必须在左下角
  '卯': '3 / 1 / 4 / 2', // 必须在左侧
  '辰': '2 / 1 / 3 / 2', // 必须在左侧
  '巳': '1 / 1 / 2 / 2', // 必须在左上角
  '午': '1 / 2 / 2 / 3', // 必须在顶部
  '未': '1 / 3 / 2 / 4', // 必须在顶部
  '申': '1 / 4 / 2 / 5', // 必须在右上角
  '酉': '2 / 4 / 3 / 5', // 必须在右侧
  '戌': '3 / 4 / 4 / 5', // 必须在右侧
  '亥': '4 / 4 / 5 / 5', // 必须在右下角
  '子': '4 / 3 / 5 / 4', // 必须在底部
  '丑': '4 / 2 / 5 / 3'  // 必须在底部
}

// 新的样式函数：按地支名称获取样式
const getGongStyleByDizhi = (gong) => {
  const dizhiName = gong.dizhi?.name
  const gridArea = dizhiGridMap[dizhiName] || '1 / 1 / 2 / 2' // 找不到就放到左上角
  return { gridArea: gridArea }
}

// 响应式数据
const showConnections = ref(true)
const showDiagonalConnections = ref(false)
const showGongDetail = ref(false)
const selectedGong = ref(null)
const clickedGongIndex = ref(-1)
const dynamicConnections = ref([])

// 容器尺寸
const gridSize = 150
const containerWidth = computed(() => gridSize * 4)
const containerHeight = computed(() => gridSize * 4)

// 计算命主宫位索引
const mingzhuGongIndex = computed(() => {
  if (!props.mingpan?.gongs) return -1

  // 寻找命宫
  for (let i = 0; i < props.mingpan.gongs.length; i++) {
    const gong = props.mingpan.gongs[i]
    if (gong.gong?.name === '命宫') {
      return i
    }
  }
  return -1
})

// 计算三方四正连线
const sanfangSizhengLines = computed(() => {
  if (!showConnections.value || !props.mingpan) return []

  const lines = []
  const mingpan = props.mingpan

  // 找到命宫位置
  let minggongIndex = -1
  let minggongPos = null

  for (let i = 0; i < mingpan.gongs.length; i++) {
    const gong = mingpan.gongs[i]
    if (gong.gong?.name === '命宫') {
      minggongIndex = i
      minggongPos = getGongPosition(i)
      break
    }
  }

  if (!minggongPos) return lines

  // 定义三方四正关系
  const relations = {
    sanfang: ['财帛', '官禄'],  // 三方
    sizheng: ['夫妻', '迁移']   // 四正
  }

  // 生成连线
  Object.entries(relations).forEach(([type, gongNames]) => {
    gongNames.forEach(gongName => {
      // 找到对应宫位
      let targetIndex = -1
      for (let i = 0; i < mingpan.gongs.length; i++) {
        if (mingpan.gongs[i].gong?.name === gongName) {
          targetIndex = i
          break
        }
      }

      if (targetIndex !== -1) {
        const targetPos = getGongPosition(targetIndex)
        if (targetPos) {
          const svgLine = generateSvgLine(minggongPos, targetPos, gridSize)
          lines.push({
            ...svgLine,
            type: type,
            fromGong: '命宫',
            toGong: gongName
          })
        }
      }
    })
  })

  return lines
})

// 计算对角连线
const diagonalLines = computed(() => {
  if (!showDiagonalConnections.value || !props.mingpan) return []

  const lines = []
  const mingpan = props.mingpan

  // 定义对角关系
  const diagonalRelations = [
    ['财帛', '官禄'],
    ['夫妻', '迁移']
  ]

  diagonalRelations.forEach(([gong1, gong2]) => {
    let pos1 = null, pos2 = null

    // 找到两个宫位的位置
    for (let i = 0; i < mingpan.gongs.length; i++) {
      const gong = mingpan.gongs[i]
      if (gong.gong?.name === gong1) {
        pos1 = getGongPosition(i)
      } else if (gong.gong?.name === gong2) {
        pos2 = getGongPosition(i)
      }
    }

    if (pos1 && pos2) {
      const svgLine = generateSvgLine(pos1, pos2, gridSize)
      lines.push(svgLine)
    }
  })

  return lines
})

// 计算所有连线（原有连线 + 动态连线）
const allConnections = computed(() => {
  const connections = []

  // 添加原有的命宫三方四正连线
  if (showConnections.value) {
    connections.push(...sanfangSizhengLines.value)
  }

  // 添加动态连线（如果有点击的宫位）
  if (dynamicConnections.value.length > 0) {
    connections.push(...dynamicConnections.value)
  }

  return connections
})

// 处理宫位点击
const handleGongClick = (gongInfo) => {
  // 后续可以在这里添加三方四正显示的逻辑
  console.log('宫位点击:', gongInfo.gong.name)

  // 更新动态连线（基于点击的宫位）
  updateDynamicConnections(gongInfo.index)
}

// 判断是否为动态连线
const isDynamicConnection = (line) => {
  if (!line.fromGong || !line.toGong) return false
  return dynamicConnections.value.some(dc =>
    dc.fromGong === line.fromGong && dc.toGong === line.toGong
  )
}

// 更新动态三方四正连线
const updateDynamicConnections = (gongIndex) => {
  console.log('更新动态连线，点击宫位索引:', gongIndex)

  if (gongIndex >= 0 && gongIndex < props.mingpan.gongs.length) {
    clickedGongIndex.value = gongIndex
    dynamicConnections.value = calculateDynamicConnections(props.mingpan, gongIndex)
  } else {
    clickedGongIndex.value = -1
    dynamicConnections.value = []
  }
}

// 切换连线显示
const toggleConnections = (show) => {
  console.log('三方四正连线显示:', show)
}

// 切换对角线显示
const toggleDiagonal = (show) => {
  console.log('对角线显示:', show)
}

// 重置视图
const resetView = () => {
  showConnections.value = true
  showDiagonalConnections.value = false
  showGongDetail.value = false
  selectedGong.value = null
  clickedGongIndex.value = -1
  dynamicConnections.value = []
}

// 重置命盘
const handleReset = () => {
  emit('reset')
}

// 导出命盘
const handleExport = () => {
  // 这里可以使用 html2canvas 等库实现真正的图片导出
  console.log('导出命盘图片')
  // 暂时显示提示
  ElMessage.info('导出功能开发中，敬请期待！')
}

// 检查宫位是否有星辰
const hasAnyStars = (gong) => {
  return (gong.jiaStars?.length > 0) ||
         (gong.yiStars?.length > 0) ||
         (gong.bingStars?.length > 0) ||
         (gong.huaStars?.length > 0)
}

// 获取长生标签类型
const getChangshengTagType = (name) => {
  const typeMap = {
    '长生': 'success',
    '沐浴': 'info',
    '冠带': 'warning',
    '临官': 'primary',
    '帝旺': 'danger',
    '衰': 'info',
    '病': 'warning',
    '死': 'danger',
    '墓': 'info',
    '绝': 'danger',
    '胎': 'success',
    '养': 'primary'
  }
  return typeMap[name] || 'info'
}

// 组件挂载
onMounted(() => {
  console.log('命盘显示组件已挂载')
  console.log('命盘数据:', props.mingpan)
})
</script>

<style scoped>
.mingpan-display {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.mingpan-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.mingpan-title {
  margin: 0 0 16px 0;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.mingpan-title .el-icon {
  font-size: 2.5rem;
}

.mingpan-info {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.time-info {
  display: flex;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  margin-top: 8px;
  width: 100%;
  justify-content: center;
}

.mingpan-grid {
  position: relative;
  margin: 0 auto 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 800px;
  aspect-ratio: 1;
}

.sanfang-sizheng-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.connection-line {
  transition: opacity 0.3s ease;
}

.connection-line:hover {
  opacity: 1 !important;
  stroke-width: 3px !important;
}

.dynamic-connection {
  animation: pulse-connection 2s ease-in-out infinite;
  filter: drop-shadow(0 0 3px rgba(33, 150, 243, 0.6));
}

@keyframes pulse-connection {
  0%, 100% {
    opacity: 0.6;
    stroke-width: 2;
  }
  50% {
    opacity: 1;
    stroke-width: 4;
  }
}

.diagonal-line {
  transition: opacity 0.3s ease;
}

.control-panel {
  max-width: 600px;
  margin: 0 auto;
}

.control-panel .el-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.control-panel .el-divider {
  margin: 16px 0;
}

.gong-detail {
  padding: 16px 0;
}

.gong-detail .el-descriptions {
  margin-bottom: 24px;
}

.stars-detail h4 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 16px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
}

.star-category {
  margin-bottom: 20px;
}

.star-category h5 {
  margin: 0 0 8px 0;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
}

.star-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.star-list .el-tag {
  margin: 0;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mingpan-display {
    padding: 10px;
  }

  .mingpan-header {
    padding: 16px;
    margin-bottom: 20px;
  }

  .mingpan-title {
    font-size: 1.5rem;
  }

  .mingpan-title .el-icon {
    font-size: 2rem;
  }

  .mingpan-info {
    gap: 8px;
  }

  .mingpan-grid {
    padding: 10px;
    gap: 4px;
    max-width: 600px;
  }

  .control-panel {
    max-width: 100%;
  }

  .time-info {
    font-size: 12px;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mingpan-display {
  animation: fadeIn 0.6s ease-out;
}

/* 网格背景效果 */
.mingpan-grid {
  background-image:
    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

/* 悬浮效果 */
.mingpan-grid:hover {
  box-shadow: 0 20px 40px rgba(50, 50, 93, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* 宫位网格项样式 */
.gongwei-grid-item {
  /* 位置已通过内联样式设置 */
}

/* 天盘信息网格项样式 */
.tianpan-info-grid-item {
  grid-column: 2 / 4;
  grid-row: 2 / 4;
  z-index: 2;
}

/* SVG连线动画效果 */
.connection-line {
  animation: drawLine 1s ease-in-out;
}

@keyframes drawLine {
  from {
    stroke-dashoffset: 100;
  }
  to {
    stroke-dashoffset: 0;
  }
}

/* 控制面板样式优化 */
.control-panel :deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
}

.control-panel :deep(.el-switch__label) {
  font-weight: 500;
}

/* 按钮组样式 */
.control-panel .el-row .el-col {
  display: flex;
  justify-content: center;
}

.control-panel .el-button {
  width: 100%;
  font-weight: 500;
}
</style>
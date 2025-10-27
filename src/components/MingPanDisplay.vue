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
  
      <!-- 十二宫位 - 按照4x4网格布局 -->
      <GongWei
        v-for="(gong, index) in mingpan.gongs"
        :key="gong.dizhi.name"
        :gong="gong"
        :index="index"
        :mingzhu-gong-index="mingzhuGongIndex"
        :highlight-type="getGongHighlightType(index)"
        @gong-click="handleGongClick"
        @gong-hover="handleGongHover"
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
  getGongPosition,
  getGongIndexByName
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
const showGongDetail = ref(false)
const selectedGong = ref(null)

// 三方四正高亮相关
const hoveredGongIndex = ref(-1)
const highlightedGongs = ref(new Set())

// 容器尺寸
const gridSize = 150
const containerWidth = computed(() => gridSize * 4)
const containerHeight = computed(() => gridSize * 4)


// 使用后端提供的三方四正映射数据
const sanfangSizhengMap = computed(() => {
  if (!props.mingpan?.sanfangSizhengMap) return {}
  return props.mingpan.sanfangSizhengMap
})

// 简化的计算函数，直接使用后端数据
const calculateHighlightedGongs = (gongIndex) => {
  const relations = sanfangSizhengMap.value[gongIndex.toString()]
  if (relations && relations.sizheng) {
    return new Set(relations.sizheng)
  }
  return new Set([gongIndex]) // 默认只包含自身
}

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



// 处理宫位悬停
const handleGongHover = (gongIndex, isHovering) => {
  if (isHovering) {
    hoveredGongIndex.value = gongIndex
    highlightedGongs.value = calculateHighlightedGongs(gongIndex)
  } else {
    hoveredGongIndex.value = -1
    highlightedGongs.value.clear()
  }
}

// 处理宫位点击
const handleGongClick = (gongInfo) => {
  console.log('宫位点击:', gongInfo.gong.name)
  // 点击功能已移除，现在只记录日志
}

// 获取宫位的高亮类型
const getGongHighlightType = (gongIndex) => {
  if (hoveredGongIndex.value === gongIndex) return 'hovered'
  if (highlightedGongs.value.has(gongIndex)) return 'related'
  return null
}

// 重置视图
const resetView = () => {
  showGongDetail.value = false
  selectedGong.value = null
  hoveredGongIndex.value = -1
  highlightedGongs.value.clear()
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
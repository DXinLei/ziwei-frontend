<template>
  <div
    :class="gongClass"
    @click="handleGongClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @keydown.enter="handleKeyDown"
    :tabindex="isInteractive ? 0 : -1"
    :aria-label="`${gongName}宫，${totalStars}个星辰`"
    :title="gongTooltip"
  >
    <!-- 高亮指示器 -->
    <div v-if="highlightType" class="highlight-indicator" :class="`highlight-indicator-${highlightType}`">
      <span v-if="highlightType === 'hovered'" class="indicator-symbol">◉</span>
      <span v-else-if="highlightType === 'related'" class="indicator-symbol">◈</span>
    </div>

    <!-- 宫位头部信息 -->
    <div class="gongwei-header">
      <div class="gongwei-title">
        <span class="gongwei-name">{{ gongName }}</span>
        <span v-if="gong.shen" class="shen-badge">身</span>
        <span v-if="dayunText" class="dayun-badge">运</span>
      </div>
      <div class="gongwei-ganzhi">{{ tianganText }}{{ dizhiText }}</div>
      <div v-if="nayinText" class="gongwei-nayin">{{ nayinText }}</div>
    </div>

    <!-- 星辰信息区域 -->
    <div class="gongwei-stars-container">
      <!-- 左列：甲级星和四化星 -->
      <div class="stars-left-column">
        <!-- 甲级星 -->
        <div v-if="hasJiaStars" class="stars-group jia-stars">
          <div class="stars-list">
            <StarDisplay
              v-for="star in gong.jiaStars"
              :key="`jia-${star.element.value}`"
              :star="star"
              level="jia"
            />
          </div>
        </div>

        <!-- 四化星 -->
        <div v-if="hasHuaStars" class="stars-group hua-stars">
          <div class="stars-label">四化</div>
          <div class="stars-list">
            <StarDisplay
              v-for="star in gong.huaStars"
              :key="`hua-${star.value}`"
              :star="{ element: star, level: 'hua' }"
              level="hua"
            />
          </div>
        </div>
      </div>

      <!-- 右列：乙级星和丙级星 -->
      <div class="stars-right-column">
        <!-- 乙级星 -->
        <div v-if="hasYiStars" class="stars-group yi-stars">
          <div class="stars-list">
            <StarDisplay
              v-for="star in gong.yiStars"
              :key="`yi-${star.element.value}`"
              :star="star"
              level="yi"
            />
          </div>
        </div>

        <!-- 丙级星 -->
        <div v-if="hasBingStars" class="stars-group bing-stars">
          <div class="stars-list">
            <StarDisplay
              v-for="star in gong.bingStars"
              :key="`bing-${star.element.value}`"
              :star="star"
              level="bing"
            />
          </div>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div v-if="!hasAnyStars" class="empty-stars">
        <el-icon><Star /></el-icon>
        <span>暂无星辰</span>
      </div>
    </div>

    <!-- 底部三区域信息 -->
    <div class="gongwei-bottom-section">
      <!-- 左下角：博士12星和建前12星 -->
      <div class="bottom-left">
        <!-- 博士12星 (绿色) -->
        <div v-if="boshi12Star" class="boshi-stars-bottom">
          <span class="star-text boshi-text">{{ boshi12Star }}</span>
        </div>
        <!-- 建前12星 (黑色) -->
        <div v-if="jianqian12Star" class="jianqian-stars-bottom">
          <span class="star-text jianqian-text">{{ jianqian12Star }}</span>
        </div>
      </div>

      <!-- 底部中间：大限和小限信息 -->
      <div class="bottom-center">
        <div v-if="daxianText || xiaoxianText" class="daxian-xiaoxian-container">
          <div v-if="daxianText" class="daxian-simple">
            <span class="daxian-text">{{ daxianText }}</span>
          </div>
          <div v-if="xiaoxianText" class="xiaoxian-simple">
            <span class="xiaoxian-text">{{ xiaoxianText }}</span>
          </div>
        </div>
      </div>

      <!-- 右下角：长生12星 -->
      <div class="bottom-right">
        <div v-if="changshengName" class="changsheng-simple">
          <span class="changsheng-text" :class="changshengClass">{{ changshengName }}</span>
        </div>
      </div>
    </div>

    <!-- 大运信息 (保留在神煞之前) -->
    <div v-if="dayunText" class="dayun-section">
      <span class="dayun-text">{{ dayunText }}</span>
    </div>

    <!-- 神煞信息 -->
    <div v-if="shenshaList.length > 0" class="shensha-section">
      <div class="shensha-label">神煞:</div>
      <div class="shensha-list">
        <span v-for="sha in shenshaList" :key="sha" class="shensha-item">{{ sha }}</span>
      </div>
    </div>

    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Star } from '@element-plus/icons-vue'
import StarDisplay from './StarDisplay.vue'
import {
  getGongSpecialClass,
  isMingGong,
  isShenGong
} from '../utils/mingpanLayout.js'

// 定义组件属性
const props = defineProps({
  gong: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  mingzhuGongIndex: {
    type: Number,
    default: -1
  },
  isInteractive: {
    type: Boolean,
    default: true
  },
  highlightType: {
    type: String,
    default: null,
    validator: (value) => ['clicked', 'hovered', 'related', null].includes(value)
  }
})

// 定义组件事件
const emit = defineEmits(['gong-click', 'gong-hover'])

// 计算宫位名称
const gongName = computed(() => {
  return props.gong.gong?.name || ''
})

// 计算干支
const ganzhi = computed(() => {
  const tiangan = props.gong.tiangan?.name || ''
  const dizhi = props.gong.dizhi?.name || ''
  return tiangan + dizhi
})

// 计算长生十二星名称
const changshengName = computed(() => {
  return props.gong.changsheng12Star?.name || ''
})

// 计算长生样式类
const changshengClass = computed(() => {
  const name = changshengName.value
  const classMap = {
    '长生': 'changsheng-sheng',
    '沐浴': 'changsheng-muyu',
    '冠带': 'changsheng-guandai',
    '临官': 'changsheng-linguan',
    '帝旺': 'changsheng-diwang',
    '衰': 'changsheng-shuai',
    '病': 'changsheng-bing',
    '死': 'changsheng-si',
    '墓': 'changsheng-mu',
    '绝': 'changsheng-jue',
    '胎': 'changsheng-tai',
    '养': 'changsheng-yang'
  }
  return classMap[name] || ''
})

// 计算大限文本
const daxianText = computed(() => {
  if (props.gong.daxianStart !== undefined) {
    return `${props.gong.daxianStart}-${props.gong.daxianStart + 9}`
  }
  return ''
})

// 计算小限文本
const xiaoxianText = computed(() => {
  if (props.gong.xiaoxian !== undefined) {
    // 生成完整的小限序列：xiaoxian, xiaoxian+12, xiaoxian+24, xiaoxian+36, xiaoxian+48, xiaoxian+60
    const baseXiaoxian = props.gong.xiaoxian
    const xiaoxianSequence = []
    for (let i = 0; i < 6; i++) {
      xiaoxianSequence.push(baseXiaoxian + (i * 12))
    }
    return xiaoxianSequence.join(',')
  }
  return ''
})

// 计算宫位大运信息
const dayunText = computed(() => {
  if (props.gong.dayunStart !== undefined && props.gong.dayunEnd !== undefined) {
    return `${props.gong.dayunStart}-${props.gong.dayunEnd}`
  }
  return ''
})

// 计算宫位天干
const tianganText = computed(() => {
  return props.gong.tiangan?.name || ''
})

// 计算宫位地支
const dizhiText = computed(() => {
  return props.gong.dizhi?.name || ''
})

// 计算宫位纳音
const nayinText = computed(() => {
  return props.gong.nayin?.name || ''
})

// 计算宫位神煞
const shenshaList = computed(() => {
  const shensha = []
  if (props.gong.shensha && Array.isArray(props.gong.shensha)) {
    props.gong.shensha.forEach(sha => {
      if (sha.name) {
        shensha.push(sha.name)
      }
    })
  }
  return shensha
})

// 计算博士12星
const boshi12Star = computed(() => {
  return props.gong.boshi12Star?.name || ''
})

// 计算建前12星
const jianqian12Star = computed(() => {
  return props.gong.jianqian12Star?.name || ''
})

// 计算是否有甲级星
const hasJiaStars = computed(() => {
  return props.gong.jiaStars && props.gong.jiaStars.length > 0
})

// 计算是否有乙级星
const hasYiStars = computed(() => {
  return props.gong.yiStars && props.gong.yiStars.length > 0
})

// 计算是否有丙级星
const hasBingStars = computed(() => {
  return props.gong.bingStars && props.gong.bingStars.length > 0
})

// 计算是否有四化星
const hasHuaStars = computed(() => {
  return props.gong.huaStars && props.gong.huaStars.length > 0
})

// 计算是否有任何星辰
const hasAnyStars = computed(() => {
  return hasJiaStars.value || hasYiStars.value || hasBingStars.value || hasHuaStars.value
})

// 计算星辰总数
const totalStars = computed(() => {
  let count = 0
  if (hasJiaStars.value) count += props.gong.jiaStars.length
  if (hasYiStars.value) count += props.gong.yiStars.length
  if (hasBingStars.value) count += props.gong.bingStars.length
  if (hasHuaStars.value) count += props.gong.huaStars.length
  return count
})

// 计算宫位样式类
const gongClass = computed(() => {
  const classes = ['gongwei']

  // 添加基础样式类
  classes.push('gongwei-normal')

  // 添加特殊宫位样式
  classes.push(getGongSpecialClass(props.gong, props.mingzhuGongIndex))

  // 添加有星辰的样式
  if (hasAnyStars.value) {
    classes.push('gongwei-has-stars')
  }

  // 添加身宫样式
  if (isShenGong(props.gong)) {
    classes.push('gongwei-shengong')
  }

  // 添加高亮样式
  if (props.highlightType) {
    classes.push(`gongwei-highlight-${props.highlightType}`)
  }

  return classes
})

// 计算宫位提示信息
const gongTooltip = computed(() => {
  let tooltip = `${gongName.value}宫`

  if (tianganText.value || dizhiText.value) {
    tooltip += ` (${tianganText.value}${dizhiText.value})`
  }

  if (nayinText.value) {
    tooltip += ` ${nayinText.value}`
  }

  if (boshi12Star.value) {
    tooltip += ` 博士:${boshi12Star.value}`
  }

  if (jianqian12Star.value) {
    tooltip += ` 建前:${jianqian12Star.value}`
  }

  if (changshengName.value) {
    tooltip += ` 长生:${changshengName.value}`
  }

  return tooltip
})

// 宫位位置样式现在由父组件通过内联样式设置，这里移除计算逻辑


// 处理鼠标进入
const handleMouseEnter = () => {
  if (props.isInteractive) {
    emit('gong-hover', props.index, true)
  }
}

// 处理鼠标离开
const handleMouseLeave = () => {
  if (props.isInteractive) {
    emit('gong-hover', props.index, false)
  }
}

// 处理键盘事件
const handleKeyDown = (event) => {
  if (event.key === 'Enter' && props.isInteractive) {
    event.preventDefault()
    handleGongClick()
  }
}

// 处理宫位点击
const handleGongClick = () => {
  if (props.isInteractive) {
    emit('gong-click', {
      gong: props.gong,
      index: props.index,
      gongName: gongName.value
    })
  }
}
</script>

<style scoped>
.gongwei {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 8px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 120px;
  overflow: hidden;
}

.gongwei:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  z-index: 10;
  transform: translateY(-2px);
}

.gongwei.ming-gong {
  background: linear-gradient(135deg, #ffebee, #fff3e0);
  border-color: #d32f2f;
}

.gongwei.shen-gong {
  background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
  border-color: #1976d2;
}

.gongwei-has-stars {
  border-color: #28a745;
}

.gongwei-shengong {
  border-color: #ff9800 !important;
}

/* 宫位头部 */
.gongwei-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
  padding-bottom: 4px;
  border-bottom: 1px solid #eee;
}

.gongwei-title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.gongwei-name {
  font-weight: 700;
  color: #2c3e50;
  font-size: 13px;
}

.shen-badge {
  background: #ff9800;
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: bold;
}

.gongwei-ganzhi {
  color: #666;
  font-size: 11px;
  font-weight: 500;
}

.gongwei-nayin {
  color: #888;
  font-size: 10px;
  font-weight: 400;
  margin-top: 2px;
}

.dayun-badge {
  background: #9c27b0;
  color: white;
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 3px;
  font-weight: bold;
  margin-left: 2px;
}

/* 星辰容器 */
.gongwei-stars-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 4px;
  min-height: 60px;
}

/* 左列：甲级星和四化星 */
.stars-left-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

/* 右列：乙级星和丙级星 */
.stars-right-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  align-items: flex-end;
}

.stars-group {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.stars-label {
  font-size: 9px;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.stars-list {
  display: flex;
  flex-direction: row;
  gap: 2px;
  align-items: flex-start;
  flex-wrap: wrap;
}

/* 右列星辰列表特殊样式 */
.stars-right-column .stars-list {
  justify-content: flex-end;
}

.empty-stars {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  font-size: 11px;
  gap: 4px;
  flex: 1;
}

/* 底部三区域布局 */
.gongwei-bottom-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid #eee;
  min-height: 40px;
}

.bottom-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.bottom-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

/* 博士12星样式 (绿色，12px) */
.boshi-stars-bottom {
  display: flex;
  align-items: center;
}

.boshi-text {
  color: #28a745;
  font-size: 9px;
  font-weight: 600;
  line-height: 1.2;
}

/* 建前12星样式 (黑色，12px) */
.jianqian-stars-bottom {
  display: flex;
  align-items: center;
}

.jianqian-text {
  color: #2c3e50;
  font-size: 9px;
  font-weight: 600;
  line-height: 1.2;
}

/* 大限和小限容器样式 */
.daxian-xiaoxian-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

/* 大限信息样式 (底部中间，10px) */
.daxian-simple {
  display: flex;
  align-items: center;
}

.daxian-text {
  color: #007bff;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.2;
}

/* 小限信息样式 (大限下方，10px) */
.xiaoxian-simple {
  display: flex;
  align-items: center;
}

.xiaoxian-text {
  color: #007bff;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.2;
}

/* 长生12星样式 (右下角，10px) */
.changsheng-simple {
  display: flex;
  align-items: center;
}

.changsheng-text {
  font-size: 10px;
  font-weight: 500;
  line-height: 1.2;
}

/* 长生颜色样式 */
.changsheng-sheng { color: #28a745; }
.changsheng-muyu { color: #17a2b8; }
.changsheng-guandai { color: #ffc107; }
.changsheng-linguan { color: #fd7e14; }
.changsheng-diwang { color: #dc3545; }
.changsheng-shuai { color: #6c757d; }
.changsheng-bing { color: #6f42c1; }
.changsheng-si { color: #343a40; }
.changsheng-mu { color: #495057; }
.changsheng-jue { color: #6610f2; }
.changsheng-tai { color: #20c997; }
.changsheng-yang { color: #0d6efd; }

/* 大运信息样式 */
.dayun-section {
  margin-top: 2px;
  padding-top: 2px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

.dayun-section .dayun-text {
  color: #9c27b0;
  font-size: 10px;
  font-weight: 500;
}


/* 响应式设计 */
@media (max-width: 768px) {
  .gongwei {
    padding: 6px;
    font-size: 11px;
    min-height: 100px;
  }

  .gongwei-name {
    font-size: 12px;
  }

  .gongwei-ganzhi {
    font-size: 10px;
  }

  .stars-label {
    font-size: 8px;
  }

  .gongwei-footer {
    font-size: 9px;
  }

  .empty-stars {
    font-size: 10px;
  }
}

/* 动画效果 */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.gongwei.ming-gong {
  animation: pulse 3s ease-in-out infinite;
}

/* 特殊宫位样式 */
.gongwei .gong-ming { background: rgba(211, 47, 47, 0.1); }
.gongwei .gong-shen { background: rgba(25, 118, 210, 0.1); }
.gongwei .gong-fuqi { background: rgba(233, 30, 99, 0.1); }
.gongwei .gong-zinv { background: rgba(0, 123, 255, 0.1); }
.gongwei .gong-caibo { background: rgba(40, 167, 69, 0.1); }
.gongwei .gong-jiei { background: rgba(220, 53, 69, 0.1); }
.gongwei .gong-qianyi { background: rgba(255, 193, 7, 0.1); }
.gongwei .gong-guanlu { background: rgba(111, 66, 193, 0.1); }
.gongwei .gong-tianzhai { background: rgba(25, 135, 84, 0.1); }
.gongwei .gong-fude { background: rgba(13, 110, 253, 0.1); }
.gongwei .gong-fumu { background: rgba(108, 117, 125, 0.1); }

/* 交互增强样式 */
.gongwei:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
  z-index: 20;
}

.gongwei:hover:not(:focus) {
  outline: 1px solid #667eea;
  outline-offset: 1px;
}

/* 高亮状态 */
.gongwei.highlighted {
  background: linear-gradient(135deg, #fff3cd, #ffeaa7) !important;
  border-color: #ffc107 !important;
  box-shadow: 0 6px 20px rgba(255, 193, 7, 0.3) !important;
  transform: scale(1.02);
  z-index: 15;
}

/* 选中状态 */
.gongwei.selected {
  background: linear-gradient(135deg, #d4edda, #c3e6cb) !important;
  border-color: #28a745 !important;
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3) !important;
  transform: scale(1.02);
  z-index: 15;
}

/* 禁用状态 */
.gongwei.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* 加载状态 */
.gongwei.loading {
  position: relative;
  overflow: hidden;
}

.gongwei.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* 键盘导航提示 */
.gongwei:focus .keyboard-hint {
  display: block;
  position: absolute;
  top: -25px;
  right: 5px;
  background: #667eea;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  z-index: 30;
}

.keyboard-hint {
  display: none;
}

/* 神煞样式 */
.shensha-section {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid #f0f0f0;
}

.shensha-label {
  font-size: 9px;
  color: #999;
  margin-bottom: 2px;
}

.shensha-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.shensha-item {
  background: #f5f5f5;
  color: #666;
  font-size: 8px;
  padding: 1px 3px;
  border-radius: 2px;
  border: 1px solid #e0e0e0;
}



/* 连接线动画 */
.gongwei.connected::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #ff9800;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse-dot 1.5s ease-in-out infinite;
  z-index: 5;
}

@keyframes pulse-dot {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.5;
  }
}

/* 高亮指示器 */
.highlight-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  animation: indicator-bounce 2s ease-in-out infinite;
}


.highlight-indicator-hovered {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.6);
}

.highlight-indicator-related {
  background: linear-gradient(135deg, #52c41a, #73d13d);
  box-shadow: 0 2px 8px rgba(82, 196, 26, 0.6);
}

.indicator-symbol {
  font-size: 14px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

@keyframes indicator-bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* 三方四正高亮样式 */
.gongwei-highlight-hovered {
  border: 3px solid #1890ff !important;
  box-shadow: 0 0 18px rgba(24, 144, 255, 0.7) !important;
  background-color: rgba(24, 144, 255, 0.15) !important;
  transform: scale(1.03);
  z-index: 8;
  position: relative;
}

.gongwei-highlight-hovered::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border: 1px solid #1890ff;
  border-radius: 5px;
  z-index: -1;
}

.gongwei-highlight-related {
  border: 3px solid #52c41a !important;
  box-shadow: 0 0 15px rgba(82, 196, 26, 0.6) !important;
  background-color: rgba(82, 196, 26, 0.12) !important;
  transform: scale(1.02);
  z-index: 6;
  position: relative;
}

.gongwei-highlight-related::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border: 1px solid #52c41a;
  border-radius: 5px;
  z-index: -1;
}

/* 平滑过渡效果 */
.gongwei {
  transition: all 0.3s ease;
  position: relative;
}

.gongwei-highlight-clicked,
.gongwei-highlight-hovered,
.gongwei-highlight-related {
  transition: all 0.2s ease;
}

/* 脉冲动画效果 */
.gongwei-highlight-clicked {
  animation: pulse-clicked 2s ease-in-out infinite;
}

.gongwei-highlight-hovered {
  animation: pulse-hovered 1.5s ease-in-out infinite;
}

.gongwei-highlight-related {
  animation: pulse-related 1.8s ease-in-out infinite;
}

@keyframes pulse-hovered {
  0%, 100% {
    box-shadow: 0 0 18px rgba(24, 144, 255, 0.7);
  }
  50% {
    box-shadow: 0 0 25px rgba(24, 144, 255, 0.9);
  }
}

@keyframes pulse-related {
  0%, 100% {
    box-shadow: 0 0 15px rgba(82, 196, 26, 0.6);
  }
  50% {
    box-shadow: 0 0 22px rgba(82, 196, 26, 0.8);
  }
}
</style>
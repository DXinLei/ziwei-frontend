<template>
  <span :class="starClass" :title="starTitle">
    <div class="star-content-vertical">
      <span class="star-name-vertical">{{ starName }}</span>
      <span v-if="lightName" class="star-light-box">{{ lightName }}</span>
      <span v-if="huaName" class="star-hua-box">{{ huaName }}</span>
    </div>
  </span>
</template>

<script setup>
import { computed } from 'vue'

// 定义组件属性
const props = defineProps({
  star: {
    type: Object,
    required: true
  },
  level: {
    type: String,
    required: true,
    validator: (value) => ['jia', 'yi', 'bing', 'hua'].includes(value)
  }
})

// 计算星辰名称
const starName = computed(() => {
  return props.star.element?.name || ''
})

// 计算亮度名称
const lightName = computed(() => {
  return props.star.light?.name || ''
})

// 计算化星名称（简化显示：化禄→禄，化权→权，化科→科，化忌→忌）
const huaName = computed(() => {
  let huaFullName = ''
  if (props.level === 'hua') {
    huaFullName = props.star.element?.name || ''
  } else {
    huaFullName = props.star.hua?.name || ''
  }

  // 简化显示：去除"化"字，只显示最后一个字
  if (huaFullName && huaFullName.length > 0) {
    return huaFullName.slice(-1) // 取最后一个字符
  }
  return ''
})

// 计算星辰标题（用于 tooltip）
const starTitle = computed(() => {
  const parts = [starName.value]
  if (lightName.value) parts.push(`亮度: ${lightName.value}`)
  if (huaName.value) parts.push(`四化: ${huaName.value}`)
  if (props.star.element?.value !== undefined) parts.push(`编号: ${props.star.element.value}`)
  return parts.join(' | ')
})

// 计算星辰样式类
const starClass = computed(() => {
  const classes = [`star-${props.level}`]

  // 添加基础样式
  classes.push('star-item')

  // 添加亮度样式
  if (lightName.value) {
    const lightMap = {
      '庙': 'light-miao',
      '旺': 'light-wang',
      '得地': 'light-dedi',
      '利益': 'light-liyi',
      '平和': 'light-pinghe',
      '不得地': 'light-budedi',
      '陷': 'light-xian'
    }
    classes.push(lightMap[lightName.value] || '')
  }

  // 添加四化样式
  if (huaName.value) {
    const huaMap = {
      '化禄': 'hua-lu',
      '化权': 'hua-quan',
      '化科': 'hua-ke',
      '化忌': 'hua-ji'
    }
    classes.push(huaMap[huaName.value] || '')
  }

  // 甲级星统一颜色，不添加个性化样式
  // 所有甲级星使用相同的样式类：star-jia

  return classes.join(' ')
})
</script>

<style scoped>
.star-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 2px 1px;
  margin: 0.5px;
  font-size: 9px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
  cursor: default;
  position: relative;
  min-width: 12px;
  text-align: center;
}

.star-item:hover {
  transform: scale(1.1);
  z-index: 10;
}

.star-name {
  font-weight: 600;
}

.star-light {
  margin-left: 1px;
  font-size: 7px;
  opacity: 0.8;
}

.star-hua {
  margin-left: 1px;
  font-weight: bold;
  font-size: 8px;
  text-shadow: 0 0 2px currentColor;
}


/* 垂直文字排列样式 */
.star-content-vertical {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  line-height: 1;
}

.star-name-vertical {
  font-weight: 600;
  font-size: 9px;
  writing-mode: vertical-rl;
  text-orientation: upright;
  line-height: 1;
}

/* 亮度状态方框样式 - 纵排显示 */
.star-light-box {
  font-size: 7px;
  font-weight: 600;
  padding: 1px 2px;
  margin: 1px;
  border: 1px solid #ccc;
  border-radius: 2px;
  background: #f9f9f9;
  color: #333;
  line-height: 1;
  text-align: center;
  min-width: 12px;
  writing-mode: vertical-rl; /* 纵排显示 */
  text-orientation: upright;
}

/* 四化星方框样式 - 纵排显示 */
.star-hua-box {
  font-size: 7px;
  font-weight: 700;
  padding: 1px 2px;
  margin: 1px;
  border: 1px solid;
  border-radius: 2px;
  line-height: 1;
  text-align: center;
  min-width: 12px;
  writing-mode: vertical-rl; /* 纵排显示，与亮度标识一致 */
  text-orientation: upright;
}

/* 甲级星样式 - 主要星耀，统一红色 */
.star-jia {
  background: transparent;
  color: #d32f2f; /* 统一红色，突出甲级星重要性 */
  font-weight: 700;
  font-size: 10px;
}

.star-jia:hover {
  color: #b71c1c; /* 悬停时更深红色 */
}

/* 乙级星样式 - 辅助星耀，中色调 */
.star-yi {
  background: transparent;
  color: #546e7a;
  font-weight: 600;
  font-size: 9px;
}

.star-yi:hover {
  color: #37474f;
}

/* 丙级星样式 - 杂耀星，浅色调 */
.star-bing {
  background: transparent;
  color: #78909c;
  font-weight: 500;
  font-size: 8px;
}

.star-bing:hover {
  color: #546e7a;
}

/* 四化星样式 - 特殊标记色 */
.star-hua {
  background: transparent;
  font-weight: 700;
}

/* 亮度状态方框颜色 - 参考ziwei.pub专业标准 */
.light-miao .star-light-box {
  background: #ffebee;
  border-color: #d32f2f;
  color: #d32f2f; /* 庙：最佳状态，红色 */
}

.light-wang .star-light-box {
  background: #fff3e0;
  border-color: #f57c00;
  color: #f57c00; /* 旺：优秀状态，橙色 */
}

.light-dedi .star-light-box {
  background: #e8f5e8;
  border-color: #388e3c;
  color: #388e3c; /* 得地：良好状态，绿色 */
}

.light-liyi .star-light-box {
  background: #e3f2fd;
  border-color: #1976d2;
  color: #1976d2; /* 利益：较好状态，蓝色 */
}

.light-pinghe .star-light-box {
  background: #fafafa;
  border-color: #757575;
  color: #616161; /* 平和：普通状态，灰色 */
}

.light-budedi .star-light-box {
  background: #fff8e1;
  border-color: #f9a825;
  color: #f9a825; /* 不得地：较差状态，深黄色 */
}

.light-xian .star-light-box {
  background: #f5f5f5;
  border-color: #9e9e9e;
  color: #757575; /* 陷：最差状态，浅灰色 */
  opacity: 0.8;
}

/* 四化星方框颜色 - 参考ziwei.pub专业标准 */
.hua-lu .star-hua-box {
  background: #ffebee;
  border-color: #d32f2f;
  color: #d32f2f; /* 禄：红色 */
}

.hua-quan .star-hua-box {
  background: #e3f2fd;
  border-color: #1976d2;
  color: #1976d2; /* 权：蓝色 */
}

.hua-ke .star-hua-box {
  background: #e8f5e8;
  border-color: #388e3c;
  color: #388e3c; /* 科：绿色 */
}

.hua-ji .star-hua-box {
  background: #f5f5f5;
  border-color: #424242;
  color: #212121; /* 忌：黑色 */
}

/* 特殊星辰样式已移除 - 所有甲级星现在使用统一的star-jia样式 */

/* 响应式设计 */
@media (max-width: 768px) {
  .star-item {
    font-size: 10px;
    padding: 1px 4px;
    margin: 0.5px;
  }

  .star-light, .star-hua {
    font-size: 8px;
  }
}

/* 悬停效果 */
.star-item:hover .star-name {
  transform: scale(1.1);
}

.star-item:hover .star-light {
  animation: twinkle 1s ease-in-out infinite;
}

.star-item:hover .star-hua {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
</style>
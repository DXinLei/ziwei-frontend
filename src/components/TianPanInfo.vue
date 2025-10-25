<template>
  <div class="tianpan-info">
    <el-card shadow="hover" style="height: 100%;">
      <template #header>
        <div class="tianpan-header">
          <el-icon><InfoFilled /></el-icon>
          <span>命盘信息</span>
        </div>
      </template>

      <el-descriptions
        v-if="mingpan && mingpan.mingzhu"
        :column="2"
        border
        size="small"
        class="info-descriptions"
      >
        <el-descriptions-item label="命主" :span="2">
          {{ mingpan.mingzhu.name || 'N/A' }}
          ({{ mingpan.mingzhu.yinyang.name }}{{ mingpan.mingzhu.gender.name }})
        </el-descriptions-item>

        <el-descriptions-item label="五行局">
          <el-tag type="warning" size="small">
            {{ mingpan.mingzhu.wuxingju.name }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="生年">
          {{ mingpan.mingzhu.nianGan.name }}{{ mingpan.mingzhu.nianZhi.name }}
        </el-descriptions-item>

        <el-descriptions-item label="命主星">
          {{ mingpan.mingzhu.mingzhu.name }}
        </el-descriptions-item>
        <el-descriptions-item label="身主星">
          {{ mingpan.mingzhu.shenzhu.name }}
        </el-descriptions-item>

        <el-descriptions-item label="阳历" :span="2">
          {{ timeInfo?.solarDateTime || '加载中...' }}
        </el-descriptions-item>

        <el-descriptions-item label="农历" :span="2">
          {{ timeInfo?.lunarDateTime || '加载中...' }}
        </el-descriptions-item>

        <el-descriptions-item label="排盘时间" :span="2">
          <span>{{ timeInfo?.paipanTime || '加载中...' }}</span>
          <el-tag v-if="timeInfo" type="info" size="small" style="margin-left: 8px;">
            {{ timeInfo.paipanTimeType }}
          </el-tag>
        </el-descriptions-item>

      </el-descriptions>
      <div v-else>
        数据加载中...
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'

const props = defineProps({
  mingpan: {
    type: Object,
    required: true,
    default: () => ({ mingzhu: {} }) // 提供默认值防止访问 undefined
  }
})

// 计算时间信息
const timeInfo = computed(() => {
  if (!props.mingpan?.timeInfo) return null

  return {
    solarDateTime: props.mingpan.timeInfo.solarDateTime,
    lunarDateTime: props.mingpan.timeInfo.lunarDateTime,
    paipanTime: props.mingpan.timeInfo.paipanTime,
    paipanTimeType: props.mingpan.timeInfo.paipanTimeType
  }
})
</script>

<style scoped>
.tianpan-info {
  padding: 5px; /* 留出一点边距 */
  height: 100%;
  width: 100%;
  background: #fdfdfd;
  border: 1px solid #eee;
  border-radius: 6px;
  box-sizing: border-box; /* 确保 padding 不会撑开 */
}

.tianpan-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

/* 确保 el-card 填满 */
.tianpan-info :deep(.el-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.tianpan-info :deep(.el-card__header) {
  flex-shrink: 0; /* 头部不压缩 */
  padding: 10px 12px;
}

.tianpan-info :deep(.el-card__body) {
  flex: 1; /* 身体占满剩余空间 */
  padding: 10px;
  overflow-y: auto; /* 如果内容超出自适应滚动 */
  box-sizing: border-box;
}

.info-descriptions :deep(.el-descriptions__label) {
  font-weight: 500;
  width: 30%; /* 固定标签宽度 */
  background: #fafafa;
}

.info-descriptions :deep(.el-descriptions__content) {
  font-weight: bold;
}
</style>
<template>
  <div class="mingpan-view">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">
          <el-icon><Star /></el-icon>
          倪派紫微斗数排盘系统
        </h1>
        <p class="page-subtitle">专业的倪派紫微斗数命盘分析工具</p>
      </div>

      <!-- 主要内容区域 -->
      <el-row :gutter="20" class="main-content-row">
        <!-- 左侧：表单区域 -->
        <el-col :xs="24" :md="8" v-if="showForm" class="form-col">
          <div class="form-section">
            <ChartForm
              @submit="handleFormSubmit"
              @reset="handleFormReset"
              @arrange-success="handleArrangeSuccess"
              :loading="loading"
            />
          </div>
        </el-col>

        <!-- 右侧：命盘显示区域 -->
        <el-col :xs="24" :md="showForm ? 16 : 24" class="chart-col">
          <div class="chart-section">
            <!-- 加载状态 -->
            <div v-if="loading" class="loading-container">
              <el-loading-directive></el-loading-directive>
              <p>正在排盘，请稍候...</p>
            </div>

            <!-- 错误状态 -->
            <div v-else-if="error" class="error-container">
              <el-result
                icon="error"
                title="排盘失败"
                :sub-title="error"
              >
                <template #extra>
                  <el-button type="primary" @click="retryArrange">重新排盘</el-button>
                  <el-button @click="toggleForm">修改信息</el-button>
                </template>
              </el-result>
            </div>

            <!-- 成功状态：显示命盘 -->
            <div v-else-if="mingpanData" class="mingpan-container">
              <MingPanDisplay
                :mingpan="mingpanData"
                @reset="handleChartReset"
              />
            </div>

            <!-- 初始状态 -->
            <div v-else class="welcome-container">
              <el-result
                icon="info"
                title="欢迎使用倪派紫微斗数排盘系统"
                sub-title="请在左侧填写出生信息开始排盘"
              >
                <template #extra>
                  <el-button type="primary" size="large" @click="toggleForm" v-if="!showForm">
                    <el-icon><Edit /></el-icon>
                    开始排盘
                  </el-button>
                </template>
              </el-result>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 浮动操作按钮 -->
      <div class="floating-actions">
        <el-button
          v-if="!showForm && mingpanData"
          type="primary"
          circle
          size="large"
          @click="toggleForm"
          title="修改信息"
        >
          <el-icon><Edit /></el-icon>
        </el-button>

        <el-button
          v-if="showForm"
          type="warning"
          circle
          size="large"
          @click="toggleForm"
          title="隐藏表单"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Star, Edit, Close } from '@element-plus/icons-vue'
import ChartForm from '../components/ChartForm.vue'
import MingPanDisplay from '../components/MingPanDisplay.vue'
import axios from 'axios'

// 响应式数据
const loading = ref(false)
const error = ref('')
const showForm = ref(true)
const mingpanData = ref(null)
const lastSubmitData = ref(null)

// 处理排盘成功事件
const handleArrangeSuccess = (result) => {
  console.log('收到排盘成功事件:', result)

  if (result && result.mingpan) {
    mingpanData.value = result.mingpan
    ElMessage.success('排盘完成！')

    // 在小屏幕上自动隐藏表单
    if (window.innerWidth < 768) {
      setTimeout(() => {
        showForm.value = false
      }, 1000)
    }
  } else {
    ElMessage.error('排盘数据格式错误')
    error.value = '排盘数据格式错误'
  }
}

// 处理表单提交（保留原来的逻辑作为备用）
const handleFormSubmit = async (formData) => {
  try {
    loading.value = true
    error.value = ''
    lastSubmitData.value = { ...formData }

    console.log('提交排盘数据:', formData)

    // 调用API进行排盘
    const response = await axios.post('http://localhost:8082/api/arrange', formData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30秒超时
    })

    if (response.data && response.data.success) {
      mingpanData.value = response.data.mingpan
      ElMessage.success('排盘完成！')

      // 在小屏幕上自动隐藏表单
      if (window.innerWidth < 768) {
        setTimeout(() => {
          showForm.value = false
        }, 1000)
      }
    } else {
      throw new Error(response.data?.message || '排盘失败')
    }

  } catch (err) {
    console.error('排盘失败:', err)

    let errorMessage = '排盘失败，请检查输入信息'
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.message) {
      errorMessage = err.message
    } else if (err.code === 'ECONNABORTED') {
      errorMessage = '请求超时，请稍后重试'
    }

    error.value = errorMessage
    ElMessage.error(errorMessage)

  } finally {
    loading.value = false
  }
}

// 处理表单重置
const handleFormReset = () => {
  mingpanData.value = null
  error.value = ''
  ElMessage.info('表单已重置')
}

// 处理命盘重置
const handleChartReset = () => {
  ElMessageBox.confirm('确定要重新排盘吗？当前命盘将会丢失。', '确认重置', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    mingpanData.value = null
    error.value = ''
    showForm.value = true
    ElMessage.success('已重置，请重新填写信息')
  }).catch(() => {
    // 用户取消
  })
}

// 重新排盘
const retryArrange = () => {
  if (lastSubmitData.value) {
    handleFormSubmit(lastSubmitData.value)
  } else {
    showForm.value = true
    error.value = ''
  }
}

// 切换表单显示
const toggleForm = () => {
  showForm.value = !showForm.value
}

// 页面挂载
onMounted(() => {
  // 检查窗口大小，在大屏幕上默认显示表单
  if (window.innerWidth >= 768) {
    showForm.value = true
  }

  // 添加窗口大小变化监听
  window.addEventListener('resize', () => {
    if (window.innerWidth < 768 && mingpanData.value) {
      showForm.value = false
    }
  })

  ElMessage.info('欢迎使用倪派紫微斗数排盘系统！')
})
</script>

<style scoped>
.mingpan-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  min-height: calc(100vh - 40px);
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.page-title {
  margin: 0 0 16px 0;
  font-size: 3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-title .el-icon {
  font-size: 3.5rem;
}

.page-subtitle {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
}

.form-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 600px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-content-row {
  align-items: stretch;
  justify-content: space-between;
}

.form-col {
  display: flex;
  flex-direction: column;
}

.chart-col {
  display: flex;
  flex-direction: column;
}

.loading-container,
.error-container,
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 500px;
  padding: 40px;
  text-align: center;
}

.loading-container p {
  margin-top: 20px;
  font-size: 16px;
  color: #666;
}

.mingpan-container {
  padding: 0;
}

.floating-actions {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.floating-actions .el-button {
  width: 56px;
  height: 56px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
  font-size: 20px;
}

.floating-actions .el-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mingpan-view {
    padding: 10px 0;
  }

  .container {
    padding: 0 10px;
    min-height: calc(100vh - 20px);
  }

  .page-header {
    margin-bottom: 20px;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-title .el-icon {
    font-size: 2.5rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .form-section {
    margin-bottom: 16px;
    border-radius: 12px;
    height: auto;
    max-height: none;
  }

  .chart-section {
    border-radius: 12px;
    min-height: 400px;
    height: auto;
  }

  .loading-container,
  .error-container,
  .welcome-container {
    min-height: 300px;
    padding: 20px;
  }

  .floating-actions {
    bottom: 20px;
    right: 20px;
  }

  .floating-actions .el-button {
    width: 48px;
    height: 48px;
    font-size: 18px;
  }

  .form-col,
  .chart-col {
    margin-bottom: 16px;
  }

  .main-content-row {
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }

  .page-title .el-icon {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-section,
.chart-section {
  animation: slideIn 0.6s ease-out;
}

.form-section {
  animation-delay: 0.1s;
}

.chart-section {
  animation-delay: 0.2s;
}

/* 滚动条样式 */
.form-section::-webkit-scrollbar {
  width: 6px;
}

.form-section::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.form-section::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.form-section::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Element Plus 样式覆盖 */
:deep(.el-result__title) {
  font-size: 20px;
  color: #2c3e50;
}

:deep(.el-result__subtitle) {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

:deep(.el-loading-directive) {
  font-size: 48px;
  color: #667eea;
}
</style>
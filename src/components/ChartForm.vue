<template>
  <div class="form-container">
    <h2 class="form-title">
      <span class="title-icon">🔮</span>
      紫微斗数排盘
    </h2>
    <p class="form-subtitle">专业的紫微斗数命盘分析工具</p>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      size="large"
      @submit.prevent="submitForm"
    >
      <!-- 基本信息区域 -->
      <div class="form-section">
        <h3 class="section-title">基本信息</h3>

        <!-- 姓名 -->
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入姓名（可选）"
            clearable
            maxlength="20"
            show-word-limit
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <!-- 性别 -->
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender" size="large">
            <el-radio label="male" border>
              <span class="gender-option">
                <el-icon class="gender-icon male"><Male /></el-icon>
                男
              </span>
            </el-radio>
            <el-radio label="female" border>
              <span class="gender-option">
                <el-icon class="gender-icon female"><Female /></el-icon>
                女
              </span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

      <!-- 时间信息区域 -->
      <div class="form-section">
        <h3 class="section-title">出生时间</h3>

        <!-- 历法类型 -->
        <el-form-item label="历法类型" prop="calendarType">
          <el-radio-group v-model="form.calendarType" @change="handleCalendarTypeChange">
            <el-radio label="solar">
              <span class="calendar-option">
                <el-icon><Sunny /></el-icon>
                公历（阳历）
              </span>
            </el-radio>
            <el-radio label="lunar">
              <span class="calendar-option">
                <el-icon><Moon /></el-icon>
                农历（阴历）
              </span>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 出生日期时间 -->
        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker
            v-model="form.birthDate"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择出生日期和时间"
            style="width: 100%"
            :disabled-date="disabledDate"
            @change="handleBirthDateChange"
          />
          <div class="form-help">
            <el-icon><InfoFilled /></el-icon>
            {{ calendarTypeHelp }}
          </div>
        </el-form-item>

        <!-- 闰月（农历时显示） -->
        <el-form-item v-if="form.calendarType === 'lunar'" label="闰月">
          <el-switch
            v-model="form.leapMonth"
            active-text="是"
            inactive-text="否"
            @change="handleLeapMonthChange"
          />
          <div class="form-help">
            <el-icon><InfoFilled /></el-icon>
            闰月按"闰月生人作下月论"规则处理
          </div>
        </el-form-item>
      </div>

      <!-- 地理位置区域 -->
      <div class="form-section">
        <h3 class="section-title">
          <span>出生地点</span>
          <el-tooltip content="精确的出生地点可以提高真太阳时计算的准确性" placement="top">
            <el-icon class="help-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </h3>

        <LocationPicker
          v-model="form.location"
          @location-change="handleLocationChange"
        />
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button
          type="primary"
          size="large"
          :loading="loading"
          :disabled="!canSubmit"
          @click="submitForm"
        >
          <el-icon v-if="!loading"><Star /></el-icon>
          {{ loading ? '排盘中...' : '开始排盘' }}
        </el-button>
        <el-button
          size="large"
          @click="resetForm"
        >
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>

        <!-- 快速示例 -->
        <el-button
          type="info"
          size="large"
          plain
          @click="fillExample"
        >
          <el-icon><Document /></el-icon>
          填充示例
        </el-button>
      </div>
    </el-form>

    <!-- 排盘结果预览 -->
    <div v-if="previewResult" class="preview-section">
      <h3>排盘预览</h3>
      <div class="preview-content">
        <p><strong>{{ previewResult.mingzhu.name }}</strong></p>
        <p>{{ previewResult.mingzhu.nianGan.name }}{{ previewResult.mingzhu.nianZhi.name }}年
           {{ previewResult.mingzhu.yue.name }}{{ previewResult.mingzhu.ri.name }}日
           {{ previewResult.mingzhu.shi.name }}时</p>
        <p>{{ previewResult.mingzhu.yinyang.name }}{{ previewResult.mingzhu.gender.name }} ·
           {{ previewResult.mingzhu.wuxingju.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User, Male, Female, Sunny, Moon, InfoFilled, QuestionFilled,
  Star, Refresh, Document
} from '@element-plus/icons-vue'
import { arrangeApi } from '../services/api.js'
import LocationPicker from './LocationPicker.vue'

// 定义组件事件
const emit = defineEmits(['arrange-success'])

// 响应式数据
const formRef = ref(null)
const loading = ref(false)
const previewResult = ref(null)
const selectedLocation = ref([])

// 表单数据
const form = reactive({
  name: '',
  gender: 'male',
  calendarType: 'solar',
  birthDate: '',
  location: {
    province: '',
    city: '',
    district: ''
  },
  leapMonth: false
})

// 历法类型帮助文本
const calendarTypeHelp = computed(() => {
  return form.calendarType === 'solar'
    ? '请选择公历（阳历）出生日期和时间'
    : '请选择农历（阴历）出生日期和时间'
})

// 是否可以提交
const canSubmit = computed(() => {
  return form.gender &&
         form.birthDate &&
         form.location.province &&
         form.location.city &&
         !loading.value
})

// 表单验证规则
const rules = reactive({
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  calendarType: [
    { required: true, message: '请选择历法类型', trigger: 'change' }
  ],
  birthDate: [
    { required: true, message: '请选择出生日期', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择出生日期'))
          return
        }

        const date = new Date(value)
        const now = new Date()

        // 检查日期是否合理
        if (date > now) {
          callback(new Error('出生日期不能晚于当前时间'))
          return
        }

        // 检查年份范围（1900-2100）
        if (date.getFullYear() < 1900 || date.getFullYear() > 2100) {
          callback(new Error('出生年份应在1900-2100年之间'))
          return
        }

        callback()
      },
      trigger: 'change'
    }
  ],
  'location.province': [
    { required: true, message: '请选择省份', trigger: 'change' }
  ],
  'location.city': [
    { required: true, message: '请选择城市', trigger: 'change' }
  ]
})

// 禁用的日期
const disabledDate = (time) => {
  const date = new Date(time)
  const now = new Date()

  // 禁用未来日期
  if (date > now) {
    return true
  }

  // 禁用1900年以前的日期
  if (date.getFullYear() < 1900) {
    return true
  }

  return false
}

// 处理历法类型变化
const handleCalendarTypeChange = (value) => {
  // 重置闰月状态
  form.leapMonth = false

  // 清除预览结果
  previewResult.value = null

  console.log('历法类型变化:', value)
}

// 处理出生日期变化
const handleBirthDateChange = (value) => {
  console.log('出生日期变化:', value)
  // 可以在这里添加日期变化的处理逻辑
}

// 处理闰月变化
const handleLeapMonthChange = (value) => {
  console.log('闰月状态变化:', value)
  ElMessage.info(value ? '已启用闰月模式' : '已关闭闰月模式')
}

// 处理地址变化
const handleLocationChange = (location) => {
  console.log('地址选择变化:', location)
}

// 提交表单
const submitForm = async () => {
  try {
    // 验证表单
    const valid = await formRef.value.validate()
    if (!valid) {
      ElMessage.error('请检查表单填写是否正确')
      return
    }

    loading.value = true
    previewResult.value = null

    console.log('提交表单数据:', form)

    // 调用 API
    const result = await arrangeApi.arrange(form)

    console.log('排盘结果:', result)

    // 显示成功消息
    ElMessage.success('排盘完成！')

    // 发送成功事件
    emit('arrange-success', result)

  } catch (error) {
    console.error('排盘失败:', error)

    // 显示详细错误信息
    if (error.response?.data?.message) {
      ElMessage.error(`排盘失败: ${error.response.data.message}`)
    } else {
      ElMessage.error(`排盘失败: ${error.message || '请检查网络连接'}`)
    }
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要重置表单吗？所有填写的内容将被清空。',
      '确认重置',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    // 重置表单
    formRef.value?.resetFields()
    selectedLocation.value = []
    previewResult.value = null

    // 重新设置默认值
    Object.assign(form, {
      name: '',
      gender: 'male',
      calendarType: 'solar',
      birthDate: getDefaultBirthDate(),
      location: {
        province: '',
        city: '',
        district: ''
      },
      leapMonth: false
    })

    ElMessage.success('表单已重置')
  } catch {
    // 用户取消重置
  }
}

// 填充示例数据
const fillExample = () => {
  Object.assign(form, {
    name: '张三',
    gender: 'male',
    calendarType: 'solar',
    birthDate: '2020-06-05 23:30:00',
    location: {
      province: '北京市',
      city: '北京市',
      district: '朝阳区'
    },
    leapMonth: false
  })

  selectedLocation.value = ['北京市', '北京市', '朝阳区']
  ElMessage.success('已填充示例数据')
}

// 获取默认出生日期
const getDefaultBirthDate = () => {
  const now = new Date()
  // 设置为30年前的今天
  now.setFullYear(now.getFullYear() - 30)
  return now.toISOString().slice(0, 19).replace('T', ' ')
}

// 组件挂载时的处理
onMounted(() => {
  // 设置默认日期
  form.birthDate = getDefaultBirthDate()

  // 显示欢迎消息
  setTimeout(() => {
    ElMessage.info('欢迎使用紫微斗数排盘系统！')
  }, 1000)
})
</script>

<style scoped>
.form-container {
  max-width: 700px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
}

.form-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.form-title {
  text-align: center;
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 2.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.form-subtitle {
  text-align: center;
  margin: 0 0 2rem 0;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.form-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.section-title {
  margin: 0 0 1.5rem 0;
  color: #495057;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.help-icon {
  color: #6c757d;
  cursor: help;
  font-size: 0.9em;
}

.gender-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gender-icon {
  font-size: 1.2rem;
}

.gender-icon.male {
  color: #007bff;
}

.gender-icon.female {
  color: #e83e8c;
}

.calendar-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-help {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #e3f2fd;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #1565c0;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

.form-actions .el-button {
  min-width: 120px;
  height: 44px;
  font-size: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-actions .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.preview-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  border: 1px solid #dee2e6;
}

.preview-section h3 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1.1rem;
}

.preview-content {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.preview-content p {
  margin: 0.5rem 0;
  color: #495057;
}

/* Element Plus 组件样式覆盖 */
:deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
}

:deep(.el-radio) {
  margin-right: 20px;
  margin-bottom: 10px;
}

:deep(.el-radio.is-bordered) {
  padding: 12px 20px;
  margin-right: 15px;
}

:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-input__prefix) {
  color: #6c757d;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-container {
    margin: 1rem;
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.8rem;
  }

  .form-section {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .form-actions .el-button {
    margin: 0.5rem 0;
  }

  :deep(.el-radio.is-bordered) {
    display: block;
    margin-bottom: 10px;
  }
}
</style>
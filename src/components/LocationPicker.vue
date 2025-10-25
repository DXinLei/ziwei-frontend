<template>
  <div class="location-picker">
    <!-- 级联选择器 -->
    <el-cascader
      v-model="selectedLocation"
      :options="locationData"
      :props="cascaderProps"
      placeholder="请选择出生地（省-市-区/县）"
      clearable
      filterable
      style="width: 100%"
      @change="handleLocationChange"
      @visible-change="handleVisibleChange"
    >
      <template #default="{ node, data }">
        <span class="cascader-option">
          <el-icon v-if="node.level === 1"><Location /></el-icon>
          <el-icon v-else-if="node.level === 2"><OfficeBuilding /></el-icon>
          <el-icon v-else><MapLocation /></el-icon>
          <span>{{ data.name }}</span>
        </span>
      </template>
    </el-cascader>

    <!-- 手动输入模式 -->
    <div class="manual-input-section">
      <el-collapse v-model="showManualInput">
        <el-collapse-item title="或手动输入地址" name="manual">
          <div class="manual-input-form">
            <el-row :gutter="12">
              <el-col :span="8">
                <el-input
                  v-model="manualLocation.province"
                  placeholder="省份"
                  clearable
                  @input="handleManualInputChange"
                />
              </el-col>
              <el-col :span="8">
                <el-input
                  v-model="manualLocation.city"
                  placeholder="城市"
                  clearable
                  @input="handleManualInputChange"
                />
              </el-col>
              <el-col :span="8">
                <el-input
                  v-model="manualLocation.district"
                  placeholder="区县（可选）"
                  clearable
                  @input="handleManualInputChange"
                />
              </el-col>
            </el-row>

            <!-- 地址验证状态 -->
            <div v-if="validationStatus" class="validation-status">
              <el-alert
                :title="validationStatus.message"
                :type="validationStatus.type"
                :closable="false"
                show-icon
              />
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 选中地址预览 -->
    <div v-if="hasLocation" class="location-preview">
      <el-tag type="success" effect="light">
        <el-icon><Check /></el-icon>
        {{ fullAddress }}
      </el-tag>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { Location, OfficeBuilding, MapLocation, Check } from '@element-plus/icons-vue'
import { locationData } from '../data/locations.js'

// 定义组件属性和事件
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      province: '',
      city: '',
      district: ''
    })
  }
})

const emit = defineEmits(['update:modelValue', 'location-change'])

// 响应式数据
const selectedLocation = ref([])
const showManualInput = ref(['manual'])
const validationStatus = ref(null)

// 手动输入的地址
const manualLocation = reactive({
  province: '',
  city: '',
  district: ''
})

// 级联选择器配置
const cascaderProps = {
  value: 'name',
  label: 'name',
  children: 'children',
  checkStrictly: false,
  emitPath: true
}

// 计算属性：是否有完整地址
const hasLocation = computed(() => {
  return (props.modelValue.province && props.modelValue.city) ||
         (manualLocation.province && manualLocation.city)
})

// 计算属性：完整地址
const fullAddress = computed(() => {
  const location = props.modelValue
  const parts = []

  if (location.province) parts.push(location.province)
  if (location.city && location.city !== location.province) parts.push(location.city)
  if (location.district) parts.push(location.district)

  return parts.join('')
})

// 监听手动输入变化
watch(manualLocation, (newVal) => {
  // 如果有手动输入，清空级联选择器
  if (newVal.province || newVal.city || newVal.district) {
    selectedLocation.value = []
  }

  // 验证地址
  validateLocation()

  // 更新父组件
  if (newVal.province && newVal.city) {
    emit('update:modelValue', { ...newVal })
    emit('location-change', { ...newVal })
  }
}, { deep: true })

// 监听级联选择器变化
watch(selectedLocation, (newVal) => {
  if (newVal && newVal.length > 0) {
    // 清空手动输入
    Object.assign(manualLocation, {
      province: '',
      city: '',
      district: ''
    })

    // 更新父组件
    const [province, city, district] = newVal
    emit('update:modelValue', { province, city, district: district || '' })
    emit('location-change', { province, city, district: district || '' })
  }
})

// 处理位置变化
const handleLocationChange = (value) => {
  console.log('位置选择变化:', value)
  validationStatus.value = null
}

// 处理可见性变化
const handleVisibleChange = (visible) => {
  if (visible) {
    console.log('级联选择器已打开')
  }
}

// 处理手动输入变化
const handleManualInputChange = () => {
  // 延迟验证，避免频繁触发
  setTimeout(validateLocation, 500)
}

// 验证地址
const validateLocation = () => {
  const { province, city } = manualLocation

  if (!province && !city) {
    validationStatus.value = null
    return
  }

  if (!province) {
    validationStatus.value = {
      type: 'warning',
      message: '请填写省份'
    }
    return
  }

  if (!city) {
    validationStatus.value = {
      type: 'warning',
      message: '请填写城市'
    }
    return
  }

  // 验证地址长度
  if (province.length > 20) {
    validationStatus.value = {
      type: 'error',
      message: '省份名称过长'
    }
    return
  }

  if (city.length > 20) {
    validationStatus.value = {
      type: 'error',
      message: '城市名称过长'
    }
    return
  }

  // 验证成功
  validationStatus.value = {
    type: 'success',
    message: '地址格式正确'
  }
}

// 设置默认地址
const setDefaultLocation = () => {
  const defaultLocation = {
    province: '北京市',
    city: '北京市',
    district: ''
  }

  emit('update:modelValue', defaultLocation)
  emit('location-change', defaultLocation)

  // 更新级联选择器
  selectedLocation.value = ['北京市', '北京市']
}

// 清空地址
const clearLocation = () => {
  selectedLocation.value = []
  Object.assign(manualLocation, {
    province: '',
    city: '',
    district: ''
  })

  emit('update:modelValue', {
    province: '',
    city: '',
    district: ''
  })

  validationStatus.value = null
}

// 暴露方法给父组件
defineExpose({
  setDefaultLocation,
  clearLocation
})

// 组件挂载时的处理
onMounted(() => {
  // 如果已有地址，设置到级联选择器
  const { province, city, district } = props.modelValue
  if (province && city) {
    selectedLocation.value = [province, city, district].filter(Boolean)
  }
})
</script>

<style scoped>
.location-picker {
  width: 100%;
}

.cascader-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cascader-option .el-icon {
  color: #6c757d;
  font-size: 16px;
}

.manual-input-section {
  margin-top: 12px;
}

.manual-input-form {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.validation-status {
  margin-top: 12px;
}

.location-preview {
  margin-top: 12px;
  display: flex;
  align-items: center;
}

.location-preview .el-tag {
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
}

.location-preview .el-icon {
  margin-right: 6px;
}

/* Element Plus 样式覆盖 */
:deep(.el-cascader) {
  width: 100%;
}

:deep(.el-cascader__tags-text) {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__header) {
  font-size: 14px;
  color: #6c757d;
  padding: 12px 0;
  height: auto;
  line-height: 1.4;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}

:deep(.el-input) {
  font-size: 14px;
}

:deep(.el-alert) {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .manual-input-form .el-row {
    flex-direction: column;
  }

  .manual-input-form .el-col {
    margin-bottom: 12px;
  }

  .cascader-option {
    font-size: 14px;
  }
}
</style>
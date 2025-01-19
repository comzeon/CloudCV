<template>
  <div class="slider-demo-block" ref="sliderRef" @wheel="handleWheel">
    <span>{{ state.paramName }}</span>
    <el-slider v-model="state.value" show-input :debounce=debounceTick size="small" :format-tooltip="formatTooltip"
               :min="state.min" :max="state.max" :step="state.step" @change="handleChange" />
  </div>
</template>

<script setup>
import {reactive, onMounted, onBeforeUnmount, ref} from 'vue'
import {debounce} from "lodash";
import {sendParam} from '@/api/slider'

const props = defineProps({
  min: {
    type: Number,
    default: 0, // 默认最小值
  },
  max: {
    type: Number,
    default: 100, // 默认最大值
  },
  step: {
    type: Number,
    default: 1,
  },
  initialValue: {
    type: Number,
    default: 50, // 默认初始值
  },
  serviceName: {
    type: String,
    default: ""
  },
  paramName: {
    type: String,
    default: ""
  },
});
const emit = defineEmits(['getSliderVal'])
const sliderRef = ref(null)
const state = ref({
  min: props.min, max: props.max, step: props.step, value: props.initialValue, paramName: props.paramName,
})
const debounceTick = 200;

const sliderVal = () => {return {paramName: state.value.paramName, value: state.value.value};}

defineExpose({sliderVal})
const formatTooltip = (val) => {
  return Math.round(val * 1000) / 1000;
}

// 鼠标滚轮控制，只在父级 div 中生效
const handleWheel = (event) => {
  // 阻止页面滚动
  event.preventDefault()

  // 判断滚动方向
  if (event.deltaY < 0) {
    // 向下滚动，减少值
    state.value.value = Math.min(state.value.max, state.value.value + state.value.step)
  } else {
    // 向上滚动，增加值
    state.value.value = Math.max(state.value.min, state.value.value - state.value.step)
  }
  handleChange(state.value.value)
}

// 打印滑块值变化
const handleChange = debounce(function (newValue){
  state.value.value = formatTooltip(newValue)
  emit("getSliderVal", {paramName: state.value.paramName, value: state.value.value})
}, debounceTick)

onMounted(() => {
  // 绑定滚轮事件到父级 div
  const sliderDiv = sliderRef.value;
  if (sliderDiv) {
    sliderDiv.addEventListener('wheel', handleWheel, { passive: false });
  }
});

onBeforeUnmount(() => {
  // 移除事件监听器
  const sliderDiv = sliderRef.value;
  if (sliderDiv) {
    sliderDiv.removeEventListener('wheel', handleWheel, { passive: false });
  }
});
</script>

<style scoped>
.slider-demo-block {
  width: 400px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
</style>

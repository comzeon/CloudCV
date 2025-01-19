<template>
  <div class="contrast">
    <div class="panel">
      <canvas id="leftCanvas" width="500" height="500"></canvas>
      <MySliders ref="lefter" @getSliderVal="handleLeftSliders" :current-id="props.left.id" :key="`left-${leftRefresher}`"></MySliders>
    </div>
    <div class="panel">
      <canvas id="rightCanvas" width="500" height="500"></canvas>
      <MySliders ref="righter" @getSliderVal="handleRightSliders" :current-id="props.right.id" :key="`right-${rightRefresher}`"></MySliders>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, toRaw, watch} from 'vue';
import MySliders from "@/components/core/MySliders.vue";

import Denormalize from "@/api/ops/convert/Denormalize.js";
import {useSliderCache} from "@/stores/sliderCacheStore.js";

const props = defineProps({
  left: {
    type: Object,
    default: {}
  },
  right: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['getLeftSliderVal', 'getRightSliderVal'])

const state = ref(props)
const lefter = ref(null)
const righter = ref(null)
const leftRefresher = ref(0)
const rightRefresher = ref(0)
const denormalizer = new Denormalize()

const updateLeftCache = (id) => {
  let param = lefter.value.getSlidersVal()
  const sliderCache = useSliderCache()
  const obj = sliderCache.getter(id)
  for(let [key, value] of Object.entries(param))
    obj[key].val = value
}
const updateRightCache = (id) => {
  let param = righter.value.getSlidersVal()
  const sliderCache = useSliderCache()
  const obj = sliderCache.getter(id)
  for(let [key, value] of Object.entries(param))
    obj[key].val = value
}

watch(
    () => props.left,
    (newVal, oldVal) => {
      if(newVal.id !== oldVal.id) {
        updateLeftCache(oldVal.id)
        leftRefresher.value += 1
      }
      showing()
    },
    {deep: true}
)
watch(
    () => props.right,
    (newVal, oldVal) => {
      if(newVal.id !== oldVal.id) {
        updateRightCache(oldVal.id)
        rightRefresher.value += 1;
      }
      showing()
    },
    {deep: true}
)
const handleLeftSliders = (info) => {
  const sliderCache = useSliderCache()
  emit('getLeftSliderVal', info)
}
const handleRightSliders = (info) => {
  emit('getRightSliderVal', info)
}
const showing = () => {
  let leftOut = denormalizer.apply({"defaultImg": props.left.mat.clone()})
  let rightOut = denormalizer.apply({"defaultImg": props.right.mat.clone()})
  cv.imshow("leftCanvas", leftOut["defaultImg"]);
  cv.imshow("rightCanvas", rightOut["defaultImg"])
}

onMounted(() => {
  try {
    showing()
  }catch (err){
    console.log(err.toString())
  }
})
</script>

<style scoped>
.contrast {
  display: flex;
  justify-content: center; /* 居中对齐 */
  gap: 20px;
  margin: 20px 0;
  align-items: flex-start; /* 顶部对齐 */
  flex-wrap: wrap; /* 支持换行 */
}

.panel {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 20px; /* 减小间距 */
  align-items: center;
  max-width: 500px; /* 限制面板宽度 */
  background-color: #f7f7f7; /* 背景颜色 */
  padding: 20px; /* 内边距 */
  border-radius: 10px; /* 圆角边框 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

canvas {
  background-color: #fff; /* 背景颜色 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 画布阴影 */
}

@media (max-width: 768px) {
  .contrast {
    flex-direction: column; /* 在小屏幕上改为垂直排列 */
    gap: 15px;
  }

  .panel {
    max-width: 100%; /* 面板宽度自适应 */
    padding: 10px;
  }

  img, canvas {
    max-width: 100%; /* 图片和画布的最大宽度 */
  }
}
</style>

<template>
  <MySlider v-for="[paramName, item] in Object.entries(params)" :key="`${currentId}_${paramName}`"
            ref="slidersRef"
            :param-name="paramName" :min="item.min" :max="item.max"
            :step="item.step" :initial-value="item.val" @getSliderVal="handleSliderVal"></MySlider>
</template>

<script setup>
import MySlider from "@/components/core/MySlider.vue";
import {ref, watch} from "vue";

import {useSliderCache} from "@/stores/sliderCacheStore.js";

const props = defineProps({
  currentId: {
    type: String,
    default: null
  }
})
const emit = defineEmits(['getSliderVal'])

const slidersRef = ref([])
const sliderCache = useSliderCache()
let currentId = props.currentId
const params = sliderCache.getter(currentId) || {}

const getSlidersVal = () => {
  let result = {}
  for(let refer of slidersRef.value){
    let item = refer.sliderVal()
    result[item.paramName] = item.value
  }
  return result
}
defineExpose({getSlidersVal})

watch(() => props.currentId, (newVal) => {
  params.value = sliderCache.getter(newVal)
  currentId = newVal
})
const handleSliderVal = (info) => {
  emit('getSliderVal', info)
}
</script>

<style scoped>

</style>
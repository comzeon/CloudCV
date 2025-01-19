<template>
  <el-dialog v-model="dialogFormVisible" :title=sliderCache.getName() width="500" align-center>
    <MyTabs :key="refresher"></MyTabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {nextTick, ref, watch} from 'vue'

import MyTabs from "@/components/menu/MyTabs.vue";
import {useSliderCache} from "@/stores/sliderCacheStore.js";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
})

const refresher = ref(0)
const dialogFormVisible = ref(props.isVisible)
const sliderCache = useSliderCache()

const refresh = () => {refresher.value += 1}

watch(() => props.isVisible, (newVal) => {
  dialogFormVisible.value = newVal;
  refresh()
})
const updateTabs = () => {tabsVisible.value = false; tabsVisible.value = true}
</script>
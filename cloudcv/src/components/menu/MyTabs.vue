<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane v-for="[paramName, val] of Object.entries(paramObj)" :key="`${currentId}-${paramName}`">
      <template #label>
        <span class="custom-tabs-label">
          <span>{{ paramName }}</span>
        </span>
      </template>
      <template #default>
        {{ paramName }}
        <MyParamFrom :param="val" :name="paramName"></MyParamFrom>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import {ref, defineExpose, toRaw} from "vue";
import MyParamFrom from "@/components/menu/MyParamFrom.vue";
import {useSliderCache} from "@/stores/sliderCacheStore.js";

const sliderCache = useSliderCache()
const currentId = sliderCache.getId()
const paramObj = sliderCache.getter(currentId) || {}
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 20px;
  font-weight: 600;
}
.demo-tabs .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
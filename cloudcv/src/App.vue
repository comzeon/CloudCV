<script setup>
import MySlider from "@/components/core/MySlider.vue";
import Upload from "@/views/Upload.vue";
import Canvas from "@/views/Canvas.vue";
import MyCarousel from "@/components/core/MyCarousel.vue";
import Workflow from "@/views/Workflow.vue";
import MyDrawer from "@/components/core/MyDrawer.vue";
import MyPopover from "@/components/menu/MyPopover.vue";
import Workstation from "@/views/Workstation.vue";
import MySliders from "@/components/core/MySliders.vue";
import MyTabs from "@/components/menu/MyTabs.vue";
import MyDialog from "@/components/menu/MyDialog.vue";
import MyParamFrom from "@/components/menu/MyParamFrom.vue";
import CvTest from "@/test/CvTest.vue";

import {OpFactory} from "@/api/OpBase/Op.js";
import {sliderParamParser} from "@/api/slider.js";
import {provide} from "vue";

provide('OpFactory', OpFactory)
provide('sliderParam', sliderParamParser())
</script>

<template>
<!--  <MyParamFrom></MyParamFrom>-->
<!--  <MyDialog></MyDialog>-->
<!--  <MyTabs></MyTabs>-->
  <Workstation/>
<!--  <CvTest/>-->
<!--  <Upload></Upload>-->
<!--  <Canvas></Canvas>-->
<!--  <Canvas/>-->
<!--  <MyCarousel/>-->
<!--  <Test/>-->
<!--  <Workflow/>-->
<!--  <MyPopover :is-visible=is_ :x=x :y=y></MyPopover>-->
<!--  <MyDrawer/>-->
<!--  <MySliders :params="sliderParamParser().get('高斯滤波')"></MySliders>-->
</template>

<style scoped>
</style>

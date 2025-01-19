<template>
  <el-carousel :interval="4000" height="auto" :autoplay=autoplay :loop=false indicator-position="none">
    <el-carousel-item class="myCarouselItem" v-for="item in 6" :key="item">
      <el-card class="adaptive-card">
        <template #header>Yummy hamburger</template>
        <img
            class="adaptive-img"
            :src=img
        />
      </el-card>
      <MySlider/>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import {ref} from "vue";
import img from "@/assets/test_img/processed_6_img_.png"
import MySlider from "@/components/core/MySlider.vue";
import Canvas from "@/views/Canvas.vue";

const autoplay = ref(false)
</script>

<style scoped>
.adaptive-img {
  display: block;
  width: 400px;
  height: 400px;
}
.adaptive-card {
  display: inline-block;
  box-shadow: none;
  max-width: 100%;
  height: auto;
}
.myCarouselItem {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
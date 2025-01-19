<template>
  <img ref="srcRef" src="../assets/test_img/img_4.png" @load="test1" width="400" height="400">
  <canvas id="dstRef" width="400" height="400"></canvas>
</template>

<script setup>
import {ref} from "vue";
import Square from "@/api/ops/pointOps/Square.js"

const srcRef = ref(null)

const test1 = () => {
  let src = cv.imread(srcRef.value)
  let src_ = new cv.Mat()
  let src__ = new cv.Mat()
  let _src_ = new cv.Mat()
  cv.cvtColor(src, src_, cv.COLOR_RGBA2BGR)
  cv.cvtColor(src_, src__, cv.COLOR_BGR2GRAY, 0);
  // src__.convertTo(_src_, cv.CV_32F);
  // cv.multiply(_src_, _src_.clone(), dst, 1, cv.CV_32F)
  // 获取图像的宽度和高度
  let dst = src__.clone()
  let rows = src__.rows;
  let cols = src__.cols;

// 遍历图像的每个像素
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // 获取当前像素的灰度值
      let grayValue = src__.ucharPtr(y, x)[0];

      // 检查像素值是否不为0
      if (grayValue !== 0) {
        // 以该点为中心绘制圆圈（例如，半径为5的圆圈，红色，厚度为2）
        cv.circle(dst, new cv.Point(x, y), 5, new cv.Scalar(255, 0, 0), 2); // BGR格式表示红色
      }
    }
  }
  cv.imshow("dstRef", dst)
}
</script>
<template>
  <Canvas :v-if=isShowing :left="canvasParam.get('left')" :right="canvasParam.get('right')"
          @getLeftSliderVal="handleLeftSliderVal" @getRightSliderVal="handleRightSliderVal"></Canvas>
  <Workflow :submit="submitWorkflow" @bind-left="updateLeft" @bind-right="updateRight"></Workflow>
  <img ref="image" src="../assets/test_img/test.png" v-show=false @load="loadImage" width="500" height="500"></img>
</template>

<script setup>
import Canvas from "@/views/Canvas.vue";
import Workflow from "@/views/Workflow.vue";

import {onMounted, ref, provide, nextTick, toRaw} from "vue";

import {useOpFactory} from "@/utils/useOpFactory.js";
import {Manager} from "@/api/workflow.js";
import {sliderParamParser} from "@/api/slider.js";
import {useSliderCache} from "@/stores/sliderCacheStore.js";
import img from "@/assets/test_img/processed_6_img_.png"

// Manager初始化
const OpFactory = useOpFactory()
const sliderParam = sliderParamParser()
const sliderCache = useSliderCache()
let managerRef = null
const canvasParam = new Map()
const workerIdStore = ref(new Map())
const image = ref(null)
const isShowing = ref(false)

const updateCanvas = () => {
  isShowing.value = false
  isShowing.value = true
}
const updateLeft = async (workId) => {
  await managerRef.runById(workId)
  workerIdStore.value.set('left', workId)
  let rightId = workerIdStore.value.get('right')

  canvasParam.set('left', {
    id: workId,
    mat: managerRef.getOutputById(workId)["defaultImg"] || managerRef.getOutputById(workId)["mask"]
  })
  canvasParam.set('right', {
    id: rightId,
    mat: managerRef.getOutputById(rightId)["defaultImg"] || managerRef.getOutputById(rightId)["mask"]
  })
  updateCanvas()
}
const updateRight = async (workId) => {
  await managerRef.runById(workId)
  workerIdStore.value.set('right', workId)
  let leftId = workerIdStore.value.get('left')

  canvasParam.set('left', {
    id: leftId,
    mat: managerRef.getOutputById(leftId)["defaultImg"] || managerRef.getOutputById(leftId)["mask"]
  })
  canvasParam.set('right', {
    id: workId,
    mat: managerRef.getOutputById(workId)["defaultImg"] || managerRef.getOutputById(workId)["mask"]
  })
  updateCanvas()
}
const submitWorkflow = async (nodes) => {
  Manager.setOpFactory(OpFactory)
  const manager = new Manager(toRaw(sliderCache.cache))
  await manager.getWorkflowByNodes(nodes)
  // console.log(manager.workers)

  let inputId = null
  let outputId = null
  for(let [key, val] of manager.workers) {
    if (val.name === "输入")
      inputId = key
    else if (val.name === "输出") {
      let lastOne = manager.dependencyMap.get(key).linkFrom
      // !!!!!!!!!!!!!
      if (lastOne.length === 1)
        outputId = lastOne[0]
    }
  }
  // console.log(manager.workers.get(inputId).op)
  const inputs = new Map()
  let src = cv.imread(image.value)
  let dst = new cv.Mat()
  if(src.channels() === 4) {
    cv.cvtColor(src, dst, cv.COLOR_RGBA2BGR)
    inputs.set(inputId, {defaultImg: dst})
  }
  else inputs.set(inputId, {defaultImg: src})
  manager.init(inputs)
  await manager.runById(manager.endId)

  managerRef = manager
  workerIdStore.value.set('left', inputId)
  workerIdStore.value.set('right', outputId)

  let workerLeft = managerRef.workers.get(inputId)
  let workerRight = managerRef.workers.get(outputId)
  canvasParam.get('left').mat.delete()
  canvasParam.get('right').mat.delete()

  canvasParam.set('left', {id: inputId, mat: managerRef.getOutputById(inputId)["defaultImg"] || managerRef.getOutputById(inputId)["mask"]})
  canvasParam.set('right', {id: outputId, mat: managerRef.getOutputById(outputId)["defaultImg"] || managerRef.getOutputById(outputId)["mask"]})
  updateCanvas()
}

const handleLeftSliderVal = async (info) => {
  let workerIdLeft = workerIdStore.value.get('left')
  let workerIdRight = workerIdStore.value.get('right')
  let workerLeft = managerRef.workers.get(workerIdLeft)
  let workerRight = managerRef.workers.get(workerIdRight)

  sliderCache.getter(workerIdLeft)[info.paramName].val = info.value

  await managerRef.adjustById(workerIdLeft, info.paramName, info.value)
  await managerRef.runById(workerIdLeft)
  await managerRef.runById(workerIdRight)

  canvasParam.set('left', {
    id: workerIdLeft,
    mat: managerRef.getOutputById(workerIdLeft)["defaultImg"] || managerRef.getOutputById(workerIdLeft)["mask"]
  })
  canvasParam.set('right', {
    id: workerIdRight,
    mat: managerRef.getOutputById(workerIdRight)["defaultImg"] || managerRef.getOutputById(workerIdRight)["mask"]
  })
  updateCanvas()
}
const handleRightSliderVal = async (info) => {
  let workerIdLeft = workerIdStore.value.get('left')
  let workerIdRight = workerIdStore.value.get('right')
  let workerLeft = managerRef.workers.get(workerIdLeft)
  let workerRight = managerRef.workers.get(workerIdRight)

  sliderCache.getter(workerIdRight)[info.paramName].val = info.value

  await managerRef.adjustById(workerIdRight, info.paramName, info.value)
  await managerRef.runById(workerIdLeft)
  await managerRef.runById(workerIdRight)

  canvasParam.set('left', {
    id: workerIdLeft,
    mat: managerRef.getOutputById(workerIdLeft)["defaultImg"] || managerRef.getOutputById(workerIdLeft)["mask"]
  })
  canvasParam.set('right', {
    id: workerIdRight,
    mat: managerRef.getOutputById(workerIdRight)["defaultImg"] || managerRef.getOutputById(workerIdRight)["mask"]
  })
  updateCanvas()
}

const loadImage = () => {
  const mat = cv.imread(image.value)
  canvasParam.set("left", {id: null, mat: mat.clone()})
  canvasParam.set("right", {id: null, mat: mat.clone()})
  isShowing.value = true
  mat.delete()
}
</script>
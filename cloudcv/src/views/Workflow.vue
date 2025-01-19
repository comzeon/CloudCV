<template>
  <div>
    <!-- 抽屉 -->
    <MyDrawer :trigger="addNode"></MyDrawer>
    <el-button @click="submit(toRaw(nodes))" type="primary" size="large" style="margin-left: 30px">提交工作流</el-button>

    <!-- 画布 -->
    <div class="my-canvas">
      <div
          v-for="node of Object.values(nodes)"
          :key="node.id"
          :id="node.id"
          class="node"
          :style="{ position: 'absolute', left: `${node.x}px`, top: `${node.y}px` }"
          @mouseover="mouseoverNodeHandler(node.id)"
          @mouseout="mouseoutNodeHandler(node.id)"
          @contextmenu.prevent="openNodePopover({x: node.x, y: node.y})"
      >
        {{ node.label }}
      </div>
      <MyPopover :is-visible="nodePopoverParams.isVisible" :x="nodePopoverParams.x" :y="nodePopoverParams.y"
          @deletion="nodePopoverDelete" @cancellation="nodePopoverCancel"
      >
        <template v-slot:other>
          <el-button type="info" size="small" @click="checkIdHandler">查看节点id</el-button>
          <el-button type="warning" size="small" plain @click="dialogActivator">打开调参面板</el-button>
          <el-button type="success" size="small" @click="bindLeftHandler">绑定至左画布</el-button>
          <el-button type="success" size="small" @click="bindRightHandler">绑定至右画布</el-button>
        </template>
      </MyPopover>
      <MyPopover :is-visible="connectionPopoverParams.isVisible" :x="connectionPopoverParams.x" :y="connectionPopoverParams.y"
                 @deletion="connectionPopoverDelete" @cancellation="connectionPopoverCancel"
      >
      </MyPopover>
      <MyDialog :is-visible="dialogVisible"></MyDialog>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick, reactive, toRaw, h} from "vue";
import { jsPlumb } from "jsplumb";
import {v4 as uuidv4} from 'uuid'
import {cloneDeep} from "lodash";

import MyDrawer from "@/components/core/MyDrawer.vue";
import MyPopover from "@/components/menu/MyPopover.vue";
import MyDialog from "@/components/menu/MyDialog.vue";
import jsPlumbInstance from "@/utils/jsPlumbInstance.js";
import {useSliderCache} from "@/stores/sliderCacheStore.js";
import {sliderParamParser} from "@/api/slider.js";
import {ElNotification} from "element-plus";

const props = defineProps({
  submit: {
    type: Function,
    default: undefined
  },
})

const emit = defineEmits(['bindLeft', 'bindRight'])

const drawerVisible = ref(false); // 控制抽屉显示状态
const dialogVisible = ref(false);  // 控制调参对话框显示状态
const dialogActivator = () => {
  sliderCache.setId(currentNodeId.value)
  console.log(sliderCache)
  sliderCache.rename(nodes.value[currentNodeId.value].label)
  dialogVisible.value = true;
}
const nodes = ref({}); // 存储所有节点信息
const sliderParam = sliderParamParser()  // 解析opsConfig.json后的数据
const sliderCache = useSliderCache()  // 调参Slider缓存数据
const jsPlumber = ref(null); // 存储 jsPlumb 实例
const connectionObj = ref(null); // 有需要时存储jsPlumb.bind中回调的参数info
const currentNodeId = ref(null); // 存储mouseover监听事件的nodeid
const nodePopoverParams = reactive({x: 0, y: 0, isVisible: false})
const connectionPopoverParams = reactive({x: 0, y: 0, isVisible: false})
const sourceConfig = {
  anchors: ["Right", "Bottom"],
  isSource: true,
  isTarget: false,
  maxConnections: -1,
  connectorStyle: { stroke: "#5c96bc", strokeWidth: 3 },
}
const targetConfig = {
  anchors: ["Left", "Top"],
  isSource: false,
  isTarget: true,
  maxConnections: -1,
  connectorStyle: { stroke: "#5c96bc", strokeWidth: 3 },
}

// 添加新节点
const addNode = (opName) => {
  const newNode = {
    id: `node-${uuidv4()}`,
    label: opName,
    x: 100 + Object.getOwnPropertyNames(nodes.value).length * 50, // 初始位置
    y: 100,
    linkTo: [],
    linkFrom: [],
  };
  nodes.value[newNode.id] = newNode; // 添加到节点列表
  sliderCache.update(newNode.id, cloneDeep(sliderParam.get(newNode.label)));  // 添加缓存数据
  sliderCache.rename(newNode.label)
  sliderCache.setId(newNode.id)
  nextTick(() => initNode(newNode.id)); // 等待节点渲染后初始化
};

// 初始化节点拖动和连线
const initNode = (id) => {
  const instance = jsPlumber.value;
  const nodeElement = document.getElementById(id);

  const node = nodes.value[id];
  // 检查节点是否已经初始化
  if (nodeElement && !nodeElement.dataset.initialized) {
    instance.draggable(id, {
      containment: "parent",
      drag: (params) => {
        const position = params.pos
        // 更新节点位置
        if (node) {
          node.x = position[0];
          node.y = position[1];
          nodePopoverParams.x = position[0] + 50
          nodePopoverParams.y = position[1] - 50
        }
      }
    });

    if(node.label === "输入")
      instance.addEndpoint(id, sourceConfig)
    else if(node.label === "输出")
      instance.addEndpoint(id, targetConfig)
    else{
      instance.addEndpoint(id, targetConfig);
      instance.addEndpoint(id, sourceConfig);
    }

    // 给节点添加已初始化的标识
    nodeElement.dataset.initialized = 'true';
  }
};

// jsPlumbEventHandler
const connectionHandler = (info) =>{
  const sourceNode = nodes.value[info.sourceId]
  sourceNode.linkTo.push(info.targetId)
  const targetNode = nodes.value[info.targetId]
  targetNode.linkFrom.push(info.sourceId)
  info.connection.bind("contextmenu", contextmenuHandler)
  info.connection.bind("mouseover", mouseoverHandler)
  info.connection.bind("mouseout", mouseoutHandler)
}
const connectionDetachedHandler = (info) => {
  const sourceNode = nodes.value[info.sourceId]
  sourceNode.linkTo = sourceNode.linkTo.filter(target => target !== info.targetId)
  const targetNode = nodes.value[info.targetId]
  targetNode.linkFrom = targetNode.linkFrom.filter(source => source !== info.sourceId)
}
const beforeDropHandler = (info) => {
  if(info.sourceId === info.targetId)
    return false
  else{
    const connections = jsPlumber.value.getConnections({source: info.sourceId})
    let flag = true
    for(let i = 0, len = connections.length; i < len; i ++){
      flag = connections[i].targetId !== info.targetId
      if(! flag)  break
    }
    return flag
  }
  return true
}
const keydownConnectorHandler = (event) => {
  if(event.key === "Delete"){
    jsPlumber.value.deleteConnection(connectionObj.value)
    window.removeEventListener("keydown", keydownConnectorHandler)
  }
}
const mouseoverHandler = (info) => {
  connectionObj.value = info
  window.addEventListener("keydown", keydownConnectorHandler)
}
const mouseoutHandler = (info) => {
  window.removeEventListener("keydown", keydownConnectorHandler)
}
const deleteNodeHandler = () => {
  // 与该node相关的connection删除
  const connections1 = jsPlumber.value.getConnections({source: currentNodeId.value})
  const connections2 = jsPlumber.value.getConnections({target: currentNodeId.value})
  const connections = connections1.concat(connections2)
  connections.forEach(connection => jsPlumber.value.deleteConnection(connection))
  // 与该节点相关的endpoint删除
  const endpoints = jsPlumber.value.getEndpoints(currentNodeId.value)
  endpoints.forEach(endpoint => jsPlumber.value.deleteEndpoint(endpoint))
  // node删除
  const node = document.getElementById(currentNodeId.value)
  node.remove()
  // nodes数据模型的节点删除
  sliderCache.remove(currentNodeId.value)
  // 缓存清理
  delete nodes.value[currentNodeId.value]
}
const checkIdHandler = () => {
  ((message, title, color) => {
    ElNotification({
      title: title,
      message: h('i', { style: `color: ${color}` }, message),
    })
  })(currentNodeId.value, "ID", 'gray')
}
const bindLeftHandler = () => {
  emit('bindLeft', currentNodeId.value)
  closeNodePopover()
}
const bindRightHandler = () => {
  emit('bindRight', currentNodeId.value)
  closeNodePopover()
}
const keydownNodeHandler = (event) => {
  if(event.key === "Delete"){
    deleteNodeHandler()
    window.removeEventListener("keydown", keydownNodeHandler)
  }
}
const mouseoverNodeHandler = (id) => {
  currentNodeId.value = id
  const node = document.getElementById(id);
  node.style.transform = "scale(1.2)";
  node.style.backgroundColor = "#bf4fa1";
  window.addEventListener("keydown", keydownNodeHandler)
}
const mouseoutNodeHandler = (id) => {
  const node = document.getElementById(id);
  node.style.transform = "scale(1)";
  node.style.backgroundColor = "#5c96bc"; // 恢复原样
  window.removeEventListener("keydown", keydownNodeHandler)
}
const contextmenuHandler = (info) => {
  connectionObj.value = info
  const sourceNode = document.getElementById(info.sourceId)
  const targetNode = document.getElementById(info.targetId)
  const positionX = (parseInt(sourceNode.style.left) + parseInt(targetNode.style.left)) / 2
  const positionY = (parseInt(sourceNode.style.top) + parseInt(targetNode.style.top)) / 2
  openConnectionPopover({x: positionX, y: positionY})
}
const openNodePopover = (position) => {
  nodePopoverParams.x = position.x + 50
  nodePopoverParams.y = position.y - 50
  nodePopoverParams.isVisible = true
}
const closeNodePopover = () => {
  nodePopoverParams.isVisible = false
  dialogVisible.value = false
}
const nodePopoverDelete = () => {
  deleteNodeHandler()
  closeNodePopover()
}
const nodePopoverCancel = () => {
  closeNodePopover()
}
const disableRightClick = (event) => {event.preventDefault()}
const openConnectionPopover = (position) => {
  window.addEventListener("contextmenu", disableRightClick)
  connectionPopoverParams.x = position.x + 50
  connectionPopoverParams.y = position.y - 70
  connectionPopoverParams.isVisible = true
}
const closeConnectionPopover = () => {
  connectionPopoverParams.isVisible = false
  window.removeEventListener("contextmenu", disableRightClick)
}
const connectionPopoverDelete = () => {
  jsPlumber.value.deleteConnection(connectionObj.value)
  closeConnectionPopover()
}
const connectionPopoverCancel = () => {
  closeConnectionPopover()
}

// 初始化 jsPlumb
const initJsPlumb = () => {
  jsPlumb.ready(() => {
    jsPlumbInstance.setContainer("canvas")
    jsPlumber.value = jsPlumbInstance;
    jsPlumber.value.bind("connection", connectionHandler)
    jsPlumber.value.bind("connectionDetached", connectionDetachedHandler)
    jsPlumber.value.bind("beforeDrop", beforeDropHandler)
  });
}

// 防止节点位置被重置的解决方案
const onDrawerToggle = () => {
  // 打开或关闭抽屉时，不触发重新渲染画布中的节点
  drawerVisible.value = !drawerVisible.value;
};

// Vue 生命周期钩子：组件挂载完成后初始化 jsPlumb
onMounted(() => {
  initJsPlumb();
});
</script>

<style scoped>
.workflow-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.my-canvas {
  flex: 1;
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  position: relative;
  background-color: #f5f4f1;
  margin-top: 20px;
}

 .node {
   width: 100px;
   height: 50px;
   background-color: #5c96bc;
   color: white;
   text-align: center;
   line-height: 50px;
   border-radius: 5px;
   cursor: pointer;
   transition: transform 0.3s, background-color 0.3s; /* 增加过渡效果 */
 }
</style>

<template>
  <div class="my-popover" v-if=props.isVisible :style="{'--x': `${props.x}px`, '--y': `${props.y}px`}">
    <slot name="other"></slot>
    <slot name="default">
      <el-button type="danger" plain size="small" @click="$emit('deletion')">删除</el-button>
      <el-button type="info" plain size="small" @click="$emit('cancellation')">取消</el-button>
    </slot>
  </div>
</template>

<script setup>
import {ref} from "vue";

const isVisible = ref(true)
const props = defineProps({
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.my-popover {
  flex: auto;
  display: flex;
  flex-direction: column;
  position: absolute;
  gap: 10px;
  left: var(--x);
  top: var(--y);
  justify-content: space-evenly;
  padding: 10px;

  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 5px 15px rgba(40, 40, 40, 0.4);
  border-radius: 5px;
  backdrop-filter: blur(7px);
}

.my-popover ::v-deep .el-button {
  margin: 0px 0; /* 给每个按钮统一上下外边距 */
  width: 100%; /* 确保按钮填满父容器的宽度 */
}
</style>
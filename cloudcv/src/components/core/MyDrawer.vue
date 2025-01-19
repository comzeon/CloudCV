<template>
  <el-button @click="drawerVisible = true" type="primary" size="large">添加工作流节点</el-button>

  <el-drawer v-model="drawerVisible" title="Groups" size="40%">
    <div v-for="(group, index) in groups" :key="index" class="group">
      <el-button @click="toggleInnerDrawer(index)" :type=buttonType[innerDrawerVisible[index]]>
        {{ group.groupName }}
      </el-button>

      <el-drawer
          v-model="innerDrawerVisible[index]"
          :title="group.groupName"
          :append-to-body="true"
      >
        <div v-for="(item, idx) in group.content" :key="idx" @click="props.trigger(item.name)" class="ops">
          <el-button>{{ item.name }}</el-button>
        </div>
      </el-drawer>
    </div>
  </el-drawer>
</template>

<script setup>
import {ref} from 'vue';
import opsConfig from "@/config/opsConfig.json"

const props = defineProps({trigger: {type: Function, default: undefined}})

// Reactive state for drawers
const drawerVisible = ref(false);
const innerDrawerVisible = ref(opsConfig.map(() => false));
const buttonType = {true: "primary", false: "info"};
// Groups data
const groups = ref(opsConfig);

// Toggle inner drawer visibility
const toggleInnerDrawer = (index) => {
  innerDrawerVisible.value[index] = !innerDrawerVisible.value[index];
};
</script>

<style scoped>
.group {
  margin-bottom: 16px;
}

.ops {
  margin-bottom: 16px;
}
</style>

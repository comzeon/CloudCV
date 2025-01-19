<template>
  <el-form
      ref="formRef"
      style="max-width: 600px"
      :model="numberValidateForm"
      label-width="auto"
      class="demo-ruleForm"
  >
    <el-form-item v-for="paramName of Object.keys(numberValidateForm)"
                  :label="paramName" :prop="paramName" :key="paramName"
                  :rules="[{ required: true, message: 'age must be a number' },
                  { type: 'number', message: 'age must be a number' },]">
      <el-input v-model.number="numberValidateForm[paramName]" type="number"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)">应用</el-button>
      <el-button @click="resetForm(formRef)">恢复默认</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {reactive, ref, toRaw, h} from 'vue'
import {cloneDeep} from "lodash";
import { ElNotification } from 'element-plus'

import {useSliderCache} from "@/stores/sliderCacheStore.js";

const props = defineProps({
  param: {
    type: Object,
    default: {}
  },
  name: {
    type: String,
    default: ""
  }
})

const formRef = ref(null)
const sliderCache = useSliderCache()

const numberValidateForm = reactive(props.param)
const backup = cloneDeep(toRaw(numberValidateForm))

const open = (message, title, color) => {
  ElNotification({
    title: title,
    message: h('i', { style: `color: ${color}` }, message),
  })
}

// !!!!!!!!!!!每一张表单都要点击“应用”
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      sliderCache.getter(sliderCache.getId())[props.name] = numberValidateForm
      open("修改成功", "SUCCESS", "teal")
    } else open("修改失败", "ERROR", "red")
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  for(let [key, val] of Object.entries(backup))
    numberValidateForm[key] = val
}
</script>

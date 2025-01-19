<template>
  <el-upload
      ref="uploadRef"
      name="files"
      :http-request="packer"
      class="upload-demo"
      list-type="picture-card"
      :on-preview="handlePreview"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :auto-upload="false"
      multiple
      v-model:file-list="files"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      拖动图片至此 <p><em>点击上传</em></p>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500KB
      </div>
    </template>
  </el-upload>

  <!-- 确认上传按钮 -->
  <el-button type="primary" @click="submitUpload" :disabled="!files.length">
    确认上传
  </el-button>

  <!-- 图片预览窗口 -->
  <el-dialog v-model="previewVisible" width="50%">
    <img :src="imageUrl" alt="Preview" style="width: 100%; height: auto" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="previewVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { baseURL } from '@/utils/request'
import { uploadFiles } from '@/api/upload'
import request from '@/utils/request'

const previewVisible = ref(false) // 控制预览窗口的显示
const imageUrl = ref('') // 存储图片的预览地址
const files = ref([]) // 存储上传的文件
const uploadRef = ref(null)

// 上传成功的回调
const handleSuccess = (response, file) => {
  ElMessage.success('上传成功')
}

// 上传失败的回调
const handleError = (err, file) => {
  ElMessage.error('上传失败，请重试')
}

// 删除文件时的回调
const handleRemove = (file) => {
  ElMessage.success(`删除了文件: ${file.name}`)
}

// 图片预览
const handlePreview = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
    previewVisible.value = true // 显示预览窗口
  }
  reader.readAsDataURL(file.raw) // 读取文件内容
}

// 上传前的检查
const beforeUpload = (file) => {
  const isJpgOrPng = ['image/jpeg', 'image/png'].includes(file.type) // 限制文件格式
  const isLt500K = file.size / 1024 / 1024 < 0.5 // 限制文件大小为 500KB
  if (!isJpgOrPng) {
    ElMessage.error('只能上传 JPG/PNG 格式的文件')
  }
  if (!isLt500K) {
    ElMessage.error('上传图片大小不能超过 500KB')
  }
  return isJpgOrPng && isLt500K // 返回 false 会阻止上传
}

// 手动触发上传
const submitUpload = async () => {
  if (uploadRef.value) {
    for (const file of files.value) {
      await packer({
        file: file.raw, // 使用 raw 文件上传
        onSuccess: handleSuccess,
        onError: handleError
      })
    }
  }
}

// 自定义上传逻辑
const packer = async (options) => {
  const formData = new FormData()
  formData.append('files', options.file)
  try {
    const response = await uploadFiles(formData)
    options.onSuccess(response)
  } catch (error) {
    options.onError(error)
  }
}

const test = async () => {
  console.log(await request.get("/test", {params: {"id": "1"}}))
}
test()
</script>

<style scoped>
.upload-demo {
  max-width: 600px;
  display: flex;
  align-items: center;
}
.upload-demo .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
</style>

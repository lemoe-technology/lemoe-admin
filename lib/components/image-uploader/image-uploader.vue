<template>
  <div class="image-uploader">
    <el-space wrap alignment="start">
      <div v-for="url in urls" :key="url" class="image">
        <el-image :src="url" fit="contain" />
        <span class="image-remove" @click="handleRemove(url)">
          <el-icon><close-icon /></el-icon>
        </span>
      </div>
      <el-upload
        v-if="max === -1 || urls.length < max"
        drag
        action=""
        :show-file-list="false"
        :on-success="(url) => handleAppend(url)"
        :before-upload="beforeUpload"
        :http-request="upload"
      >
        <div class="image-upload-btn">
          <el-icon><upload /></el-icon>
        </div>
      </el-upload>
    </el-space>
  </div>
</template>

<script>
export default {
  name: 'LeImageUploader',
};
</script>

<script setup>
import { Close as CloseIcon, Upload } from 'icon-park-vue3';
import { getCurrentInstance, ref } from 'vue';

const { appContext, emit } = getCurrentInstance();

const props = defineProps({
  modelValue: {
    type: Array,
    default() {
      return [];
    },
  },
  upload: {
    type: Function,
    required: true,
  },
  max: {
    type: Number,
    default() {
      return -1;
    },
  },
});

const urls = ref(props.modelValue);

const beforeUpload = (file) => {
  if (!/image\//.test(file.type)) {
    appContext.config.globalProperties.$message({
      message: '图片格式不正确',
      type: 'error',
    });
    return false;
  }
  return true;
};

const handleAppend = (url) => {
  urls.value.push(url);
  emit('update:modelValue', urls.value);
};

const handleRemove = (url) => {
  urls.value.splice(urls.value.indexOf(url), 1);
  emit('update:modelValue', urls.value);
};
</script>

<style lang="scss">
.image-uploader {
  .image {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    box-sizing: border-box;

    .el-image {
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }

    .image-remove {
      display: none;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border-radius: 6px;
      background: #000;
      opacity: 0.5;
      color: #fff;
      font-size: 24px;
      cursor: pointer;
    }

    &:hover {
      border-color: var(--el-color-primary);

      .image-remove {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .el-upload-dragger {
    width: initial !important;
    height: initial !important;
    border: none !important;

    &.is-dragover {
      border: none;
    }
  }

  .image-upload-btn {
    display: flex;
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;

    &:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon {
      margin: auto;
    }
  }
}
</style>

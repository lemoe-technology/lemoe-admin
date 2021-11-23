<template>
  <div class="media-uploader">
    <draggable
      v-model="urls"
      :item-key="(url) => url"
      class="media-uploader-list"
    >
      <template #item="{ element }">
        <div class="media-uploader-item">
          <template v-if="type === 'image'">
            <img :src="element" />
          </template>
          <template v-if="type === 'video'">
            <video :src="element" />
          </template>
          <span class="media-uploader-remove">
            <el-icon @click="handleRemove(element)"><close-icon /></el-icon>
          </span>
        </div>
      </template>

      <template #footer>
        <el-upload
          v-if="max === -1 || urls.length < max"
          action=""
          multiple
          :show-file-list="false"
          :on-success="(url) => handleAppend(url)"
          :before-upload="beforeUpload"
          :http-request="upload"
        >
          <div class="media-uploader-btn">
            <el-icon><upload /></el-icon>
          </div>
        </el-upload>
      </template>
    </draggable>
  </div>
</template>

<script>
export default {
  name: 'LeMediaUploader',
};
</script>

<script setup>
import { Close as CloseIcon, Upload } from '@icon-park/vue-next';
import { ElMessage } from 'element-plus';
import { ref, watch } from 'vue';
import draggable from 'vuedraggable/src/vuedraggable';

const emits = defineEmits(['update:modelValue']);
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
  type: {
    type: String,
    required: true,
    validator(value) {
      return ['image', 'video'].includes(value);
    },
  },
  max: {
    type: Number,
    default() {
      return -1;
    },
  },
});

const urls = ref(props.modelValue);

watch(
  () => props.modelValue,
  (value) => (urls.value = value)
);
watch(urls, (value) => {
  emits('update:modelValue', value);
});

const beforeUpload = (file) => {
  if (props.type === 'image') {
    if (!/image\//.test(file.type)) {
      ElMessage.error('图片格式不正确');
      return false;
    }
  } else if (props.type === 'video') {
    if (!/video\//.test(file.type)) {
      ElMessage.error('视频格式不正确');
      return false;
    }
  }
  return true;
};

const handleAppend = (url) => {
  urls.value.push(url);
  if (props.max !== -1 && urls.value.length > props.max) {
    urls.value.splice(0, 1);
  }
};

const handleRemove = (url) => {
  urls.value.splice(urls.value.indexOf(url), 1);
};
</script>

<style lang="scss">
.media-uploader {
  &-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &-item {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;

    img,
    video {
      width: 100%;
      height: 100%;
      border-radius: 6px;
      object-fit: contain;
    }

    &:hover {
      border-color: var(--el-color-primary);

      .media-uploader-remove {
        display: block;
      }
    }
  }

  &-remove {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    cursor: pointer;

    .el-icon {
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }

  &-btn {
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

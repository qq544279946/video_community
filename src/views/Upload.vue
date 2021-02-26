<template>
  <div class="upload-view">
    <video style="display: none" :src="videoSrc" ref="videoDom"></video>
    <div class="upload-view__header">视频发布</div>
    <div class="upload-view__form-box">
      <van-form @submit="onSubmit">
        <van-uploader :max-count="1" accept=".mp4" :after-read="afterReadVideo">
          <div class="upload-view__upload-btn">
            <van-button icon="plus">上传视频</van-button>
            <div class="upload-view__video-title" v-if="uploadForm.video">
              {{ uploadForm.video.name }}
            </div>
          </div>
        </van-uploader>
        <div class="upload-view__base-info-header">基础信息</div>
        <div class="upload-view__form-item-box">
          <div class="upload-view__form-item-box__label">封面选择</div>
          <van-uploader
            v-model="selectedPoster"
            :max-count="1"
            :after-read="afterReadPoster"
          />
        </div>
        <div class="upload-view__form-item-box">
          <div class="upload-view__form-item-box__label">标题</div>
          <van-field
            v-model="uploadForm.title"
            name="title"
            placeholder="请输入标题"
            maxlength="80"
            show-word-limit
            :rules="[{ required: true, message: '请填写标题' }]"
          />
        </div>

        <div class="upload-view__form-item-box">
          <div class="upload-view__form-item-box__label">分区</div>
          <van-field
            v-model="panelValue"
            is-link
            readonly
            placeholder="请选择分区"
            @click="showPanel = true"
          />
        </div>

        <div class="btn-box">
          <router-link to="/space">
            <van-button block native-type="button">返回</van-button>
          </router-link>
          <van-button block native-type="submit">发布</van-button>
        </div>
      </van-form>
    </div>
    <van-popup v-model="showPanel" round position="bottom">
      <van-cascader
        :field-names="fieldNames"
        v-model="panelValue"
        title="请选择分区"
        :options="panelOption"
        active-color="#fb7299"
        @close="showPanel = false"
        @change="panelValue = ''"
        @finish="onFinish"
      />
    </van-popup>
  </div>
</template>

<script>
import { getCategory } from "../api/category";
import { upload } from "../api/upload";
export default {
  async created() {
    const res = await getCategory();
    console.log(res);
    this.panelOption = res.data;
  },
  data() {
    return {
      videoSrc: "",

      showPanel: false,
      panelValue: "",
      fieldNames: {
        text: "name",
        value: "value",
        children: "children",
      },
      panelOption: [],

      // 选择的封面图片
      selectedPoster: [],

      //   需要上传的表单数据
      uploadForm: {
        video: null,
        title: "",
        poster: null,
        category: [],
        during_time: 0,
      },
    };
  },
  methods: {
    async onSubmit() {
      const data = {
        ...this.uploadForm,
      };
      const formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      const result = await upload(formData);
      console.log("upload", result);
      if (result.code === "200") {
        this.$router.replace("/space");
      }
    },
    onFinish({ selectedOptions }) {
      console.log(selectedOptions);
      this.uploadForm.category = [
        selectedOptions[0].value,
        selectedOptions[1].value,
      ];
      this.showPanel = false;
      this.panelValue = selectedOptions.map((option) => option.name).join("/");
    },
    afterReadPoster(fileInfo) {
      console.log(fileInfo.file);
      this.uploadForm.poster = fileInfo.file;
    },
    afterReadVideo(fileInfo) {
      console.log(fileInfo.file);
      this.uploadForm.video = fileInfo.file;
      this.videoSrc = URL.createObjectURL(fileInfo.file);

      setTimeout(() => {
        this.uploadForm.during_time = this.$refs.videoDom.duration;
        console.dir(this.$refs.videoDom.duration);
      }, 100);
    },
  },
};
</script>

<style scoped>
.upload-view {
  height: 100vh;
  background-color: #f4f4f4;
}
.upload-view__header {
  padding: 0 3.2vw;
  height: 11.73333vw;
  background-color: #fff;
  text-align: center;
  line-height: 11.73333vw;
  font-size: 4.26667vw;
  color: #212121;
}

.upload-view__form-box {
  padding: 0 2vw;
  padding-top: 4.26667vw;
}

.upload-view__form-box >>> .van-form > * {
  margin-bottom: 2vw;
}
.upload-view__upload-btn {
  display: flex;
  align-items: center;
}
.upload-view__upload-btn >>> .van-button {
  background-color: var(--theme-color);
  color: #fff;
  border-radius: 1vw;
}

.upload-view__video-title {
  margin-left: 4vw;
}

.upload-view__base-info-header {
  padding-top: 4vw;
  font-weight: 700;
  border-top: 1px solid hsl(0deg 0% 90%);
}

.upload-view__form-item-box {
  font-size: 14px;
}

.upload-view__form-item-box >>> .van-uploader__upload {
  width: 37.33333vw;
  height: 22.31vw;
}

.upload-view__form-item-box >>> .van-uploader__preview-image {
  width: 37.33333vw;
  height: 22.31vw;
}

.upload-view__form-item-box__label {
  margin-bottom: 1vw;
}

.btn-box {
  display: flex;
  justify-content: space-around;
  margin-top: 4.2vw;
}

.btn-box >>> .van-button {
  width: 45.33333vw;
  height: 11.73333vw;
  border: 1px solid #ff9db5;
  background-color: #ff9db5;
  color: #fff;
  font-size: 3.733vw;
  border-radius: 1.02vw;
}

.btn-box >>> .van-button:first-child {
  width: 45.33333vw;
  height: 11.73333vw;
  border: 1px solid #ff9db5;
  background-color: transparent;
  color: #ff9db5;
  font-size: 3.733vw;
  border-radius: 1.02vw;
}
</style>
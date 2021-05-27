<template>
  <div class="upload-view">
    <div class="upload-view__header">视频发布</div>
    <div class="upload-view__form-box">
      <van-form @submit="onSubmit">
        <van-uploader
          :max-count="1"
          accept=".mp4,.flv,.webm,.ogg"
          :compressed="false"
          :preview-image="false"
          :after-read="afterReadVideo"
          :before-read="beforeReadVideo"
          :disabled="percentage < 100 && percentage !== 0"
        >
          <div class="upload-view__upload-btn">
            <van-button icon="plus">上传视频</van-button>
            <div class="upload-view__video-title" v-if="uploadForm.video">
              {{ uploadForm.video.name }}
            </div>
          </div>
        </van-uploader>
        <div class="upload-msg" style="font-size: 4vw">
          <span v-show="percentage === 100">上传成功</span>
          <span v-show="percentage !== 0 && percentage !== 100">正在上传</span>
          <span v-show="percentage == 0">未选择文件</span>
        </div>
        <van-progress
          :percentage="percentage"
          stroke-width="2"
          :show-pivot="false"
          color="#fb7299"
        />

        <div class="upload-view__base-info-header">基础信息</div>
        <div class="upload-view__form-item-box">
          <div class="upload-view__form-item-box__label">封面选择</div>
          <van-uploader
            v-model="selectedPoster"
            :max-count="1"
            :after-read="afterReadPoster"
            :before-read="beforeReadPoster"
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
          <van-button block native-type="submit" :disabled="percentage < 100"
            >发布</van-button
          >
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
import { getCredential } from "../api/credential";
import COS from "cos-js-sdk-v5";
export default {
  async created() {
    let cos = new COS({
      // 必选参数
      getAuthorization: async function (options, callback) {
        const data = await getCredential();
        let credentials = data.credentials;
        callback({
          TmpSecretId: credentials.tmpSecretId,
          TmpSecretKey: credentials.tmpSecretKey,
          XCosSecurityToken: credentials.sessionToken,
          // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
          StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
          ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
          ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
        });
      },
    });
    console.log(cos);
    this.cos = cos;

    const res = await getCategory();
    console.log(res);
    this.panelOption = res.data;
  },
  data() {
    return {
      cos: null,
      percentage: 0,
      videoSrc: null,

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
        videoUrl: null,
        title: "",
        posterUrl: null,
        category: [],
        during_time: 0,
      },
    };
  },
  methods: {
    async onSubmit() {
      // console.log(upload);
      const data = {
        ...this.uploadForm,
      };
      const formData = new FormData();
      for (let key in data) {
        formData.append(key, data[key]);
      }
      const result = await upload(data);
      console.log("upload", result);
      if (result.code === "200") {
        if(result.data === 'success'){
          this.$message('上传成功');
          this.$router.replace("/space");
        }else{
          this.$message('上传的视频无效')
        }
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
    beforeReadPoster(file){
      if(!/image\//.test(file.type)){
        this.$message('图片类型格式不正确')
        return false;
      }
      return true
    },
    afterReadPoster(fileInfo) {
      
      let self = this;
      fileInfo.status = 'uploading';
      fileInfo.message = '上传中...';
      this.cos.putObject(
        {
          Bucket: "test-1300545604" /* 必须 */,
          Region: "ap-guangzhou" /* 存储桶所在地域，必须字段 */,
          Key: `${new Date().getTime()}` /* 必须 */,
          StorageClass: "STANDARD",
          Body: fileInfo.file, // 上传文件对象
          
        },
        function (err, data) {
          console.log(err || data);
          self.uploadForm.posterUrl = `https://${data.Location}` ;
          fileInfo.status = 'success';
          fileInfo.message = '上传成功';
        }
      );
    },
    beforeReadVideo(file){
      console.log(file)
      if(!/\.(mp4|rmvb|flv|mpeg|avi)$/.test(file.name)){
        this.$message('视频类型格式不正确')
        return false;
      }
      if(file.size > 250000000){
        this.$message('视频大小不能超过200M')
        return false;
      }
      return true;
    },
    afterReadVideo(fileInfo) {
      
      console.log(fileInfo);
      
      let self = this;
      this.cos.putObject(
        {
          Bucket: "test-1300545604" /* 必须 */,
          Region: "ap-guangzhou" /* 存储桶所在地域，必须字段 */,
          Key: `${new Date().getTime()}` /* 必须 */,
          StorageClass: "STANDARD",
          Body: fileInfo.file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
            self.percentage = progressData.percent * 100;
          },
        },
        function (err, data) {
          console.log(err || data);
          self.uploadForm.videoUrl = `https://${data.Location}`;
        }
      );
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
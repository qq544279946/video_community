<template>
  <div class="video-view">
    <Header></Header>
    <div class="video-player" ref="videoPlayerDom">
      <div class="video-player__container">
        <picture>
          <img
            :src="videoInfo.imgSrc | handleImgSrc"
            alt=""
            style="display: none"
          />
        </picture>
        <div class="video-player__player">
          <div class="danmu">
            <canvas class="danmu__canvas" ref="canvas"></canvas>
          </div>
          <div class="video-player__video-wrap">
            <e-player
              :src="videoInfo.videoSrc"
              ref="video2"
              :poster="videoInfo.imgSrc | handleImgSrc"
            >
            </e-player>
          </div>
          <div class="danmu-bar">
            <div class="left">
              <van-field
                v-model="danmu"
                type="danmu"
                name="danmu"
                placeholder="发送弹幕"
                @keyup.enter="sendDanmu"
              />
              <ColorPicker
                v-model="color"
                :disabled="disabled"
                :colorType="colorType"
                :useConfirm="useConfirm"
              ></ColorPicker>
              <van-button
                block
                @click="sendDanmu"
                style="width: 20vw; margin-left: 0.5vw"
                >发送</van-button
              >
            </div>
            <div class="right">
              <van-popover
                v-model="showPopover"
                trigger="click"
                :actions="actions"
                @select="onSelect"
                placement="left-start"
              >
                <template #reference>
                  <van-button style="margin-left: 0.5vw">弹幕数</van-button>
                </template>
              </van-popover>
            </div>
          </div>
        </div>
      </div>

      <div class="video-player__info">
        <div class="video-player__info__title">
          <h1 class="left">{{ videoInfo.title }}</h1>
          <div class="right" @click="showMoreInfo" ref="arrowDom">
            <i class="iconfont general_pulldown_s"></i>
          </div>
        </div>
        <div class="video-player__info__fold-container" ref="foldDom">
          <div class="video-player__info__fold-container__up">
            <div class="video-player__info__fold-container__up__face">
              <router-link
                :to="`/space/${userInfo.user_id}`"
                class="video-player__info__fold-container__up__face__avatar"
              >
                <img src="../assets/imgs/face_login.jpg" alt="" />
              </router-link>
              <div class="video-player__info__fold-container__up__face__info">
                <div
                  class="video-player__info__fold-container__up__face__info__name"
                >
                  {{ userInfo.user_name }}
                </div>
                <div class="video-player__info__fold-container__up__face__fans">
                  {{ userInfo.fansCount }}粉丝
                </div>
              </div>
            </div>
            <div
              class="video-player__info__fold-container__up__follow"
              :class="{ isWatch: isWatch }"
            >
              <van-button plain block @click="watchUser"
                ><i class="iconfont ic_add1"></i> 关注</van-button
              >
            </div>
          </div>
          <div class="video-player__info__fold-container__data">
            <span class="video-player__info__fold-container__data__view"
              >{{ videoInfo.playCount }}观看</span
            >
            <span
              class="video-player__info__fold-container__data__danmu"
              v-if="videoInfo.bulletScreenCount"
              >{{ videoInfo.bulletScreenCount }}弹幕</span
            >
            <span class="video-player__info__fold-container__data__time">{{
              videoInfo.create_time | dateFormat
            }}</span>
            <span class="video-player__info__fold-container__data__bvid">{{
              videoInfo.video_id
            }}</span>
          </div>
        </div>
      </div>
      <div class="video-player__toolbar">
        <span class="left">
          <router-link
            :to="`/space/${userInfo.user_id}`"
            class="video-player__toolbar__avatar"
          >
            <img src="../assets/imgs/face_login.jpg" alt="" />
          </router-link>
          <span class="video-player__toolbar__name">{{
            userInfo.user_name
          }}</span>
        </span>
        <span class="right">
          <span @click="like">
            <i class="iconfont dianzan" :class="{ 'click-color': isLike }"></i
            >{{ videoInfo.likeCount }}
          </span>
          <span @click="userCollectVideo">
            <i
              class="iconfont icon_fav"
              :class="{ 'click-color': isCollect }"
            ></i
            >{{ collectCount }}
          </span>
        </span>
      </div>
      <div class="video-player__nav">
        <Nav :navItems="navItems"></Nav>
      </div>
      <div class="video-comment-list">
        <div class="video-comment" v-for="item in commentList" :key="item.id">
          <div class="video-comment__left">
            <router-link
              :to="`/space/${item.from_uid}`"
              class="video-comment__from-user-avator"
            >
              <img src="../assets/imgs/face_login.jpg" alt="" />
            </router-link>
          </div>
          <div class="video-comment__right">
            <div class="video-comment__from-user-name">
              {{ item.from_uname }}
            </div>
            <div class="video-comment__create-time">
              {{ item.create_time | dateFormat }}
            </div>
            <div class="video-comment__content">
              <span v-if="item.to_uid"
                >回复
                <router-link
                  :to="`/space/${item.to_uid}`"
                  class="video-comment__to-user-name"
                  >@{{ item.to_uname }}</router-link
                >:</span
              >
              {{ item.content }}
            </div>
            <div
              class="video-comment__reply-btn"
              v-if="user === null || item.from_uid != user.id"
            >
              <router-link
                :to="`/comment?video_id=${videoInfo.video_id}&to_uid=${item.from_uid}`"
                ><span class="reply-btn">回复</span></router-link
              >
            </div>
          </div>
        </div>
      </div>

      <div class="add-comment-bar">
        <div class="comment-text">
          <router-link :to="`/comment?video_id=${videoInfo.video_id}&to_uid=0`">
            <van-field placeholder="发条友善的评论" disabled />
          </router-link>
        </div>
        <!-- <span class="comment-send-btn">发布</span> -->
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../components/layout/Header";
import Nav from "../components/layout/Nav";
import navData from "../assets/js/navData";
import { getViewInfoByVideoId, playCountAdd, like, isLike } from "../api/video";
import { getCommentByVideoId } from "../api/comment";
import { watchUser, isWatchUser } from "../api/user";
import { userCollectVideo, isCollect, getCollectCount } from "../api/collect";
// import CanvasBarrage from "../utils/CanvasBarrage";
import Danmu from "../eplayer/danmu.js";
import { sendDanmu, getDanmu } from "../api/danmu.js";
import { mapState } from "vuex";

import "heyui/themes/index.less";

export default {
  components: {
    Header: Header,
    Nav: Nav,
  },
  async created() {
    this.getCommentByVideoId(this.video_id);
    // console.log(commentrResult)

    let result = await getViewInfoByVideoId({
      videoId: this.video_id,
    });
    if (result.code === "200") {
      this.videoInfo = result.data.videoInfo;
      this.videoInfo.videoSrc += "_transcode_100010.mp4";
      this.userInfo = result.data.userInfo;
    }

    if (this.user) {
      this.isWatchUser({
        from_uid: this.user.id,
        to_uid: this.userInfo.user_id,
      });
      this.isUserCollect({
        from_uid: this.user.id,
        video_id: this.videoInfo.video_id,
      });
    }
    this.getCollectCount();
    this.userIsLike();
    playCountAdd(this.video_id);
  },
  async mounted() {
    let danmuData = [];
    let result = await this.getDanmu();
    if (result.code == 200) {
      danmuData = result.data;
    }
    this.actions = danmuData.map((item) => {
      let h = parseInt(item.time / 60 / 60);
      let m = parseInt(item.time / 60);
      let s = parseInt(item.time % 60);
      return { text: `时间: ${h}:${m}:${s} ${item.value}`, time: item.time };
    });
    let { canvas, video2 } = this.$refs;
    console.dir(video2);
    let innerVideo = video2.video;
    console.dir(innerVideo, "video");
    let dm = new Danmu(canvas, innerVideo, danmuData);
    this.danmuSystem = dm;
    this.videoPlayer = innerVideo;
    innerVideo.addEventListener("play", function () {
      dm.play();
    });
    innerVideo.addEventListener("pause", function () {
      dm.pause();
    });
    innerVideo.addEventListener("seeked", function () {
      dm.reset();
    });

    // 操作历史记录
    let obStr = localStorage.getItem("video_history");
    let ob = {};
    if (obStr) {
      ob = JSON.parse(obStr);
    }
    console.log(ob, ob[this.video_id]);
    if (ob[this.video_id]) {
      this.videoPlayer.currentTime = ob[this.video_id];
    }
    // let canvasBarrage = new CanvasBarrage(canvas, video, {
    //   data: danmuData,
    // });
    // console.log(canvasBarrage);
  },
  beforeDestroy() {
    let obStr = localStorage.getItem("video_history");
    let ob = {};
    if (obStr) {
      ob = JSON.parse(obStr);
    }
    ob[this.videoInfo.video_id] = this.videoPlayer.currentTime;
    localStorage.setItem("video_history", JSON.stringify(ob));
  },
  data() {
    return {
      navItems: navData.videoNav,
      videoInfo: {},
      userInfo: {},
      commentList: [],
      // 是否已经关注
      isWatch: false,
      isCollect: false,
      isLike: false,

      collectCount: 0,

      danmu: "",

      // 颜色选择器属性
      colorType: "rgb",
      disabled: false,
      useConfirm: false,
      color: "#fff",

      showPopover: false,
      // 通过 actions 属性来定义菜单选项
      actions: [{ text: "选项一" }, { text: "选项二" }, { text: "选项三" }],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
    video_id() {
      return this.$route.query.video_id;
    },
  },
  methods: {
    onSelect(action) {
      console.log(action);
      this.videoPlayer.currentTime = action.time;
    },
    // 获取弹幕
    async getDanmu() {
      let result = await getDanmu({ video_id: this.video_id });
      console.log(result);
      return result;
    },
    // 发送弹幕
    async sendDanmu() {
      if (this.danmu == "") {
        this.$message("弹幕不能为空");
        return;
      }
      if (!this.user) {
        this.$message("请先登录");
        this.$router.replace("/login");
        return;
      }

      console.log(this.videoPlayer.currentTime);
      let data = {
        value: this.danmu,
        time: this.videoPlayer.currentTime,
        color: this.color,
      };
      this.danmuSystem.add(data);
      this.danmu = "";

      data.video_time = data.time;
      data.video_id = this.video_id;
      data.user_id = this.user.id;
      let h = parseInt(data.time / 60 / 60);
      let m = parseInt(data.time / 60);
      let s = parseInt(data.time % 60);
      this.actions.push({ text: `时间: ${h}:${m}:${s} ${data.value}`, time: data.time });
      let result = await sendDanmu(data);
      console.log(result);
    },
    // 点赞
    async like() {
      if (!this.user) {
        this.$router.push("/login");
        return;
      }
      let result = await like({
        user_id: this.user.id,
        video_id: this.videoInfo.video_id,
      });
      console.log(result);
      if (result.data === true) {
        this.videoInfo.likeCount++;
        this.isLike = true;
      } else if (result.data === false) {
        this.videoInfo.likeCount--;
        this.isLike = false;
      }
    },
    async userIsLike() {
      if (!this.user) {
        return;
      }
      let result = await isLike({
        user_id: this.user.id,
        video_id: this.videoInfo.video_id,
      });
      console.log(result);
      if (result.data === true) {
        this.isLike = true;
      } else if (result.data === false) {
        this.isLike = false;
      }
    },
    showMoreInfo() {
      this.$refs.videoPlayerDom.classList.toggle("spread");
    },
    async getCommentByVideoId(videoId) {
      let result = await getCommentByVideoId({
        video_id: videoId,
      });
      if (result.code === "200") {
        console.log("1234");
        this.commentList = result.data;
      }
    },
    async watchUser() {
      if (!this.user) {
        this.$router.push("/login");
        return;
      }
      let result = await watchUser({
        from_uid: this.user.id,
        to_uid: this.userInfo.user_id,
      });
      if (result.code === "200") {
        if (result.result) {
          this.isWatch = true;
        } else {
          this.isWatch = false;
        }
        this.$message(result.msg);
      }
    },
    async isWatchUser(data) {
      let result = await isWatchUser(data);
      this.isWatch = result.data;
    },
    async userCollectVideo() {
      if (!this.user) {
        this.$router.push("/login");
        return;
      }
      let result = await userCollectVideo({
        from_uid: this.user.id,
        to_uid: this.userInfo.user_id,
        video_id: this.videoInfo.video_id,
      });
      if (result.code === "200") {
        this.isCollect = result.data;
        if (result.data) {
          this.collectCount++;
        } else {
          this.collectCount--;
        }
      }
    },

    async isUserCollect(data) {
      let result = await isCollect(data);
      this.isCollect = result.data;
    },

    async getCollectCount() {
      let res = await getCollectCount({
        video_id: this.video_id,
      });
      if (res.code === "200") {
        this.collectCount = res.data;
      }
    },
  },
  filters: {
    dateFormat(value) {
      const date = new Date(value);
      const dateStr = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      return dateStr;
    },
    handleImgSrc(src) {
      return `${src}/middle`;
    },
  },
};
</script>

<style scoped>
.video-player {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 56.25%;
}

.video-player.spread .video-player__info__title .right {
  transform: rotate(0deg);
}

.video-player.spread .video-player__info__fold-container {
  height: 27vw;
}

.video-player.spread .video-player__toolbar .left {
  display: none;
}

.video-player.spread .video-player__toolbar .right {
  margin-left: 0;
}

.video-player__container {
}

.video-player__container img {
  z-index: var(--video-cover-z-index);
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}

.video-player__player {
  /* z-index: var(--video-z-index); */
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.video-player__video-wrap {
  height: 100%;
  width: 100%;
}

.video-player__video-wrap video {
  display: block;
  height: 100%;
  width: 100%;
}

.video-player__info {
  margin-top: 13.66667vw;
  padding: 0 3.2vw;
}

.video-player__info__fold-container {
  display: flex;
  flex-direction: column;
  height: 0vw;
  overflow: hidden;
  transition: height 0.3s;
}

.video-player__info__fold-container__up {
  display: flex;
  justify-content: space-between;
  margin-top: 4vw;
}
.video-player__info__fold-container__up__face {
  display: flex;
}

.video-player__info__fold-container__up__face__avatar {
  margin-right: 2.66667vw;
}

.video-player__info__fold-container__up__face__avatar img {
  width: 9.6vw;
  height: 9.6vw;
  border-radius: 4.8vw;
  border: 0.5px solid #999;
}

.video-player__info__fold-container__up__face__info {
}

.video-player__info__fold-container__up__face__info__name {
  font-size: 3.73333vw;
  color: #212121;
  height: 4.53333vw;
  line-height: 4.53333vw;
}

.video-player__info__fold-container__up__face__fans {
  margin-top: 1.33333vw;
  font-size: 3.2vw;
  height: 3.2vw;
  line-height: 3.2vw;
  color: #999;
}

.video-player__info__fold-container__up__follow >>> .van-button--plain {
  width: 17.6vw;
  height: 6.4vw;
  padding: 0;
  border-radius: 1.06667vw;
  font-size: 3.46667vw;
  background-color: var(--theme-color);
  color: #fff;
  border: 1px solid var(--theme-color);
}

.video-player__info__fold-container__up__follow.isWatch >>> .van-button--plain {
  background-color: #fff;
  color: var(--theme-color);
}

.video-player__info__fold-container__data {
  margin-top: 2.66667vw;
  font-size: 3.3vw;
  color: #999;
}

.video-player__info__fold-container__data__view {
  margin-right: 2.13333vw;
}

.video-player__info__fold-container__data__danmu {
  margin-right: 2.13333vw;
}

.video-player__info__fold-container__data__time {
  margin-right: 2.13333vw;
}

.video-player__info__fold-container__data__bvid {
  margin-right: 2.13333vw;
}

.video-player__info__title {
  display: flex;
  align-items: center;
}
.video-player__info__title .left {
  width: 86.66667vw;
  font-size: 4.26667vw;
  font-weight: 400;
  color: #212121;
  height: 6.4vw;
  line-height: 6.4vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-player__info__title .right {
  margin-left: auto;
  transform-origin: center;
  transform: rotate(180deg);
  transition: transform 0.1s ease;
}

.video-player__info__title .right i {
  font-size: 5.33333vw;
  color: #999;
}

.video-player__toolbar {
  display: flex;
  padding: 2.93333vw 3.2vw;
  border-bottom: 1px solid #e7e7e7;
  color: #999;
}

.video-player__toolbar .left {
  display: flex;
  align-items: center;
}

.video-player__toolbar__avatar img {
  display: block;
  height: 5.33333vw;
  width: 5.33333vw;
  border-radius: 2.66667vw;
  border: 0.5px solid #999;
}

.video-player__toolbar__name {
  margin-left: 1.33333vw;
  width: 26.66667vw;
  font-size: 3.2vw;
  color: #212121;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-player__toolbar .right {
  display: flex;
  margin-left: auto;
}

.video-player__toolbar .right > span {
  margin-left: 4vw;
  font-size: 2.66667vw;
}
.video-player__toolbar .right > span:first-child {
  margin-left: 0;
}
.video-player__toolbar .right > span i {
  margin-right: 1.33333vw;
  font-size: 5.33333vw;
  color: #757575;
  vertical-align: sub;
}

.video-player__nav {
  position: relative;
}

.video-comment-list {
  padding-bottom: 13vw;
}
.video-comment {
  display: flex;
  padding: 2vw 3.2vw;
  font-size: 3.733vw;
  border-bottom: 1px solid #f5f5f5;
}

.video-comment__left {
  display: flex;
  justify-content: center;
  width: 9.6vw;
}

.video-comment__right {
  flex: 1;
}

.video-comment__from-user-avator {
  display: block;
}
.video-comment__from-user-avator > img {
  width: 9.6vw;
  height: 9.6vw;
  border-radius: 4.8vw;
}

.video-comment__from-user-name {
  font-size: 3.5vw;
  color: rgb(121, 121, 121);
}

.video-comment__create-time {
  font-size: 3.3vw;
  color: #999;
}

.video-comment__to-user-name {
  color: hsl(203deg 100% 39%);
}

.video-comment__reply-btn {
  font-size: 3.3vw;
  text-align: right;
  color: var(--theme-color);
}

.reply-btn {
  color: var(--theme-color);
}

.add-comment-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  padding: 0 2vw;
  border-top: 1px solid #f5f5f5;
  background-color: #fff;
}

.add-comment-bar >>> .van-field__control {
  padding: 0 2vw;
  border-radius: 3vw;
  background-color: #f7f7f7;
}
.add-comment-bar >>> .van-cell {
  padding: 2vw 1vw;
}
.comment-text {
  flex: 1;
}

.comment-send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-color);
  font-size: 3.5vw;
}

.video-player__toolbar .right > span .click-color {
  color: var(--theme-color);
}

.danmu {
  z-index: 10000;
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
}

.danmu__canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}

.danmu-bar {
  display: flex;
  padding: 0.5vw 0;
}

.danmu-bar .left {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: 80vw;
}
.danmu-bar .right {
  margin-left: 1vw;
  flex-basis: 20vw;
}
</style>
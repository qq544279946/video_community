<template>
  <div class="video-view">
    <Header></Header>
    <div class="video-player" ref="videoPlayerDom">
      <div class="video-player__container">
        <picture>
          <img :src="videoInfo.imgSrc" alt="" style="display: none" />
        </picture>
        <div class="video-player__player">
          <div class="video-player__video-wrap">
            <video
              :src="videoInfo.videoSrc"
              :poster="videoInfo.imgSrc"
              controls
              preload="metadata"
            ></video>
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
            <div class="video-player__info__fold-container__up__follow">
              <van-button plain block color="#fb7299"
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
          <span> <i class="iconfont dianzan"></i>3777 </span>
          <span> <i class="iconfont icon_fav"></i>2521 </span>
        </span>
      </div>
      <div class="video-player__nav">
        <Nav :navItems="navItems"></Nav>
      </div>
      <div class="video-comment-list">
        <div class="video-comment" v-for="item in commentList" :key="item.id">
          <div class="video-comment__left">
            <router-link :to="`/space/${item.from_uid}`" class="video-comment__from-user-avator">
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
                <router-link :to="`/space/${item.to_uid}`" class="video-comment__to-user-name">@{{ item.to_uname }}</router-link
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
import { getViewInfoByVideoId, playCountAdd } from "../api/video";
import { getCommentByVideoId } from "../api/comment";
import { mapState } from "vuex";
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
      this.userInfo = result.data.userInfo;
    }
    playCountAdd(this.video_id);
  },
  data() {
    return {
      navItems: navData.videoNav,
      videoInfo: {},
      userInfo: {},
      commentList: [],
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
  },
  filters: {
    dateFormat(value) {
      const date = new Date(value);
      const dateStr = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      return dateStr;
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
  z-index: var(--video-z-index);
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
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
  margin-top: 2.66667vw;
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

.video-comment-list{
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
</style>
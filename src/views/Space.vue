<template>
  <div class="space">
    <div class="space__header">
      <Header></Header>
    </div>
    <div class="space__banner"></div>
    <div class="space__part1">
      <div class="space__face">
        <img src="../assets/imgs/face_login.jpg" alt="" />
      </div>
      <div class="space__relation">
        <div class="space__count">
          <span class="space__count__fans">
            <div class="space__count__num">1</div>
            <div class="space__count__type">粉丝</div>
          </span>
          <span class="space__count__split"></span>
          <span class="space__count__follow">
            <div class="space__count__num">1</div>
            <div class="space__count__type">关注</div>
          </span>
          <span class="space__count__split"></span>
          <span class="space__count__likes">
            <div class="space__count__num">1</div>
            <div class="space__count__type">获赞</div>
          </span>
        </div>
        <div class="space__edit-btn">
          <van-button
            plain
            block
            color="#fb7299"
            @click="showPersonalInfoPanel"
            v-if="isMySpace"
            >编辑资料</van-button
          >
          <van-button block color="#fb7299" v-if="!isMySpace"
            >+关注</van-button
          >
        </div>
      </div>
    </div>
    <div class="space__part2">
      <span class="space__name">{{ userInfo.nickname }}</span>
    </div>

    <!-- 弹出个人信息 -->
    <div class="space__panel" :class="{ showPanel: showPanel }">
      <van-cell-group>
        <van-cell title="头像" size="large" center clickable>
          <template #extra>
            <div class="space-edit-face">
              <img src="../assets/imgs/face_login.jpg" alt="" />
            </div>
          </template>
        </van-cell>
        <van-cell title="昵称" size="large" center clickable>
          <template #extra>
            <input type="text" v-model="editInfo.nickname" />
          </template>
        </van-cell>
        <van-cell title="性别" size="large" center clickable>
          <template #extra>
            <input
              type="text"
              v-model="editInfo.sex"
              placeholder="格式:男/女"
            />
          </template>
        </van-cell>
        <van-cell title="出生日期" size="large" center clickable>
          <template #extra>
            <input
              type="text"
              v-model="editInfo.birthday"
              placeholder="格式:1998-01-01"
            />
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group>
        <van-cell title="保存修改" clickable @click="saveEditInfo" />
        <van-cell title="退出登录" clickable @click="logout" />
        <van-cell title="返回空间" clickable @click="backSpace" />
      </van-cell-group>
    </div>

    <div class="space__tabs">
      <span>视频</span>

      <router-link to="/upload">
        <van-button
          plain
          block
          @click="showPersonalInfoPanel"
          v-if="isMySpace"
          >视频发布</van-button
        ></router-link
      >
    </div>
    <div class="space__video-list">
      <Card
        v-for="item in cardDataList"
        :key="item.video_id"
        :cardData="item"
      ></Card>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import Header from "../components/layout/Header";
import Card from "../components/layout/Card";
import { mapState } from "vuex";

import { updateUserInfo, logout, getUserInfo } from "../api/user";
import { getVideoListByUserId } from "../api/video";
export default {
  components: {
    Header: Header,
    Card: Card,
  },
  async created() {
    console.log("init?");
    let userId = this.$route.params.id;
    if (userId === void 0) {
      userId = this.user.id;
    }
    console.log("user", userId);
    let result = await getVideoListByUserId(userId);
    console.log(result);
    if (result.code === "200") {
      this.cardDataList = result.data;
    }
    result = await getUserInfo(userId);
    console.log(result);
    if (result.code === "200") {
      this.userInfo = result.data;
    }
  },
  data() {
    return {
      showPanel: false,
      editInfo: {},
      userInfo: {},
      cardDataList: [],
    };
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
    isMySpace() {
      if (this.$route.params.id == void 0) {
        return true;
      }
      if (this.user && this.$route.params.id == this.user.id) {
        return true;
      }
      return false;
    },
  },
  methods: {
    // 展示个人信息面板
    showPersonalInfoPanel() {
      this.editInfo = {
        nickname: this.user.nickname,
        sex: this.user.sex,
        birthday: this.user.birthday,
      };
      this.showPanel = true;
    },

    backSpace() {
      this.showPanel = false;
    },

    async saveEditInfo() {
      let result = await updateUserInfo(this.editInfo);
      if (result.code === "200") {
        this.$store.commit("setUser", result.data);
      }

      this.backSpace();
    },

    async logout() {
      const result = await logout();
      if (result.code === "200") {
        Cookies.remove("token");
        this.$store.commit("setUser", null);
        this.$router.replace("/m/home");
      }
    },
  },
};
</script>

<style scoped>
.space__banner {
  height: 24vw;
  background: url(../assets/imgs/bannerTop_new.png);
  background-size: cover;
  background-position: center center;
}

.space__part1 {
  padding: 0 3.2vw;
  display: flex;
}

.space__face {
  height: 22.4vw;
  width: 22.4vw;
  border-radius: 11.2vw;
  overflow: hidden;
  transform: translateY(-1.6vw);
}

.space__face img {
  width: 100%;
  display: block;
}

.space__relation {
  width: 58.6667vw;
  margin-left: auto;
  padding-top: 2.1vw;
}

.space__count {
  display: flex;
  align-items: center;
  text-align: center;
}

.space__count__fans {
  width: 19.2vw;
}
.space__count__follow {
  width: 19.2vw;
}
.space__count__likes {
  width: 19.2vw;
}

.space__count__split {
  width: 1px;
  height: 4.2666vw;
  background-color: #e7e7e7;
}

.space__count__num {
  font-size: 3.73333vw;
  color: var(--font-color);
  line-height: 4.26667vw;
}

.space__count__type {
  font-size: 2.9333vw;
  color: #999;
}

.space__edit-btn >>> .van-button {
  margin-top: 3.2vw;
  height: 8vw;
  border-radius: 1.06667vw;
  font-size: 3.7333vw;
}

.space__part2 {
  padding: 3.2vw;
}

.space__name {
  font-size: 4.8vw;
  color: #212121;
}

.space__tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 10.66667vw;
  padding: 0 3.2vw;
  line-height: 10.66667vw;
  border-bottom: 1px solid #e7e7e7;
  border-top: 1px solid #e7e7e7;
  color: #757575;
  font-size: 3.46667vw;
}

.space__tabs >>> .van-button {
  width: 24vw;
  height: 8vw;
  background-color: var(--theme-color);
  color: #fff;
  font-size: 3.46667vw;
  border-radius: 1.5vw;
  letter-spacing: 0.3vw;
}

.space__tabs > span {
  margin-right: 8.53333vw;
}

.space__panel {
  z-index: var(--header-z-index);
  visibility: hidden;
  position: fixed;
  top: 11.73333vw;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f4f4f4;
  transform: translateX(100vw);
  transition: transform 0.5s ease, visibility 0.5s ease 0.5s;
}

.space__panel.showPanel {
  visibility: visible;
  transform: translateX(0vw);
  transition: transform 0.5s ease 0.1s, visibility 0.5s ease;
}

.space__panel >>> .van-cell-group {
  margin-top: 3vw;
}

.space__panel >>> .van-cell-group:last-child .van-cell {
  text-align: center;
}

.space__panel input[type="text"] {
  border: none;
  color: #999;
  font-size: 4vw;
  text-align: right;
  background-color: transparent;
}

.space-edit-face {
  display: block;
  height: 12.26667vw;
  width: 12.26667vw;
  border-radius: 6.13333vw;
  overflow: hidden;
}

.space-edit-face img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
}
</style>
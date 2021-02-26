<template>
  <div class="search-box">
    <div class="search-bar">
      <div class="search-bar__input-area">
        <i class="iconfont ic_search_tab"></i>
        <input
          type="text"
          v-model="searchInput"
          placeholder="请输入搜索内容"
          @keyup.enter="search"
        />
        <i
          class="iconfont guanbi"
          v-show="searchInput"
          @click="searchInput = ''"
        ></i>
      </div>
      <router-link class="search-bar__cancel" to="/m/home">取消</router-link>
    </div>
    <div class="search-content">
      <div class="search-content__nav">
        <Nav
          :navItems="searchNavItems"
          @activechange="handleActivechange"
        ></Nav>
      </div>
      <div class="search-content__cards">
        <div v-show="index === 0">
          <router-link
            :to="`/video?video_id=${item.video_id}`"
            v-for="item in videoList"
            :key="item.video_id"
          >
            <Card :cardData="item"></Card>
          </router-link>
        </div>

        <div v-show="index === 1">
          <router-link
            :to="`/space/${item.user_id}`"
            v-for="item in userList"
            :key="item.user_id"
          >
            <div class="card-up">
              <div class="card-up__cover">
                <img src="../assets/imgs/face_login.jpg" alt="" />
              </div>
              <div class="card-up__info">
                <p class="card-up__info__name">{{ item.author }}</p>
                <p class="card-up__info__state">
                  粉丝：0 &nbsp;&nbsp; 视频：{{ item.video_count }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../components/layout/Nav";
import Card from "../components/layout/Card";
import navData from "../assets/js/navData";

import { searchVideo } from "../api/video";
import { searchUsers } from "../api/user";
export default {
  components: {
    Nav: Nav,
    Card: Card,
  },
  async mounted(){
    const keyword = this.$route.query.keyword;
    if(keyword !== void 0){
      this.searchInput = keyword;
      await this.search();
    }
  },
  data() {
    return {
      // 搜索关键字
      searchInput: "",
      searchNavItems: navData.searchNavItems,

      index: 0,

      // 当前页数
      videoListPageNum: 1,
      videoListPageSize: 10,

      userListPageNum: 1,
      userListPageSize: 10,

      // 查询列表
      videoList: [],
      userList: [],
    };
  },
  methods: {
    handleActivechange(index) {
      this.index = index;
    },
    async search() {
      this.$router.replace('/search?keyword='+ this.searchInput)
      let videoList = searchVideo({
        pageNum: this.videoListPageNum,
        pageSize: this.videoListPageSize,
        keyword: this.searchInput,
      });
      let userList = searchUsers({
        pageNum: this.userListPageNum,
        pageSize: this.userListPageSize,
        keyword: this.searchInput,
      });
      let result = await Promise.all([videoList, userList]);
      this.videoList = result[0].data;
      this.userList = result[1].data;
    },
  },
};
</script>

<style>
.search-box {
  min-height: 100vh;
  background-color: #f4f4f4;
}
.search-bar {
  display: flex;
  z-index: var(--header-z-index);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 11.73333vw;
  padding: 0 3.2vw;
  background-color: #fff;
}

.search-bar__input-area {
  display: flex;
  margin-top: 1.86667vw;
  height: 8vw;
  width: 82.4vw;
  line-height: 8vw;
  padding: 0 3.2vw;
  background-color: #f4f4f4;
  border-radius: 0.53333vw;
}

.search-bar__input-area > input {
  width: 61.33333vw;
  padding-left: 2vw;
  font-size: 3.46667vw;
  color: #505050;
  border: none;
  background: transparent;
}

.search-bar__input-area > i:first-child {
  font-size: 5.33333vw;
  color: #a0a0a0;
}
.search-bar__input-area > i:last-child {
  font-size: 3.73333vw;
  color: #a0a0a0;
  margin-left: auto;
}
.search-bar__cancel {
  margin-left: auto;
  font-size: 4vw;
  color: var(--theme-color);
  line-height: 11.73333vw;
}

.search-content {
  padding: 23.46666vw 0 0;
}
.search-content__nav {
  z-index: var(--header-z-index);
  position: fixed;
  top: 11.73333vw;
  left: 0;
  width: 100vw;
}

.card {
  display: flex;
  padding: 1.6vw;
  padding-top: 3.2vw;
}

.card__pic {
  position: relative;
  width: 37.33333vw;
  border-radius: 1.06vw;
  overflow: hidden;
}

.card__pic > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card__pic__duration {
  position: absolute;
  right: 1.06667vw;
  bottom: 1.06667vw;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 0 0.53333vw;
  font-size: 3.2vw;
}

.card__info {
  flex: 1;
  font-size: 3.2vw;
  color: #999;
  margin-left: 2.66667vw;
}

.card__info__title {
  display: -webkit-box;
  font-size: 3.73333vw;
  color: #222;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin-bottom: 2.13333vw;
}

.card__info__author {
  display: flex;
  margin-bottom: 1.06667vw;
}

.card__info__author i {
  margin-right: 1.33333vw;
}

.card__info__count {
  display: flex;
}

.card__info__count span {
  margin-right: 2.66667vw;
}

.card__info__count span > i {
  margin-right: 1.33333vw;
}

.card-up {
  display: flex;
  padding: 3.2vw;
}
.card-up__cover {
  width: 16vw;
  height: 16vw;
  border-radius: 8vw;
  overflow: hidden;
}
.card-up__cover img {
  display: block;
  height: 100%;
  width: 100%;
}

.card-up__info {
  margin-left: 3.2vw;
  color: #212121;
  width: 69.33333vw;
}

.card-up__info__name {
  font-size: 3.73333vw;
  height: 5.33333vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-up__info__state {
  font-size: 3.2vw;
  height: 3.2vw;
  line-height: 3.2vw;
  margin-top: 1.6vw;
  color: #999;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
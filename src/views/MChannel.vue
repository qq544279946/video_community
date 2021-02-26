<template>
  <div class="m-channel-view">
    <div class="m-channel-view__sub-menu">
      <Nav
        :navItems="navItems"
        @activechange="handleActiveChange"
        :defaultActiveIndex="defaultActiveIndex"
      ></Nav>
    </div>
    <div class="m-channel-view__page">
      <VideoList
        :list="item.list"
        :showTitle="true"
        v-for="(item, index) in list"
        :key="index"
        :titleName="item.name"
        :showMore="item.showMore"
        :moreValue="item.listIndex"
        @getmoreindex="handleGetMoreIndex"
      ></VideoList>

      <div class="m-channel__more" v-show="currentNavSubIndex !== 0">
        <van-button round @click="getMore">加载更多</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "@/components/layout/Nav";
import VideoList from "@/components/layout/VideoList";

import navData from "@/assets/js/navData.js";

import {
  getVideoListByCategoryId,
  getMoreVideoListByCategory,
} from "../api/video";

export default {
  components: {
    Nav: Nav,
    VideoList: VideoList,
  },
  created() {
    this.handleActiveChange(0);
  },
  props: {
    navIndex: {
      type: Number,
    },
  },
  data() {
    return {
      currentNavSubIndex: 0,
      list: [],
      defaultActiveIndex: 0,

      // 下一页页数
      pageNum: 2,
      pageSize: 10,
    };
  },
  computed: {
    navItems() {
      let index = this.navIndex;
      return navData.navSubItems[index - 1];
    },
  },
  watch: {
    navIndex() {
      this.handleActiveChange(this.currentNavSubIndex);
    },
  },
  methods: {
    handleGetMoreIndex(index) {
      console.log("getmore", index);
      this.defaultActiveIndex = index;
    },
    async handleActiveChange(index) {
      if (this.navIndex === 0) {
        return;
      }
      console.log("active Sub", this.navIndex, index);
      this.currentNavSubIndex = index;
      this.defaultActiveIndex = index;
      this.pageNum = 2;
      //
      const result = await getVideoListByCategoryId({
        main_category_id: this.navIndex,
        sub_category_id: index,
      });
      console.log(result);
      if (result.code === "200") {
        this.list = result.data;
      } else {
        this.list = [];
      }
    },

    async getMore() {
      const result = await getMoreVideoListByCategory({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        main_category_id: this.navIndex,
        sub_category_id: this.currentNavSubIndex,
      });

      if (result.code === "200") {
        if (result.data.length !== 0) {
          this.list[1].list.push(...result.data);
          this.pageNum++;
        } else {
          this.$message("已经到底了");
        }
      }
    },
  },
};
</script>

<style scoped>
.m-channel-view {
}
.m-channel-view__sub-menu {
  z-index: var(--sub-menu-z-index);
  position: fixed;
  width: 100vw;
}
.m-channel-view__page {
  padding-top: 12.667vw;
}

.m-channel__more {
  padding-bottom: 2vw;
  text-align: center;
}
.m-channel__more >>> .van-button {
  width: 24vw;
  height: 10vw;
  background-color: var(--theme-color);
  color: #fff;
  font-size: 3.5vw;
}
</style>
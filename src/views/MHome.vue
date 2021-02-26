<template>
  <div class="m-home">
    <div class="banner">
      <picture>
        <img
          src="@/assets/imgs/186673b089ce18a7164b040dba4055d0bdc65848.jpg"
          alt=""
        />
      </picture>
    </div>
    <VideoList :showTitle="false" :list="list"></VideoList>
    <div class="m-home__more">
      <van-button round @click="getMore">加载更多</van-button>
    </div>
  </div>
</template>

<script>
import VideoList from "@/components/layout/VideoList";
import { getHomeVideos } from "../api/video";
export default {
  components: {
    VideoList: VideoList,
  },
  props: {
    navIndex: {
      type: Number,
      default: 0,
    },
  },
  created() {
    this.getMore();
    // {
    //     imgSrc: "/imgs/5a976e958928423bf2ca1f9b11f3bfe6f4abd5fd.jpg",
    //     playCount: "11.8万",
    //     bulletScreenCount: "8万",
    //     title: "bilibili百年祭",
    //   }
  },
  data() {
    return {
      list: [],
      pageSize: 10,
      pageNum: 1,
    };
  },
  methods: {
    async getMore() {
      const data = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      };
      let result = await getHomeVideos(data);
      if (result.code === "200") {
        if (result.data.length !== 0) {
          this.list.push(...result.data);
          this.pageNum++;
        }else{
          this.$message('已经到底了')
        }
      }
    },
  },
};
</script>

<style scoped>
.banner {
  padding: 0 2.67vw;
}
.banner picture {
  display: block;
}

.banner picture img {
  display: block;
  height: 26.66667vw;
  width: 100%;
  border-radius: 0.5vw;
  object-fit: fill;
}

.m-home__more {
  padding-bottom: 2vw;
  text-align: center;
}
.m-home__more >>> .van-button {
  width: 24vw;
  height: 10vw;
  background-color: var(--theme-color);
  color: #fff;
  font-size: 3.5vw;
}
</style>
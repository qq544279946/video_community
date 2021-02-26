<template>
  <div class="video-list" :class="{ 'has-title': showTitle }">
    <div class="video-list__title">
      <span>{{ titleName }}</span>
      <a class="video-list__title__more" :class="{'has-more': showMore}"
        @click="handleMoreEvent"
        >查看更多 <i class="iconfont gengduo1"></i
      ></a>
    </div>
    <div class="video-list__item" v-for="(item, index) in list" :key="index">
      <router-link :to="`/video?video_id=${item.video_id}`">
        <div class="video-list-item">
        <div class="video-list-item__card">
          <img :src="item.imgSrc" alt="" />
          <div class="video-list-item__count">
            <span class="video-list-item__inner">
              <i class="iconfont icon_shipin_bofangshu"></i>
              <span>{{ item.playCount }}</span>
            </span>
            <span>
              <i class="iconfont icon_shipin_danmushu"></i>
              <span>{{ item.bulletScreenCount }}</span>
            </span>
          </div>
        </div>
        <p class="video-list-item__title">{{ item.title }}</p>
      </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showMore: {
      type: Boolean,
      default: false
    },
    moreValue: {
      type: Number,
      default: 0
    },
    showTitle: {
      type: Boolean,
      default: false,
    },
    titleName: {
      type: String,
      default: "",
    },
    list: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  methods: {
    handleMoreEvent(){
      this.$emit('getmoreindex', this.moreValue)
    }
  }
};
</script>

<style>
.video-list {
  display: grid;
  padding: 0 1.33vw;
  margin-bottom: 2.33333vw;
  grid-template-columns: 48.67vw 48.67vw;
  grid-template-rows: auto;
  grid-template-areas: "header header";
}

.video-list.has-title .video-list__title {
  display: flex;
}

.video-list__title {
  display: none;
  justify-content: space-between;
  align-items: center;
  padding: 1.33333vw 2.66667vw;
  font-size: 4vw;
  grid-area: header;
}

.video-list__title__more {
  display: none;
  font-size: 3.3333vw;
  color: #999;
}

.video-list__title__more.has-more{
  display: block;
}

.video-list__item {
  padding: 2.13333vw 1.33vw;
}

.video-list-item__card {
  height: 27.31vw;
  z-index: var(--card-z-index);
  position: relative;
  border-radius: 0.6vw;
  overflow: hidden;
}

.video-list-item__card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-list-item__count {
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 1.33333vw 1.6vw;
  font-size: 3.2vw;
  color: #fff;
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.85), transparent);
}

.video-list-item__count>span {
  display: flex;
  align-items: center;
}
.video-list-item__count>span i {
  margin-right: 1.33333vw;
}

.video-list-item__title {
  display: -webkit-box;
  margin-top: 1.6vw;
  font-size: 3.2vw;
  color: #212121;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
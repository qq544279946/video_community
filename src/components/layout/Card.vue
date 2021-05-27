<template>
  <router-link class="card" :to="`/video?video_id=${cardData.video_id}`" v-if="cardData">
    <div class="card__pic">
      <img
        :src="cardData.imgSrc | handleImgSrc"
        alt=""
      />
      <span class="card__pic__duration">{{cardData.during_time | duringTimeFormat}}</span>
    </div>
    <div class="card__info">
      <p class="card__info__title">{{cardData.title}}</p>
      <p class="card__info__author" v-if="cardData.author">
        <i class="iconfont ic_up"></i>
        {{cardData.author}}
      </p>
      <p class="card__info__count">
        <span> <i class="iconfont icon_shipin_bofangshu"></i>{{cardData.playCount}} </span>
        <span v-if="cardData.bulletScreenCount"> <i class="iconfont icon_shipin_danmushu"></i>{{cardData.bulletScreenCount}} </span>
      </p>
    </div>
  </router-link>
</template>

<script>
export default {
  props: ['cardData'],
  filters: {
    duringTimeFormat(value){
      let seconds = parseInt(value);
      let minutes = parseInt(seconds / 60);
      seconds = seconds % 60;
      return (minutes + '').padStart(2, '0') + ':' + (seconds + '').padStart(2, '0');
    },
    handleImgSrc(src){
      return `${src}/small`
    }
  }
};
</script>

<style scoped>
.card {
  display: flex;
  padding: 1.6vw;
  padding-top: 3.2vw;
}

.card__pic {
  position: relative;
  width: 37.33333vw;
  height: 22.31vw;
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
</style>
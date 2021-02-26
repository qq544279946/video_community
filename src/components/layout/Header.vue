<template>
  <header class="header">
      <div class="header__left">
          <router-link to="/" class="logo">
              <!-- <i class="iconfont Navbar_logo"></i> -->
              <h1>视频社区</h1>
          </router-link>
      </div>
      <div class="header__right">
          <router-link to="/search" class="search">
              <i class="iconfont ic_search_tab"></i>
          </router-link>
          <router-link to="/login" class="face" v-show="!user">
              <img src="../../assets/imgs/login.png@48w_48h_1c.png" alt="" >
          </router-link>
          <router-link to="/space" class="face" v-show="user">
              <img src="../../assets/imgs/face_login.jpg" alt="">
          </router-link>
      </div>
  </header>
</template>

<script>
import {mapState} from 'vuex'
export default {
    computed: {
        ...mapState({
            user: state => state.user
        })
    }
};
</script>

<style>
.header{
    display: flex;
    padding: 0 3.2vw 0 4.8vw;
    height: 11.73vw;
    line-height: 11.73vw;
    background-color: #fff;
}

.header__left{
    
}

.header__left  h1{
    font-size: 6vw;
    color: var(--theme-color);
}

.header__right{
    margin-left: auto;
}

.logo i{
    font-size: 7.46667vw;
    color: var(--theme-color);
}

.search i{
    margin-right: 5.86vw;
    font-size: 5.86667vw;
    color: var(--icon-color);
}

.face{
    display: inline-block;
    vertical-align: text-bottom;
}

.face img{
    display: block;
    width: 6.4vw;
    height: 6.4vw;
    border-radius: 3.2vw;
}
</style>
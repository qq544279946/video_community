<template>
  <main-layout :isNotHome="isNotHome">
    <template v-slot:header>
      <Header></Header>
    </template>
    <template v-slot:nav>
      <Nav
        @activechange="handleActiveChange"
        :navItems="navItems"
        :defaultActiveIndex="defaultActiveIndex"
      ></Nav>
    </template>
    <template v-slot:content>
      <router-view :key="$route.path" :navIndex="currentNavIndex"></router-view>
    </template>
  </main-layout>
</template>

<script>
// @ is an alias to /src
import MainLayout from "@/components/layout/index";
import Header from "@/components/layout/Header";
import Nav from "@/components/layout/Nav";

import navData from "@/assets/js/navData.js";
export default {
  components: {
    "main-layout": MainLayout,
    Header: Header,
    Nav: Nav,
  },
  created(){
    console.log(this.defaultActiveIndex)
  },
  data() {
    return {
      currentNavIndex: 0,
      navItems: navData.navItems,
    };
  },
  computed: {
    isNotHome() {
      return this.currentNavIndex !== 0;
    },
    defaultActiveIndex() {
      if (this.$route.params.id) {
        return parseInt(this.$route.params.id);
      }
      return 0;
    },
  },
  methods: {
    handleActiveChange(index) {
      console.log("active ", index);
      if (this.currentNavIndex === index) {
        return;
      }
      this.currentNavIndex = index;
      if (index === 0) {
        this.$router.replace("/m/home");
        return;
      }
      this.$router.replace(`/m/channel/${index}`);
    },
  },
};
</script>

<style lang="less">
</style>

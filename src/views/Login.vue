<template>
  <div class="login">
    <div class="login__header">登录短视频社区</div>
    <div class="login__form-box">
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="username"
          label="账号"
          placeholder="账号"
          :rules="[{ required: true, message: '请填写账号' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div class="forget-box">
          <a>忘记密码</a>
        </div>
        <div class="btn-box">
          <router-link to="/register">
            <van-button block native-type="button"
              >注册</van-button
            ></router-link
          >
          <van-button block native-type="submit">登录</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import {login} from '../api/user'
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async onSubmit(e) {
      console.log(e);
      const res = await login(e);
      if(res.code === '200'){
        const user = res.data;
        this.$store.commit('setUser', user);
        this.$router.replace('/m/home')
      }
    },
  },
};
</script>

<style scoped>
.login {
  height: 100vh;
  background-color: #f4f4f4;
}
.login__header {
  padding: 0 3.2vw;
  height: 11.73333vw;
  background-color: #fff;
  text-align: center;
  line-height: 11.73333vw;
  font-size: 4.26667vw;
  color: #212121;
}

.login__form-box {
  padding-top: 4.26667vw;
}

.forget-box {
  padding: 2.1vw 3.2vw;
  color: #fb7299;
  font-size: 3.667vw;
  line-height: 4.2667vw;
  text-align: right;
}

.btn-box {
  display: flex;
  justify-content: space-around;
  margin-top: 4.2vw;
}

.btn-box >>> .van-button {
  width: 45.33333vw;
  height: 11.73333vw;
  border: 1px solid #ff9db5;
  background-color: #ff9db5;
  color: #fff;
  font-size: 3.733vw;
  border-radius: 1.02vw;
}

.btn-box >>> .van-button:first-child {
  width: 45.33333vw;
  height: 11.73333vw;
  border: 1px solid #ff9db5;
  background-color: transparent;
  color: #ff9db5;
  font-size: 3.733vw;
  border-radius: 1.02vw;
}
</style>
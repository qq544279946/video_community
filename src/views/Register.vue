<template>
  <div class="register">
    <div class="register__header">注册</div>
    <div class="register__form-box">
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

        <van-field
          v-model="nickname"
          name="nickname"
          label="昵称"
          placeholder="昵称"
          :rules="[{ required: true, message: '请填写昵称' }]"
        />

        <van-field
          v-model="phone"
          name="phone"
          label="手机号"
          placeholder="手机号(用于修改密码)"
          :rules="[{ required: true, message: '请填写手机号' },{pattern: /^1[3|4|5|7|8][0-9]{9}$/, message: '手机号格式错误'}]"
        />

        <div class="btn-box">
          <router-link to="/login">
              <van-button  block native-type="button"
            >登录</van-button
          >
          </router-link>
          <van-button  block  native-type="submit"
            >同意并注册</van-button
          >
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import {registerUser} from '../api/user'
export default {
    data(){
        return{
            username: '',
            password: '',
            nickname: '',
            phone: ''
        }
    },
    methods: {
        async onSubmit(form){
            console.log(form)
            const result = await registerUser(form);
            if(result.code === '200'){
              this.$router.replace('/m/home')
            }
        }
    }
};
</script>

<style scoped>
.register {
  height: 100vh;
  background-color: #f4f4f4;
}
.register__header {
  padding: 0 3.2vw;
  height: 11.73333vw;
  background-color: #fff;
  text-align: center;
  line-height: 11.73333vw;
  font-size: 4.26667vw;
  color: #212121;
}

.register__form-box {
  padding-top: 4.26667vw;
}


.btn-box{
    display: flex;
    justify-content: space-around;
    margin-top: 4.2vw;
}

.btn-box >>> .van-button{
    width: 45.33333vw;
    height: 11.73333vw;
    border: 1px solid #ff9db5;
    background-color: #ff9db5;
    color: #fff;
    font-size: 3.733vw;
    border-radius: 1.02vw;
}

.btn-box >>> .van-button:first-child{
    width: 45.33333vw;
    height: 11.73333vw;
    border: 1px solid #ff9db5;
    background-color: transparent;
    color: #ff9db5;
    font-size: 3.733vw;
    border-radius: 1.02vw;
}
</style>
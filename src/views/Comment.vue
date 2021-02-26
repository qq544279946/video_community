<template>
  <div class="comment-view">
    <div class="comment-view__header">添加评论</div>
    <van-form @submit="onSubmit">
      <van-field
        v-model="comment"
        name="comment"
        placeholder="请填写评论"
        maxlength="80"
        show-word-limit
        type="textarea"
        :rules="[{ required: true, message: '请填写评论' }]"
      />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit" color="#fb7299"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import {addComment} from '../api/comment';
import {mapState} from 'vuex'
export default {
    data(){
        return {
            comment: ''
        }
    },
    computed:{
        ...mapState({
            user: state=> state.user
        }),
        video_id(){
            return this.$route.query.video_id;
        },
        to_uid(){
          return this.$route.query.to_uid;
        }
    },
    methods: {
        async onSubmit(data){
            console.log(data)
            let result = await addComment({
                video_id: this.video_id,
                content: this.comment,
                from_uid: this.user.id,
                to_uid: parseInt(this.to_uid)
            });
            if(result){
              this.$router.back()
            }
        }
    }
};
</script>

<style scoped>
.comment-view {
  height: 100vh;
  background-color: #f4f4f4;
}

.comment-view > * {
  margin-bottom: 2vw;
}
.comment-view__header {
  padding: 0 3.2vw;
  height: 11.73333vw;
  background-color: #fff;
  text-align: center;
  line-height: 11.73333vw;
  font-size: 4.26667vw;
  color: #212121;
}
</style>
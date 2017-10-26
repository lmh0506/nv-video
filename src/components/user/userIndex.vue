<template>
  <div class="userIndex-wrapper">
    <div class="myVideo-wrapper">
      <h3 class="video-item-wrapper">
        <span class="video-title">我的视频</span>
        <router-link tag="span" :to="{name: 'userVideo', params: {id: $route.params.id}}" class="seeMore">查看更多</router-link>
      </h3>
      <template v-if="myHotVideo.length > 0">
        <el-row>
          <el-col :span="4" v-for="(v, index) in myHotVideo" :key="index">
            <div class="grid-content">
              <base-video :video='v' 
                        :edit="false"
                        :videoRouter="true"></base-video>
            </div>
          </el-col>
        </el-row>
      </template>
      <h1 class="nolist-title" v-else-if="myHotVideo.length === 0">你还没有上传过视频</h1>
    </div>
    <div class="myVideo-wrapper">
      <h3 class="video-item-wrapper">
        <span class="video-title">我的收藏</span>
        <router-link tag="span" :to="{name: 'userStore', params: {id: $route.params.id}}" class="seeMore">查看更多</router-link>
      </h3>
      <template v-if="myHotStore.length > 0">
        <el-row>
          <el-col :span="4" v-for="(v, index) in myHotStore" :key="index">
            <div class="grid-content">
              <base-video :video='v' 
                        :edit="false"
                        :videoRouter="true"></base-video>
            </div>
          </el-col>
        </el-row>
      </template>
      <h1 class="nolist-title" v-else-if="myHotStore.length === 0">你还没有收藏过视频</h1>
    </div>
  </div>
</template>

<script>
  import {getMyHotVideo} from '@/api/User'
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  import baseVideo from '@/base/baseVideo'

  export default {
    data () {
      return {
        myHotVideo: [],
        myHotStore: []
      }
    },
    methods: {
      getMyHotVideo () {
        let id = this.$route.params.id
        getMyHotVideo(id).then(res => {
          if (res.data.error === ERR_OK) {
            this.myHotStore = res.data.result.storeVideo
            this.myHotVideo = res.data.result.uploadVideo
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      }
    },
    mounted () {
      this.getMyHotVideo()
    },
    components: {
      baseVideo
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .myVideo-wrapper {
    margin-top: 20px;

    .video-item-wrapper{
      height: 36px;
      .video-title {
        text-align: left;
        line-height: 36px;
        margin-left: 30px;
      }
      .seeMore {
        display: inline-block;
        width: 60px;
        height: 30px;
        box-sizing: content-box;
        padding: 2px 5px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
        border-radius: 5px;
        float: right;
        border: 1px solid #ddd;
        cursor: pointer;
      }

      .seeMore:hover{
        color: #409EFF;
        border: 1px solid #409EFF;
      }
    }
    .nolist-title {
      margin: 50px auto 0;
      text-align: center;
    }
  }
</style>

<template>
  <div class="videoDetail-wrapper" v-if="video._id">
    <div class="videoDetail-header">
      <div class="videoDetail-left-title">
        <h3 class="videoDetail-video-name">{{video.name}}</h3>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{video.type.name}}</el-breadcrumb-item>
        </el-breadcrumb>
        <p class="videoDetail-createTime">
          {{video.createTime}}
        </p>
        <p class="videoDetail-playInfo">
          <span class="videoDetail-playnum">
            <i class="el-icon-my-bofang1"></i>
            {{video.vplaynum}}
          </span>
          <span class="videoDetail-favnum">
            <i class="el-icon-my-shoucang"></i>
            {{video.fav_num}}
          </span>
          <span class="videoDetail-score">
            <i class="el-icon-my-pingfen1"></i>
            {{rateNum}}
          </span>
        </p>
      </div>
      <div class="videoDetail-right-user">
        <router-link tag="div" :to="{name: 'userIndex', params: {id: video.publisher._id}}" class="user-avatar-wrapper">
          <img :src="video.publisher.avatar" alt="">
        </router-link>
        <router-link tag="p" :to="{name: 'userIndex', params: {id: video.publisher._id}}" class="user-name">
          {{video.publisher.name}}
        </router-link>
      </div>
    </div>
    <div class="videoDetail-main">
      <d-player :video='videoObj' 
                  :contextmenu="contextmenu"
                  @ended="end"
                  :loop="false"
                  ref="player"></d-player>
      <p class="video-bottom">
        <span class="videoDetail-store">
          {{isStore ? '取消收藏' : '收藏视频'}}
          <i class="icon" @click="storeVideo" :class="storeIcon"></i>
        </span>
        <span class="videoDetail-rate">
          评分
          <el-rate class="rate-wrapper"
            v-model="rate"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            show-text>
          </el-rate>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
  import {getVideo, playNumUp, storeVideo} from '@/api/Video'
  import {getIsStore} from '@/api/User'
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  import VueDPlayer from 'vue-dplayer'
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        video: {},
        videoObj: {},
        contextmenu: [],
        rate: null,
        isStore: false // 是否收藏
      }
    },
    computed: {
      ...mapState([
        'user'
      ]),
      rateNum () { // 计算视频评分
        let num = 0
        if (this.video.score.length > 0) {
          this.video.score.forEach(item => {
            num += item.rate
          })
          return num / this.video.score.length
        } else {
          return num
        }
      },
      storeIcon () {
        return this.isStore ? 'el-icon-my-shoucang1' : 'el-icon-my-shoucang2'
      }
    },
    methods: {
      getVideo () {
        let id = this.$route.params.id
        getVideo(id).then(res => {
          if (res.data.error === ERR_OK) {
            this.video = res.data.result
            this.videoObj = {
              url: this.video.src,
              pic: this.video.img
            }
            this.contextmenu = [
              {
                text: '查看作者更多视频',
                link: `/user/${this.video.publisher._id}`
              }
            ]
            if (this.user.id) { // 如果用户已登录 获取他的收藏信息
              this.getIsStore()
            }
          }
        })
      },
      end () { // 播放结束时视频播放量增加
        let id = this.$route.params.id
        playNumUp(id).then(res => {
          if (res.data.error === ERR_OK) {
            this.video.vplaynum ++
          }
        })
      },
      storeVideo () { // 收藏或取消收藏视频
        let vid = this.$route.params.id
        let uid = this.user.id
        storeVideo(vid, uid).then(res => {
          if (res.data.error === ERR_OK) {
            this.isStore = res.data.result
            if (this.isStore) {
              this.video.fav_num ++
            } else {
              this.video.fav_num --
            }
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      getIsStore () { // 当前登录用户是否对该视频收藏
        getIsStore(this.user.id, this.video._id).then(res => {
          if (res.data.error === ERR_OK) {
            this.isStore = res.data.result
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      }
    },
    components: {
      'd-player': VueDPlayer
    },
    mounted () {
      this.getVideo()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .videoDetail-wrapper{
    width: 1100px;
    min-height: calc(100% - 162px);
    margin: 0px auto;

    .videoDetail-header{
      padding: 10px;
      min-height: 135px;
      border-bottom: 1px solid #ddd;

      .videoDetail-left-title {
        width: 60%;
        float: left;

        .videoDetail-video-name{
          margin-bottom: 15px;
          font-weight: normal;
        }

        p {
          margin-top: 15px;
          color: #666;

          span {
            margin-right: 20px;
          }
        }
      }

      .videoDetail-right-user {
        width: 40%;
        float: right;

        .user-avatar-wrapper {
          img{
            width: 100px;
            height: 100px;
            display: block;
            border-radius: 50%;
            margin: 0px auto;
            cursor: pointer;
          }
        }

        .user-name {
          text-align: center;
          margin-top: 10px;
          color: #409EFF;
          cursor: pointer;
        }
      }
    }

    .videoDetail-header:after{
      content: ' ';
      display: none;
      clear: both;
    }

    .videoDetail-main {
      margin-top: 10px;

      .video-bottom {
        margin-top: 10px;
        text-align: center;

        .icon {
          font-size: 38px;
          cursor: pointer;
        }
        .el-icon-my-shoucang1 {
          color: red;
        }

        .videoDetail-rate{
          margin-left: 20px;
          width: 250px;
          display: inline-block;

          .rate-wrapper {
            display: inline-block;
            margin-left: 10px;
            vertical-align: top;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="base-video-wrapper">
    <div class="base-video-main">
      <template v-if="videoRouter">
        <router-link tag="div" :to="{name: 'videoDetail', params: {id: video._id}}" class="base-video-img-wrapper">
          <img v-lazy="video.img" alt="" class="base-video-img">
        </router-link>
        <router-link tag="p" :to="{name: 'videoDetail', params: {id: video._id}}" class="base-video-title">{{video.name}}</router-link>
      </template>
      <template v-else>
        <div class="base-video-img-wrapper">
          <img v-lazy="video.img" alt="" class="base-video-img">
        </div>
        <p class="base-video-title">{{video.name}}</p>
      </template>
      
      <p class="base-video-bottom">
        <span class="base-video-playnum">
          <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-bofang1"></use>
          </svg>
          &nbsp;&nbsp;{{video.vplaynum}}
        </span>
        <span class="base-video-favnum">
          <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shoucang"></use>
          </svg>
          &nbsp;&nbsp;{{video.fav_num}}
        </span>
      </p>
      <div class="base-video-cover" v-if="video.shenhe === 'ing'">审核中。。。</div>
      <div class="base-video-cover" v-else-if="video.shenhe !== '审核通过' && video.shenhe !== 'ing'">{{video.shenhe}}</div>
      <div v-if="edit" class="el-icon-circle-close delete-btn" @click="deleteVideo"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      video: Object,
      edit: {
        type: Boolean,
        default: true
      },
      videoRouter: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    methods: {
      deleteVideo () {
        this.$emit('deleteVideo', this.video._id)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .base-video-main{
    width: 160px;
    height: 164px;
    padding: 10px;
    position: relative;

    .base-video-img-wrapper{
      width: 100%;
      height: 100px;
      border-radius: 10px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .base-video-title {
      font-size: 14px;
      margin-top: 10px;
      height: 38px;
      overflow: hidden;
    }

    .base-video-bottom {
      font-size: 12px;
      color: #999;

      .base-video-favnum {
        margin-left: 20px;
      }
    }

    .delete-btn {
      position: absolute;
      top: 0px;
      right: 0px;
      font-size: 20px;
      color: red;
      cursor: pointer;
    }

    .base-video-cover {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 160px;
      height: 100px;
      background-color: rgba(0, 0, 0, .8);
      color: #fff;
      text-align: center;
      line-height: 100px;
      font-size: 20px;
    }
  }
</style>

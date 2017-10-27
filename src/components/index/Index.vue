<template>
  <div class="index-wrapper">
    <el-carousel class="carousel" :interval="5000" trigger="click" type="card" height="300px">
      <el-carousel-item v-for="item in hotList" :key="item._id">
        <router-link tag="img" :to="{name: 'videoDetail', params: {id: item._id}}" :src="item.img" width="100%" height="100%" alt=""></router-link>
      </el-carousel-item>
    </el-carousel>
    <div class="search-wrapper">
      <el-form>
        <el-form-item>
          <el-input placeholder="请输入视频名称" v-model="searchKey">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="video-list">
      <div class="videoType-wrapper" v-for="(item, index) in hotTypeList" :key="index">
        <div v-if="item.videos.length > 0" :id="'videoType_' + index">
          <h3 class="type-item-wrapper">
            <span class="type-title">{{item.name}}</span>
            <span class="seeMore">查看更多</span>
          </h3>
          <el-row>
            <el-col :span="4" v-for="(v, index) in item.videos" :key="index">
              <div class="grid-content">
                <base-video :video='v'
                            :edit="false"
                            :videoRouter="true"></base-video>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="type-list">
        <div v-for="(item, index) in hotTypeList" :key="index">
          <div class="type-wrapper" v-if="item.videos.length > 0" v-scroll-to="'#videoType_' + index">
            {{item.name}}
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {getHotList} from '@/api/Video'
  import {getHotTypeList} from '@/api/VideoType'
  import {ERR_OK} from '@/config/index'
  import baseVideo from '@/base/baseVideo'

  export default {
    data () {
      return {
        hotList: [],
        hotTypeList: [],
        searchKey: ''
      }
    },
    methods: {
      getHotList () {
        getHotList().then(res => {
          if (res.data.error === ERR_OK) {
            this.hotList = res.data.result
          }
        })
      },
      getHotTypeList () {
        getHotTypeList().then(res => {
          if (res.data.error === ERR_OK) {
            this.hotTypeList = res.data.result
          }
        })
      },
      search () {
        if (this.searchKey) {
          this.$router.push({'name': 'search', 'query': {key: this.searchKey}})
        }
      }
    },
    components: {
      baseVideo
    },
    mounted () {
      this.getHotList()
      this.getHotTypeList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .index-wrapper{
    min-height: calc(100% - 162px);
    background-color: #fefefe;

    .carousel {
      margin: 30px 0;
    }

    .search-wrapper {
      width: 500px;
      margin: 15px auto 0;

      .search-select{
        width: 100px;
      }
    }

    .video-list {
      width: 1100px;
      margin: 0px auto;
      position: relative;

      .videoType-wrapper {
        margin-top: 50px;

        .type-item-wrapper{
          height: 36px;
          .type-title {
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
      }

      .type-list{
        position: fixed;
        top: 50%;
        left: 50%;
        margin-left: 600px;
        width: 48px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #eee;
        transform: translateY(-50%);

        .type-wrapper {
          height: 30px;
          text-align: center;
          line-height: 30px;
          cursor: pointer;
        }
        .type-wrapper:hover{
          color: #fff;
          background-color: #409EFF;
          border-left: 1px solid #409EFF;
          border-right: 1px solid #409EFF;
        }
      }
    }
  }
</style>

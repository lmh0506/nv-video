<template>
  <div class="ranklist">
    <div class="rank-wrapper">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="6" v-for="(rank, rindex) in list" :key="rindex">
          <div class="grid-content">
            <h3 class="rank-title">{{ranks[rindex]}}</h3>
            <div class="rank">
              <div class="rank-item" v-for="(item, index) in rank" :key="index">
                <router-link tag="p" :to="{name: 'videoDetail', params: {id: item._id}}" class="item">
                  <span>
                    <svg v-if="index < 3" class="icon" aria-hidden="true">
                        <use :xlink:href="rankIcon(index)"></use>
                    </svg>
                    <i class="normal" v-else>{{index + 1}}</i>
                  </span>
                  <span class="name">{{item.name}}</span>
                  <span class="num">{{item[keys[rindex]]}}</span>
                </router-link>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import {getRankList} from '@/api/Video'
  import {ERR_OK} from '@/config/index'

  export default {
    data () {
      return {
        ranks: ['点击榜', '收藏榜', '高分榜'],
        keys: ['vplaynum', 'fav_num', 'rate'],
        list: []
      }
    },
    methods: {
      getRankList () {
        getRankList().then(res => {
          if (res.data.error === ERR_OK) {
            this.list = res.data.result
          }
        })
      },
      rankIcon (index) {
        switch (index) {
          case 0: return '#icon-diyiming'
          case 1: return '#icon-diermingyajunjiangbei'
          case 2: return '#icon-disanmingjijunjiangbei'
        }
      }
    },
    mounted () {
      this.getRankList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .ranklist{
    min-height: calc(100% - 162px);
    box-sizing: border-box;
    padding-top: 50px;

    .rank-wrapper {
      width: 1100px;
      margin: 0px auto;

      .grid-content {
        .rank-title{
          text-align: center;
          background-color: #409EFF;
          color: #fff;
          padding: 5px 0;
        }
        .rank {
          .rank-item{
            height: 50px;
            line-height: 50px;
            border: 1px solid #ddd;
            border-top: none;
            font-size: 0;
            cursor: pointer;
            transition: all .3s;

            span {
              display: inline-block;
              width: 20%;
              font-size: 14px;
              text-align: center;
              overflow: hidden;
              .rank-num {
                font-size: 30px;
              }
            }
            span:nth-child(1) {
              font-weight: bold;
              color: #b8c0cc;
              font-size: 30px;
            }
            span:nth-child(2) {
              width: 60%;
            }
            span:nth-child(3) {
              font-weight: bold;
              color: #409EFF;
            }
          }
          .rank-item:hover{
            box-shadow: 2px 3px 3px #ddd;
          }
        }
      }
    }
  }
</style>

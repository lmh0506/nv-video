<template>
  <div class="typeDetail">
    <div class="typeDetail-wrapper">
      <h3 class="typeDetail-title">
      {{name}}
      <span class="typeDetail-small-title" 
            :class="{'active-title': sort}"
            @click="changeTitle()">
        按发布时间排序
      </span>
      <span class="typeDetail-small-title" 
            :class="{'active-title': !sort}"
            @click="changeTitle()">
        按热度排序
      </span>
    </h3>
      <div class="typeDetail-list">
        <template v-if="detailList.length > 0">
          <el-row>
            <el-col :span="4" v-for="(v, index) in detailList" :key="index">
              <div class="grid-content">
                <base-video :video='v' 
                          :edit="false"
                          :videoRouter="true"></base-video>
              </div>
            </el-col>
          </el-row>
          <div class="block" v-if="total > pageSize">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </template>
        <h1 class="nolist-title" v-else-if="detailList.length === 0">你还没有上传过视频</h1>
      </div>
    </div>
  </div>
</template>

<script>
  import {ERR_OK} from '@/config/index'
  import {getDetailList} from '@/api/VideoType'
  import baseVideo from '@/base/baseVideo'

  export default {
    data () {
      return {
        sort: true,
        currentPage: 1,
        pageSize: 24,
        total: 0,
        detailList: [],
        name: ''
      }
    },
    methods: {
      getDetailList () {
        let id = this.$route.params.id
        getDetailList(id, this.sort, this.currentPage, this.pageSize).then(res => {
          if (res.data.error === ERR_OK) {
            this.detailList = res.data.list
            this.total = res.data.total
            this.name = res.data.name
          }
        })
      },
      handleCurrentChange (page) {
        this.currentPage = page
        this.getDetailList()
      },
      changeTitle () {
        this.sort = !this.sort
        this.handleCurrentChange(1)
      }
    },
    components: {
      baseVideo
    },
    mounted () {
      this.getDetailList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .typeDetail {
    min-height: calc(100% - 162px);
    position: relative;
    padding-top: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;

    .typeDetail-wrapper {
      width: 1100px;
      margin: 0px auto;

      .typeDetail-title{
        margin-left: 20px;
        margin-bottom: 10px;

        .typeDetail-small-title:first-child{
          margin-left: 30px;
        }
        .typeDetail-small-title{
          font-size: 12px;
          margin-right: 10px;
          display: inline-block;
          padding-bottom: 5px;
          font-weight: normal;
          cursor: pointer;
        }
        .typeDetail-small-title.active-title{
          border-bottom: 2px solid #00a1d6;
          color: #00a1d6;
          font-weight: bold;
          position: relative;
        }
        .typeDetail-small-title.active-title:after{
          content: ' ';
          display: block;
          position: absolute;
          border: 3px solid transparent;
          border-bottom: 3px solid #00a1d6;
          left: 50%;
          transform: translate(-50%, -10%);
        }
      }
    }

    .nolist-title {
      margin: 50px auto 0;
      text-align: center;
    }

    .block {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translate(-50%, 0);
      .el-pagination{
        text-align: center;
      }
    }
  }
</style>

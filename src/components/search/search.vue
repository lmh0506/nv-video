<template>
  <div class="search-wrapper">
    <div class="search-wrapper">
      <el-form>
        <el-form-item>
          <el-input placeholder="请输入视频名称" v-model="searchKey">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="search-list">
      <template v-if="searchList.length > 0">
        <el-row>
          <el-col :span="4" v-for="(v, index) in searchList" :key="index">
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
      <h1 v-else class="nolist-title">没有找到相关的数据</h1>
    </div>
  </div>
</template>

<script>
  import {getVideoList} from '@/api/Video'
  import {ERR_OK} from '@/config/index'
  import baseVideo from '@/base/baseVideo'

  export default {
    data () {
      return {
        currentPage: 1,
        pageSize: 24,
        total: 0,
        searchKey: this.$route.query.key,
        searchList: []
      }
    },
    methods: {
      getSearchList () {
        getVideoList(this.searchKey, this.currentPage, this.pageSize).then(res => {
          if (res.data.error === ERR_OK) {
            this.searchList = res.data.result
            this.total = res.data.total
          }
        })
      },
      search () {
        this.handleCurrentChange(1)
      },
      handleCurrentChange (page) {
        this.currentPage = page
        this.getSearchList()
      }
    },
    mounted () {
      this.getSearchList()
    },
    components: {
      baseVideo
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .search-wrapper{
    min-height: calc(100% - 177px);
    position: relative;

    .search-wrapper {
      width: 500px;
      margin: 15px auto 0;

      .search-select{
        width: 100px;
      }
    }

    .search-list{
      width: 1100px;
      margin: 0px auto;
      padding-bottom: 20px;

      .nolist-title {
        margin: 50px auto 0;
        text-align: center;
      }
      
      .block{
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
</style>

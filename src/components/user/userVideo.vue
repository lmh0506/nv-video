<template>
  <div class="userVideo-wrapper">
    <h3 class="my-video-title">
      我的视频
      <span v-for="(item, index) in titleArr" 
            :key="index" 
            class="my-video-small-title" 
            :class="{'active-title': activeTitle === index}"
            @click="changeTitle(index)">
        {{item}}
      </span>
      <el-button type="text" @click="editVideo">{{editMsg}}<i class="el-icon-edit"></i></el-button>
    </h3>
    <div class="my-video-wrapper" v-if="activeTitle === 0">
      <template v-if="videoList.length > 0">
        <el-row>
          <el-col :span="4" v-for="(v, index) in videoList" :key="index">
            <div class="grid-content">
              <base-video @deleteVideo="deleteVideo($event, index, true)"            :video='v' 
                        :edit="edit"
                        :videoRouter="true"></base-video>
            </div>
          </el-col>
        </el-row>
        <div class="block">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </template>
      <h1 class="nolist-title" v-else-if="videoList.length === 0">你还没有上传过视频</h1>
    </div>
    <div class="my-video-ing" v-else-if="activeTitle === 1">
      <el-row v-if="ingList.length > 0">
        <el-col :span="4" v-for="(v, index) in ingList" :key="index">
          <div class="grid-content">
            <base-video @deleteVideo="deleteVideo($event, index, false)"                  :video='v' 
                        :edit="edit"></base-video>
          </div>
        </el-col>
      </el-row>
      <h1 class="nolist-title" v-else-if="ingList.length === 0">还没有审核中的视频</h1>
    </div>
    <div class="my-video-nopass" v-else-if="activeTitle === 2">
      <el-row v-if="noPassList.length > 0">
        <el-col :span="4" v-for="(v, index) in noPassList" :key="index">
          <div class="grid-content">
            <base-video @deleteVideo="deleteVideo($event, index, false)" :video='v' :edit="edit"></base-video>
          </div>
        </el-col>
      </el-row>
      <h1 class="nolist-title" v-else-if="noPassList.length === 0">还没有审核未通过的视频</h1>
    </div>
  </div>
</template>

<script>
  import baseVideo from '@/base/baseVideo'
  import {getUserVideoList, deleteVideo} from '@/api/Video'
  import {ERR_OK, NO_LOGIN} from '@/config/index'

  export default {
    data () {
      return {
        activeTitle: 0,
        titleArr: ['我的视频', '审核中', '审核未通过'],
        videoList: [],
        ingList: [],
        noPassList: [],
        edit: false,
        editMsg: '编辑视频',
        pageSize: 24, // 每页显示数目
        total: 0, // 总数
        currentPage: 1 // 当前页码
      }
    },
    methods: {
      changeTitle (index) {
        this.activeTitle = index
      },
      getUserVideoList () { // 获取用户审核中和审核未通过的视频列表
        getUserVideoList(this.$route.params.id).then(res => {
          if (res.data.error === ERR_OK) {
            this.normalizeList(res.data.result)
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      getPassList () { // 获取用户审核通过的视频列表
        getUserVideoList(this.$route.params.id, this.currentPage, this.pageSize).then(res => {
          if (res.data.error === ERR_OK) {
            this.videoList = res.data.result
            this.total = res.data.total
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      normalizeList (list) { // 格式化视频列表
        this.ingList = []
        this.noPassList = []
        list.forEach(v => {
          if (v.shenhe === 'ing') {
            this.ingList.push(v)
          } else {
            this.noPassList.push(v)
          }
        })
      },
      deleteVideo (id, index, isPass) {
        this.$confirm('此操作将永久删除该视频, 请谨慎操作?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteVideo(id).then(res => {
            if (res.data.error === ERR_OK) {
              this.$message.success('删除成功')
              if (isPass) {
                this.getPassList()
              } else {
                this.getUserVideoList()
              }
            } else if (res.data.error === NO_LOGIN) {
              this.$router.push('/login')
            } else {
              this.$message('服务器繁忙，删除失败')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      editVideo () {
        this.edit = !this.edit
        if (this.edit) {
          this.editMsg = '取消编辑'
        } else {
          this.editMsg = '编辑视频'
        }
      },
      handleCurrentChange (page) {
        this.currentPage = page
        this.getPassList()
      }
    },
    mounted () {
      this.getPassList()
      this.getUserVideoList()
    },
    components: {
      baseVideo
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .userVideo-wrapper{
    padding: 10px;
    padding-bottom: 40px;

    .my-video-title{
      margin-left: 20px;
      margin-bottom: 10px;

      .my-video-small-title:first-child{
        margin-left: 30px;
      }
      .my-video-small-title{
        font-size: 12px;
        margin-right: 10px;
        display: inline-block;
        padding-bottom: 5px;
        font-weight: normal;
        cursor: pointer;
      }
      .my-video-small-title.active-title{
        border-bottom: 2px solid #00a1d6;
        color: #00a1d6;
        font-weight: bold;
        position: relative;
      }
      .my-video-small-title.active-title:after{
        content: ' ';
        display: block;
        position: absolute;
        border: 3px solid transparent;
        border-bottom: 3px solid #00a1d6;
        left: 50%;
        transform: translate(-50%, -10%);
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

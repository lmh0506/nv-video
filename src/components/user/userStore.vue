<template>
  <div class="userStore-wrapper">
    <h3 class="my-store-title">
      我的收藏
      <el-button v-if="isVisiter" class="edit-btn" type="text" @click="editVideo">{{editMsg}}<i class="el-icon-edit"></i></el-button>
    </h3>
    <div class="my-video-wrapper">
      <template v-if="storeList.length > 0">
        <el-row>
          <el-col :span="4" v-for="(v, index) in storeList" :key="index">
            <div class="grid-content">
              <base-video @deleteVideo="deleteVideo($event, index)"                       :video='v' 
                        :edit="edit"
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
      <h1 class="nolist-title" v-else-if="storeList.length === 0">你还没有收藏过视频</h1>
    </div>
  </div>
</template>

<script>
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  import {getStoreList, deleteStoreVideo} from '@/api/User'
  import baseVideo from '@/base/baseVideo'
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        editMsg: '编辑收藏',
        storeList: [],
        pageSize: 24,
        currentPage: 1,
        total: 0,
        edit: false
      }
    },
    computed: {
      ...mapState([
        'user'
      ]),
      isVisiter () {
        return this.user.id === this.$route.params.id
      }
    },
    methods: {
      getStoreList () {
        let id = this.$route.params.id
        getStoreList(id, this.currentPage, this.pageSize).then(res => {
          if (res.data.error === ERR_OK) {
            this.storeList = res.data.result
            this.total = res.data.total
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      handleCurrentChange (page) {
        this.currentPage = page
        this.getStoreList()
      },
      editVideo () {
        this.edit = !this.edit
        if (this.edit) {
          this.editMsg = '取消编辑'
        } else {
          this.editMsg = '编辑收藏'
        }
      },
      deleteVideo (id, index) {
        let uid = this.$route.params.id

        this.$confirm('此操作取消收藏该视频, 请谨慎操作?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteStoreVideo(uid, id).then(res => {
            if (res.data.error === ERR_OK) {
              this.$message.success('取消收藏成功')
              if (this.storeList.length - 1 === 0) {
                this.currentPage --
              }
              this.getStoreList()
            } else if (res.data.error === NO_LOGIN) {
              this.$router.push('/login')
            } else {
              this.$message('服务器繁忙，取消收藏失败')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    components: {
      baseVideo
    },
    mounted () {
      this.getStoreList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .userStore-wrapper{
    padding: 10px;
    padding-bottom: 40px;

    .my-store-title{
      margin-left: 20px;
      margin-bottom: 10px;

      .edit-btn {
        margin-left: 20px;
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

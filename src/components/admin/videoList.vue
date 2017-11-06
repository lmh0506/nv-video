<template>
  <div class="videoList-wrapper">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>视频管理</el-breadcrumb-item>
      <el-breadcrumb-item>视频列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="demo-form-inline" @submit.prevent.native="search">
      <el-form-item>
        <el-input v-model="searchKey" placeholder="搜索视频名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="videoList"
      v-loading='loading'
      element-loading-text="拼命加载中">
        <el-table-column
          label="视频名称"
          width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="作者昵称"
          width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.publisher.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="视频类型"
          width="180">
          <template slot-scope="scope">
            <el-tag
            type='primary'
            close-transition>{{scope.row.type.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          prop="shenhe"
          :filter-multiple="false"
          :filters="filters"
          :filter-method="filterTag"
          filter-placement="bottom"
          width="180">
          <template slot-scope="scope">
            <el-tag
            :type='tagType(scope.row.shenhe)'
            close-transition>{{scope.row.shenhe}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="showVideoDialog(scope.row)">查看</el-button>
            <el-button
              size="small"
              type="danger"
              @click="deleteVideo(scope.$index, scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" v-if="total > pageSize">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <el-dialog
        title="查看视频内容"
        :visible.sync="dialogVisible"
        width="50%"
        @close="hideVideoDialog"
        center>
        <d-player :video='videoObj' 
                  :contextmenu="contextmenu"
                  ref="player"></d-player>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="hideVideoDialog">确定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  import {getVideoList, deleteVideo} from '@/api/Video'
  import {videoListMixin} from '@/mixins/videoListMixin'

  export default {
    mixins: [videoListMixin],
    data () {
      return {
        contextmenu: [{
          text: '刷新',
          link: '/admin/videoList'
        }],
        filters: [ // 数据过滤数组
          {
            text: '通过',
            value: '通过'
          },
          {
            text: '未通过',
            value: '未通过'
          },
          {
            text: '审核中',
            value: '审核中'
          }
        ]
      }
    },
    methods: {
      getVideoList () {
        this.loading = true
        getVideoList(this.searchKey, this.currentPage, this.pageSize).then(res => {
          if (res.data.error === ERR_OK) {
            this.videoList = this.normalizList(res.data.result)
            this.total = res.data.total
            this.loading = false
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      normalizList (list) { // 格式化列表
        list.forEach(v => {
          if (v.shenhe === 'ing') {
            v.shenhe = '审核中'
          } else if (v.shenhe === '审核通过') {
            v.shenhe = '通过'
          } else {
            v.shenhe = '未通过'
          }
        })
        return list
      },
      tagType (s) {
        switch (s) {
          case '审核中': return 'primary'
          case '通过': return 'success'
          case '未通过': return 'danger'
        }
      },
      filterTag (value, row) { // 筛选状态
        return row.shenhe === value
      },
      deleteVideo (index, id) { // 删除视频
        this.$confirm('此操作将永久删除该视频, 请谨慎操作?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteVideo(id).then(res => {
            if (res.data.error === ERR_OK) {
              this.getVideoList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else if (res.data.error === NO_LOGIN) {
              this.$router.push('/login')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handleCurrentChange (page) {
        this.currentPage = page
        this.getVideoList()
      }
    },
    mounted () {
      this.getVideoList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .demo-form-inline{
    margin-top: 15px;
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
</style>

<template>
  <div class="videoAudit-wrapper">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>视频管理</el-breadcrumb-item>
      <el-breadcrumb-item>视频审核</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="demo-form-inline">
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
        <template scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="作者昵称"
        width="180">
        <template scope="scope">
          <span style="margin-left: 10px">{{ scope.row.publisher.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="视频类型"
        width="180">
        <template scope="scope">
          <el-tag
          type='primary'
          close-transition>{{scope.row.type.name}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            size="small"
            @click="showVideoDialog(scope.row)">查看</el-button>
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
      title="视频审核"
      :visible.sync="dialogVisible"
      width="50%"
      @close="hideVideoDialog"
      center>
      <d-player :video='videoObj' 
                :contextmenu="contextmenu"
                ref="player"></d-player>
      <p class="select-wrapper">
        <el-select class="shenheSelect" v-model="shenhe" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hideVideoDialog">取 消</el-button>
        <el-button type="primary" @click="submit">提交审核</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getAuditList, submitShenhe} from '@/api/Video'
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  import {videoListMixin} from '@/mixins/videoListMixin'

  export default {
    mixins: [videoListMixin],
    data () {
      return {
        contextmenu: [
          {
            text: '刷新',
            link: '/admin/videoAudit'
          }
        ],
        options: [{
          value: '审核通过',
          label: '审核通过'
        }, {
          value: '视频内容违规',
          label: '视频内容违规'
        }, {
          value: '视频预览图违规',
          label: '视频预览图违规'
        }],
        shenhe: '审核通过'
      }
    },
    methods: {
      getAuditList () { // 获取审核视频列表
        this.loading = true
        getAuditList(this.searchKey, this.currentPage, this.pageSize).then(res => {
          if (res.data.error === ERR_OK) {
            this.videoList = res.data.result
            this.loading = false
            this.total = res.data.total
          }
        })
      },
      submit () { // 提交审核
        let id = this.videoObj.id
        submitShenhe(id, this.shenhe).then(res => {
          if (res.data.error === ERR_OK) {
            this.hideVideoDialog()
            this.getAuditList()
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/')
          }
        })
      },
      handleCurrentChange (page) {
        this.currentPage = page
        this.getAuditList()
      }
    },
    mounted () {
      this.getAuditList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .demo-form-inline{
    margin-top: 15px;
  }
  .select-wrapper{
    text-align: center;
    padding-top: 10px;
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

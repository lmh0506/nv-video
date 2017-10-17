<template>
  <div class="videoAdmin-wrapper">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>视频管理</el-breadcrumb-item>
      <el-breadcrumb-item>类型管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchKey" placeholder="查找分类"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addTypeVisible = true">添加分类</el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="typeList"
    style="width: 360px;">
      <el-table-column
        label="类型名"
        width="180">
        <template scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加分类" width='400px' :visible.sync="addTypeVisible" >
      <el-form label-width='80px' 
              :model="typeForm" 
              status-icon 
              :rules="rules" 
              ref="typeForm">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="typeForm.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTypeVisible = false">取 消</el-button>
        <el-button type="primary" @click="addType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {addType, getTypeList} from '@/api/VideoType'
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  import {_checkTypeName} from '@/util/check'

  export default {
    data () {
      return {
        searchKey: '',
        typeList: [],
        addTypeVisible: false,
        typeForm: {
          name: ''
        },
        rules: {
          name: [
            {validator: _checkTypeName, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      getTypeList () { // 获取分类列表
        getTypeList(this.searchKey).then(res => {
          if (res.data.error === ERR_OK) {
            this.typeList = res.data.result
          }
        })
      },
      search () { // 查询分类
        this.getTypeList()
      },
      handleDelete () { // 删除分类

      },
      handleEdit () { // 编辑分类

      },
      addType () { // 添加分类
        this.$refs['typeForm'].validate((valid) => {
          if (valid) {
            addType(this.typeForm.name).then(res => {
              if (res.data.error === ERR_OK) {
                this.addTypeVisible = false
                this.typeList.push({'name': this.typeForm.name})
              } else if (res.data.error === NO_LOGIN) {
                this.$router.push('/login')
              }
            })
          } else {
            return false
          }
        })
      }
    },
    mounted () {
      this.getTypeList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .demo-form-inline{
    margin-top: 15px;
  }

</style>

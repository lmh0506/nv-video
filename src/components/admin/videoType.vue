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
    v-loading='loading'
    element-loading-text="拼命加载中"
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
            @click="showEditType(scope.$index)">编辑</el-button>
          <el-dialog title="编辑分类" width='400px' :visible.sync="editTypeVisible" >
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
              <el-button @click="editTypeVisible = false">取 消</el-button>
              <el-button type="primary" @click="update">确 定</el-button>
            </div>
          </el-dialog>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row._id)">删除</el-button>
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
  import {addType, getTypeList, deleteType, updateType} from '@/api/VideoType'
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  import {_checkTypeName} from '@/util/check'

  export default {
    data () {
      return {
        searchKey: '',
        typeList: [],
        addTypeVisible: false,
        editTypeVisible: false,
        typeForm: {
          name: ''
        },
        rules: {
          name: [
            {validator: _checkTypeName, trigger: 'blur'}
          ]
        },
        loading: false
      }
    },
    methods: {
      getTypeList () { // 获取分类列表
        this.loading = true
        getTypeList(this.searchKey).then(res => {
          if (res.data.error === ERR_OK) {
            this.typeList = res.data.result
            this.loading = false
          }
        })
      },
      search () { // 查询分类
        this.getTypeList()
      },
      handleDelete (index, id) { // 删除分类
        this.$confirm('此操作将永久删除该分类及该分类下的所有视频, 请谨慎操作?', '警告', {
          confirmButtonText: '取消',
          cancelButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }).catch(() => {
          deleteType(id).then(res => {
            if (res.data.error === ERR_OK) {
              this.typeList.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else if (res.data.error === NO_LOGIN) {
              this.$router.push('/login')
            }
          })
        })
      },
      update () { // 编辑分类
        updateType(this.typeForm._id, this.typeForm.name).then(res => {
          if (res.data.error === ERR_OK) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.editTypeVisible = false
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      addType () { // 添加分类
        this.$refs['typeForm'].validate((valid) => {
          if (valid) {
            addType(this.typeForm.name).then(res => {
              if (res.data.error === ERR_OK) {
                this.addTypeVisible = false
                let {_id, name} = res.data.result
                this.typeList.push({_id, name})
              } else if (res.data.error === NO_LOGIN) {
                this.$router.push('/login')
              }
            })
          } else {
            return false
          }
        })
      },
      showEditType (index) {
        this.editTypeVisible = true
        this.typeForm = this.typeList[index]
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

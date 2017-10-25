<template>
  <div>
    <div v-if="comment.reply.length > 0">
      <div class="reply-wrapper" v-for="(reply, rindex) in comment.reply" :key="rindex">
        <div class="reply-left">
          <router-link tag="img" :to="{name: 'userIndex', params: {id: reply.from_user._id}}" :src="reply.from_user.avatar" width="24" height="24" alt=""></router-link>
        </div>
        <div class="reply-right">
          <h6 class="reply-right-head">
            <router-link tag="span" :to="{name: 'userIndex', params: {id: reply.from_user._id}}" class="reply-userName">{{reply.from_user.name}}</router-link>
            <router-link tag="span" :to="{name: 'userIndex', params: {id: reply.to_user._id}}" class="reply-userName" v-if="reply.to_user && (reply.to_user._id != reply.from_user._id)">{{`回复 @ ${reply.to_user.name}:`}}</router-link>
            <span class="reply-content">{{reply.content}}</span>
          </h6>
          <p class="reply-createTime">
            {{reply.createTime}}
            <el-button type="text" class="replyBtn" @click="showReply(reply.from_user)">回复</el-button>
          </p>
        </div>
      </div>
    </div>
    <div class="pagination-wrapper">
      <el-button @click="seeMore" type="text" v-show="comment.reply.length >= pageSize && total < pageSize">查看更多</el-button>
      <el-pagination
        v-if="total > pageSize"
        small
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total">
      </el-pagination>
    </div>
  </div>
    
</template>

<script>
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  import {getReplyList} from '@/api/Comment'
  import {mapState} from 'vuex'

  export default {
    props: {
      comment: Object,
      cindex: Number,
      replySize: Number
    },
    data () {
      return {
        total: 0, // 回复总条数
        currentPage: 1,
        pageSize: this.replySize
      }
    },
    computed: {
      ...mapState([
        'user'
      ])
    },
    methods: {
      seeMore () {
        if (this.user.id) {
          this.getReplyList(this.comment._id, this.cindex)
        } else {
          this.$message.error('登录后才能查看更多')
        }
      },
      getReplyList () {
        this.pageSize = this.replySize * 2
        getReplyList(this.comment._id, this.currentPage, this.pageSize).then(res => {
          if (res.data.error === ERR_OK) {
            this.$emit('changeReply', res.data.result.reply, this.cindex)
            this.total = res.data.total
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      handleCurrentChange (page) {
        this.currentPage = page
        this.getReplyList()
        this.$emit('pageChange', -1)
      },
      showReply (fromUser) {
        this.getReplyList()
        this.$emit('showReply', this.cindex, fromUser)
      }
    },
    watch: {
      comment (val, oldVal) {
        if (val._id !== oldVal._id) { // 当评论换页时  将回复列表的属性重置
          this.total = 0
          this.currentPage = 1
          this.pageSize = this.replySize
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .reply-wrapper{
    overflow: hidden;

    .reply-left{
      padding: 5px;
      float: left;

      img {
        border-radius: 50%;
        cursor: pointer;
      }
    }

    .reply-right{
      width: calc(100% - 54px);
      margin-left: 20px;
      float: left;
      .reply-userName {
        color: #6d757a;
        margin-top: 10px;
        margin-bottom: 10px;
        cursor: pointer;
      }

      .reply-content {
        color: #333;
        line-height: 1.5;
      }

      .reply-createTime {
        color: #99a2aa;
      }

      .reply-content{
        margin-left: 20px;
      }

      .replyBtn {
        margin-left: 30px;
        color: #99a2aa;
      }
    }
  }

  .pagination-wrapper {
    padding-left: 30px;
  }
</style>

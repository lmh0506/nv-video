<template>
  <div class="videoDetail-wrapper" v-if="video._id">
    <div class="videoDetail-header">
      <div class="videoDetail-left-title">
        <h3 class="videoDetail-video-name">{{video.name}}</h3>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{name: 'typeDetail', params: {id: video.type._id}}">{{video.type.name}}</el-breadcrumb-item>
        </el-breadcrumb>
        <p class="videoDetail-createTime">
          {{video.createTime}}
        </p>
        <p class="videoDetail-playInfo">
          <span class="videoDetail-playnum">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-bofang1"></use>
            </svg>
            {{video.vplaynum}}
          </span>
          <span class="videoDetail-favnum">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shoucang"></use>
            </svg>
            {{video.fav_num}}
          </span>
          <span class="videoDetail-score">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-pingfen1"></use>
            </svg>
            {{video.rate}}
          </span>
        </p>
      </div>
      <div class="videoDetail-right-user">
        <div class="user-avatar-wrapper">
          <router-link tag="img" :to="{name: 'userIndex', params: {id: video.publisher._id}}" v-lazy="video.publisher.avatar">
          </router-link>
        </div>
        <p class="user-name">
          <router-link tag="span" :to="{name: 'userIndex', params: {id: video.publisher._id}}" >
            {{video.publisher.name}}
          </router-link>
        </p>
      </div>
    </div>
    <div class="videoDetail-main">
      <d-player :video='videoObj' 
                  :contextmenu="contextmenu"
                  @ended="end"
                  :loop="false"
                  ref="player"></d-player>
      <p class="video-bottom">
        <span class="videoDetail-store">
          {{isStore ? '取消收藏' : '收藏视频'}}
          <svg class="icon" aria-hidden="true" @click="storeVideo">
            <use :xlink:href="storeIcon"></use>
          </svg>
        </span>
        <span class="videoDetail-rate">
          {{rateAble ? '已' : ''}}评分
          <el-rate class="rate-wrapper"
            v-model="rate"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            show-text
            :disabled="rateAble"
            @change="submitRate">
          </el-rate>
        </span>
      </p>
    </div>
    <div class="videoDetail-comment">
      <div class="comment-list" v-if="commentList.length > 0">
        <div class="comment-wrapper" v-for="(comment, cindex) in commentList" :key="cindex">
          <div class="comment-left">
            <router-link tag="img" :to="{name: 'userIndex', params: {id: comment.from_user._id}}" v-lazy="comment.from_user.avatar" width="86" height="86" alt=""></router-link>
          </div>
          <div class="comment-right">
            <router-link tag="h4" :to="{name: 'userIndex', params: {id: comment.from_user._id}}" class="comment-userName">
              {{comment.from_user.name}}
            </router-link>
            <p class="comment-content">
              {{comment.content}}
            </p>
            <p class="comment-createTime">
              {{comment.createTime}}
              <el-button type="text" class="replyBtn" @click="showReply(cindex)">回复</el-button>
            </p>
            <reply-list :comment="comment" 
                    :cindex="cindex" 
                    :replySize="replySize"
                    @pageChange="pageChange"
                    @changeReply="changeReply"
                    @showReply="showReply"
                    ref="replyList"></reply-list>
            <div class="reply-form" v-show="replyFormShow === cindex">
              <el-form :inline="true" :model="replyForm" ref="replyForm" :rules="rules" class="demo-form-inline">
                <el-form-item prop="comment">
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    class="content"
                    v-model="replyForm.comment">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button class="submit-btn" type="primary" @click="submitReply(comment._id, cindex)">发表评论</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div class="no-comment" v-if="commentList.length === 0">
        目前还没有人评论该视频
      </div>
      <div class="pagination-wrapper" v-if="total > pageSize">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next"
          :total="total">
        </el-pagination>
      </div>  
      <div class="comment-form">
        <el-form :inline="true" :model="commentForm" ref="commentForm" :rules="rules" class="demo-form-inline">
          <el-form-item prop="comment">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              class="content"
              v-model="commentForm.comment">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="submit-btn" type="primary" @click="submitComment">发表评论</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {getVideo, playNumUp, storeVideo, submitRate} from '@/api/Video'
  import {getIsStoreAndRate} from '@/api/User'
  import {submitComment, getCommentList, submitReply} from '@/api/Comment'
  import {ERR_OK, NO_LOGIN} from '@/config/index'
  import VueDPlayer from 'vue-dplayer'
  import {mapState} from 'vuex'
  import baseReplyList from '@/base/baseReplyList'

  export default {
    data () {
      return {
        video: {},
        videoObj: {},
        contextmenu: [],
        rate: null,
        rateAble: false,
        isStore: false, // 是否收藏
        commentForm: {
          comment: ''
        },
        replyForm: {
          comment: ''
        },
        rules: {
          comment: [
            { required: true, message: '请输入评论内容', trigger: 'blur' }
          ]
        },
        commentList: [],
        replyFormShow: -1,
        toUser: null, // 存储回复的用户
        total: 0, // 评论总条数
        currentPage: 1,
        pageSize: 3,
        replySize: 1 // 起始显示回复数量
      }
    },
    computed: {
      ...mapState([
        'user'
      ]),
      rateNum () { // 计算视频评分
        let num = 0
        if (this.video.score.length > 0) {
          this.video.score.forEach(item => {
            num += item.rate
          })
          return (num / this.video.score.length).toFixed(1)
        } else {
          return num
        }
      },
      storeIcon () {
        return this.isStore ? '#icon-shoucang1' : '#icon-shoucang2'
      }
    },
    methods: {
      getVideo () {
        let id = this.$route.params.id
        getVideo(id).then(res => {
          if (res.data.error === ERR_OK) {
            this.video = res.data.result
            this.videoObj = {
              url: this.video.src,
              pic: this.video.img
            }
            this.contextmenu = [
              {
                text: '查看作者更多视频',
                link: `/user/${this.video.publisher._id}`
              }
            ]
            this.total = res.data.result.comment
            this.getCommentList(this.video._id)
            if (this.user.id) { // 如果用户已登录 获取他的收藏信息
              this.getIsStoreAndRate()
            }
          }
        })
      },
      getCommentList (vid) { // 获取评论列表
        getCommentList(vid, this.currentPage, this.pageSize, this.replySize).then(res => {
          if (res.data.error === ERR_OK) {
            this.commentList = res.data.result
          }
        })
      },
      end () { // 播放结束时视频播放量增加
        let id = this.$route.params.id
        playNumUp(id).then(res => {
          if (res.data.error === ERR_OK) {
            this.video.vplaynum ++
          }
        })
      },
      storeVideo () { // 收藏或取消收藏视频
        let vid = this.$route.params.id
        let uid = this.user.id
        storeVideo(vid, uid).then(res => {
          if (res.data.error === ERR_OK) {
            this.isStore = res.data.result
            if (this.isStore) {
              this.video.fav_num ++
            } else {
              this.video.fav_num --
            }
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      getIsStoreAndRate () { // 当前登录用户是否对该视频收藏
        getIsStoreAndRate(this.user.id, this.video._id).then(res => {
          if (res.data.error === ERR_OK) {
            this.isStore = res.data.store
            if (res.data.rate >= 0) {
              this.rate = res.data.rate
              this.rateAble = true
            }
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      submitRate (rate) { // 提交评价
        let vid = this.$route.params.id
        let uid = this.user.id
        submitRate(vid, uid, rate).then(res => {
          if (res.data.error === ERR_OK) {
            this.rateAble = true
          } else if (res.data.error === NO_LOGIN) {
            this.$router.push('/login')
          }
        })
      },
      submitComment () { // 提交评论
        let vid = this.$route.params.id
        let uid = this.user.id

        this.$refs['commentForm'].validate((valid) => {
          if (valid) {
            submitComment(uid, this.commentForm.comment, vid).then(res => {
              if (res.data.error === ERR_OK) {
                // 发表成功 评论总数增加
                this.total ++
                this.getCommentList(this.video._id)
                this.commentForm.comment = ''
              } else if (res.data.error === NO_LOGIN) {
                this.$router.push('/login')
              }
            })
          } else {
            return false
          }
        })
      },
      handleCurrentChange (page) {
        this.currentPage = page
        this.replyFormShow = -1
        this.getCommentList(this.video._id)
      },
      changeReply (list, index) { // 更新回复列表
        this.commentList[index].reply = list
      },
      showReply (cindex, toUser) { // 显示回复框
        this.replyFormShow = cindex
        this.toUser = toUser // 更新回复对象
        this.replyForm.comment = '' // 清空回复内容
      },
      submitReply (cid, cindex) { // 提交回复
        let uid = this.user.id
        let toUser = this.toUser ? this.toUser._id : ''

        this.$refs['replyForm'][this.replyFormShow].validate((valid) => {
          if (valid) {
            submitReply(uid, this.replyForm.comment, cid, toUser).then(res => {
              if (res.data.error === ERR_OK) {
                this.$refs.replyList[cindex].getReplyList()
                this.replyForm.comment = ''
              } else if (res.data.error === NO_LOGIN) {
                this.$router.push('/login')
              }
            })
          } else {
            return false
          }
        })
      },
      pageChange (index) {
        this.replyFormShow = index
      }
    },
    components: {
      'd-player': VueDPlayer,
      'reply-list': baseReplyList
    },
    mounted () {
      this.getVideo()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .videoDetail-wrapper{
    width: 1100px;
    min-height: calc(100% - 162px);
    margin: 0px auto;

    .videoDetail-header{
      padding: 10px;
      min-height: 135px;
      border-bottom: 1px solid #ddd;

      .videoDetail-left-title {
        width: 60%;
        float: left;

        .videoDetail-video-name{
          margin-bottom: 15px;
          font-weight: normal;
        }

        p {
          margin-top: 15px;
          color: #666;

          span {
            margin-right: 20px;
          }
        }
      }

      .videoDetail-right-user {
        width: 40%;
        float: right;

        .user-avatar-wrapper {
          img{
            width: 100px;
            height: 100px;
            display: block;
            border-radius: 50%;
            margin: 0px auto;
            cursor: pointer;
          }
        }

        .user-name {
          text-align: center;
          margin-top: 10px;
          color: #409EFF;
          cursor: pointer;
        }
      }
    }

    .videoDetail-header:after{
      content: ' ';
      display: none;
      clear: both;
    }

    .videoDetail-main {
      margin-top: 10px;

      .video-bottom {
        margin-top: 10px;
        text-align: center;

        .icon {
          font-size: 38px;
          cursor: pointer;
        }
        .el-icon-my-shoucang1 {
          color: red;
        }

        .videoDetail-rate{
          margin-left: 20px;
          width: 250px;
          display: inline-block;

          .rate-wrapper {
            display: inline-block;
            margin-left: 10px;
            vertical-align: top;
          }
        }
      }
    }

    .videoDetail-comment {
      margin-top: 20px;

      .comment-list {
        .comment-wrapper{
          margin: 20px 0;
          overflow: hidden;
          border-bottom: 1px solid #ddd;
          .comment-left{
            width: 110px;
            padding: 13px;
            float: left;
            box-sizing: border-box;
            img {
              border-radius: 50%;
              cursor: pointer;
            }
          }
          .comment-right {
            margin-left: 10px;
            width: calc(100% - 120px);
            float: left;

            .comment-userName{
              color: #6d757a;
              margin-top: 10px;
              margin-bottom: 10px;
              cursor: pointer;
            }

            .comment-content{
              color: #333;
              line-height: 1.5;
            }

            .comment-createTime{
              color: #99a2aa;
            }
          }
          .reply-form{
            .content{
              width: 500px;
              margin-top: 20px;
              margin-left: 10px;
            }
            .submit-btn{
              margin-top: 27px;
            }
          }
          .replyBtn {
            margin-left: 30px;
            color: #99a2aa;
          }
        }

        .comment-wrapper:last-child{
          border-bottom: none;
        }
      }

      .no-comment{
        width: 100%;
        height: 100px;
        margin: 20px 0;
        font-size: 20px;
        text-align: center;
        line-height: 100px;
      }

      .pagination-wrapper{
        text-align: center;
      }

      .comment-form {
        text-align: center;
        margin-top: 20px;
        .content{
          width: 500px;
        }
        .submit-btn{
          margin-top: 7px;
        }
      }
    }
  }
</style>

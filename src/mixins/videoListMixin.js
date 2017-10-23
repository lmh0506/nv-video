import VueDPlayer from 'vue-dplayer'

export const videoListMixin = {
  data () {
    return {
      searchKey: '',
      videoList: [],
      loading: false,
      dialogVisible: false,
      videoObj: {},
      pageSize: 10, // 每页显示数目
      total: 0, // 总数
      currentPage: 1 // 当前页码
    }
  },
  methods: {
    showVideoDialog (video) {
      this.dialogVisible = true
      let {src, img, _id} = video
      this.videoObj = {
        'url': src,
        'pic': img,
        'id': _id
      }
    },
    hideVideoDialog () {
      this.dialogVisible = false
      this.$refs.player.dp.pause()
    },
    search () {
      this.handleCurrentChange(1)
    }
  },
  components: {
    'd-player': VueDPlayer
  }
}

import VueDPlayer from 'vue-dplayer'

export const videoListMixin = {
  data () {
    return {
      searchKey: '',
      videoList: [],
      loading: false,
      dialogVisible: false,
      videoObj: {}
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
    }
  },
  components: {
    'd-player': VueDPlayer
  }
}

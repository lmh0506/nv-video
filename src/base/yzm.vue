<template>
  <div id="yzm-wrapper" ref="yzm">
    <canvas ref="canvas" @click="drawPic"></canvas>
  </div>
</template>

<script>
export default {
  props: {
    _width: { // 画布宽度
      type: Number,
      default: 80
    },
    _height: { // 画布高度
      type: Number,
      default: 40
    },
    _num: { // 验证码个数
      type: Number,
      default: 4
    },
    isInline: { // 是否水平排列
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 绘制验证码
    drawPic () {
      let $canvas = this.$refs.canvas
      let _str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let _picTxt = ''

      $canvas.width = this._width
      $canvas.height = this._height

      let ctx = $canvas.getContext('2d')
      ctx.textBaseline = 'bottom'
      ctx.fillStyle = this.randomColor(180, 240)
      ctx.fillRect(0, 0, this._width, this._height)

      // 绘制随机字符
      for (let i = 0; i < this._num; i++) {
        let x = (this._width - 10) / this._num * i + 10
        let fontSize = this.randomNum(20, 30)
        let y = this.randomNum(fontSize, this._height)
        let deg = this.randomNum(-45, 45)
        let txt = _str[this.randomNum(0, _str.length)]
        _picTxt += txt
        ctx.fillStyle = this.randomColor(10, 100)
        ctx.font = fontSize + 'px SimHei'

        ctx.save()
        ctx.fillText(txt, x, y)
        ctx.rotate(deg * Math.PI / 180)
        ctx.restore()
      }

      // 绘制随机干扰线条
      for (let i = 0; i < this._num; i++) {
        ctx.strokeStyle = this.randomColor(90, 180)
        ctx.beginPath()
        ctx.moveTo(this.randomNum(0, this._width), this.randomNum(0, this._height))
        ctx.lineTo(this.randomNum(0, this._width), this.randomNum(0, this._height))
        ctx.stroke()
      }

      // 绘制随机干扰圆点
      for (let i = 0; i < this._num * 10; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(this.randomNum(0, this._width), this.randomNum(0, this._height), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
      this.$emit('draw', _picTxt)
    },
    // 生成随机数
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 生成随机颜色
    randomColor (min, max) {
      let _r = this.randomNum(min, max)
      let _g = this.randomNum(min, max)
      let _b = this.randomNum(min, max)

      return `rgb(${_r},${_g},${_b})`
    }
  },
  mounted () {
    this.drawPic()
    this.$refs.yzm.style.cssText = `width:${this._width}px;height:${this._height}px;display:${this.isInline ? 'inline-block' : 'block'}`
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>

</style>

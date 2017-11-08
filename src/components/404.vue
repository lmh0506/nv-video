<template>
  <div class="noFound-wrapper">
    <div class="noFound">
      <img src="/static/404.jpg" alt="">
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .noFound-wrapper{
    min-height: calc(100% - 162px);
    box-sizing: border-box;
    padding-top: 50px;
    img {
      display: block;
      margin: 0 auto;
    }
  }
</style>

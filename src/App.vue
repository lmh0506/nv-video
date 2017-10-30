<template>
  <div id="app">
    <nv-header></nv-header>
    <router-view/>
    <nv-footer></nv-footer>
  </div>
</template>

<script>
  import nvHeader from '@/components/nvHeader'
  import nvFooter from '@/components/nvFooter'

  export default {
    name: 'app',
    components: {
      nvHeader,
      nvFooter
    }
  }
</script>

<style>
  html, body{
    height: 100%;
  }
  *{
    margin: 0;
    padding: 0;
  }
  a{
    text-decoration: none;
    color: #000;
  }
  #app {
    height: 100%;
  }
  .icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>

<template>
  <div class="adminIndex">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin/' }">首页</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="week-canvas charts">
      <IEcharts :option="bar"></IEcharts>
    </div>
    <div class="type-canvas charts">
      <IEcharts :option="pie"></IEcharts>
    </div>
  </div>
</template>

<script>
  import IEcharts from 'vue-echarts-v3/src/lite.vue'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import {getMonthList} from '@/api/Video'
  import {getTypeList} from '@/api/VideoType'
  import {ERR_OK} from '@/config/index'

  export default {
    data () {
      return {
        bar: {
          title: {
            text: '最近视频上传数'
          },
          tooltip: {},
          xAxis: {
            data: ['今天', '三天内', '一周内', '一个月内']
          },
          yAxis: {},
          series: [{
            name: '视频上传数',
            type: 'bar',
            data: []
          }]
        },
        pie: {
          title: {
            text: '各分类视频数量占比',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: '13%',
            data: []
          },
          series: [
            {
              name: '视频数量',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }
    },
    methods: {
      getMonthList () {
        getMonthList().then(res => {
          if (res.data.error === ERR_OK) {
            this.bar.series[0].data = res.data.result
          }
        })
      },
      getTypeList () {
        getTypeList().then(res => {
          if (res.data.error === ERR_OK) {
            let data = this.normalizeList(res.data.result)
            this.pie.series[0].data = data.sd
            this.pie.legend.data = data.ld
          }
        })
      },
      normalizeList (list) {
        let ld = []
        let sd = []
        list.forEach(item => {
          sd.push({name: item.name, value: item.videos.length})
          ld.push(item.name)
        })

        return {sd, ld}
      }
    },
    components: {
      IEcharts
    },
    mounted () {
      this.getMonthList()
      this.getTypeList()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
  .adminIndex {
    overflow: hidden;
    .charts {
       width: 50%;
       height: 400px;
       float: left;
       margin-top: 20px;
    }
  }
</style>

<template>
    <div >
      <h1>访问量折线图</h1>
      <!-- 7 -->
      <div style="width:50%;float: left">
        <el-card class="box-card" >
          <div slot="header" class="clearfix">
            <span style="font-weight:bold">汇总统计</span>
            <!-- 每日登录人数统计折线图 -->
            <div id="main" style="width:900px;height: 400px;"></div>
          </div>
          <div class="text item">
            内容
          </div>
        </el-card>
      </div>

    </div>
</template>

<script>
  import echarts from 'echarts'
    export default {
        name: "LoginDate",
      data (){
          return{
            opinionData:JSON.parse(window.sessionStorage.getItem("userInfo")).loginValues,

            opinionDate:JSON.parse(window.sessionStorage.getItem("userInfo")).loginKeys
          }
      },
      mounted() {
          console.log("折线图开始加载");
         console.log(JSON.parse(window.sessionStorage.getItem("userInfo")).loginKeys)
            this.$nextTick(function() {
              this.drawLine('main')
            })
      },
      methods:{

        drawLine(id) {
          this.charts = echarts.init(document.getElementById(id))
          this.charts.setOption({
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['近三十日登陆量']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },

            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data:this.opinionDate

            },
            yAxis: {
              type: 'value'
            },

            series: [{
              name: '近三十日登陆量',
              type: 'line',
              stack: '总量',
              data: this.opinionData
            }]
          })
        }


      }
    }
</script>

<style scoped>

</style>

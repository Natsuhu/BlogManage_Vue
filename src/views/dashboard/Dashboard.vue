<template>
  <div>
    <!--  顶部4块数据  -->
    <el-row class="base_margin_b_large" :gutter="30">
      <el-col :span="6">
        <el-card shadow="never">
          <div class="base_dashboard_top_left_icon" style="color: #03a9f4">
            <i class="el-icon-data-line"/>
          </div>
          <div class="base_dashboard_top_right_font">
            <div class="base_margin_b">今日访问总量</div>
            <span><strong>{{ pv }}</strong></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div class="base_dashboard_top_left_icon" style="color: #20b2aa">
            <i class="el-icon-user"/>
          </div>
          <div class="base_dashboard_top_right_font">
            <div class="base_margin_b">今日独立访客</div>
            <span><strong>{{ uv }}</strong></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div class="base_dashboard_top_left_icon" style="color: #F56C6C">
            <i class="el-icon-document"/>
          </div>
          <div class="base_dashboard_top_right_font">
            <div class="base_margin_b">文章总数</div>
            <span><strong>{{ articleCount }}</strong></span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div class="base_dashboard_top_left_icon" style="color: #bdb76b">
            <i class="el-icon-chat-line-square"/>
          </div>
          <div class="base_dashboard_top_right_font">
            <div class="base_margin_b">评论总数</div>
            <span><strong>{{ commentCount }}</strong></span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--  中部3个图表  -->
    <el-row class="base_margin_b_large" :gutter="20">
      <el-col :span="8">
        <el-card shadow="never">
          <div ref="categoryEcharts" style="height:500px;"/>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <div ref="tagEcharts" style="height:500px;"/>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <div ref="mapEcharts" style="height:500px;">访客地图（开发中...）</div>
        </el-card>
      </el-col>
    </el-row>
    <!--  底部折线图  -->
    <el-row>
      <el-card shadow="never">
        <div ref="visitRecordEcharts" style="height:500px;"></div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import echarts from "echarts";
import {getTopBaseData, getCategoryEcharts, getTagEcharts, getMapEcharts, getVisitRecordEcharts} from "@/api/Dashboard";
export default {
  name: "Dashboard",
  data() {
    return {
      //顶部数据
      pv: null,
      uv: null,
      articleCount: null,
      commentCount: null,
      //分类图表数据结构
      categoryOption: {
        title: {
          text: '分类下的文章数量',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '文章数量',
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      //标签图表数据结构
      tagOption: {
        title: {
          text: '标签下的文章数量',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '文章数量',
            type: 'pie',
            radius: ['35%', '55%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 25,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: []
          }
        ]
      },
      //访问量折线图
      visitRecordOption: {
        title: {
          text: '访问量折线图（接口开发中...）'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Email', 'Union Ads']
        },
        grid: {
          left: '10',
          right: '10',
          bottom: '10',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1', '2', '3', '4', '5', '6', '7']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Email',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210],
            smooth: true
          },
          {
            name: 'Union Ads',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310],
            smooth: true
          }
        ]
      }
    }
  },
  mounted() {
    this.getTopData();
    this.getCategoryData();
    this.getTagData();
    this.initVisitRecordEcharts();
  },
  methods: {
    getTopData() {
      getTopBaseData().then(res => {
        this.pv = res.data.pv;
        this.uv = res.data.uv;
        this.articleCount = res.data.articleCount;
        this.commentCount = res.data.commentCount;
      })
    },
    getCategoryData() {
      getCategoryEcharts().then(res => {
        this.categoryOption.series[0].data = res.data
        this.initCategoryEcharts()
      })
    },
    getTagData() {
      getTagEcharts().then(res => {
        this.tagOption.series[0].data = res.data
        this.initTagEcharts()
      })
    },
    initCategoryEcharts() {
      this.categoryEcharts = echarts.init(this.$refs.categoryEcharts, 'light')
      this.categoryEcharts.setOption(this.categoryOption)
    },
    initTagEcharts() {
      this.tagEcharts = echarts.init(this.$refs.tagEcharts, 'light')
      this.tagEcharts.setOption(this.tagOption)
    },
    initMapEcharts() {
      this.mapEcharts = echarts.init(this.$refs.mapEcharts)
      this.mapEcharts.setOption(this.mapOption)
    },
    initVisitRecordEcharts() {
      this.visitRecordEcharts = echarts.init(this.$refs.visitRecordEcharts)
      this.visitRecordEcharts.setOption(this.visitRecordOption)
    }
  }
}
</script>

<style scoped>
.base_dashboard_top_left_icon {
  float: left;
  font-size: 60px;
  width: 50%;
  height: 1.5em;
}
.base_dashboard_top_right_font {
  float: right;
  width: 50%;
  height: 1.5em;
  text-align: right;
  font-size: 18px;
}
</style>
<template>
  <div>
    <!--  顶部4块数据  -->
    <el-row class="base_margin_b" :gutter="30">
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
    <el-row class="base_margin_b" :gutter="20">
      <el-col :span="8">
        <el-card shadow="never">
          <div ref="mapEcharts" style="height:500px;"/>
        </el-card>
      </el-col>
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
import 'echarts/map/js/china';
import geoCoordMap from '@/utils/city2coord.json';
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
      //地图
      mapOption: {
        title: {
          text: '访客地图',
          x: 'center'
        },
        tooltip: {
          show: false
        },
        geo: {
          map: "china",
          roam: false,//关闭拖拽
          zoom: 1.24,
          center: [104.2, 36],//调整地图位置
          label: {
            normal: {
              show: false,//关闭省份名展示
              fontSize: "10",
              color: "rgba(0,0,0,0.7)"
            },
            emphasis: {
              show: false
            }
          }
          // ,
          // //注掉itemStyle块以去掉地图阴影
          // itemStyle: {
          //   normal: {
          //     areaColor: "#0d0059",
          //     borderColor: "#389dff",
          //     borderWidth: 1,//设置外层边框
          //     shadowBlur: 5,
          //     shadowOffsetY: 8,
          //     shadowOffsetX: 0,
          //     shadowColor: "#01012a"
          //   },
          //   emphasis: {
          //     areaColor: "#184cff",
          //     shadowOffsetX: 0,
          //     shadowOffsetY: 0,
          //     shadowBlur: 5,
          //     borderWidth: 0,
          //     shadowColor: "rgba(0, 0, 0, 0.5)"
          //   }
          // }
        },
        series: [
          {
            type: "map",
            map: "china",
            roam: false,
            zoom: 1.24,
            center: [104.2, 36],
            showLegendSymbol: false,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                areaColor: "#eae0bd",
                borderColor: "#6f641f",
                borderWidth: 0.5
              },
              emphasis: {
                areaColor: "#8ed1eb",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 5,
                borderWidth: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          },
          {
            name: "",
            type: "scatter",
            coordinateSystem: "geo",
            data: [],
            symbol: "circle",
            symbolSize: 6,
            hoverSymbolSize: 10,
            tooltip: {
              formatter(value) {
                return value.data.name + "<br/>" + "访客数：" + value.data.uv
              },
              show: true
            },
            encode: {
              value: 2
            },
            label: {
              formatter: "{b}",
              position: "right",
              show: false
            },
            itemStyle: {
              color: "#c97d0b"
            },
            emphasis: {
              label: {
                show: false
              }
            }
          },
          {
            name: "Top 5",
            type: "effectScatter",
            coordinateSystem: "geo",
            data: [],
            symbol: "circle",
            symbolSize: 6,
            tooltip: {
              formatter(value) {
                return value.data.name + "<br/>" + "访客数：" + value.data.uv
              },
              show: true
            },
            encode: {
              value: 2
            },
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke",
              color: "#c97d0b",
              period: 9,
              scale: 5
            },
            hoverAnimation: true,
            label: {
              formatter: "{b}",
              position: "right",
              show: true
            },
            itemStyle: {
              color: "#c97d0b",
              shadowBlur: 1,
              shadowColor: "#333"
            },
            zlevel: 1
          }
        ]
      },
      //访问量折线图
      visitRecordOption: {
        title: {
          text: '访问量折线图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['uv', 'pv']
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
          data: null
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'uv',
            type: 'line',
            stack: 'Total',
            data: null,
            smooth: true
          },
          {
            name: 'pv',
            type: 'line',
            stack: 'Total',
            data: null,
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
    this.getMapData();
    this.getLineData();
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
    getMapData() {
      getMapEcharts().then(res => {
        let mapData = this.convertData(res.data)
        this.mapOption.series[1].data = mapData
        this.mapOption.series[2].data = mapData.splice(0, 5)
        this.initMapEcharts();
      })
    },
    getLineData() {
      getVisitRecordEcharts().then(res => {
        this.visitRecordOption.xAxis.data = res.data.dateList;
        this.visitRecordOption.series[0].data = res.data.uvList;
        this.visitRecordOption.series[1].data = res.data.pvList;
        this.initVisitRecordEcharts()
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
    },
    convertData(data) {
      let res = []
      for (let i = 0; i < data.length; i++) {
        let geoData = geoCoordMap[data[i].name]
        if (geoData) {
          res.push({
            name: data[i].name,
            value: geoData,
            uv: data[i].value
          })
        }
      }
      return res
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
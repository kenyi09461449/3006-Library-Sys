<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="box-card">
          <div id="chartBing" :style="{ height: '480px', padding:'10px'}"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <el-table :data="noticeArray" stripe style="width: 100%">
            <el-table-column prop="title" label="Announcement">
            </el-table-column>
            <el-table-column prop="createTime" label="Release time">
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="box-card" style="margin-top:20px">
          <div id="chartZheXian" :style="{ height: '310px', padding:'10px'}"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'dashboard',
  data() {
    return {
      noticeArray: []
    };
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      //图书分类统计
      //Book classification statistics
      let chartBing = this.$echarts.init(document.getElementById('chartBing'));
      //借阅量趋势图
      //Trend chart of borrowing volume
      let chartZheXian = this.$echarts.init(document.getElementById('chartZheXian'));
      let chartBingOption = {
        title: {
          text: 'Book classification statistics',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          trigger: 'item',
          left: 'left'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: 'Book classification statistics',
            type: 'pie',
            radius: [50, 150],
            center: ['50%', '60%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: []
          }
        ]
      }

      let chartZheXianOption = {
        title: {
          text: 'Borrowing quantity statistics'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'line'
          }
        ]
      }



      this.$http.get("/count").then(res => {
        if (res.code === 200) {
          const bookNumArray = res.data.bookNumArray
          const monthArray = res.data.monthArray;
          const borrowArray = res.data.borrowArray;
          this.noticeArray = res.data.noticeArray
          // 绘制饼状图
          //Draw pie chart
          chartBingOption.series[0].data = bookNumArray
          chartBing.setOption(chartBingOption);
          //绘制折线图
          //Draw line chart
          chartZheXianOption.xAxis.data = monthArray;
          chartZheXianOption.series[0].data = borrowArray;
          chartZheXian.setOption(chartZheXianOption);
        }
      })

    },
  }
};
</script>


<style scoped>
</style>

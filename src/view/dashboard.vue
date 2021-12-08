<template>
    <div>
        <el-tabs v-model="workName" @tab-click="tabChange" style="margin: 0">
            <el-tab-pane label="日历" name="calendar">
                <tucCalendar v-if="workName === 'calendar'"></tucCalendar>
            </el-tab-pane>
            <el-tab-pane label="公司地图" name="finance">
                <div class="echarts">
                    <div id="main" ref="myChartMain"></div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="公司概况" name="work">
                <tucDataTabs :option="tabsOption" v-if="workName === 'work'"></tucDataTabs>
                <div style="width: 100%;display: inline-block">
                    <div id="myChart" class="myChart" ref="myChart"></div>
                    <div id="myChart1" class="myChart" ref="myChart1"></div>
                    <div id="myChart2" class="myChart" ref="myChart2"></div>
                    <div id="myChart3" class="myChart" ref="myChart3"></div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import tucCalendar from '../components/tuc-calendar/index.vue'
import tucDataTabs from '../components/tuc-data-tabs/index.vue'
const chinaJs = require('../assets/js/china/china.js')
import {loginService} from "../service/loginService";
export default {
    components: {
        tucCalendar,
        tucDataTabs
    },
    data() {
        return {
            // 工作台 // 财务清单
            workName: 'calendar',
            tabsOption: {
                span: 6,
                data: [
                    {
                        title: '用户',
                        subtitle: '实时',
                        count: 0,
                        allcount: '',
                        text: '',
                        color: 'rgb(49, 180, 141)'
                    },
                    {
                        title: '公司',
                        subtitle: '实时',
                        count: 0,
                        allcount: '',
                        text: '',
                        color: 'rgb(56, 161, 242)'
                    },
                    {
                        title: '工作',
                        subtitle: '实时',
                        count: 0,
                        allcount: '',
                        text: '',
                        color: 'rgb(117, 56, 199)'
                    },
                    {
                        title: '文章',
                        subtitle: '实时',
                        count: 0,
                        allcount: '',
                        text: '',
                        color: 'rgb(59, 103, 164)'
                    }
                ]
            },
        }
    },
    mounted() {
    },
    created() {
    },
    methods : {
        tabChange(tab) {
            console.log(tab);
            this.$nextTick(() => {
                if(tab.name === 'finance'){
                    this.drawLine();
                } else if(tab.name === 'work') {
                    this.drawLine();
                    this.getStatisticsIndex()
                }
            })
        },
        getStatisticsIndex() {
            let that = this;
            loginService.getStatisticsIndex().then(res => {
                that.tabsOption.data[0].count = Number(res.data.datas.current.userTotal);
                that.tabsOption.data[0].text = '今日新增' + (Number(res.data.datas.current.userTotal) - Number(res.data.datas.userBefore.userTotal));
                that.tabsOption.data[1].count = Number(res.data.datas.current.companyTotal);
                that.tabsOption.data[1].text = '今日新增' + (Number(res.data.datas.current.companyTotal) - Number(res.data.datas.before.companyTotal));
                that.tabsOption.data[2].count = Number(res.data.datas.current.jobTotal);
                that.tabsOption.data[2].text = '今日新增' + (Number(res.data.datas.current.jobTotal) - Number(res.data.datas.before.jobTotal));
                that.tabsOption.data[3].count = Number(res.data.datas.current.articleTotal);
                that.tabsOption.data[3].text = '今日新增' + (Number(res.data.datas.current.articleTotal) - Number(res.data.datas.before.articleTotal));
                console.log(that.tabsOption);
            }).catch(err => {
                console.log(err);
            })
        },
        drawLine(){
            let that = this;
            // 基于准备好的dom，初始化echarts实例
            let myChart = that.$refs.myChart;
            let myChart1 = that.$refs.myChart1;
            let myChart2 = that.$refs.myChart2;
            let myChart3 = that.$refs.myChart3;
            let myChartMain = that.$refs.myChartMain;

            if(myChartMain) {
                let datalist = [];
                myChartMain = that.$echarts.init(document.getElementById('main'));
                loginService.getCompaniesMaps().then(res => {
                    let provs = res.data.datas.provs;
                    res.data.datas.maps.forEach((item) => {
                        if(item.prov) {
                            datalist.push({
                                name: item.prov,
                                num: item.num,
                                value: item.num / provs,
                                code: item.provCode
                            })
                        }
                    });
                    let myChartOptin = {
                        tooltip: {
                            show: true,     // 显示提示框组件
                            trigger: "item",     // 触发类型
                            triggerOn: "mousemove",  // 出发条件
                            formatter: function (params) {
                                if(params.data) {
                                    return  '名称：' + params.data.name + '<br/>' + '数量：' + params.data.num
                                }
                            }
                        },
                        dataRange: {
                            x: 'left',
                            y: 'center',
                            splitList: [
                                {start: 0.15, label: '15%以上', color: '#203764'},
                                {start: 0.11, end: 0.15, label: '11-15%', color: '#305496'},
                                {start: 0.08, end: 0.11, label: '8-11%', color: '#5a7dbc'},
                                {start: 0.05, end: 0.08, label: '5-8%', color: '#8ea9db'},
                                {start: 0.02, end: 0.05, label: '2-5%', color: '#b4c6e7'},
                                {start: 0, end: 0.02, label: '0-2%', color: '#d9e1f2'},
                                {start: 0, end: 0, label: '0', color: '#eeeeee'}
                            ],
                            textStyle: {
                                color: '#3899FF' // 值域文字颜色
                            },
                            selectedMode: false,
                            color: ['#E0022B', '#E09107', '#A3E00B']
                        },
                        series : [
                            {
                                name: '信息量',
                                type: 'map',
                                geoIndex: 0,
                                data:datalist
                            }
                        ],
                        geo: {
                            map: 'china',
                            roam: false,//不开启缩放和平移
                            zoom:1.3,//视角缩放比例
                            label: {
                                normal: {
                                    show: true,
                                    fontSize:'10',
                                    color: '#E0022B'
                                }
                            },
                            itemStyle: {
                                normal:{
                                    borderColor: 'rgba(0, 0, 0, 0.2)'
                                },
                                emphasis:{
                                    areaColor: '#F3B329',//鼠标选择区域颜色
                                    shadowOffsetX: 0,
                                    shadowOffsetY: 0,
                                    shadowBlur: 20,
                                    borderWidth: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    };
                    myChartMain.setOption(myChartOptin);
                    // 添加点击事件
                    myChartMain.on('click', function(row) {
                        that.$nextTick(() => {
                            if(row.data && row.data.name)
                                that.$router.push({path: 'allCompanies',name: '所有公司', params: {name: row.data.name, code: row.data.code}})
                        });
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
            // 绘制图表
            if(myChart) {
                myChart = that.$echarts.init(document.getElementById('myChart'));
                loginService.getStatisticsActives({
                    type: 2,
                    day: 14
                }).then(res => {
                    let arrList = [];
                    let arrList1 = [];
                    res.data.datas.forEach(item => {
                        arrList.push(that.$moment(Number(item.dayTime)).format('YYYY-MM-DD'));
                        arrList1.push(item.num);
                    });
                    myChart.setOption({
                        title: {
                            text: '活跃公司',
                            left: 'center'
                        },
                        color: ['#3398DB'],
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: arrList,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                type: 'bar',
                                barWidth: '60%',
                                data: arrList1,
                                label: {
                                    show: true, // 开启显示
                                    rotate: 70, // 旋转70度
                                    position: 'top', // 在上方显示
                                    distance: 10, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
                                    verticalAlign: 'middle',
                                    textStyle: { // 数值样式
                                        color: 'black',
                                        fontSize: 12
                                    }
                                }
                            }
                        ]
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
            if(myChart1) {
                myChart1 = that.$echarts.init(document.getElementById('myChart1'));
                // 绘制图表
                loginService.getStatisticsActives({
                    type: 1,
                    day: 14
                }).then(res => {
                    let arrList = [];
                    let arrList1 = [];
                    res.data.datas.forEach(item => {
                        arrList.push(that.$moment(Number(item.dayTime)).format('YYYY-MM-DD'));
                        arrList1.push(item.num);
                    });
                    myChart1.setOption({
                        title: {
                            text: '活跃用户',
                            left: 'center'
                        },
                        color: ['#3398DB'],
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: arrList,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '直接访问',
                                type: 'bar',
                                barWidth: '60%',
                                data: arrList1,
                                label: {
                                    show: true, // 开启显示
                                    rotate: 70, // 旋转70度
                                    position: 'top', // 在上方显示
                                    distance: 10, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
                                    verticalAlign: 'middle',
                                    textStyle: { // 数值样式
                                        color: 'black',
                                        fontSize: 12
                                    }
                                }
                            }
                        ]
                    });
                }).catch(err => {
                    console.log(err);
                });

            }
            if(myChart2) {
                myChart2 = that.$echarts.init(document.getElementById('myChart2'));
                // let date = new Date();
                // let m = date.getMonth() + 1; //月
                loginService.getTatisticsJob({
                    type: 3,
                    pageNo: 1,
                    pageSize: 40
                }).then((res) => {
                    const arr = [];
                    // let arr = Object.entries(res.data.datas);
                    res.data.datas.datas.forEach(item => {
                        arr.push([item.hostName, item.jobCount]);
                    });
                    arr.unshift(['product', 'amount']);
                    // 绘制图表
                    myChart2.setOption({
                        title: {
                            text: '当月工作',
                            left: 'center'
                        },
                        dataset: {
                            source: arr
                        },
                        // grid: {containLabel: true},
                        xAxis: {name: 'amount'},
                        yAxis: {type: 'category'},
                        series: [
                            {
                                type: 'bar',
                                encode: {
                                    // Map the "amount" column to X axis.
                                    x: 'amount',
                                    // Map the "product" column to Y axis
                                    y: 'product'
                                },
                                label: {
                                    show: true, // 开启显示
                                    rotate: 10, // 旋转70度
                                    position: 'right', // 在上方显示
                                    distance: 10, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
                                    verticalAlign: 'middle',
                                    textStyle: { // 数值样式
                                        color: 'black',
                                        fontSize: 12
                                    }
                                }
                            }
                        ]
                    });
                }).catch(err => {
                    console.log(err);
                });
            }
            if(myChart3) {
                // 获取公司分配图标
                myChart3 = that.$echarts.init(document.getElementById('myChart3'));
                loginService.getCompaniesStatistics().then(res => {
                    let arr = Object.entries(res.data.datas);
                    arr.unshift(['product', 'amount']);
                    myChart3.setOption({
                        title: {
                            text: '公司分配',
                            left: 'center'
                        },
                        dataset: {
                            source: arr
                        },
                        grid: {containLabel: true},
                        xAxis: {name: 'amount'},
                        yAxis: {type: 'category'},
                        series: [
                            {
                                type: 'bar',
                                encode: {
                                    // Map the "amount" column to X axis.
                                    x: 'amount',
                                    // Map the "product" column to Y axis
                                    y: 'product'
                                },
                                label: {
                                    show: true, // 开启显示
                                    rotate: 10, // 旋转70度
                                    position: 'right', // 在上方显示
                                    distance: 10, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。
                                    verticalAlign: 'middle',
                                    textStyle: { // 数值样式
                                        color: 'black',
                                        fontSize: 12
                                    }
                                }
                            }
                        ]
                    })
                });
                // 添加点击事件
                myChart3.on('click', function(param) {
                    let staffFunction = '';
                    switch (param.name) {
                        case '全部-未分配': {
                            staffFunction = '0';
                            break;
                        }
                        case '销售-未分配': {
                            staffFunction = '1';
                            break;
                        }
                        case '媒体-未分配': {
                            staffFunction = '2';
                            break;
                        }
                        case '行业-未分配': {
                            staffFunction = '3';
                            break;
                        }
                        case '全部-已分配': {
                            staffFunction = '4';
                            break;
                        }
                        case '销售-已分配': {
                            staffFunction = '5';
                            break;
                        }
                        case '媒体-已分配': {
                            staffFunction = '6';
                            break;
                        }
                        case '行业-已分配': {
                            staffFunction = '7';
                            break;
                        }
                    }
                    that.$router.push({path: 'allCompanies',name: '所有公司', params: {staffFunction: staffFunction}})
                });

            }

        },
    },
}
</script>

<style lang="scss">
#main{
    width:1000px;
    height:600px;
    margin: 0 auto;
}
.myChart{
    width: 49% !important;
    height: 300px;
    display: inline-block;
}
</style>

<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/trafficAnalysis' }">统计分析</el-breadcrumb-item>
                <el-breadcrumb-item>流量分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
            <el-tabs v-model="flowtName" @tab-click="handleClick">
                <el-tab-pane label="流量分析" name="first" lazy></el-tab-pane>
                <el-tab-pane label="受访页面" name="two" lazy></el-tab-pane>
                <el-tab-pane label="浏览器" name="second" lazy></el-tab-pane>
                <el-tab-pane label="省市分布" name="four" lazy></el-tab-pane>
            </el-tabs>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px" v-if="flowtName === 'first'">
            <el-form-item>
                <el-select v-model="pageInfo.recentDays" placeholder="" class="wetuc-input3-col3" :clearable="false" @change="recentDaysChange">
                    <el-option
                        v-for="item in recentDaysList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>

                <el-select v-model="pageInfo.peopleNum" placeholder="" class="wetuc-input3-col3" :clearable="false" @change="peopleNumChange">
                    <el-option
                        v-for="item in peopleNumList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>


        <!--  用户分析数据      -->
        <el-card shadow="always" class="wetuc-cardFirst" v-if="flowtName === 'first'">
            浏览量（PV）<countTo :startVal='0' :endVal='(Number(row.pv))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <el-card shadow="always" class="wetuc-card" v-if="flowtName === 'first'">
            访客数（UV）<countTo :startVal='0' :endVal='(Number(row.cookiev))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <el-card shadow="always" class="wetuc-card" v-if="flowtName === 'first'">
            IP数<countTo :startVal='0' :endVal='(Number(row.uv))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <!--  用户分析柱状图      -->
        <div class="echarts" v-show="flowtName === 'first'"> <div class="echartsMain" id="main" ref="myChartMain"></div> </div>
        <!--  受访数据      -->
        <div class="wetuc-container" v-show="flowtName === 'two'">
            <el-table :data="pageurlList" style="width: 49%;display: inline-block" v-loading="tableLoading" element-loading-text="拼命加载中">
                <el-table-column prop="name" label="受访页面" min-width="50" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="message-title">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pv" label="浏览量（PV）" min-width="50" show-overflow-tooltip></el-table-column>
                <el-table-column prop="cookiev" label="访客数（UV）" min-width="50" show-overflow-tooltip></el-table-column>
                <el-table-column label="UV占比" min-width="50" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{(scope.row.cookiev / row.cookiev * 100).toFixed(1)}}%</span>
                    </template>
                </el-table-column>
            </el-table>

            <el-table :data="sourceList" style="width: 49%;display: inline-block" v-loading="tableLoading" element-loading-text="拼命加载中">
                <el-table-column prop="name" label="访问来源" min-width="50" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="message-title">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pv" label="浏览量（PV）" min-width="50" show-overflow-tooltip></el-table-column>
                <el-table-column prop="cookiev" label="访客数（UV）" min-width="50" show-overflow-tooltip></el-table-column>
                <el-table-column label="UV占比" min-width="50" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{(scope.row.cookiev / row.cookiev * 100).toFixed(1)}}%</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 浏览器       -->
        <div class="wetuc-container" v-show="flowtName === 'second'">
            <div class="echartsFlex" id="myChart2" ref="myChart2"></div>
            <div class="echartsFlex" id="myChart3" ref="myChart3"></div>
        </div>
        <!-- 城市分布       -->
        <div class="echarts" v-show="flowtName === 'four'"> <div class="echartsMain" id="myChart4" ref="myChart4"></div> </div>
    </div>
</template>

<script>
import {loginService} from "../../service/loginService";
import {common} from '../../assets/js/common/common'
import countTo from "vue-count-to";
require('../../assets/js/china/china')
export default {
    data() {
        return {
            flowtName: 'first',
            pageInfo: {
                recentDays: '30',
                peopleNum: '浏览量（PV）'
            },
            recentDaysList: [{
                value: '7',
                label: '最近7天'
            },{
                value: '30',
                label: '最近30天'
            }],
            peopleNumList: [{
                id: '1',
                label: '浏览量（PV）'
            },{
                id: '2',
                label: '访客数（UV）'
            },{
                id: '3',
                label: 'IP数'
            }],
            row: {},
            times:['30','40','50'],
            datas:['30','40','50'],
            time: '30',
            tableData: [],
            tableLoading: false,

            // 受访
            sourceList: [],
            pageurlList: [],

            // 浏览器
            browser:[],     //浏览器
            browserpv:[],  //浏览器pv
            terminal:[],    //终端
            terminalpv:[],  //终端pv

            provinceList:'',  //获得省市
            province:[{
                name: '北京',
                value: 0
            },
            {
                name: '天津',
                value: 0
            },
            {
                name: '上海',
                value: 0
            },
            {
                name: '重庆',
                value: 0
            },
            {
                name: '河北',
                value: 0
            },
            {
                name: '河南',
                value: 0
            },
            {
                name: '云南',
                value: 0
            },
            {
                name: '辽宁',
                value: 0
            },
            {
                name: '黑龙江',
                value: 0
            },
            {
                name: '湖南',
                value: 0
            },
            {
                name: '安徽',
                value: 0
            },
            {
                name: '山东',
                value: 0
            },
            {
                name: '新疆',
                value: 0
            },
            {
                name: '江苏',
                value: 0
            },
            {
                name: '浙江',
                value: 0
            },
            {
                name: '江西',
                value: 0
            },
            {
                name: '湖北',
                value: 0
            },
            {
                name: '广西',
                value: 0
            },
            {
                name: '甘肃',
                value: 0
            },
            {
                name: '山西',
                value: 0
            },
            {
                name: '内蒙古',
                value: 0
            },
            {
                name: '陕西',
                value: 0
            },
            {
                name: '吉林',
                value: 0
            },
            {
                name: '福建',
                value: 0
            },
            {
                name: '贵州',
                value: 0
            },
            {
                name: '广东',
                value: 0
            },
            {
                name: '青海',
                value: 0
            },
            {
                name: '西藏',
                value: 0
            },
            {
                name: '四川',
                value: 0
            },
            {
                name: '宁夏',
                value: 0
            },
            {
                name: '海南',
                value: 0
            },
            {
                name: '台湾',
                value: 0
            },
            {
                name: '香港',
                value: 0
            },
            {
                name: '澳门',
                value: 0
            }],    //省市
        }
    },
    components: {
        countTo
    },
    mounted() {
        this.getTatisticsuser()
    },
    methods: {
        // tims
        tims(item) {
            let that = this;
            that.times = []
            that.datas = []
            for(let i = that.pageInfo.recentDays - 1; i >= 0; i--) {
                that.times.push(common.getFormatOfDate(that.tableData[i].date, 'MM-dd'));
                for (let i = that.pageInfo.recentDays - 1; i >= 0; i--) {
                    if(item === '浏览量（PV）') {
                        that.datas.push(that.tableData[i].pv)
                    } else if (item === '访客数（UV）') {
                        that.datas.push(that.tableData[i].cookiev)
                    } else if (item === 'IP数') {
                        that.datas.push(that.tableData[i].uv)
                    }
                }
                that.$nextTick(() => {
                    that.drawLine()
                })
            }
        },
        handleClick (item) {
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            setTimeout(() => {
                loading.close();
            }, 2000);
            if(item.name === 'four') {
                let myChart4 = this.$echarts.init(this.$refs.myChart4);
                setTimeout(() =>{
                    myChart4.resize();
                }, 0)
            } else if (item.name === 'first') {
                let myChartMain = this.$echarts.init(this.$refs.myChartMain);
                setTimeout(() =>{
                    myChartMain.resize();
                }, 0)
            } else if (item.name === 'second') {
                let myChart2 = this.$echarts.init(this.$refs.myChart2);
                let myChart3 = this.$echarts.init(this.$refs.myChart3);
                setTimeout(() =>{
                    myChart2.resize();
                    myChart3.resize();
                }, 0)
            }
        },
        // 获取用户分析数据
        getTatisticsuser() {
            let that = this;
            that.tableLoading = true;
            loginService.getTatisticsflow({
            }).then(res => {
                if(res.data.success) {
                    that.$nextTick(() => {
                        that.row = res.data.datas.yesterdayAndAll[0];
                        that.tableData = res.data.datas.tendency;

                        that.sourceList = that.row.sourceList //访问来源
                        that.pageurlList = that.row.pageurlList //受访页面

                        let browerList = that.row.browerList
                        for(let i=0;i<browerList.length;i++){
                            that.browser.push(browerList[i].name)
                            that.browserpv.push(browerList[i].pv)
                        }

                        let deviceList = that.row.deviceList

                        for(let i=0;i<deviceList.length;i++){
                            that.terminal.push(deviceList[i].name)
                            that.terminalpv.push(deviceList[i].pv)
                        }

                        that.provinceList = that.row.provinceList   //省市
                        for(let y = 0; y < that.province.length; y++){
                            for(let i = 0; i < that.provinceList.length; i++){
                                if(that.province[y].name == that.provinceList[i].name){
                                    that.province[y].value = that.provinceList[i].pv
                                }
                            }
                        }
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                        that.tims(that.pageInfo.peopleNum);
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 获取用户分析柱状图
        // 获取柱状图数据
        drawLine() {
            let that = this;
            let myChartMain = that.$refs.myChartMain;
            let myChart2 = that.$refs.myChart2;
            let myChart3 = that.$refs.myChart3;
            let myChart4 = that.$refs.myChart4;
            if(myChartMain) {
                myChartMain = that.$echarts.init(document.getElementById('main'));
                myChartMain.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    lineStyle:{
                        normal:{
                            color:'#32A8FF'
                        }
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}//将统计图保存为
                        }
                        ,right:100
                        ,top:0
                    },
                    grid: {
                        left: '0',
                        right: '4%',
                        bottom: '9%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: that.times
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: that.peopleNumName,
                            type:'line',
                            stack: '总量',
                            data: that.datas,
                            itemStyle : {normal : {color:'#32A8FF'}}
                        }
                    ]
                });
            }
            if(myChart2) {
                myChart2 = that.$echarts.init(document.getElementById('myChart2'));
                myChart2.setOption({
                    animation: true,
                    grid: {
                        top: 10,
                        bottom: 40,
                        left:74
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer : {
                            type : 'shadow'
                        }
                    },
                    xAxis: {
                        type: 'value',
                        position: 'bottom',
                        splitLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#cfc3bd'
                            }
                        },
                    },
                    yAxis: {
                        splitNumber: 25,
                        type: 'category',
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                            }
                        },
                        axisLabel: {
                            show: true,
                            rotate: 0,
                            textStyle: {
                                color: '#666666'
                            }
                        },
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: that.browser
                    },
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            label: {normal:{show: true,formatter:function(v) {
                                        let val =(v.data / that.row.pv * 100).toFixed(0);
                                        if (val == 0) {
                                            return '';
                                        }
                                        return val + '%';
                                    },position: 'insideRight'}},
                            data: that.browserpv,
                            barWidth: '28px'

                        }
                    ]
                });
            }
            if(myChart3) {
                myChart3 = that.$echarts.init(document.getElementById('myChart3'));
                myChart3.setOption({
                    animation: true,
                    grid: {
                        top: 10,
                        bottom: 40,
                        left:74
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer : {
                            type : 'shadow'
                        }
                    },
                    xAxis: {
                        type: 'value',
                        position: 'bottom',
                        splitLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#cfc3bd'
                            }
                        },
                    },
                    yAxis: {
                        splitNumber: 25,
                        type: 'category',
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                            }
                        },
                        axisLabel: {
                            show: true,
                            rotate: 0,
                            textStyle: {
                                color: '#666666'
                            }
                        },
                        axisTick: {
                            alignWithLabel: true
                        },
                        data: that.terminal
                    },
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            label: {normal:{show: true,formatter:function(v) {
                                        let val =(v.data / that.row.pv * 100).toFixed(0);
                                        if (val == 0) {
                                            return '';
                                        }
                                        return val + '%';
                                    },position: 'insideRight'}},
                            data: that.terminalpv,
                            barWidth: '28px'

                        }
                    ]
                });
            }
            if(myChart4) {
                myChart4 = that.$echarts.init(document.getElementById('myChart4'));
                myChart4.setOption({
                    visualMap: {
                        textStyle: {
                            color: '#565656'
                        },
                        min: 0,
                        max: that.row.pv,
                        left: 'left',
                        top: 'bottom',
                        text: ['高', '低'], // 文本，默认为数值文本
                        calculable: false,
                        color: ['#20A0FF', '#D2EDFF']
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter:'{b}<br>浏览量：{c}'
                    },
                    series: [
                        {
                            name: '省份分布',
                            type: 'map',
                            mapType: 'china',
                            roam: false,
                            itemStyle: {
                                emphasis: {
                                    areaColor: '#FF5722'
                                }
                            },
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            data:that.province
                        }
                    ]
                });
            }
        },
        peopleNumChange(item) {
            this.peopleNumName = item;
            this.tims(item)
        },
        recentDaysChange(item) {
            let row = this.peopleNumName;
            if(row) {
                this.tims(row);
            } else {
                this.tims(this.pageInfo.peopleNum);
            }
        }
    },

}
</script>

<style scoped>

</style>

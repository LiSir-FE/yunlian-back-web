<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/trafficAnalysis' }">统计分析</el-breadcrumb-item>
                <el-breadcrumb-item>用户分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px">
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
        <el-card shadow="always" class="wetuc-cardFirst">
            用户总数<countTo :startVal='0' :endVal='(Number(row.userCount))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <el-card shadow="always" class="wetuc-card">
            总主办方数<countTo :startVal='0' :endVal='(Number(row.adminCount))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <el-card shadow="always" class="wetuc-card">
            作者总数<countTo :startVal='0' :endVal='(Number(row.authorCount))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <el-card shadow="always" class="wetuc-card">
            会员总数<countTo :startVal='0' :endVal='(Number(row.vipCount))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <el-card shadow="always" class="wetuc-card">
            客户总数<countTo :startVal='0' :endVal='(Number(row.customerCount))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>

        <!--  用户分析柱状图      -->
        <div class="echarts"> <div class="echartsMain" id="main" ref="myChartMain"></div> </div>
    </div>
</template>

<script>
import {loginService} from "../../service/loginService";
import {common} from '../../assets/js/common/common'
import countTo from "vue-count-to";
export default {
    data() {
        return {
            peopleNumName: '',
            pageInfo: {
                recentDays: '30',
                peopleNum: '新增用户数'
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
                label: '新增用户数'
            },{
                id: '2',
                label: '新增主办方'
            },{
                id: '3',
                label: '新增作者数'
            },{
                id: '4',
                label: '新增会员数'
            }],
            row: {},
            times:[],
            time: '30',
            tableData: [],
            datas: []
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
                that.times.push(common.getFormatOfDate(that.tableData[i].dayTime, 'MM-dd'));
                for (let i = that.pageInfo.recentDays - 1; i >= 0; i--) {
                    if(item === '新增用户数') {
                        that.datas.push(that.tableData[i].userCount)
                    } else if (item === '新增主办方') {
                        that.datas.push(that.tableData[i].adminCount)
                    } else if (item === '新增作者数') {
                        that.datas.push(that.tableData[i].authorCount)
                    } else if (item === '新增会员数') {
                        that.datas.push(that.tableData[i].vipCount)
                    }
                }
                that.drawLine()
            }
        },
        // 获取用户分析数据
        getTatisticsuser() {
            let that = this;
            loginService.getTatisticsuser({
            }).then(res => {
                if(res.data.success) {
                    that.row = res.data.datas.countInfo;
                    that.tableData = res.data.datas.users;
                    that.$nextTick(() => {
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

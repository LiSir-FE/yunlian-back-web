<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/trafficAnalysis' }">统计分析</el-breadcrumb-item>
                <el-breadcrumb-item>内容分析</el-breadcrumb-item>
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
            文章总数<countTo :startVal='0' :endVal='(Number(row.activityTotal))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <el-card shadow="always" class="wetuc-card">
            资料总数<countTo :startVal='0' :endVal='(Number(row.documentTotal))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <el-card shadow="always" class="wetuc-card">
            活动总数<countTo :startVal='0' :endVal='(Number(row.activityTotal))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <el-card shadow="always" class="wetuc-card">
            公司总数<countTo :startVal='0' :endVal='(Number(row.companyTotal))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <el-card shadow="always" class="wetuc-card">
            工作总数<countTo :startVal='0' :endVal='(Number(row.jobTotal))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <el-card shadow="always" class="wetuc-card">
            商机总数<countTo :startVal='0' :endVal='(Number(row.infoTotal))' :duration='3000' class="wetuc-spanRed"></countTo>
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
                peopleNum: '新文章'
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
                label: '新文章'
            },{
                id: '2',
                label: '知识数'
            },{
                id: '3',
                label: '资料数'
            },{
                id: '4',
                label: '活动数'
            },{
                id: '5',
                label: '活动数'
            },{
                id: '6',
                label: '互动数'
            },{
                id: '7',
                label: '调查数'
            },{
                id: '8',
                label: '公司数'
            },{
                id: '9',
                label: '工作数'
            },{
                id: '10',
                label: '商机数'
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
                    if(item === '新文章') {
                        that.datas.push(that.tableData[i].articleCount)
                    } else if (item === '知识数') {
                        that.datas.push(that.tableData[i].libraryCount)
                    } else if (item === '资料数') {
                        that.datas.push(that.tableData[i].documentCount)
                    } else if (item === '活动数') {
                        that.datas.push(that.tableData[i].activityCount)
                    } else if (item === '商品数') {
                        that.datas.push(that.tableData[i].productCount)
                    } else if (item === '互动数') {
                        that.datas.push(that.tableData[i].interactiveCount)
                    } else if (item === '调查数') {
                        that.datas.push(that.tableData[i].surveyCount)
                    } else if (item === '公司数') {
                        that.datas.push(that.tableData[i].companyCount)
                    } else if (item === '工作数') {
                        that.datas.push(that.tableData[i].jobCount)
                    } else if (item === '商机数') {
                        that.datas.push(that.tableData[i].infoCount)
                    }
                }
                that.drawLine()
            }
        },
        // 获取用户分析数据
        getTatisticsuser() {
            let that = this;
            loginService.getTatisticscontent({
            }).then(res => {
                if(res.data.success) {
                    that.row = res.data.datas.countInfo;
                    that.tableData = res.data.datas.contents;
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

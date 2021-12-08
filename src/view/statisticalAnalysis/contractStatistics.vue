<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/trafficAnalysis' }">统计分析</el-breadcrumb-item>
                <el-breadcrumb-item>合同统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
            <el-tabs v-model="contractName" @tab-click="handleClick">
                <el-tab-pane label="合同统计" name="first"></el-tab-pane>
                <el-tab-pane label="统计列表" name="second"></el-tab-pane>
            </el-tabs>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px">
            <el-form-item>
                <el-date-picker
                    @change="yearChange"
                    :clearable="false"
                    v-model="pageInfo.year"
                    type="year"
                    class="wetuc-input3-col3"
                    placeholder="请选择年">
                </el-date-picker>

                <el-date-picker class="wetuc-input3-col3" v-model="pageInfo.time" type="datetimerange" value-format="timestamp" :default-time="pageInfo.time"
                                @change="timeChange"
                                format="yyyy-MM-dd HH:mm"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
        </el-form>
        <!--  合同统计数据      -->
        <el-card shadow="always" v-for="(item, index) in row" :key="index" :class="index === 0 ? 'wetuc-cardFirst' : 'wetuc-card'" v-if="contractName === 'first'">
            {{item.label}}<countTo :startVal='0' :endVal='(Number(item.value))' :duration='3000' class="wetuc-spanRed"></countTo>
        </el-card>
        <!--  合同统计柱状图      -->
        <div class="echarts" v-if="contractName === 'first'"> <div class="echartsMain" id="main" ref="myChartMain"></div> </div>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中" v-if="contractName === 'second'">
            <el-table-column prop="hostName" label="业务员" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="hostName" label="合同金额" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{getFloatStr(scope.row.totalAmount / 100)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="jobCount" label="开票总额" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{getFloatStr(scope.row.invoiceAmount / 100)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="infoCount" label="已收总额" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{getFloatStr(scope.row.gatheringAmount / 100)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="userNum" label="应收总额" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{getFloatStr(scope.row.reciveAmount / 100)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="jobNum" label="未完合同/全部合同" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.notCompleteNum }} / {{scope.row.totalNum}}</span>
                </template>
            </el-table-column>
        </el-table>

        <div class="wetuc-pagination-panel" v-if="contractName === 'second'">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.pageNum"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {loginService} from "../../service/loginService";
import countTo from 'vue-count-to'
export default {
    data() {
        return {
            contractName: 'first',
            row: [],
            pageInfo: {
                year: new Date().getFullYear().toString(),
                time: []
            },
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            tableData: [],
            tableLoading: false,
        }
    },
    components: {
        countTo
    },
    mounted() {
        this.getContractsAllCount()
    },
    methods: {
        handleClick (item) {
            if(item.name === 'first') {
                this.getContractsAllCount()
            } else {
                this.queryData()
            }
        },
        // 获取合同数据元于柱状图
        getContractsAllCount() {
            let that = this;
            loginService.getContractsAllCount({
                year: that.pageInfo.year,
                startTime: that.pageInfo.time && that.pageInfo.time[0] ? that.pageInfo.time[0] : '',
                endTime: that.pageInfo.time && that.pageInfo.time[1] ? that.pageInfo.time[1] : '',
            }).then(res => {
                if(res.data.success) {
                    let reult = [{
                        value: that.getFloatStr(res.data.datas.totalAmount / 100),
                        label: '合同总金额'
                    },{
                        value: that.getFloatStr(res.data.datas.totalInvoiceAmount / 100),
                        label: '开票总金额'
                    },{
                        value: that.getFloatStr(res.data.datas.totalGatheringAmount / 100),
                        label: '已收总金额'
                    },{
                        value: that.getFloatStr(res.data.datas.totalReciveAmount / 100),
                        label: '应收总金额'
                    },{
                        value: res.data.datas.totalNum,
                        label: '合同总数'
                    },{
                        value: res.data.datas.notCompleteNum,
                        label: '未完成合同总数'
                    }];
                    that.row = reult;
                    that.$nextTick(() => {
                        that.drawLine();
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 获取柱状图数据
        drawLine() {
            let that = this;
            let myChartMain = that.$refs.myChartMain;
            if(myChartMain) {
                let datalist = [];
                let datalists = [];
                let datalistss = [];
                let datalistsss = [];
                myChartMain = that.$echarts.init(document.getElementById('main'));
                loginService.getContractsStatistics({
                    year: that.pageInfo.year,
                    startTime: that.pageInfo.time !== null && that.pageInfo.time.length >= 1 ? that.pageInfo.time[0] : '',
                    endTime: that.pageInfo.time !== null && that.pageInfo.time.length >= 1 ? that.pageInfo.time[1] : '',
                    type: 1
                }).then(res=> {
                    if(res.data.success) {
                        let result = res.data.datas;
                        result.forEach(item => {
                            datalist.push(item.date);
                            datalists.push(item.total / 100);
                            datalistss.push(item.invoiceTotal / 100);
                            datalistsss.push(item.gatheringTotal / 100);
                        })
                        myChartMain.setOption({
                            legend: {
                                show: true,
                                data: ['合同金额', '开票金额', '已收金额']
                            },
                            tooltip: {
                            },
                            xAxis: [
                                {type: 'category', data: datalist}
                            ],
                            yAxis: [
                                {type: 'value'}
                            ],
                            grid: {
                                left: '0',
                                right: '4%',
                                bottom: '9%',
                                show:'true',
                                borderWidth:'0',
                                containLabel: true
                            },
                            series: [
                                {
                                    type: 'bar',
                                    name: '合同金额',
                                    data: datalists
                                },
                                {
                                    type: 'bar',
                                    name: '开票金额',
                                    data: datalistss
                                },
                                {
                                    type: 'bar',
                                    name: '已收金额',
                                    data: datalistsss
                                }
                            ]
                        });
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        // 获取列表
        queryData() {
            let that = this;
            that.tableLoading = true;
            loginService.getContractsAllStaffCount({
                year: that.pageInfo.year,
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize,
                startTime: that.pageInfo.time && that.pageInfo.time[0] ? that.pageInfo.time[0] : '',
                endTime: that.pageInfo.time && that.pageInfo.time[1] ? that.pageInfo.time[1] : '',
            }).then(res => {
                if (res.data.success) {
                    let result = res.data.datas
                    that.tableData = result.datas
                    that.page.total = Number(result.totalCount);
                    setTimeout(function () {
                        that.tableLoading = false
                    }, 300)
                }
            }).catch(err => {
                console.log(err);
            })
        },
        yearChange(value) {
            this.pageInfo.year = value.getFullYear().toString();
            if(this.contractName === 'first') {
                this.getContractsAllCount()
            } else {
                this.queryData()
            }
        },
        timeChange(item) {
            if(item) {
                this.pageInfo.time[0] = item[0];
                this.pageInfo.time[1] = item[1];
            }
            if(this.contractName === 'first') {
                this.getContractsAllCount()
            } else {
                this.queryData()
            }
        },
        getFloatStr(num){
            num += '';
            num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符

            if(/^0+/) //清除字符串开头的0
                num = num.replace(/^0+/, '');
            if(!/\./.test(num)) //为整数字符串在末尾添加.00
                num += '.00';
            if(/^\./.test(num)) //字符以.开头时,在开头添加0
                num = '0' + num;
            num += '00';        //在字符串末尾补零
            return num = num.match(/\d+\.\d{2}/)[0];
        },
        // 分页
        handleSizeChange (val) {
            this.page.pageSize = val
            this.queryData(this.pageInfo.search)
        },
        handleCurrentChange (val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.queryData(this.pageInfo.search)
            }
        }
    },
}
</script>

<style scoped>

</style>

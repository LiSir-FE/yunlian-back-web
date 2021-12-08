<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/trafficAnalysis' }">统计分析</el-breadcrumb-item>
                <el-breadcrumb-item>工作分析</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px">
            <el-form-item>
                <el-select v-model="pageInfo.select" placeholder="" class="wetuc-input3-col3" :clearable="true">
                    <el-option
                        v-for="item in selectList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>

                <el-date-picker class="wetuc-input3-col3" v-model="pageInfo.time" type="datetimerange" value-format="timestamp" :default-time="pageInfo.time"
                                @change="timeChange"
                                format="yyyy-MM-dd HH:mm"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column label="名次" min-width="50" show-overflow-tooltip>
                <template slot-scope="scope">
                    <i class="wetuc-champion" v-if="scope.$index + 1 === 1 && page.pageNum === 1"></i>
                    <i class="wetuc-runnerUp" v-if="scope.$index + 1 === 2 && page.pageNum === 1"></i>
                    <i class="wetuc-runner-up" v-if="scope.$index + 1 === 3 && page.pageNum === 1"></i>
                    <span style="margin-left: 20px">{{ scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="hostName" label="姓名" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jobCount" label="工作" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="infoCount" label="商机" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userNum" label="用户总数" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jobNum" label="工作总数" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="infoNum" label="商机总数" min-width="80" show-overflow-tooltip></el-table-column>
        </el-table>

        <div class="wetuc-pagination-panel">
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

export default {
    data() {
        return {
            pageInfo: {
                select: '1',
                time: []
            },
            selectList: [{
                value: '1',
                label: '今日'
            },{
                value: '2',
                label: '本周'
            },{
                value: '3',
                label: '本月'
            }],
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            tableData: [],
            tableLoading: false,
        }
    },
    mounted() {
        this.queryData(this.pageInfo.select)
    },
    methods: {
        queryData(select) {
            let that = this;
            that.tableLoading = true;
            loginService.workStatistics({
                type: select ? select : '',
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
        timeChange(item) {
            if(item) {
                this.pageInfo.time[0] = item[0];
                this.pageInfo.time[1] = item[1];
                this.pageInfo.select = ''
            } else {
                this.pageInfo.select = '1'
            }
            this.queryData(this.pageInfo.select)
        },
        // 分页
        handleSizeChange (val) {
            this.page.pageSize = val
            this.queryData(this.pageInfo.select)
        },
        handleCurrentChange (val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.queryData(this.pageInfo.select)
            }
        }
    }
}
</script>

<style scoped>

</style>

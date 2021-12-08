<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/trafficAnalysis' }">统计分析</el-breadcrumb-item>
                <el-breadcrumb-item>答题统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px">
            <el-form-item>
                <el-date-picker class="wetuc-input3-col3"
                                v-model="pageInfo.time"
                                type="date"
                                value-format="timestamp"
                                @change="timeChange">
                </el-date-picker>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" style="width: 100%" max-height="300" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column label="名次" min-width="50" show-overflow-tooltip>
                <template slot-scope="scope">
                    <i class="wetuc-champion" v-if="scope.$index + 1 === 1"></i>
                    <i class="wetuc-runnerUp" v-if="scope.$index + 1 === 2"></i>
                    <i class="wetuc-runner-up" v-if="scope.$index + 1 === 3"></i>
                    <span style="margin-left: 20px">{{ scope.$index + 1 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="hostName" label="姓名" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column label="是否答题" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.answerd">是</span>
                    <span v-else>否</span>
                </template>
            </el-table-column>
            <el-table-column prop="point" label="得分" min-width="50" show-overflow-tooltip></el-table-column>
        </el-table>
    </div>
</template>

<script>
import {loginService} from "../../service/loginService";

export default {
    data() {
        return {
            pageInfo: {
                time: ''
            },
            tableData: [],
            tableLoading: false,
        }
    },
    mounted() {
        this.queryData()
    },
    methods: {
        queryData() {
            let that = this;
            that.tableLoading = true;
            loginService.getQuizesStatistics({
                time: that.pageInfo.time,
            }).then(res => {
                if (res.data.success) {
                    let result = res.data.datas
                    that.tableData = result
                    setTimeout(function () {
                        that.tableLoading = false
                    }, 300)
                }
            }).catch(err => {
                console.log(err);
            })
        },
        timeChange(item) {
            this.queryData(this.pageInfo.select)
        }
    }
}
</script>

<style scoped>

</style>

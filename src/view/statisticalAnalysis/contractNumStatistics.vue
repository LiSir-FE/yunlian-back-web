<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/trafficAnalysis' }">统计分析</el-breadcrumb-item>
                <el-breadcrumb-item>内容统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px">
            <el-form-item>
                <el-date-picker class="wetuc-input3-col3" v-model="pageInfo.time" type="datetimerange" value-format="timestamp" :default-time="pageInfo.time"
                                @change="timeChange1"
                                format="yyyy-MM-dd HH:mm"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" style="width: 100%" max-height="300" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="name" label="分析师" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="totalReadNum" label="总阅读数" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="totalCount" label="全部文章" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="originalCount" label="原创文章" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="qualifiedCount" label="合格文章" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" min-width="50" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" icon="el-icon-view" @click="detailsFn()">详情</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog title="内容详情" :visible.sync="dialogVisible" width="75%">
            <el-form ref="contentInfo" :model="contentInfo" label-width="50px" :inline="true">
                <el-form-item label="人员">
                    <el-select v-model="contentInfo.contractType" class="wetuc-input-col2" placeholder="请选择人员" clearable @change="contractTypeFn">
                        <el-option
                            v-for="item in contractList"
                            :key="item.id"
                            :label="item.hostName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="日期">
                    <el-date-picker
                        class="wetuc-input-col2"
                        @change="timeChange2"
                        v-model="contentInfo.time"
                        type="datetimerange"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
            </el-form>


            <el-table :data="gridData" style="width: 100%" v-loading="gridTableLoading" element-loading-text="拼命加载中">
                <el-table-column label="标题" min-width="300" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="title-underline" @click="titleClick(scope.row)">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="readNum" label="阅读数" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column label="发布时间" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.createDate | stampFormate}}
                    </template>
                </el-table-column>
                <el-table-column prop="createUser" label="分析师" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="qualified" label="评审" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.qualified == 1">待评审</span>
                        <span v-if="scope.row.qualified == 2">合格</span>
                        <span v-if="scope.row.qualified == 3">不合格</span>
                    </template>
                </el-table-column>
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {loginService} from "../../service/loginService";

export default {
    data() {
        return {
            pageInfo: {
                time: []
            },
            contentInfo: {
                contractType: '',
                time: []
            },
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            contractList: [],
            gridData: [],
            gridTableLoading: false,
            dialogVisible: false,
            tableData: [],
            tableLoading: false,
        }
    },
    mounted() {
        this.queryData()
        this.getStaff()
    },
    methods: {
        queryData() {
            let that = this;
            that.tableLoading = true;
            loginService.getArticlesQualifiedStatistice({
                startTime: that.pageInfo.time && that.pageInfo.time[0] ? that.pageInfo.time[0] : '',
                endTime: that.pageInfo.time && that.pageInfo.time[1] ? that.pageInfo.time[1] : '',
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
        // 时间筛选
        timeChange1(val) {
            this.pageInfo.time[0] = val[0];
            this.pageInfo.time[1] = val[1];
            this.queryData()
        },
        detailsFn() {
            let that = this;
            that.dialogVisible = true
            that.gridTableLoading = true
            loginService.getArticlesQualifiedStatisticeCreateUserId({
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize,
                lableId:'5ba0f72b5a700006de4fc194',
                all:true,
                status:1,
                createStartTime: that.contentInfo.time && that.contentInfo.time[0] ? that.contentInfo.time[0] : '',
                createEndTime: that.contentInfo.time && that.contentInfo.time[1] ? that.contentInfo.time[1] : '',
                createUserId: that.contentInfo.contractType
            }).then(res => {
                if (res.data.success) {
                    let result = res.data.datas
                    that.gridData = result.datas
                    that.page.total = Number(result.totalCount);
                    setTimeout(function () {
                        that.gridTableLoading = false
                    }, 300)
                }
            }).catch(err => {
                console.log(err);
            })
        },
        titleClick(row) {
            let that = this;
            const {href} = that.$router.resolve({
                name: 'articleDetail',
                params:{id: row.id}
            });
            setTimeout(function () {
                window.open(href, '_blank')
            }, 200);
        },
        // 获取员工
        getStaff() {
            let that = this;
            loginService.getStaff({
                staffFunction: 2
            }).then(res => {
                if (res.data.success) {
                    let result = res.data.datas;
                    that.contractList = result
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 分页
        handleSizeChange (val) {
            this.page.pageSize = val
            this.detailsFn()
        },
        handleCurrentChange (val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.detailsFn()
            }
        },
        timeChange2(item) {
            if(item) {
                this.pageInfo.time[0] = item[0];
                this.pageInfo.time[1] = item[1];
            }
            this.detailsFn()
        },
        contractTypeFn() {
            this.detailsFn()
        },
    }
}
</script>

<style scoped>

</style>

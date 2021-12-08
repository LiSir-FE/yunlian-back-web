<template>
    <div class="wetuc-page-content">
        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column :key="Math.random()" label="姓名" prop="applyName" min-width="80"
                             show-overflow-tooltip></el-table-column>
            <el-table-column :key="Math.random()" label="公司" prop="applyInfo.公司" min-width="80"
                             show-overflow-tooltip></el-table-column>
            <el-table-column :key="Math.random()" label="手机号" prop="applyPhone" min-width="80"
                             show-overflow-tooltip></el-table-column>
            <el-table-column :key="Math.random()" label="票券类型" prop="ticket.name" min-width="80"
                             show-overflow-tooltip></el-table-column>


            <el-table-column :key="Math.random()" label="状态" prop="status" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.archive">归档</span>
                    <span v-else>未归档</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="60" align="right" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="editFn(scope.row)" v-if="!scope.row.archive">编辑
                    </el-button>
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
    </div>
</template>

<script>
import {loginService} from "../../service/loginService";

export default {
    props: {
        id: {
            type: String
        }
    },
    data() {
        return {
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            tableData: [],
            dialogVisible: false,
            tableLoading: false,
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.queryData()
        })
    },
    methods: {
        queryData() {
            let that = this;
            loginService.getListActivityPeople({
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize,
                actId: that.id,
            }).then(function (res) {
                if (res.data.success) {
                    let result = res.data.datas
                    that.tableData = result.datas
                    that.page.total = Number(result.totalCount);
                    setTimeout(function () {
                        that.tableLoading = false
                    }, 300)
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) { // 捕获异常
                console.log(err);
            });
        },
        editFn(row) {
            this.$router.push({path: 'personnelFilingEdit', query: {ids: this.id, id: row.id, actId: row.actId}})
        },
        // 分页
        handleSizeChange(val) {
            this.page.pageSize = val
            this.queryData()
        },
        handleCurrentChange(val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.queryData()
            }
        },
    },
}
</script>

<style scoped>

</style>

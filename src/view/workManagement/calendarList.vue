<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/companyList' }">工作台</el-breadcrumb-item>
                <el-breadcrumb-item>日历列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" label-width="5px" @submit.native.prevent :inline="true">

            <el-input v-model="pageInfo.query" placeholder="搜索" class="wetuc-input3-col3"
                      @keyup.enter.native="queryData(pageInfo.search)">
                <i slot="suffix" class="el-input__icon el-icon-search"
                   @click="queryData(pageInfo.search)" style="cursor: pointer"></i>
            </el-input>


            <el-button type="primary" @click="addItems">新增事项</el-button>
        </el-form>
        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="name" label="类型" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.type | typeCalendar}}
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="hostName" label="发起人" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.createTime | stampFormate}}
                </template>
            </el-table-column>
            <el-table-column prop="time" label="执行时间" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.time | stampFormate}}
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="editCalendar(scope.row)">修改</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" size="small" @click.prevent="deteleFn(scope.row)">删除</el-button>
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
import {loginService} from '../../service/loginService'
import {typeCalendar} from '../../filter/companyList'

export default {
    data () {
        return {
            tableLoading: false,
            tableData: [],
            pageInfo: {
                search: ''
            },
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
        }
    },
    filters: {
        typeCalendar
    },
    mounted () {
        this.queryData(this.pageInfo.search);
    },
    methods: {
        // 获取列表
        queryData(search) {
            let that = this;
            that.tableLoading = true;
            loginService.getCalendars({
                param: search,
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize
            }).then(res => {
                if(res.data.code == 200) {
                    let result = res.data.datas;
                    that.tableData = result.datas;
                    that.page.total = Number(result.totalCount);
                    setTimeout(function () {
                        that.tableLoading = false
                    }, 300)
                } else {
                    that.$message.error(res.data.message)
                }
            }).catch(err => {
                console.log('err', err);
            });
        },
        addItems() {
            this.$router.push({path: 'addCalendar'})
        },
        editCalendar(row) {
          this.$router.push({path: 'editCalendar', query: {id: row.id}})
        },
        // 删除
        deteleFn(scope) {
            this.$confirm('是否确定删除？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                loginService.deleteCalendars(scope.id, {
                }).then(res => {
                    if(res.data.success) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        setTimeout(() => {
                            this.queryData(this.pageInfo.search);
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });

        },
        // 分页
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.queryData(this.pageInfo.search);
        },
        handleCurrentChange(val) {
            this.page.pageNo = val;
            this.queryData(this.pageInfo.search);
        }
    }
}
</script>

<style scoped>

</style>

<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/companyList' }">功能</el-breadcrumb-item>
                <el-breadcrumb-item>工作列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px">
            <el-form-item>
                <el-badge :value="statistics.userNum" class="item">
                    <el-button size="small">用 户</el-button>
                </el-badge>
                <el-badge :value="statistics.companyNum" class="item">
                    <el-button size="small">公 司</el-button>
                </el-badge>
                <el-badge :value="statistics.jobNum" class="item">
                    <el-button size="small">工作记录</el-button>
                </el-badge>
                <el-badge :value="statistics.infoNum" class="item">
                    <el-button size="small">重要信息</el-button>
                </el-badge>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="adduser">新增用户</el-button>
                <el-button type="primary" @click="addWork">新增工作</el-button>
                <el-button type="primary" @click="myUserList">我的用户列表</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="name" label="用户姓名" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="type" label="分类" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.type | type}}
                </template>
            </el-table-column>
            <el-table-column prop="communicateMethod" label="沟通方式" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.communicateMethod | communicateMethod}}
                </template>
            </el-table-column>
            <el-table-column prop="scene" label="场景" min-width="60" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.scene | scene}}
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="value" label="价值" min-width="60">
                <template slot-scope="scope">
                    {{scope.row.value | value}}
                </template>
            </el-table-column>
            <el-table-column prop="visitTime" label="时间" min-width="80">
                <template slot-scope="scope">
                    <p v-if="scope.row.visitTime">{{scope.row.visitTime | stampFormate}}</p>
                    <p v-else></p>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="editWork(scope.row)">修改</el-button>
                    <el-button type="text" icon="el-icon-view" size="small" @click.prevent="detailsFn(scope.row)">详情</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" size="small" @click.prevent="deleteFn(scope.row)">删除</el-button>
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
import {communicateMethod, scene, type, value} from "../../filter/companyList";
import {loginService} from "../../service/loginService";

export default {
    data () {
        return {
            tableLoading: false,
            tableData: [],
            statistics: {},
            pageInfo: {

            },
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
        }
    },
    filters: {
        type,
        communicateMethod,
        scene,
        value
    },
    mounted () {
        this.getWorkStatistics()
    },
    methods: {
        queryData() {
            let that = this;
            that.tableLoading = true;
            loginService.getWorkList({
                param: '',
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize
            }).then(res => {
                if (res.data.success) {
                    let result = res.data.datas;
                    if (result.datas) {
                        result.datas.forEach(item => {
                            item.name = item.user.name
                        })
                    }
                    that.tableData = result.datas;
                    that.page.total = Number(result.totalCount);
                    setTimeout(function () {
                        that.tableLoading = false
                    }, 300)
                } else {
                    that.$message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err);
            });
        },
        // 获取统计
        getWorkStatistics() {
            loginService.getWorkStatistics({}).then(res => {
                if (res.data.success) {
                    this.statistics = res.data.datas;
                    this.queryData()
                }
            }).catch(err => {
                console.log(err);
            })
        },
        myUserList() {
          this.$router.push({path: 'userManagement'})
        },
        adduser() {
          this.$router.push({path: 'userAdd'})
        },
        editWork(row) {
          this.$router.push({path: 'editWork', query: {id: row._id}})
        },
        addWork() {
          this.$router.push({path: 'addWork'})
        },
        detailsFn(row) {
            this.$store.commit('setAddCompanyUrl', '/workList');
            this.$store.commit('setAddCompanyName', '工作列表');
            this.$router.push({path: 'detailsWork', query: {id: row._id}})
        },
        // 删除
        deleteFn(row) {
            this.$confirm('删除工作可能会造成商机信息不完整,是否确定', '严重警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                loginService.getWorkDelete(row._id, {}).then(res => {
                    if (res.data.success) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        setTimeout(() => {
                            this.queryData()
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
        handleSizeChange (val) {
            this.page.pageSize = val
            this.queryData()
        },
        handleCurrentChange (val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.queryData()
            }
        }
    }
}
</script>


<style scoped>
.item {
    margin-top: 0px;
    margin-right: 40px;
}
</style>

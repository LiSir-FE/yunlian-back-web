<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/companyList' }">功能</el-breadcrumb-item>
                <el-breadcrumb-item>商机列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px">
            <el-form-item>
                <el-input v-model="pageInfo.search" placeholder="搜索账号/名称" class="wetuc-input3-col3"
                          @keyup.enter.native="queryData(pageInfo.search)">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                       @click="queryData(pageInfo.search)" style="cursor: pointer"></i>
                </el-input>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="infoType" label="碎片类型" min-width="100">
                <template slot-scope="scope">
                    {{scope.row.infoType | infoType}}
                </template>
            </el-table-column>

            <el-table-column prop="infoTitle" label="碎片标题" min-width="300" show-overflow-tooltip>
                <template slot-scope="scope">
                    <i class="el-icon-bell" style="color: red" v-if="!scope.row.commentRead"></i>
                    <span style="margin-left: 10px">{{scope.row.infoTitle}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="hostName" label="发现人" min-width="100"></el-table-column>
            <el-table-column prop="createTime" label="时间" min-width="100">
                <template slot-scope="scope">
                    {{scope.row.createTime | stampFormate}}
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" v-if="!scope.row.editStatus" size="small" @click.prevent="editOpportunity(scope.row)">修改</el-button>
                    <el-button type="text" icon="el-icon-view" size="small" @click.prevent="details(scope.row)">详情</el-button>
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
import {loginService} from "../../service/loginService";
import {infoType} from '../../filter/companyList'
export default {
    data () {
        return {
            pageInfo: {
                search: ''
            },
            tableLoading: false,
            tableData: [],
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
        }
    },
    filters: {
        infoType
    },
    mounted () {
        this.queryData(this.pageInfo.search)
    },
    methods: {
        queryData(search) {
            let that = this;
            that.tableLoading = true;
            loginService.informationList({
                param: search,
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize
            }).then(res => {
                if (res.data.success) {
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
                console.log(err);
            });
        },
        editOpportunity(row) {
            this.$router.push({path: 'editOpportunity', query: {id: row.id}})
        },
        // 查看详情
        details(scope) {
            this.$store.commit('setAddCompanyUrl', '/opportunityList');
            this.$store.commit('setAddCompanyName', '商机列表');
            this.$router.push({path: 'detailsOpportunity', query: {id: scope.id}})
        },
        // 删除
        deleteFn(row) {
            this.$confirm('是否确定删除商机？', '严重警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                loginService.informationDelete(row.id, {
                }).then(res => {
                    if(res.data.success) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        setTimeout(() => {
                            this.queryData(this.pageInfo.search)
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
            this.queryData(this.pageInfo.search)
        },
        handleCurrentChange (val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.queryData(this.pageInfo.search)
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

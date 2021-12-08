<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/articleManagement' }">功能</el-breadcrumb-item>
                <el-breadcrumb-item>现场互动</el-breadcrumb-item>
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
            <el-form-item>
                <el-button type="primary" @click="addInteraction()">新建互动</el-button>
            </el-form-item>
        </el-form>


        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column label="标题" key="1" min-width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="spanHover">{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column label="参与人数" prop="userNum" key="2" min-width="100"></el-table-column>
            <el-table-column label="创建时间" key="3" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | stampFormate4}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="120" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small">互动设置</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small">复制</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small">删除</el-button>
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
        data () {
            return {
                imgUrl: process.env.IMG_URL,
                pageInfo: {
                    search: '',
                    activeState: '',
                    registrationStatus: ''
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
        mounted () {
            this.queryData(this.pageInfo.search)
        },
        methods: {
            queryData(search) {
                let that = this;
                that.tableLoading = true;
                loginService.fieldActivitiesList({
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                    query: search
                }).then(res => {
                    if (res.data.success) {
                        let result = res.data.datas
                        that.tableData = result.datas
                        that.page.total = Number(result.totalCount)
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            addInteraction() {

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

</style>

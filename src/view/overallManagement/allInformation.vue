<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/allArticles' }">总体管理</el-breadcrumb-item>
                <el-breadcrumb-item>所有资料</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-tabs v-model="dataName" @tab-click="handleClick">
            <el-tab-pane label="开放资料" name="openData"></el-tab-pane>
            <el-tab-pane label="会员资料" name="vipData"></el-tab-pane>
        </el-tabs>

        <el-form ref="pageInfo" :model="pageInfo" label-width="80px">
            <el-input v-model="pageInfo.query" placeholder="搜索" class="wetuc-input3-col3"
                      @keyup.enter.native="queryData">
                <i slot="suffix" class="el-input__icon el-icon-search"
                   @click="queryData" style="cursor: pointer"></i>
            </el-input>
        </el-form>


        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading"
                  element-loading-text="拼命加载中">
            <el-table-column prop="name" label="文件名" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="desc" label="描述" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="form" label="分类" min-width="80"></el-table-column>
            <el-table-column prop="size" label="大小" min-width="80"></el-table-column>
            <el-table-column prop="right" label="下载量" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.downloadCount === null ? '0' : scope.row.downloadCount}}</span>
                </template>
            </el-table-column>
            <el-table-column label="时间" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | stampFormate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editText(scope.row.id)">下载</el-button>
                    <el-button type="text" size="small" @click="editText(scope.row.id)">删除</el-button>
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
    import {stampFormate} from '../../filter/index'
    export default {
        data () {
            return {
                dataName: 'openData',
                pageInfo: {
                    query: ''
                },
                type: 1,
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                tableData: [],
                tableLoading: false
            }
        },
        mounted () {
            this.queryData(this.type);
        },
        methods: {
            queryData(type) {
                let that = this;
                that.tableLoading = true;
                loginService.getDocumentslist({
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                    name: that.pageInfo.query,
                    type: type,
                    order: 'Long_max',
                    all: true
                }).then(res => {
                    if(res.data.success) {
                        let result = res.data.datas
                        that.tableData = result.datas
                        that.page.total = Number(result.totalCount)
                    }
                    that.tableLoading = false;
                }).catch(err => {
                    console.log(err)
                })
            },
            // 编辑
            editText(id) {
                console.log(id)
            },

            // 分页
            handleSizeChange (val) {
                this.page.pageSize = val;
                this.queryData(this.type);
            },
            handleCurrentChange (val) {
                if (val !== 0) {
                    this.page.pageNum = val;
                    this.queryData(this.type)
                }
            },
            handleClick(tab) {
                this.type = null;
                if(tab.name === 'vipData') {
                    this.type = 2;
                } else {
                    this.type = 1;
                }
                this.queryData(this.type)
            }
        }
    }
</script>

<style scoped>

</style>

<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/articleManagement' }">功能</el-breadcrumb-item>
                <el-breadcrumb-item>问题管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px">
            <el-form-item>
                <el-input v-model="pageInfo.search" placeholder="搜索账号/名称" class="wetuc-input3-col3"
                          @keyup.enter.native="queryData(pageInfo.search)">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                       @click="queryData(pageInfo.search)" style="cursor: pointer"></i>
                </el-input>

                <el-select v-model="pageInfo.classification" placeholder="请选择分类" class="wetuc-input3-col3" :clearable="true" @change="queryData(pageInfo.search)">
                    <el-option
                        v-for="item in classificationList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addQuestion()">添加问题</el-button>
            </el-form-item>
        </el-form>


        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column label="问题名称" key="1" min-width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="spanHover">{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column label="分类" prop="userNum" key="2" min-width="100">
                <template slot-scope="scope">
                    <span> {{scope.row.classify | classify}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="120" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-view" size="small" @click.prevent="detailsFn(scope.row)">详情</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" v-if="!scope.row.active" @click.prevent="modify(scope.row)">开启</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" v-else @click.prevent="deleteFn(scope.row)">关闭</el-button>
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
import {classify} from '../../filter/companyList'
export default {
    data () {
        return {
            imgUrl: process.env.IMG_URL,
            pageInfo: {
                search: '',
                classification: ''
            },
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            classificationList: [{
                value: '1',
                label: '行业'
            },{
                value: '2',
                label: '企业'
            },{
                value: '3',
                label: '运联'
            },{
                value: '4',
                label: '其它'
            }],
            tableData: [],
            tableLoading: false,
        }
    },
    filters: {
        classify
    },
    mounted () {
        this.queryData(this.pageInfo.search)
    },
    methods: {
        queryData(search) {
            let that = this;
            that.tableLoading = true;
            loginService.getQuizesList({
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize,
                classify: that.pageInfo.classification,
                param: search
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
        addQuestion() {
            this.$router.push({path: 'addProblem'})
        },
        // 开启
        modify(row) {
            let that = this;
            loginService.putQuizes(row.id, {
                active: !row.active
            }).then(res => {
                if (res.data.success) {
                    that.$message('开启成功!');
                    setTimeout(function () {
                        this.queryData(this.pageInfo.search)
                    }, 800)
                }
            }).catch(err => {
                console.log(err);
            });
        },
        detailsFn(row) {
            this.$router.push({path: 'detailsProblem', query: {id: row.id}})
        },
        // 关闭
        deleteFn(row) {
            let that = this;
            loginService.putQuizes(row.id, {
                active: !row.active
            }).then(res => {
                if (res.data.success) {
                    that.$message('已关闭!');
                    setTimeout(function () {
                        this.queryData(this.pageInfo.search)
                    }, 800)
                }
            }).catch(err => {
                console.log(err);
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

</style>

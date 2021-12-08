<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/articleManagement' }">功能</el-breadcrumb-item>
                <el-breadcrumb-item>课程管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="pageInfo.search" placeholder="搜索课程名称" class="wetuc-input3-col3"
                          @keyup.enter.native="queryData(pageInfo.search)">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                       @click.prevent="queryData(pageInfo.search)" style="cursor: pointer"></i>
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="addCourse()">添加课程</el-button>
            </el-form-item>
        </el-form>


        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column label="课程名称" min-width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="spanHover">{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column label="时长" prop="userNum" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.time | resultPage}}</span>
                </template>
            </el-table-column>
            <el-table-column label="讲师" prop="hostName" min-width="80"></el-table-column>
            <el-table-column label="添加时间" prop="userNum" min-width="100">
                <template slot-scope="scope">
                    <span> {{scope.row.createTime | stampFormate4}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="120" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="modify(scope.row)">修改</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="deleteFn(scope.row)">删除</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="download(scope.row)">下载课件</el-button>
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
    computed: {
        picHead() {
            return process.env.IMG_URL
        }
    },
    mounted () {
        this.queryData(this.pageInfo.search)
    },
    methods: {
        queryData(search) {
            let that = this;
            that.tableLoading = true;
            loginService.getCourseList({
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize,
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
        // 删除
        deleteFn(scope) {
            let that = this;
            that.$confirm('确认删除课程吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                loginService.deleteCourse(scope.id, {
                }).then(res => {
                    if(res.data.success) {
                        that.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        setTimeout(() => {
                            that.queryData(this.pageInfo.search)
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消'
                });
            });

        },
        download(row) {
            let that = this;
            let href = that.picHead + row.file;
            window.open(href, '_blank')
        },
        modify(row) {
          this.$router.push({path: 'editCourses', query: {id: row.id}})
        },
        addCourse() {
            this.$router.push({path: 'addCourses'})
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

<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/allArticles' }">总体管理</el-breadcrumb-item>
                <el-breadcrumb-item>所有评论</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-tabs v-model="name" @tab-click="handleClick">
            <el-tab-pane label="文章" name="article"></el-tab-pane>
            <el-tab-pane label="活动" name="activity"></el-tab-pane>
        </el-tabs>



        <el-table :data="arrayData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column min-width="60">
                <template slot-scope="scope">
                    <el-avatar :size="50" :src="imgUrl + scope.row.userHeadImg"></el-avatar>
                    <!--<el-image style="width: 50px; height: 50px;border-radius: 100%;overflow: hidden" :src="imgUrl + scope.row.userHeadImg"></el-image>-->
                </template>
            </el-table-column>
            <el-table-column prop="userName" min-width="60"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="content" min-width="60"
                             show-overflow-tooltip></el-table-column>
            <el-table-column min-width="80"
                             show-overflow-tooltip>
                <template slot-scope="scope">
                    <span> {{scope.row.commentTime | stampFormate2}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="100"
                             show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button type="text" size="small">{{scope.row.typeTitle}}</el-button>
                </template>
            </el-table-column>
            <el-table-column fixed="right" min-width="60" align="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small">删除</el-button>
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
                tableLoading: false,
                imgUrl: process.env.IMG_URL,
                name: 'article',
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                type: 1,
                arrayData: []
            }
        },
        mounted () {
            this.getComments(this.type);
        },
        methods: {
            getComments(type) {
                let that = this;
                that.tableLoading = true;
                loginService.getComments({
                    level: 1,
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                    type: type,
                    all: true
                }).then(res => {
                    if(res.data.code == 200) {
                        let result = res.data.datas;
                        that.arrayData = result.datas;
                        that.page.total = Number(result.totalCount)
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    } else {
                        that.$message.error(res.data.message)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 分页
            handleSizeChange (val) {
                this.page.pageSize = val;
                this.getComments(this.type);
            },
            handleCurrentChange (val) {
                if (val !== 0) {
                    this.page.pageNum = val;
                    this.getComments(this.type);
                }
            },
            handleClick(tab) {
                this.page.pageSize = 5;
                this.page.pageNum = 1;
                if(tab.name === 'article') {
                    this.type = 1;
                    this.getComments(this.type);
                } else {
                    this.type = 2;
                    this.getComments(this.type);
                }
            }
        }
    }
</script>

<style lang="scss">
    /*.container{*/
        /*width: 100%;*/
        /*height: auto;*/
        /*display: flex;*/
        /*padding: 10px 0;*/
        /*border-bottom: 1px solid #e8e8e8;*/
        /*box-sizing: border-box;*/
    /*}*/
</style>

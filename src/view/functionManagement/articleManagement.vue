<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/articleManagement' }">功能</el-breadcrumb-item>
                <el-breadcrumb-item>文章管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <div>
            <el-tabs v-model="articleName" @tab-click="handleClick">
                <el-tab-pane label="我的文章" name="first"></el-tab-pane>
                <el-tab-pane label="草稿箱" name="second"></el-tab-pane>
            </el-tabs>
        </div>


        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px">
            <el-form-item>
                <el-input v-model="pageInfo.search" placeholder="搜索账号/名称" class="wetuc-input3-col3"
                          @keyup.enter.native="queryData(pageInfo.search)">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                       @click="queryData(pageInfo.search)" style="cursor: pointer"></i>
                </el-input>
                <el-select v-model="pageInfo.type" placeholder="请选择文章分类" class="wetuc-input3-col3"
                           v-if="articleName === 'first'" :clearable="true">
                    <el-option
                        v-for="item in typeOptionsList"
                        :key="item.id"
                        :label="item.tagName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="pageInfo.status" placeholder="请选择文章状态" class="wetuc-input3-col3" :clearable="true">
                    <el-option
                        v-for="item in statusOptionsList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryData(pageInfo.search)">筛 选</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addAccDialoadBtnFn(addAccDialogId)">发布文章</el-button>
            </el-form-item>
        </el-form>


        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <span class="item-icon"><i class="el-icon-view"></i>{{scope.row.readNum}}</span>
                    <span class="item-icon"><i class="el-icon-thumb"></i>{{scope.row.thumbsNum}}</span>
                    <span class="item-icon"><i class="el-icon-star-on"></i>{{scope.row.collectNum}}</span>
                    <span class="item-icon"><i
                        class="el-icon-chat-square"></i>{{scope.row.commentNum}}</span>
                    <span class="item-icon"><i class="el-icon-position"></i>{{scope.row.commentNum}}</span>
                </template>
            </el-table-column>

            <el-table-column label="图片（查看大图）" min-width="100">
                <template slot-scope="scope">
                    <div class="tableImg">
                        <el-image class="table-td-thumb" :src="imgUrl + scope.row.poster" :preview-src-list="[imgUrl + scope.row.poster]"></el-image>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="标题" min-width="180" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="spanHover">{{scope.row.title}}</span>
                </template>
            </el-table-column>
            <el-table-column label="文章分类" min-width="180" v-if="articleName === 'first'">
                <template slot-scope="scope">
                    <span class="spanHover" v-for="item in scope.row.classifications">{{item + '/'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="文章状态" min-width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.status | articleStatus}}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" min-width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.createDate | stampFormate4}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="120" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" size="small">删除</el-button>
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
    import {stampFormate4} from '../../filter/index'
    import {articleStatus} from '../../filter/companyList'

    export default {
        data () {
            return {
                imgUrl: process.env.IMG_URL,
                pageInfo: {
                    search: '',
                    type: '',
                    status: ''
                },
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                tableData: [],
                tableLoading: false,
                articleName: 'first',
                typeOptionsList: [],
                statusOptionsList: [{
                    label: '已发布',
                    value: '1'
                }, {
                    label: '待审核',
                    value: '2'
                }, {
                    label: '被驳回',
                    value: '3'
                }]
            }
        },
        filters: {
            articleStatus
        },

        mounted () {
            this.queryData(this.pageInfo.search);
            this.getArticlesType();
        },
        methods: {
            queryData (search) {
                let that = this
                that.tableLoading = true
                loginService.getList({
                    query: search,
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                    classId: that.pageInfo.type,
                    status: that.articleName === 'first' ? that.pageInfo.status : 2,
                    lableId: ''
                }).then(res => {
                    if (res.data.success) {
                        let result = res.data.datas
                        that.tableData = result.datas
                        that.page.total = Number(result.totalCount)
                    }
                    that.tableLoading = false
                }).catch(err => {
                    console.log(err)
                })
            },
            getArticlesType () {
                loginService.getArticlesType({
                    type: 2
                }).then(res => {
                    if (res.data.success) {
                        this.typeOptionsList = res.data.datas
                    } else {
                        this.$message.error(res.data.message)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            handleClick (item) {
                this.queryData(this.pageInfo.search)
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

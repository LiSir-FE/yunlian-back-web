<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/allArticles' }">总体管理</el-breadcrumb-item>
                <el-breadcrumb-item>所有文章</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
            <el-tabs v-model="article" @tab-click="handleClick">
                <el-tab-pane label="全部文章" name="articleAll">
                    <el-form ref="pageAllInfo" :model="pageAllInfo" label-width="10px" :inline="true">

                        <el-input v-model="pageAllInfo.query" placeholder="搜索" class="wetuc-input3-col3"
                                  @keyup.enter.native="queryAllData(pageAllInfo.articlesIification, pageAllInfo.articleLabel)">
                            <i slot="suffix" class="el-input__icon el-icon-search"
                               @click="queryAllData(pageAllInfo.articlesIification, pageAllInfo.articleLabel)" style="cursor: pointer"></i>
                        </el-input>

                        <el-select v-model="pageAllInfo.articlesIification" placeholder="文章分类" class="wetuc-input3-col3"
                                   @change="articlesIificationChange" clearable>
                            <el-option
                                v-for="item in articlesIificationList"
                                :key="item.id"
                                :label="item.tagName"
                                :value="item.id">
                            </el-option>
                        </el-select>

                        <el-select v-model="pageAllInfo.articleLabel" placeholder="文章标签" class="wetuc-input3-col3"
                                   @change="articleLabelChange" clearable>
                            <el-option
                                v-for="item in articleLabelList"
                                :key="item.id"
                                :label="item.tagName"
                                :value="item.id">
                            </el-option>
                        </el-select>

                    </el-form>
                    <el-table :data="tableAllData" style="width: 100%" v-loading="tableAllLoading"
                              element-loading-text="拼命加载中">
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


                        <el-table-column label="序号" min-width="50">
                            <template slot-scope="scope">
                                <span>{{scope.$index + 1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="配图（查看大图）" min-width="120">
                            <template slot-scope="scope">
                                <el-image class="table-td-thumb" :src="imgUrl + scope.row.poster" :preview-src-list="[imgUrl + scope.row.poster]"></el-image>
<!--                                <el-avatar shape="square" fit="cover" :size="60" :src="imgUrl + scope.row.poster"></el-avatar>-->
                                <!--<el-image style="width: 108px; height: 72px" :src="imgUrl + scope.row.poster"></el-image>-->
                            </template>
                        </el-table-column>
                        <el-table-column label="标题" min-width="150" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span class="spanHover">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="文章分类" min-width="100">
                            <template slot-scope="scope">
                                 <span v-if="scope.row.classifications">
                                     <p v-for="(ite, idx) in scope.row.classifications" :key="idx">{{ite}}</p>
                                </span>
                                <span v-else>{{scope.row.classification}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="lable" label="文章标签" min-width="100"></el-table-column>
                        <el-table-column prop="originAuthor" label="作者名称" min-width="80"></el-table-column>
                        <el-table-column label="发布时间" min-width="130">
                            <template slot-scope="scope">
                                <span>{{scope.row.varefyTime | stampFormate4}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="240" fixed="right" align="right">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-edit" size="small" @click="editText(scope.row.id)">编辑</el-button>
                                <el-button type="text" icon="el-icon-delete" class="red" size="small" @click="editText(scope.row.id)"
                                           v-if="scope.row.isClose === '0'">关闭
                                </el-button>
                                <el-button type="text" icon="el-icon-edit" size="small" @click="editText(scope.row.id)"
                                           v-if="scope.row.isClose === '1'">开启
                                </el-button>
                                <el-button type="text" icon="el-icon-edit" size="small" @click="editText(scope.row.id)"
                                           v-if="scope.row.position >= 20">置顶
                                </el-button>
                                <el-button type="text" icon="el-icon-delete" class="red" size="small" @click="editText(scope.row.id)"
                                           v-if="scope.row.position <= 20">取消置顶
                                </el-button>
                                <el-button type="text" icon="el-icon-delete" class="red" size="small" @click="editText(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="wetuc-pagination-panel">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="pageAll.pageNum"
                            :page-sizes="[5, 10, 20, 50]"
                            :page-size="pageAll.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="pageAll.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="文章审核" name="reviewArticles">

                    <el-form ref="pageReviewInfo" :model="pageReviewInfo" label-width="80px">

                        <el-input v-model="pageReviewInfo.query" placeholder="搜索" class="wetuc-input3-col3"
                                  @keyup.enter.native="queryReviewData(pageReviewInfo.examine)">
                            <i slot="suffix" class="el-input__icon el-icon-search"
                               @click="queryReviewData(pageReviewInfo.examine)" style="cursor: pointer"></i>
                        </el-input>

                        <el-select v-model="pageReviewInfo.examine" class="wetuc-input3-col3" @change="examineChange" clearable>
                            <el-option
                                v-for="item in examineList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form>
                    <el-table :data="tableReviewData" style="width: 100%" v-loading="tableReviewLoading"
                              element-loading-text="拼命加载中">
                        <el-table-column label="配图" min-width="120">
                            <template slot-scope="scope">
                                <el-image style="width: 108px; height: 72px"
                                          :src="imgUrl + scope.row.article_poster"></el-image>
                            </template>
                        </el-table-column>
                        <el-table-column prop="article_title" label="标题" min-width="150"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column label="文章分类" min-width="100" show-overflow-tooltip>
                            <template slot-scope="scope">
                                 <span v-if="scope.row.article_classifications">
                                     <span v-for="(ite, idx) in scope.row.article_classifications" :key="idx">{{ite + '/'}}</span>
                                </span>
                                <span v-else>{{scope.row.article_classifications}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="article_originAuthor" label="作者名称" min-width="80"></el-table-column>
                        <el-table-column label="提交时间" min-width="100">
                            <template slot-scope="scope">
                                <span>{{scope.row.applyTime | stampFormate}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" min-width="150" fixed="right" align="right">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="editText(scope.row.id)" v-if="scope.row.varifyResult === '0'">通过</el-button>
                                <el-button type="text" size="small" @click="editText(scope.row.id)" v-if="scope.row.varifyResult === '0'">驳回</el-button>
                                <el-popover
                                    v-if="scope.row.varifyResult !== '0' && scope.row.varifyResult === '2'"
                                    placement="top-start"
                                    width="200"
                                    trigger="hover"
                                    :content="scope.row.failReason">
                                    <el-button slot="reference" type="text" size="small">驳回原因</el-button>
                                </el-popover>
                                <el-button type="text" icon="el-icon-delete" class="red" size="small" @click="editText(scope.row.id)" v-if="scope.row.varifyResult !== '0'">删除记录</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="wetuc-pagination-panel">
                        <el-pagination
                            @size-change="handleReviewSizeChange"
                            @current-change="handleReviewCurrentChange"
                            :current-page="pageReview.pageNum"
                            :page-sizes="[5, 10, 20, 50]"
                            :page-size="pageReview.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="pageReview.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="文章评审" name="articleReview">
                    <el-form ref="reviewPageInfo" :model="reviewPageInfo" label-width="80px">

                        <el-date-picker
                            @change="reviewTime"
                            class="wetuc-input3-col3"
                            v-model="reviewPageInfo.time"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>

                        <el-select v-model="reviewPageInfo.review" placeholder="请选择评审状态" class="wetuc-input3-col3" clearable @change="reviewChange">
                            <el-option
                                v-for="item in reviewList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>

                        <el-button type="primary" @click="screen">筛 选</el-button>

                    </el-form>


                    <el-table :data="reviewTableData" style="width: 100%" v-loading="reviewLoading" element-loading-text="拼命加载中">
                        <el-table-column label="标题" min-width="220" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span @click="toDetail(scope.row.id)" class="spanHover">
                                    {{scope.row.title}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="readNum" label="阅读量" min-width="60" show-overflow-tooltip></el-table-column>
                        <el-table-column label="发布时间" min-width="80" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{scope.row.createDate | stampFormate}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="createUser" label="分析师" min-width="60" show-overflow-tooltip></el-table-column>

                        <el-table-column label="评审" min-width="80" show-overflow-tooltip fixed="right" align="right" v-if="reviewPageInfo.review == 0">
                            <template slot-scope="scope">
                                <span>{{scope.row.qualified | qualified}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" align="right" label="操作" min-width="120" v-else>
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click.prevent="qualifiedClick(scope.row)" v-if="scope.row.qualified == '1' || scope.row.qualified == '2'">
                                    合格
                                </el-button>
                                <el-button type="text" size="small" @click.prevent="unqualified(scope.row)" v-if="scope.row.qualified != '2' || scope.row.qualified == '3'">
                                    不合格
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                    <div class="wetuc-pagination-panel">
                        <el-pagination
                            @size-change="reviewHandlSizeChange"
                            @current-change="reviewHandleCurrentChange"
                            :current-page="reviewPage.pageNum"
                            :page-sizes="[5, 10, 20, 50]"
                            :page-size="reviewPage.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="reviewPage.total">
                        </el-pagination>
                    </div>
                </el-tab-pane>

            </el-tabs>


        </div>
    </div>
</template>

<script>
    import {loginService} from '../../service/loginService'
    import {stampFormate} from '../../filter/index'
    import {qualified} from '../../filter/companyList'

    export default {
        data () {
            return {
                article: 'articleAll',
                imgUrl: process.env.IMG_URL,
                pageAllInfo: {
                    query: '',
                    articlesIification: '',
                    articleLabel: ''
                },
                pageReviewInfo: {
                    query: '',
                    examine: '0'
                },
                pageAll: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                pageReview: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                reviewPageInfo: {
                    time: '',
                    review: ''
                },
                reviewPage: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                reviewLoading: false,
                reviewTableData: [],
                reviewList: [{
                    label: '全部',
                    value: 0
                },{
                    label: '待评审',
                    value: 1
                },{
                    label: '已评审',
                    value: 2
                }],
                tableAllData: [],
                tableReviewData: [],
                tableAllLoading: false,
                tableReviewLoading: false,
                articlesIificationList: [],
                articleLabelList: [],
                examineList: [{
                    label: '待审核',
                    value: '0'
                }, {
                    label: '已发布',
                    value: '1'
                }, {
                    label: '未通过',
                    value: '2'
                }]
            }
        },
        filters: {
            qualified
        },
        mounted () {
            this.queryAllData(this.pageAllInfo.articlesIification, this.pageAllInfo.articleLabel)
            this.getArticlesIification()
            this.getArticleLabelList()
            this.getArticlesList(this.reviewPageInfo.review)
        },
        methods: {
            queryAllData (classId, lableId) {
                let that = this
                that.tableAllLoading = true
                loginService.getList({
                    pageNo: that.pageAll.pageNum,
                    pageSize: that.pageAll.pageSize,
                    query: that.pageAllInfo.query,
                    classId: classId,
                    lableId: lableId,
                    all: true,
                    status: 1
                }).then(res => {
                    if (res.data.success) {
                        let result = res.data.datas
                        that.tableAllData = result.datas
                        that.pageAll.total = Number(result.totalCount)
                    }
                    that.tableAllLoading = false
                }).catch(err => {
                    console.log(err)
                })
            },

            queryReviewData (examine) {
                let that = this
                that.tableReviewLoading = true
                loginService.getVarifysList({
                    pageNo: that.pageReview.pageNum,
                    pageSize: that.pageReview.pageSize,
                    query: that.pageReviewInfo.query,
                    type: 1,
                    varifyResult: examine
                }).then(res => {
                    if (res.data.success) {
                        let result = res.data.datas
                        that.tableReviewData = result.datas
                        that.pageReview.total = Number(result.totalCount)
                    }
                    that.tableReviewLoading = false
                }).catch(err => {
                    console.log(err)
                })
            },

            // 获取文章评审
            getArticlesList(qualified) {
                let that = this;
                that.reviewLoading = true;
                loginService.getArticlesList({
                    pageNo: that.reviewPage.pageNum,
                    pageSize: that.reviewPage.pageSize,
                    qualified: qualified,
                    lableId: '5ba0f72b5a700006de4fc194',
                    all: true,
                    status: 1,
                    createStartTime: that.reviewPageInfo.time && that.reviewPage.time[0] ? that.reviewPage.time[0] : '',
                    createEndTime: that.reviewPageInfo.time && that.reviewPage.time[1] ? that.reviewPage.time[1] : ''
                }).then(res => {
                    if(res.data.code == 200) {
                        let result = res.data.datas;
                        that.reviewTableData = result.datas;
                        that.reviewPage.total = Number(result.totalCount);
                        setTimeout(function () {
                            that.reviewLoading = false
                        }, 300)
                    } else {
                        that.$message.error(res.data.message)
                    }
                }).catch(err => {
                    console.log(err);
                })
            },


            // 文章评审筛选
            screen() {
                this.getArticlesList(this.reviewPageInfo.review)
            },


            // 时间
            reviewTime (item) {
                this.reviewPage.time = [];
                this.reviewPage.time[0] = item[0];
                this.reviewPage.time[1] = item[1];
            },

            // 合格不合格
            qualifiedClick(row) {
                let that = this;
                loginService.articlesQualified(row.id, {
                    qualified: 2
                }).then(res => {
                    if (res.data.code == 200) {
                        that.$message.success('合格!');
                        setTimeout(function () {
                            that.getArticlesList(that.qualified)
                        }, 800)
                    } else {
                        that.$message.error(res.data.message)
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            unqualified(row) {
                let that = this;
                loginService.articlesQualified(row.id, {
                    qualified: 3
                }).then(res => {
                    if (res.data.code == 200) {
                        that.$message.warning('不合格!');
                        setTimeout(function () {
                            that.getArticlesList(that.qualified)
                        }, 800)
                    } else {
                        that.$message.error(res.data.message)
                    }
                }).catch(err => {
                    console.log(err);
                })
            },


            // 文章评审状态
            reviewChange(row) {
                this.getArticlesList(row)
            },

            // 文章评审新窗口
            toDetail(id) {
                let href = this.$store.state.frontEndDomainName + 'article/' + id;
                window.open(href, '_blank');
            },

            // 获取文章分类
            getArticlesIification () {
                let that = this
                loginService.getArticlesType({type: 2}).then(res => {
                    if (res.data.success) {
                        that.articlesIificationList = res.data.datas
                    } else {
                        that.$message.error(res.data.message)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },

            // 获取文章标签
            getArticleLabelList () {
                let that = this
                loginService.getArticlesType({type: 6}).then(res => {
                    if (res.data.success) {
                        that.articleLabelList = res.data.datas
                    } else {
                        that.$message.error(res.data.message)
                    }
                }).catch(err => {
                    err.algorithm
                })
            },

            // 文章分类筛选
            articlesIificationChange (val) {
                this.queryAllData(val, this.pageAllInfo.articleLabel)

            },

            // 文章分类筛选
            articleLabelChange (val) {
                this.queryAllData(this.pageAllInfo.articlesIification, val)
            },


            // 审核-状态筛选
            examineChange(val) {
                this.queryReviewData(val)
            },

            // 分页
            handleSizeChange (val) {
                this.pageAll.pageSize = val
                this.queryAllData(this.pageAllInfo.articlesIification, this.pageAllInfo.articleLabel)
            },
            handleCurrentChange (val) {
                if (val !== 0) {
                    this.pageAll.pageNum = val
                    this.queryAllData(this.pageAllInfo.articlesIification, this.pageAllInfo.articleLabel)
                }
            },

            // 分页
            handleReviewSizeChange (val) {
                this.pageReview.pageSize = val
                this.queryReviewData(this.pageReviewInfo.examine)
            },
            handleReviewCurrentChange (val) {
                if (val !== 0) {
                    this.pageReview.pageNum = val
                    this.queryReviewData(this.pageReviewInfo.examine)
                }
            },


            // 分页
            reviewHandlSizeChange (val) {
                this.reviewPage.pageSize = val
                this.getArticlesList(this.reviewPageInfo.review)
            },
            reviewHandleCurrentChange (val) {
                if (val !== 0) {
                    this.reviewPage.pageNum = val
                    this.getArticlesList(this.reviewPageInfo.review)
                }
            },


            // 操作
            editText (id) {
                console.log(id)
            },
            handleClick (tab, event) {
                if (tab.name === 'reviewArticles') {
                    this.queryReviewData(this.pageReviewInfo.examine)
                } else if(tab.name === 'articleAll') {
                    this.queryAllData(this.pageAllInfo.articlesIification, this.pageAllInfo.articleLabel)
                } else {
                    console.log('123132')
                }
            }
        }
    }
</script>

<style lang="scss">


    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>

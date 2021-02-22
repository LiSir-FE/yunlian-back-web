<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/allArticles' }">总体管理</el-breadcrumb-item>
                <el-breadcrumb-item>所有活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <el-form ref="pageInfo" :model="pageInfo" label-width="80px">
            <el-input v-model="pageInfo.query" placeholder="搜索" class="wetuc-input3-col3"
                      @keyup.enter.native="queryData(pageInfo.classId, pageInfo.tagId, pageInfo.status)">
                <i slot="suffix" class="el-input__icon el-icon-search"
                   @click="queryData(pageInfo.classId, pageInfo.tagId, pageInfo.status)" style="cursor: pointer"></i>
            </el-input>


            <el-select v-model="pageInfo.classId" placeholder="活动分类" @change="classChange" clearable>
                <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :label="item.tagName"
                    :value="item.id">
                </el-option>
            </el-select>

            <el-select v-model="pageInfo.tagId" placeholder="活动状态" @change="tagChange" clearable>
                <el-option
                    v-for="item in tagList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <el-select v-model="pageInfo.status" placeholder="报名状态" @change="statusChange" clearable>
                <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading"
                  element-loading-text="拼命加载中">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <span class="item-icon"><i class="el-icon-view"></i>{{scope.row.actReadNum}}</span>
                </template>
            </el-table-column>
            <el-table-column label="封面图（查看大图）" min-width="120">
                <template slot-scope="scope">
                    <el-image class="table-td-thumb" :src="imgUrl + scope.row.activityPoster" :preview-src-list="[imgUrl + scope.row.activityPoster]"></el-image>
<!--                    <el-avatar shape="square" fit="cover" :size="60" :src="imgUrl + scope.row.activityPoster"></el-avatar>-->

                    <!--<el-image style="width: 108px; height: 72px" :src="imgUrl + scope.row.activityPoster"></el-image>-->
                </template>
            </el-table-column>
            <el-table-column label="标题" min-width="150" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="spanHover">{{scope.row.activityTitle}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="actTheme" label="活动分类" min-width="100"></el-table-column>
            <el-table-column prop="actTheme" label="活动状态" min-width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.actStauts == 0">未开始</span>
                    <span v-if="scope.row.actStauts == 1">进行中</span>
                    <span v-if="scope.row.actStauts == 2">已结束</span>
                </template>
            </el-table-column>
            <el-table-column prop="actTheme" label="报名状态" min-width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.actApplyStauts == 0">未开始</span>
                    <span v-if="scope.row.actApplyStauts == 1">已开始</span>
                    <span v-if="scope.row.actApplyStauts == 2">已关闭</span>
                </template>
            </el-table-column>
            <el-table-column prop="publishUser" label="发布者" min-width="100"></el-table-column>
            <el-table-column label="发布时间" min-width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.publishTime | stampFormate4}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="240" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click="editText(scope.row.id)">编辑</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click="editText(scope.row.id)" v-if="scope.row.sortNumber > 0">取消置顶</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click="editText(scope.row.id)" v-if="scope.row.sortNumber <= 0">置顶</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" size="small" @click="editText(scope.row.id)" v-if="scope.row.isClose === 0">关闭</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click="editText(scope.row.id)" v-if="scope.row.isClose === 1">开启</el-button>
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
                imgUrl: process.env.IMG_URL,
                pageInfo: {
                    query: '',
                    classId: '',
                    tagId: '',
                    status: ''
                },
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                classList: [],
                tagList: [{
                    label: '未开始',
                    value: '0'
                },{
                    label: '进行中',
                    value: '1'
                },{
                    label: '已结束',
                    value: '2'
                }],
                statusList: [{
                    label: '未开始',
                    value: '0'
                },{
                    label: '已开始',
                    value: '1'
                },{
                    label: '已关闭',
                    value: '2'
                }],
                tableData: [],
                tableLoading: false
            }
        },
        mounted () {
            this.queryData(this.pageInfo.classId, this.pageInfo.tagId, this.pageInfo.status)
            this.getArticlesType();
        },
        methods: {
            queryData(classId, actStauts, actApplyStauts) {
                let that = this;
                that.tableLoading = true;
                loginService.getActivities({
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                    query: that.pageInfo.query,
                    actStauts: actStauts,
                    classId: classId,
                    actApplyStauts: actApplyStauts,
                    all: true
                }).then(res => {
                    if(res.data.code == 200) {
                        let result = res.data.datas
                        that.tableData = result.datas
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
            // 获取活动分类
            getArticlesType() {
                let that = this;
              loginService.getArticlesType({
                  type: 4
              }).then(res => {
                  if(res.data.success) {
                      let result = res.data.datas;
                      that.classList = result;
                  }
              }).catch(err => {
                  console.log(err)
              })
            },
            //状态切换
            classChange(val) {
                this.queryData(val, this.pageInfo.tagId, this.pageInfo.status)
            },
            tagChange(val) {
                this.queryData(this.pageInfo.classId, val, this.pageInfo.status)
            },
            statusChange(val) {
                this.queryData(this.pageInfo.classId, this.pageInfo.tagId, val)
            },

            // 编辑
            editText(id) {
                console.log(id)
            },

            // 分页
            handleSizeChange (val) {
                this.page.pageSize = val;
                this.queryData(this.pageInfo.classId, this.pageInfo.tagId, this.pageInfo.status)
            },
            handleCurrentChange (val) {
                if (val !== 0) {
                    this.page.pageNum = val;
                    this.queryData(this.pageInfo.classId, this.pageInfo.tagId, this.pageInfo.status)
                }
            },
        }
    }
</script>

<style scoped>

</style>

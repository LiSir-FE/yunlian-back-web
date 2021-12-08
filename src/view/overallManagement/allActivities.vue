<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/allArticles' }">总体管理</el-breadcrumb-item>
                <el-breadcrumb-item>所有活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>



        <el-tabs v-model="activityName" @tab-click="handleClick">
            <el-tab-pane label="活动管理" name="a"></el-tab-pane>
            <el-tab-pane label="活动用户" name="b"></el-tab-pane>
        </el-tabs>


        <el-form ref="pageInfo" :model="pageInfo" label-width="80px">
            <el-input v-model="pageInfo.query" placeholder="搜索" class="wetuc-input3-col3"
                      @keyup.enter.native="queryData(pageInfo.classId, pageInfo.tagId, pageInfo.status)">
                <i slot="suffix" class="el-input__icon el-icon-search"
                   @click="queryData(pageInfo.classId, pageInfo.tagId, pageInfo.status)" style="cursor: pointer"></i>
            </el-input>


            <el-select v-model="pageInfo.classId" placeholder="活动分类" @change="classChange" clearable v-if="activityName === 'a'">
                <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :label="item.tagName"
                    :value="item.id">
                </el-option>
            </el-select>

            <el-select v-model="pageInfo.tagId" placeholder="活动状态" @change="tagChange" clearable v-if="activityName === 'a'">
                <el-option
                    v-for="item in tagList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <el-select v-model="pageInfo.status" placeholder="报名状态" @change="statusChange" clearable v-if="activityName === 'a'">
                <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <el-select v-model="pageInfo.activity" placeholder="选择活动" class="wetuc-input-col3" @change="statusChange" clearable v-if="activityName === 'b'">
                <el-option
                    v-for="item in activityList"
                    :key="item.id"
                    :label="item.activityTitle"
                    :value="item.id">
                </el-option>
            </el-select>


            <el-button type="primary" v-if="pageInfo.activity && !contractFlag" @click.prevent="generateContract">生成合同</el-button>
            <el-button type="primary"  v-if="!pageInfo.activity && contractFlag" :disabled="contractFlag">已生成合同</el-button>

        </el-form>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading"
                  element-loading-text="拼命加载中">
            <el-table-column :key="Math.random()" type="expand" v-if="activityName === 'a'">
                <template slot-scope="scope">
                    <span class="item-icon"><i class="el-icon-view"></i>{{scope.row.actReadNum}}</span>
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" label="封面图（查看大图）" min-width="120" v-if="activityName === 'a'">
                <template slot-scope="scope">
                    <el-image class="table-td-thumb" :src="imgUrl + scope.row.activityPoster" :preview-src-list="[imgUrl + scope.row.activityPoster]"></el-image>
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" label="标题" min-width="150" show-overflow-tooltip v-if="activityName === 'a'">
                <template slot-scope="scope">
                    <span class="spanHover">{{scope.row.activityTitle}}</span>
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="actTheme" label="活动分类" show-overflow-tooltip min-width="100" v-if="activityName === 'a'"></el-table-column>
            <el-table-column :key="Math.random()" prop="actTheme" label="活动状态" show-overflow-tooltip min-width="100" v-if="activityName === 'a'">
                <template slot-scope="scope">
                    <span v-if="scope.row.actStauts == 0">未开始</span>
                    <span v-if="scope.row.actStauts == 1">进行中</span>
                    <span v-if="scope.row.actStauts == 2">已结束</span>
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="actTheme" label="报名状态" show-overflow-tooltip min-width="100" v-if="activityName === 'a'">
                <template slot-scope="scope">
                    <span v-if="scope.row.actApplyStauts == 0">未开始</span>
                    <span v-if="scope.row.actApplyStauts == 1">已开始</span>
                    <span v-if="scope.row.actApplyStauts == 2">已关闭</span>
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="publishUser" label="发布者" show-overflow-tooltip min-width="100" v-if="activityName === 'a'"></el-table-column>
            <el-table-column :key="Math.random()" label="发布时间" min-width="150" show-overflow-tooltip v-if="activityName === 'a'">
                <template slot-scope="scope">
                    <span>{{scope.row.publishTime | stampFormate4}}</span>
                </template>
            </el-table-column>

            <el-table-column :key="Math.random()" label="姓名" prop="name" show-overflow-tooltip min-width="100" v-if="activityName === 'b'"></el-table-column>
            <el-table-column :key="Math.random()" label="公司" prop="companyName" show-overflow-tooltip min-width="100" v-if="activityName === 'b'"></el-table-column>
            <el-table-column :key="Math.random()" label="活动名称" prop="activityTitle" show-overflow-tooltip min-width="150" v-if="activityName === 'b'"></el-table-column>
            <el-table-column :key="Math.random()" label="业务员" prop="hostName" show-overflow-tooltip min-width="100" v-if="activityName === 'b'"></el-table-column>
            <el-table-column :key="Math.random()" label="票务名称" prop="ticketName" show-overflow-tooltip min-width="100" v-if="activityName === 'b'"></el-table-column>
            <el-table-column :key="Math.random()" label="票种价格(元)" prop="title" show-overflow-tooltip min-width="100" v-if="activityName === 'b'">
                <template slot-scope="scope">
                    {{scope.row.price | moneyFormate}}
                </template>
            </el-table-column>



            <el-table-column label="操作" min-width="240" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click="userDetails(scope.row)" v-if="activityName === 'b'">详情</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click="editText(scope.row)" v-if="activityName === 'a'">编辑</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click="cancelTopRow(scope.row)" v-if="scope.row.sortNumber > 0 && activityName === 'a'">取消置顶</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click="toppingFn(scope.row)" v-if="scope.row.sortNumber <= 0 && activityName === 'a'">置顶</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" size="small" @click="closeFn(scope.row)" v-if="scope.row.isClose === 0 && activityName === 'a'">关闭</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click="openFn(scope.row)" v-if="scope.row.isClose === 1 && activityName === 'a'">开启</el-button>
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
                activityName: 'a',
                contractFlag: false,
                pageInfo: {
                    query: '',
                    classId: '',
                    tagId: '',
                    status: '',
                    activity: ''
                },
                activityList: [],
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
            this.getList();
        },
        methods: {
            queryData(classId, actStauts, actApplyStauts) {
                let that = this;
                that.tableLoading = true;
                if(that.activityName === 'a') {
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
                } else if(that.activityName === 'b') {
                    loginService.getActusersList({
                        pageNo: that.page.pageNum,
                        pageSize: that.page.pageSize,
                        param: that.pageInfo.query,
                        actId: that.pageInfo.activity,
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
                }

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
            editText(row) {
                this.$router.push({path: `editAllActivities`, query: { id: row.id }});
            },
            // 置顶
            toppingFn(row) {
                let that = this
                that.$prompt('序号越小排名越靠前，最多排序20个', '排序号', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputType: 'Number',
                    inputErrorMessage: '序号不能为空'
                }).then(({ value }) => {
                    loginService.stickActivity({
                        actId: row.id,
                        sortNumber: value
                    }).then(function (res) {
                        if(res.data.success){
                            setTimeout(() =>{
                                that.queryData(that.pageInfo.classId, that.pageInfo.tagId, that.pageInfo.status)
                            }, 300)
                        }else{
                            that.$message.error(res.data.message);
                        }
                    }).catch(function (err) {
                        that.$router.push({name: 'error'});
                    });
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '取消置顶'
                    });
                });
            },
            // 取消置顶
            cancelTopRow(row) {
                let that = this;
                loginService.distickActivity({actId: row.id}).then(function (res) {
                    if (res.data.success) {
                        that.queryData(that.pageInfo.classId, that.pageInfo.tagId, that.pageInfo.status)
                    } else {
                        that.$message.error(res.data.message);
                    }
                }).catch(function (err) {
                    that.$router.push({name: 'error'});
                });
            },
            // 关闭
            closeFn(row) {
                let that = this
                that.$prompt('请输入关闭的原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '关闭原因不能为空'
                }).then(({ value }) => {
                    loginService.openCloseActivity({
                        articleId: row.id,
                        close: 1,
                        reason: value
                    }).then(function (res) {
                        if(res.data.success){
                            setTimeout(() =>{
                                that.queryData(that.pageInfo.classId, that.pageInfo.tagId, that.pageInfo.status)
                            }, 300)
                        }else{
                            that.$message.error(res.data.message);
                        }
                    }).catch(function (err) {
                        that.$router.push({name: 'error'});
                    });
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            // 开启
            openFn(row) {
                let that = this
                that.$confirm('确认开启该活动吗？', '开启', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    loginService.openCloseActivity({
                        articleId: row.id,
                        close: 0
                    }).then(function (res) {
                        if (res.data.success) {
                            setTimeout(() =>{
                                that.queryData(that.pageInfo.classId, that.pageInfo.tagId, that.pageInfo.status)
                            }, 300)
                        } else {
                            that.$message.error(res.data.message);
                        }
                    }).catch(function (err) {
                        that.$router.push({path: 'error'});
                    });
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消开启'
                    })
                })
            },
            handleClick(tab) {
                this.type = null;
                if(tab.name === 'a') {
                    this.queryData(this.pageInfo.classId, this.pageInfo.tagId, this.pageInfo.status)
                } else {
                    this.queryData(this.pageInfo.classId, this.pageInfo.tagId, this.pageInfo.status)
                }
            },
            // 活动列表
            getList() {
                let that = this;
                that.tableData = [];
                loginService.getActivities({
                    pageNo: 1,
                    pageSize: 7,
                    query: '',
                    actStauts: '',
                    classId: '',
                    actApplyStauts: '',
                    all: true
                }).then(function (res) {
                    if (res.data.success) {
                         that.activityList = res.data.datas.datas;
                    } else {
                        that.$message.error(res.data.message);
                    }
                }).catch(function (err) { // 捕获异常
                    that.$router.push({name: 'error'});
                });
            },
            generateContract() {
                let that = this;
                that.$confirm('系统将自动生成合同并派发到相关业务员账号中, 是否确定?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    loginService.postActuser2contracts({
                        actId: that.pageInfo.activity
                    }).then(function(res){
                        if(res.data.success) {
                            that.$message({
                                type: 'success',
                                message: '生成合同成功!'
                            });
                            that.contractFlag = true;
                            setTimeout(() => {
                                that.getList(that.pageInfo.activity); // 列表
                            }, 200);
                        } else {
                            that.$message({
                                type: 'info',
                                message: res.data.message
                            });
                        }
                    }).catch(function(err){
                        console.log(err);
                    })
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消!'
                    });
                });
            },
            userDetails(row) {
                console.log(row);
                this.$store.commit('setAddCompanyUrl', '/allActivities');
                this.$store.commit('setAddCompanyName', '活动用户');
                this.$router.push({
                    path: `/userDetails`,
                    query: { id: row.userId }
                });
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

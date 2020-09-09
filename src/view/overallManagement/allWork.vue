<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/allArticles' }">总体管理</el-breadcrumb-item>
                <el-breadcrumb-item>所有工作</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" label-width="10px" @submit.native.prevent :inline="true">

            <el-input v-model="pageInfo.titleName" @keyup.enter.native="screen" placeholder="请输入关键字搜索" class="wetuc-input3-col3"></el-input>

            <el-select v-model="pageInfo.type" placeholder="请选择分类" class="wetuc-input3-col3" clearable>
                <el-option
                    v-for="item in typeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>


            <el-select v-model="pageInfo.value" placeholder="请选择价值" class="wetuc-input3-col3" clearable>
                <el-option
                    v-for="item in valueOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <el-button type="primary" @click="screen">筛 选</el-button>
        </el-form>
        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="name" label="用户姓名" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="type" label="分类" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.type | type}}
                </template>
            </el-table-column>
            <el-table-column prop="communicateMethod" label="沟通方式" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.communicateMethod | communicateMethod}}
                </template>
            </el-table-column>
            <el-table-column prop="scene" label="场景" min-width="60" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.scene | scene}}
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="admin.hostName" label="记录人" min-width="65" show-overflow-tooltip></el-table-column>
            <el-table-column prop="value" label="价值" min-width="60">
                <template slot-scope="scope">
                    {{scope.row.value | value}}
                </template>
            </el-table-column>
            <el-table-column prop="visitTime" label="时间" min-width="80">
                <template slot-scope="scope">
                    <p v-if="scope.row.visitTime">{{scope.row.visitTime | stampFormate4}}</p>
                    <p v-else></p>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="60" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click.prevent="details(scope.row)">
                        详情
                    </el-button>
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
    import {type, communicateMethod, scene, value} from '../../filter/companyList'
    import {stampFormate4} from '../../filter/index'

    export default {
        data () {
            return {
                statistics: {},
                tableLoading: false,
                pageInfo: {
                    titleName: '',
                    name: '',
                    type: '',
                    value: ''
                },
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                typeOption: [{
                    value: 1,
                    label: '信息沟通'
                }, {
                    value: 2,
                    label: '商务合作'
                }, {
                    value: 3,
                    label: '资源对接'
                }, {
                    value: 4,
                    label: '采访报道'
                }, {
                    value: 5,
                    label: '培训咨询'
                }],
                valueOption: [{
                    value: 1,
                    label: '精华'
                },{
                    value: 2,
                    label: '高'
                },{
                    value: 3,
                    label: '中'
                },{
                    value: 4,
                    label: '低'
                }],
                tableData: []
            }
        },
        filters: {
            type,
            communicateMethod,
            scene,
            value
        },
        mounted () {
            this.getAdminInfo();
            this.getWorkStatistics();
        },
        methods: {
            // 获取管理员身份
            getAdminInfo() {
                let that = this;
                that.tableLoading = true;
                loginService.getWorkListAll({
                    param: that.pageInfo.titleName,
                    type: that.pageInfo.type,
                    value: that.pageInfo.value,
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize
                }).then(res => {
                    if (res.data.code == 200) {
                        let result = res.data.datas;
                        if (result.datas) {
                            result.datas.forEach(item => {
                                item.name = item.user.name
                            })
                        }
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
            // 筛选
            screen() {
                this.page.pageNo = 1;
                this.getAdminInfo();
            },
            // 获取统计
            getWorkStatistics() {
                loginService.getWorkStatistics({
                }).then(res => {
                    if(res.data.success) {
                        this.statistics = res.data.datas;
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            // 添加工作
            // addWork() {
            //     this.$router.push({name: 'addWork'})
            // },
            // // 添加用户
            // addUser() {
            //     this.$router.push({name: 'addRoleUser'})
            // },
            // // 编辑-修改
            // modify(scope) {
            //     this.$router.push({name: 'editWork', query: {id: scope._id}})
            // },
            // // 查看详情
            // details(scope) {
            //     this.$router.push({name: 'detailsWork', query: {flag: this.flag, id: scope._id}})
            // },
            // // 我的用户列表{
            // myUserListFn() {
            //     this.$router.push({name: 'users', query: {id: this.id}})
            // },
            // 分页
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getAdminInfo();
            },
            handleCurrentChange(val) {
                this.page.pageNo = val;
                this.getAdminInfo();
            }
        }
    }
</script>

<style scoped>

</style>

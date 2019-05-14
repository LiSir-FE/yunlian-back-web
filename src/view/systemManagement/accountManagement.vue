<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/roleManagement' }">系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>账号管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
            <el-tabs v-model="accountNum" @tab-click="handleClick">
                <el-tab-pane label="账号列表" name="accountList">
                    <el-form ref="accListInfo" :inline="true" :model="accListInfo" label-width="10px">
                        <el-form-item>
                            <el-input v-model="accListInfo.accName" placeholder="搜索账号/名称" class="wetuc-input3-col3"
                                      @keyup.enter.native="queryAccListData(accListInfo.seleList)">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="queryAccListData(accListInfo.seleList)" style="cursor: pointer"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="accListInfo.seleList" placeholder="选择列表" class="wetuc-input3-col3"
                                       @change="seleListChange(accListInfo.seleList)">
                                <el-option
                                    v-for="item in accOptionsList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="accListInfo.seleList === ''">
                            <el-select v-model="accListInfo.seleAll" placeholder="全部"
                                       @change="seleAllChange(accListInfo.seleAll)">
                                <el-option
                                    v-for="item in seleAllOptionsList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary">新建账号</el-button>
                        </el-form-item>
                    </el-form>

                    <el-table
                        :data="accListData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
                        <el-table-column prop="account" label="账号" min-width="100"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column prop="hostCompany" label="名称" min-width="100"
                                         show-overflow-tooltip></el-table-column>
                        <el-table-column prop="rolesName" label="角色名称" min-width="100" show-overflow-tooltip
                                         v-if="accListInfo.seleList === ''"></el-table-column>
                        <el-table-column label="状态" min-width="100" show-overflow-tooltip
                                         v-if="accListInfo.seleList === ''">
                            <template slot-scope="scope">
                                <p v-if="scope.row.accountStatus === 'enabled'">开启</p>
                                <p v-if="scope.row.accountStatus !== 'enabled'">禁用</p>
                            </template>
                        </el-table-column>
                        <el-table-column prop="hostName" label="联系人" min-width="100" show-overflow-tooltip
                                         v-if="accListInfo.seleList === '4'"></el-table-column>
                        <el-table-column prop="hostPhone" label="联系手机" min-width="100" show-overflow-tooltip
                                         v-if="accListInfo.seleList === '4'"></el-table-column>
                        <el-table-column prop="createTime" label="客户数" min-width="100" show-overflow-tooltip
                                         v-if="accListInfo.seleList === '4'"></el-table-column>
                        <el-table-column prop="distributioinNum" label="分销数" min-width="100" show-overflow-tooltip
                                         v-if="accListInfo.seleList === '4'"></el-table-column>
                        <el-table-column label="粉丝数" min-width="100" show-overflow-tooltip
                                         v-if="accListInfo.seleList === '2' || accListInfo.seleList === '3'">
                            <template slot-scope="scope">
                                <span>{{scope.row.subNum}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="addActivityNum" label="活动数" min-width="100" show-overflow-tooltip
                                         v-if="accListInfo.seleList === '2' || accListInfo.seleList === '3'"></el-table-column>
                        <el-table-column label="创建时间" min-width="100" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" min-width="120" align="right">
                            <template slot-scope="scope">
                                <el-button type="text" size="small">编辑</el-button>
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
                </el-tab-pane>
                <el-tab-pane label="账号审核" name="examine">账号审核</el-tab-pane>
                <el-tab-pane label="认证审核" name="authentication">认证审核</el-tab-pane>
            </el-tabs>
        </div>
    </div>

</template>

<script>
    import {loginService} from '../../service/loginService'

    export default {
        data () {
            return {
                accountNum: 'accountList',
                accListInfo: {
                    accName: '',
                    seleList: '',
                    seleAll: ''
                },
                accOptionsList: [{
                    label: '主办方',
                    value: '2'
                }, {
                    label: '作者',
                    value: '3'
                }, {
                    label: '销售',
                    value: '4'
                }, {
                    label: '账号列表',
                    value: ''
                }],
                accListData: [],
                tableLoading: false,
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                seleAllOptionsList: []
            }
        },
        mounted () {
            this.queryAccListData(this.accListInfo.seleList)
            this.getseleAll()
        },
        methods: {
            queryAccListData (type) {
                let that = this
                that.tableLoading = true
                loginService.getAccounts({
                    query: that.accListInfo.accName,
                    type: type,
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize
                }).then(res => {
                    if (res.data.success) {
                        let result = res.data.datas
                        that.accListData = result.datas
                        that.page.total = Number(result.totalCount)
                    }
                    that.tableLoading = false
                }).catch(err => {
                    console.log(err)
                })
            },
            seleListChange (val) {
                this.queryAccListData(val)
            },
            // 获取全部sele下拉内容
            getseleAll () {
                let that = this
                loginService.getRoles({
                    view: true
                }).then(res => {
                    if (res.data.success) {
                        console.log(res)
                        let result = res.data.datas
                        that.seleAllOptionsList = result
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            seleAllChange (val) {
                this.queryAccListData(val)
            },
            handleClick (tab, event) {
                console.log(tab, event)
            },
            // 分页
            handleSizeChange (val) {
                this.page.pageSize = val
                this.queryAccListData(this.accListInfo.seleList)
            },
            handleCurrentChange (val) {
                if (val !== 0) {
                    this.page.pageNum = val
                    this.queryAccListData(this.accListInfo.seleList)
                }
            }
        }
    }
</script>

<style scoped>

</style>

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

                        <el-input v-model="accListInfo.accName" placeholder="搜索账号/名称" class="wetuc-input3-col3"
                                  @keyup.enter.native="queryAccListData(accListInfo.seleList)">
                            <i slot="suffix" class="el-input__icon el-icon-search"
                               @click="queryAccListData(accListInfo.seleList)" style="cursor: pointer"></i>
                        </el-input>

                        <el-select v-model="accListInfo.seleList" placeholder="选择列表" class="wetuc-input3-col3"
                                   @change="seleListChange(accListInfo.seleList)">
                            <el-option
                                v-for="item in accOptionsList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>

                        <el-select v-if="accListInfo.seleList === ''" v-model="accListInfo.seleAll" placeholder="全部"
                                   @change="seleAllChange(accListInfo.seleAll)" class="wetuc-input3-col3">
                            <el-option
                                v-for="item in seleAllOptionsList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                            </el-option>
                        </el-select>

                        <el-form-item>
                            <el-button type="primary" @click="addAccDialoadBtnFn(addAccDialogId)">新建账号</el-button>
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
                                <span>{{scope.row.createTime | stampFormate}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" min-width="120" align="right">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" v-if="accListInfo.seleList === '4'">详情</el-button>
                                <el-button type="text" size="small" @click="getAccountsid(scope.row.id)" v-if="accListInfo.seleList !== '4'">编辑</el-button>
                                <el-button type="text" size="small" @click="deleteAccounts(scope.row.id)" v-if="accListInfo.seleList !== '4'">删除</el-button>
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
                <el-tab-pane label="账号审核" name="examine">
                    <to-examine :queryPlaceHolder="accountPlaceHolder" :accounType="accountNum" v-if="accountNum === 'examine'"></to-examine>
                </el-tab-pane>
                <el-tab-pane label="认证审核" name="authentication">
                    <to-examine :queryPlaceHolder="authenPlaceHolder" :accounType="accountNum" v-if="accountNum === 'authentication'"></to-examine>
                </el-tab-pane>
            </el-tabs>
        </div>


        <el-dialog title="新建账号" :visible.sync="addAccDiaload" width="35%" min-width="35%" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="addAccDialoadCloseFn">
            <el-form ref="addAccDialogInfo" :model="addAccDialogInfo" label-width="100px" :rules="addAccDialogRules">
                <el-form-item label="选择角色" prop="roleSele">
                    <el-select v-model="addAccDialogInfo.roleSele" placeholder="请选择角色" multiple :multiple-limit="5"
                               style="width: 100%">
                        <el-option
                            v-for="item in roleSeleList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="账号" prop="accountNum">
                    <el-input type="text" v-model="addAccDialogInfo.accountNum" placeholder="请输入账号"
                              class="" :disabled="accountNumFlag"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input type="text" v-model="addAccDialogInfo.name" placeholder="请输入名称"
                              class=""></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="addAccDialogInfo.password" placeholder="请输入密码" show-password
                              class=""></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contacts">
                    <el-input type="text" v-model="addAccDialogInfo.contacts" placeholder="请输入联系人"
                              class=""></el-input>
                </el-form-item>
                <el-form-item label="联系人手机号" prop="contactsPhone">
                    <el-input type="text" v-model="addAccDialogInfo.contactsPhone" placeholder="请输入联系人手机号"
                              class=""></el-input>
                </el-form-item>
                <el-form-item label="是否启用">
                    <el-switch v-model="addAccDialogInfo.enabled" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="设置启用时间段" prop="time" v-if="addAccDialogInfo.enabled">
                    <el-date-picker
                        style="width: 100%"
                        v-model="addAccDialogInfo.time"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd"
                        value-format="timestamp"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addAccDiaload = false">取 消</el-button>
                <el-button type="primary" @click="addAccDialogFn('addAccDialogInfo', addAccDialogId)">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
    import {loginService} from '../../service/loginService'
    import {stampFormate} from '../../filter/index'
    import toExamine from '../../components/toExamine'

    export default {
        data () {
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入账号!'))
                } else {
                    if (!this.addAccDialogId) {
                        loginService.getAccountsvalite({account: value}).then(function (res) {
                            if (res.data.datas === false) {
                                callback(new Error('该账号已存在，不能重复创建!'))
                            } else {
                                callback()
                            }
                        })
                    } else {
                        callback()
                    }
                }
            }
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
                seleAllOptionsList: [],
                addAccDiaload: false,
                addAccDialogInfo: {
                    roleSele: '',
                    accountNum: '',
                    name: '',
                    password: '',
                    contacts: '',
                    contactsPhone: '',
                    enabled: true,
                    time: []
                },
                addAccDialogId: '',
                accountNumFlag: false,
                roleSeleList: [],
                addAccDialogRules: {
                    accountNum: [{required: true, message: '请输入账号', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}],
                    name: [{required: true, message: '请输入名称!', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码!', trigger: 'blur'}],
                    contacts: [{required: true, message: '请输入联系人!', trigger: 'blur'}],
                    contactsPhone: [{required: true, message: '请输入联系人手机号!', trigger: 'blur'},
                        {pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码'}],
                },

                accountPlaceHolder: '可输入账号/名称/联系人',
                authenPlaceHolder: '可输入账号/名称',

                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近一个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                            picker.$emit('pick', [start, end])
                        }
                    }, {
                        text: '最近三个月',
                        onClick (picker) {
                            const end = new Date()
                            const start = new Date()
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                            picker.$emit('pick', [start, end])
                        }
                    }]
                }
            }
        },
        components: {
            toExamine
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
                        let result = res.data.datas
                        that.seleAllOptionsList = result
                        that.roleSeleList = result
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            seleAllChange (val) {
                this.queryAccListData(val)
            },
            // 新增按钮
            addAccDialoadBtnFn (id) {
                let that = this
                that.accountNumFlag = false;
                that.addAccDiaload = true;
                that.addAccDialogInfo = {
                    roleSele: '',
                    accountNum: '',
                    name: '',
                    password: '',
                    contacts: '',
                    contactsPhone: '',
                    enabled: true,
                    time: []
                }
            },
            // 关闭按钮
            addAccDialoadCloseFn() {
                this.addAccDialogId = '';
            },
            // 新增账号
            addAccDialogFn (formName, addAccDialogId) {
                let that = this
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        // 编辑单个
                        if (addAccDialogId) {
                            loginService.putAccounts({
                                id: addAccDialogId,
                                roles: that.addAccDialogInfo.roleSele,
                                account: that.addAccDialogInfo.accountNum,
                                hostCompany: that.addAccDialogInfo.contacts,
                                hostPhone: that.addAccDialogInfo.contactsPhone,
                                password: that.addAccDialogInfo.password,
                                hostName: that.addAccDialogInfo.name,
                                startTime: that.addAccDialogInfo.time[0],
                                endTime: that.addAccDialogInfo.time[1],
                                accountStatus: that.addAccDialogInfo.enabled ? 'enabled' : 'disabled',
                                activeTimeStatus: 'timeOff'
                            }).then(res => {
                                if (res.data.success) {
                                    that.$message({
                                        type: 'success',
                                        message: '编辑成功!'
                                    })
                                    that.addAccDiaload = false
                                    that.queryAccListData(that.accListInfo.seleList)
                                }
                            }).catch(err => {
                                console.log(err)
                            })

                        } else {
                            // 新增
                            that.addAccDialogId = ''
                            loginService.postAccounts({
                                roles: that.addAccDialogInfo.roleSele,
                                account: that.addAccDialogInfo.accountNum,
                                hostCompany: that.addAccDialogInfo.contacts,
                                hostPhone: that.addAccDialogInfo.contactsPhone,
                                password: that.addAccDialogInfo.password,
                                hostName: that.addAccDialogInfo.name,
                                startTime: that.addAccDialogInfo.time[0],
                                endTime: that.addAccDialogInfo.time[1],
                                accountStatus: that.addAccDialogInfo.enabled ? 'enabled' : 'disabled',
                                activeTimeStatus: 'timeOff'
                            }).then(res => {
                                if (res.data.success) {
                                    that.$message({
                                        type: 'success',
                                        message: '添加成功!'
                                    })
                                    that.addAccDiaload = false
                                    that.queryAccListData(that.accListInfo.seleList)
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            // 获取单个账户信息
            getAccountsid (id) {
                let that = this
                that.addAccDiaload = true
                that.accountNumFlag = true
                loginService.getAccountsid(id, {}).then(res => {
                    if (res.data.success) {
                        let ruslt = res.data.datas
                        that.addAccDialogId = id
                        that.addAccDialogInfo.name = ruslt.hostName
                        that.addAccDialogInfo.roleSele = ruslt.roles
                        that.addAccDialogInfo.accountNum = ruslt.account
                        that.addAccDialogInfo.contacts = ruslt.hostCompany
                        that.addAccDialogInfo.contactsPhone = ruslt.hostPhone
                        that.addAccDialogInfo.roleSele = ruslt.roles
                        // that.addAccDialogInfo.password = ruslt.password
                        that.addAccDialogInfo.enabled = ruslt.accountStatus === 'enabled' ? true : false
                        that.addAccDialogInfo.time = [ruslt.startTime, ruslt.endTime]
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 删除单个账户信息
            deleteAccounts(id) {
                let that = this;
                that.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    loginService.deleteAccounts({
                        adminId: id
                    }).then(res => {
                        if(res.data.success) {
                            that.$message({type: 'success', message: '删除成功!'});
                            that.queryAccListData(that.accListInfo.seleList)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })

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

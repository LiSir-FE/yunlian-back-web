<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/roleManagement' }">系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-button type="primary" icon="el-icon-user-solid" class="wetuc-return" style="float: right;" @click="addUser">
            新增角色
        </el-button>

        <div>
            <el-table :data="tableData" style="width: 100%" empty-text="暂无数据" v-loading="tableLoading"
                      element-loading-text="拼命加载中">
                <el-table-column prop="name" label="角色名称" min-width="150"></el-table-column>
                <el-table-column prop="permissionNum" label="功能权限数" min-width="180"></el-table-column>
                <el-table-column prop="userNum" label="成员数量" min-width="160"></el-table-column>
                <el-table-column fixed="right" label="操作" min-width="100" align="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editFn(scope.row.id)">编辑</el-button>
                        <el-button type="text" size="small" v-if="scope.row.init !== true"
                                   @click="deleteFn(scope.row.id)">删除
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

        <!--弹框-->
        <el-dialog :title="userTitle" :visible.sync="userDialogVisible" width="50%" v-loading="treeLoading"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="treeOneInfo" :model="treeOneInfo" label-width="80px" :rules="treeOneRules">
                <el-form-item label="角色名称:" prop="userName">
                    <el-input v-model="treeOneInfo.userName" placeholder="请输入角色名称" class="wetuc-input3-col3"></el-input>
                </el-form-item>
                <el-form-item label="角色描述:" prop="userDesc">
                    <el-input v-model="treeOneInfo.userDesc" placeholder="请输入角色名称" class="wetuc-input3-col3"></el-input>
                </el-form-item>

                <el-form-item label="请选择" prop="treeOneData" class="treeStyle">
                    <el-tree
                        :data="treeOneData"
                        show-checkbox
                        ref="treeOne"
                        node-key="id"
                        accordion
                        highlight-current
                        @check-change="getCheckedNodes"
                        :props="defaultProps">
                    </el-tree>
                </el-form-item>


                <el-form-item label="已选择" class="treeStyle">
                    <el-tree
                        :data="treeTwoData"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        ref="treeTwo">
                    </el-tree>
                </el-form-item>
            </el-form>


            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmRules('treeOneInfo', treeId)">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {loginService} from '../../service/loginService'

    export default {
        data () {
            let treeOneData = (rule, value, callback) => {
                let data = this.$refs.treeOne.getCheckedKeys()
                let all = this.$refs.treeOne.getHalfCheckedKeys()
                this.treeOneId = all.concat(data)
                if (this.treeOneId.length === 0) {
                    callback(new Error('请选择!'))
                } else {
                    callback()
                }
            }
            return {
                tableData: [],
                tableLoading: true,
                userDialogVisible: false,
                userTitle: '新增角色',
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                treeOneInfo: {
                    userName: '',
                    userDesc: ''
                },
                treeOneData: [],
                treeTwoData: [],
                treeLoading: false,
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                treeOneId: [],
                treeId: '',
                filterText: [],
                treeOneRules: {
                    userName: [{required: true, message: '请输入角色名称！', trigger: 'blur'}],
                    userDesc: [{required: true, message: '请输入角色描述！', trigger: 'blur'}],
                    treeOneData: [{type: 'array', required: true, validator: treeOneData, trigger: 'change, blur'}]
                }
            }
        },
        mounted () {
            this.queryData()
        },
        watch: {
            'filterText': {
                handler: function (val) {
                    this.$refs.treeTwo.filter(val)
                },
                deep: true
            }
        },
        methods: {
            // 获取列表
            queryData () {
                let that = this
                loginService.getRoles({
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize
                }).then(res => {
                    if (res.data.success) {
                        let result = res.data.datas
                        that.tableData = result.datas
                        that.page.total = Number(result.totalCount)
                    } else {
                        that.$message.error(res.data.message)
                    }
                    that.tableLoading = false
                }).catch(err => {
                    console.log(err)
                })
            },
            // 新增角色
            addUser () {
                let that = this
                that.userDialogVisible = true
                that.getPermissions()
                setTimeout(function () {
                    that.filterText = []
                }, 500)
            },
            // 获取树
            getPermissions () {
                let that = this
                that.treeLoading = true
                loginService.getPermissions().then(function (res) {
                    if (res.data.code === 200) {
                        that.treeOneData = res.data.datas
                        that.treeTwoData = that.treeOneData
                    }
                    setTimeout(function () {
                        that.treeLoading = false
                    }, 300)
                }).catch(err => {
                    console.log(err)
                })
            },
            getCheckedNodes (data) {
                let that = this
                that.treeOneData.push(data)
                let key = that.$refs.treeOne.getCheckedKeys(true)
                that.filterText = key
            },
            filterNode (value, data) {
                if (!value) return true
                return this.filterText.indexOf(data.id) !== -1
            },
            // 确定
            confirmRules (formName, id) {
                let that = this
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(!id) {
                            loginService.postRoles({
                                id: id,
                                desc: that.treeOneInfo.userDesc,
                                name: that.treeOneInfo.userName,
                                permIds: that.treeOneId,
                            }).then(res => {
                                if (res.data.success) {
                                    that.$message({
                                        type: 'success',
                                        message: '添加成功!'
                                    })
                                    that.userDialogVisible = false
                                    that.queryData()
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        } else {
                            loginService.postRoles({
                                id: id,
                                desc: that.treeOneInfo.userDesc,
                                name: that.treeOneInfo.userName,
                                permIds: that.treeOneId,
                            }).then(res => {
                                if (res.data.success) {
                                    that.$message({
                                        type: 'success',
                                        message: '编辑成功!'
                                    })
                                    that.userDialogVisible = false
                                    that.queryData()
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
            // 删除
            deleteFn (id) {
                let that = this
                that.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.deleteRoles(id)
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            deleteRoles (id) {
                let that = this
                loginService.deleteRoles({roleId: id}).then(function (res) {
                    if (res.data.success) {
                        that.$message({type: 'success', message: '删除成功!'})
                        that.queryData()
                    }
                })
            },
            // 编辑
            editFn (id) {
                let that = this;
                loginService.getRolesid(id).then(function (res) {
                    if (res.data.success) {
                        let ruslt = res.data.datas;
                        that.treeId = ruslt.role.id;
                        that.treeOneInfo.userName = ruslt.role.name;
                        that.treeOneInfo.userDesc = ruslt.role.desc;
                        that.addUser();
                        setTimeout(function () {
                            that.$refs.treeOne.setCheckedKeys(ruslt.perms);
                        }, 700)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 分页
            handleSizeChange (val) {
                this.page.pageSize = val
                this.queryData()
            },
            handleCurrentChange (val) {
                if (val !== 0) {
                    this.page.pageNum = val
                    this.queryData()
                }
            }
        }
    }
</script>

<style scoped>
    .el-checkbox:last-of-type{
        margin-right: 8px !important;
    }
    .treeStyle {
        width: 49%;
        display: inline-grid;
    }
</style>

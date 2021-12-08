<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/userManagement' }">用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>全部用户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px">
            <el-form-item>
                <el-input v-model="pageInfo.search" placeholder="搜索账号/名称" class="wetuc-input3-col3"
                          @keyup.enter.native="queryData(pageInfo.search)">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                       @click="queryData(pageInfo.search)" style="cursor: pointer"></i>
                </el-input>

                <el-select v-model="pageInfo.allUsers" placeholder="请选择用户" class="wetuc-input3-col3" @change="allUsersChange">
                    <el-option
                        v-for="item in allUsersList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userNum }}</span>
                    </el-option>
                </el-select>

                <el-select v-model="pageInfo.moveAllUsers" placeholder="移动到分组" class="wetuc-input3-col3" :clearable="true" @change="moveAllUsersChange">
                    <el-option
                        v-for="item in moveAllUsersList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="deleteGroup()" v-if="pageInfo.allUsers !== '1'">删除分组</el-button>
                <el-button type="primary" @click="addGroup('edit')" v-if="pageInfo.allUsers !== '1'">分组重命名</el-button>
                <el-button type="primary" @click="removeGroup()">移除分组</el-button>
                <el-button type="primary" @click="addGroup('add')">添加分组</el-button>
                <el-button type="primary" @click="exportUser()">导出用户</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column type="selection" min-width="55"></el-table-column>
            <el-table-column label="头像（查看大图）" min-width="120">
                <template slot-scope="scope">
                    <div class="tableImg">
                        <el-image class="table-td-thumb" :src="imgUrl + scope.row.headImg" :preview-src-list="[imgUrl + scope.row.headImg]"></el-image>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="联系方式" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="intJob" label="职位" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span> {{scope.row.intJob | intJob}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="添加时间" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span> {{scope.row.createTime | stampFormate4}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="80" align="right" v-if="roles">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click="userDetails(scope.row)">查看</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click="giftMember(scope.row)">编辑</el-button>
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



        <el-dialog :title="loadInfo.logTitle" :visible.sync="dialoadFlag" width="35%" min-width="35%" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="addAccDialoadCloseFn">
            <el-form ref="loadInfo" :model="loadInfo" label-width="110px" :rules="loadRules">
                <el-form-item label="请输入分组名称" prop="name">
                    <el-input v-model="loadInfo.name" placeholder="请输入分组名称" class="wetuc-input-col3" maxlength="6"></el-input>
                </el-form-item>
                <el-form-item label="请输入分组排序" prop="input" v-if="loadInfo.type === 'add'">
                    <el-input-number v-model.number="loadInfo.input" :min="1" class="wetuc-input-col3"></el-input-number>
                </el-form-item>
                <span class="message-title" v-if="loadInfo.type === 'add'">数字越小，排序越靠前</span>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialoadFlag = false">取 消</el-button>
                <el-button type="primary" @click="addAccDialogFn('loadInfo', loadInfo.type)">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>

    import {loginService} from "../../service/loginService";
    import {intJob} from '../../filter/companyList'
    export default {
        data() {

            return {
                imgUrl: process.env.IMG_URL,
                roles: this.$route.meta.roles.indexOf('421:query') >= 0,
                pageInfo: {
                    search: '',
                    allUsers: '1',
                    moveAllUsers: '',
                    groupIds: ''
                },
                dialoadFlag: false,
                loadInfo:{
                    name: '',
                    input: '',
                    type: 'add',
                    logTitle: '添加分组'
                },
                id: '',
                allUsersList: [],
                moveAllUsersList: [],
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                multipleSelection: [],
                tableData: [],
                tableLoading: false,
                loadRules: {
                    name: [
                        {required: true, message: '请输入分组名称!', trigger: 'blur'}
                    ]
                }
            }
        },
        filters: {
            intJob
        },
        mounted() {
            this.getAllUsrtList();
        },
        methods: {
            // 获取全部用户下拉列表
            getAllUsrtList() {
                let that = this;
                loginService.getAllUsrtList({}).then(res => {
                    if (res.data.success) {
                        let result = res.data.datas;
                        that.allUsersList = result.groups;
                        that.moveAllUsersList = JSON.parse(JSON.stringify(result.groups)); // 指向result，需要拷贝
                        that.allUsersList.unshift({
                            id: '1',
                            userNum: result.allNum,
                            name: '全部'
                        })
                    }
                    that.queryData();
                }).catch(err => {
                    console.log(err);
                })
            },
            // 获取用户列表
            queryData() {
                let that = this;
                if (!that.id) {
                    that.id = 1;
                }
                that.tableLoading = true;
                loginService.getUserGroupsUser(that.id, {
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                    search: that.pageInfo.search
                }).then(function (res) {
                    if (res.data.success) {
                        let result = res.data.datas
                        that.tableData = result.datas
                        that.page.total = Number(result.totalCount);
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            allUsersChange(item) {
                this.id = item;
                this.queryData()
            },
            userDetails(row) {
                this.$store.commit('setAddCompanyUrl', '/userManagement');
                this.$store.commit('setAddCompanyName', '全部用户');
                this.$router.push({
                    path: `/userDetails`,
                    query: { id: row.id }
                });
            },
            giftMember(row) {
                this.$router.push({
                    path: `/userEdit`,
                    query: { id: row.id }
                });
            },
            moveAllUsersChange(item) {
                if (this.multipleSelection.length >= 1) {
                    let userId = []
                    this.multipleSelection.forEach(item => {
                        userId.push(item.id);
                    })
                    this.pageInfo.groupIds = item.id;
                    loginService.moveGroups({
                        fromGroupId: this.id,
                        groupIds: item,
                        userIds: userId.toString()
                    }).then(res => {
                        if(res.data.success) {
                            this.$message({
                                type: 'success',
                                message: '移动分组成功'
                            });
                        }
                        setTimeout(() => {
                            this.pageInfo.allUsers = '';
                            this.id = '1'
                            this.getAllUsrtList()
                        }, 200)
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    this.$message({
                        message: '请选择用户',
                        type: 'warning'
                    });
                    this.pageInfo.moveAllUsers = ''
                }
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            removeGroup() {
                if (this.multipleSelection.length >= 1) {
                    let userId = []
                    this.multipleSelection.forEach(item => {
                        userId.push(item.id);
                    })
                    loginService.removeGroups({
                        groupId: this.pageInfo.allUsers,
                        userIds: userId.toString()
                    }).then(res => {
                        if(res.data.success) {
                            this.$message({
                                type: 'success',
                                message: '移除分组成功'
                            });
                        }
                        setTimeout(() => {
                            this.id = '1'
                            this.getAllUsrtList()
                        }, 200)
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    this.$message({
                        message: '请选择用户',
                        type: 'warning'
                    });
                }
            },
            deleteGroup() {
                let that = this;
                that.$confirm('此操作将永久删除该分组, 是否继续?', '删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    loginService.delGroups({
                        groupId: that.pageInfo.allUsers
                    }).then(function (res) {
                        that.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        setTimeout(() => {
                            that.pageInfo.allUsers = '1'
                            that.getAllUsrtList()
                        }, 200)
                    })
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addGroup(type) {
                this.dialoadFlag = true;
                this.loadInfo.type = type;
                if(type === 'add') {
                    this.loadInfo.logTitle = '新增分组'
                } else {
                    this.loadInfo.logTitle = '重命名分组'
                }
            },
            exportUser() {
                let that = this;
                if ( this.multipleSelection.length >= 1) {
                    window.location.href = process.env.API_ROOT  + '/export/user?adminId=' + '' + '&userIds=' + that.id + '&groupId=' + that.pageInfo.allUsers
                } else {
                    that.$message({
                        type: 'info',
                        message: '请选择导出用户'
                    });
                    return false;
                }
            },
            addAccDialogFn (formName, type) {
                let that = this
                if(type === 'add') {
                    that.$refs[formName].validate((valid) => {
                        if (valid) {
                            loginService.putGiveVip({
                                name: that.loadInfo.phone,
                                vipItemId: that.loadInfo.vipName
                            }).then(res => {
                                if(res.data.success) {
                                    that.$message({
                                        message: '创建成功',
                                        type: 'success'
                                    });
                                    that.dialoadFlag = false;
                                    that.getAllUsrtList()
                                } else {
                                    that.$message({
                                        message: res.data.datas,
                                        type: 'warning'
                                    });
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                        } else {
                            console.log('error submit!!')
                            return false
                        }
                    })

                } else {
                    that.$refs[formName].validate((valid) => {
                        if (valid) {
                            loginService.editGroups({
                                name: that.loadInfo.name,
                                id: that.pageInfo.allUsers
                            }).then(res => {
                                if(res.data.success) {
                                    that.$message({
                                        message: '组名更改为:' + that.loadInfo.name,
                                        type: 'success'
                                    });
                                    that.dialoadFlag = false;
                                    that.getAllUsrtList()
                                } else {
                                    that.$message({
                                        message: res.data.datas,
                                        type: 'warning'
                                    });
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                        } else {
                            console.log('error submit!!')
                            return false
                        }
                    })
                }
            },
            // 关闭按钮
            addAccDialoadCloseFn () {
                this.loadInfo.name = ''
                this.loadInfo.input = ''
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

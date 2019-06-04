<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/roleManagement' }">系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>分类管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px">
            <el-form-item>
                <el-input v-model="pageInfo.query" placeholder="请输入名称" class="wetuc-input3-col3"
                          @keyup.enter.native="queryData(pageInfo.articleActivity)">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                       @click="queryData(pageInfo.articleActivity)" style="cursor: pointer"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="pageInfo.articleActivity" class="wetuc-input3-col3" @change="articActiFn">
                    <el-option
                        v-for="item in articleActivityList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addText(pageInfo.articleActivity)">添加</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="tagName" label="名称" min-width="80"></el-table-column>
            <el-table-column label="创建时间" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.createDate | stampFormate2}}</span>
                </template>
            </el-table-column>
            <el-table-column label="前台显示" width="80">
                <template slot-scope="scope">
                    <span v-if="scope.row.show">显示</span>
                    <span v-else>不显示</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="80" align="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editText(scope.row.id, pageInfo.articleActivity)">编辑
                    </el-button>
                    <el-button type="text" size="small" @click="deleText(scope.row.id)">删除</el-button>
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


        <el-dialog title="新增" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog title="新增字典" :visible.sync="dialoadFlag" width="35%" min-width="35%" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="addAccDialoadCloseFn">
            <el-form ref="loadInfo" :model="loadInfo" label-width="100px" :rules="loadRules">
                <el-form-item label="请输入名称" prop="name">
                    <el-input v-model="loadInfo.name" placeholder="请输入名称"></el-input>
                </el-form-item>


                <el-form-item label="前台显示">
                    <el-radio v-model="loadInfo.radio" :label="true">显示</el-radio>
                    <el-radio v-model="loadInfo.radio" :label="false">不显示</el-radio>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialoadFlag = false">取 消</el-button>
                <el-button type="primary" @click="addAccDialogFn('loadInfo', loadInfo.id)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {loginService} from '../../service/loginService'
    import {stampFormate} from '../../filter/index'

    export default {
        data () {
            return {
                pageInfo: {
                    query: '',
                    articleActivity: '2'
                },
                dialoadFlag: false,
                loadInfo: {
                    name: '',
                    radio: true
                },
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                tagName: '',
                tableData: [],
                tableLoading: false,
                dialogVisible: false,
                articleActivityList: [{
                    label: '文章分类',
                    value: '2'
                }, {
                    label: '文章关键字',
                    value: '3'
                }, {
                    label: '文章标签',
                    value: '4'
                }, {
                    label: '活动关键词',
                    value: '5'
                }, {
                    label: '活动分类',
                    value: '6'
                }],
                loadRules: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}]
                }
            }
        },
        mounted () {
            this.queryData(this.pageInfo.articleActivity)
        },
        methods: {
            queryData (type) {
                let that = this
                that.tableLoading = true
                loginService.getDictionaryslist({
                    type: type,
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                    tagName: that.pageInfo.query
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
            // 添加
            addText (type) {
                let that = this
                if (type === '2') {
                    that.dialoadFlag = true
                    // that.addTextDiction(that.loadInfo.name, that.loadInfo.radio)
                } else {
                    that.$prompt('请输入名称', '新增字典', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputPattern: /^\S/,
                        inputErrorMessage: '请输入名称!'
                    }).then(({value}) => {
                        that.addTextDiction(value)
                    }).catch(() => {
                        that.$message({
                            type: 'info',
                            message: '取消输入!'
                        })
                    })
                }

            },
            // 新增分类
            addTextDiction (value, type) {
                let that = this
                if (type === '2') {
                    loginService.addTextDiction({
                        type: that.pageInfo.articleActivity,
                        tagName: value,
                        show: that.loadInfo.radio
                    }).then(function (res) {
                        if (res.data.success) {
                            that.$message({type: 'success', message: '新增成功!'});
                            that.dialoadFlag = false;
                            that.queryData(that.pageInfo.articleActivity);
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                } else {
                    loginService.addTextDiction({
                        type: that.pageInfo.articleActivity,
                        tagName: value
                    }).then(function (res) {
                        if (res.data.success) {
                            that.$message({type: 'success', message: '新增成功!'});
                            that.dialoadFlag = false;
                            that.queryData(that.pageInfo.articleActivity);
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }

            },
            // 编辑
            editText (id, type) {
                let that = this
                loginService.getDictionarysid(id).then(res => {
                    if (res.data.success) {
                        if (type === '2') {
                            that.loadInfo.name = res.data.datas.tagName
                            that.loadInfo.radio = res.data.datas.show
                            that.loadInfo.id = res.data.datas.id
                            that.dialoadFlag = true
                        } else {
                            that.tagName = res.data.datas.tagName
                            that.$prompt('请输入名称', '修改字典', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                inputValue: that.tagName,
                                inputPattern: /^\S/,
                                inputErrorMessage: '请输入名称!'
                            }).then(({value}) => {
                                that.editTextDiction(id, value)
                            }).catch(() => {
                                that.$message({
                                    type: 'info',
                                    message: '取消修改!'
                                })
                            })
                        }

                    }
                }).catch(err => {
                    console.log(err)
                })

            },
            // 编辑分类
            editTextDiction (id, value, type) {
                let that = this
                if (type === '2') {
                    loginService.editTextDiction(id, {
                        type: that.pageInfo.articleActivity,
                        tagName: value,
                        show: that.loadInfo.radio
                    }).then(function (res) {
                        if (res.data.success) {
                            that.$message({type: 'success', message: '修改成功!'})
                            that.dialoadFlag = false
                            that.queryData(that.pageInfo.articleActivity)
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                } else {
                    loginService.editTextDiction(id, {
                        type: that.pageInfo.articleActivity,
                        tagName: value
                    }).then(function (res) {
                        if (res.data.success) {
                            that.$message({type: 'success', message: '修改成功!'})
                            that.dialoadFlag = false
                            that.queryData(that.pageInfo.articleActivity)
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }
            },
            // 删除
            deleText (id) {
                let that = this
                that.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    loginService.deleTextDiction(id).then(function (res) {
                        if (res.data.success) {
                            that.$message({type: 'success', message: '删除成功!'})
                            that.queryData(that.pageInfo.articleActivity)
                        } else {
                            that.$message.error(res.data.message)
                        }
                    })
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消删除!'
                    })
                })

            },
            addAccDialogFn (formName, id) {
                let that = this
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (!id) {
                            that.addTextDiction(that.loadInfo.name, that.pageInfo.articleActivity)
                        } else {
                            that.editTextDiction(id, that.loadInfo.name, that.pageInfo.articleActivity)
                        }
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            // 关闭按钮
            addAccDialoadCloseFn () {
                this.loadInfo.id = ''
                this.loadInfo.name = ''
                this.loadInfo.radio = true
            },
            articActiFn (value) {
                this.queryData(value)
            },
            // 分页
            handleSizeChange (val) {
                this.page.pageSize = val
                this.queryData(this.pageInfo.articleActivity)
            },
            handleCurrentChange (val) {
                if (val !== 0) {
                    this.page.pageNum = val
                    this.queryData(this.pageInfo.articleActivity)
                }
            }
        }
    }
</script>

<style scoped>

</style>

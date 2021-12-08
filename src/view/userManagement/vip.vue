<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/userManagement' }">用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>会员管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <div>
            <el-tabs v-model="vipNum" @tab-click="handleClick">
                <el-tab-pane label="会员列表" name="first"></el-tab-pane>
                <el-tab-pane label="会员设置" name="second"></el-tab-pane>
            </el-tabs>
        </div>


        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px">
            <el-form-item>
                <el-input v-model="pageInfo.search" placeholder="搜索账号/名称" class="wetuc-input3-col3"
                          @keyup.enter.native="queryData(pageInfo.search)">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                       @click="queryData(pageInfo.search)" style="cursor: pointer"></i>
                </el-input>
            </el-form-item>

            <el-form-item v-if="vipNum === 'first'">
                <el-button type="primary" @click="giftMember('add', false)">赠送会员</el-button>
                <el-button type="primary" @click="exportUser()">导出用户</el-button>
            </el-form-item>
        </el-form>


        <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column type="selection" min-width="55"></el-table-column>
            <el-table-column label="头像（查看大图）" key="1" min-width="120" v-if="vipNum === 'first'">
                <template slot-scope="scope">
                    <div class="tableImg">
                        <el-image class="table-td-thumb" :src="imgUrl + scope.row.headImg" :preview-src-list="[imgUrl + scope.row.headImg]" v-if="scope.row.headImg"></el-image>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" key="2" min-width="80" show-overflow-tooltip v-if="vipNum === 'first'"></el-table-column>
            <el-table-column prop="phone" label="联系方式" key="3" min-width="100" show-overflow-tooltip v-if="vipNum === 'first'"></el-table-column>
            <el-table-column label="开始时间" key="4" min-width="80" show-overflow-tooltip v-if="vipNum === 'first'">
                <template slot-scope="scope" v-if="scope.row.myVip">
                    <span> {{scope.row.myVip.startTime | stampFormate4}}</span>
                </template>
            </el-table-column>
            <el-table-column label="过期时间" key="5" min-width="100" show-overflow-tooltip v-if="vipNum === 'first'">
                <template slot-scope="scope" v-if="scope.row.myVip">
                    <span> {{scope.row.myVip.endTime | stampFormate4}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="name" label="会员名称" min-width="80" key="6" show-overflow-tooltip v-if="vipNum === 'second'"></el-table-column>
            <el-table-column prop="time" label="期限" min-width="80" key="7" show-overflow-tooltip v-if="vipNum === 'second'">
                <template slot-scope="scope">
                    <p>
                        {{scope.row.time}}
                        <span v-if="scope.row.per === '1'">年</span>
                        <span v-else>月</span>
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="price_s" label="价格" min-width="80" key="8" show-overflow-tooltip v-if="vipNum === 'second'"></el-table-column>

            <el-table-column fixed="right" label="操作" min-width="80" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" v-if="vipNum === 'first'" @click="userDetails(scope.row)">查看</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" v-if="vipNum === 'second'" @click="giftMember('edit', scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="wetuc-pagination-panel" v-if="vipNum === 'first'">
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


        <el-dialog :title="loadInfo.logTitle" :visible.sync="dialoadFlag" width="25%" min-width="35%" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="addAccDialoadCloseFn">
            <el-form ref="loadInfo" :model="loadInfo" label-width="80px" :rules="loadRules">
                <el-form-item label="手机号" prop="phone" v-if="loadInfo.type === 'add'">
                    <el-input v-model="loadInfo.phone" placeholder="请输入手机号" style="width: 100%"></el-input>
                </el-form-item>
                <el-form-item label="会员名称" prop="vipName" v-if="loadInfo.type === 'add'">
                    <el-select v-model="loadInfo.vipName" placeholder="会员名称" style="width: 100%" @change="vipNameChang()">
                        <el-option
                            v-for="item in vipNameList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="会员名称" prop="name" v-if="loadInfo.type === 'edit'">
                    <el-input v-model="loadInfo.name" placeholder="请输入手机号" style="width: 100%"></el-input>
                </el-form-item>
                <div class="wetuc-container">
                    <el-form-item label="会员期限" prop="time" v-if="loadInfo.type === 'edit'" class="wetuc-twoBlock">
                        <el-input-number v-model="loadInfo.time" placeholder="请输入手机号" :min="1" style="width: 200%"></el-input-number>
                    </el-form-item>
                    <el-form-item label="" prop="per" v-if="loadInfo.type === 'edit'" class="wetuc-twoBlock">
                        <el-select v-model="loadInfo.per" placeholder="会员名称" style="width: 100%" @change="vipNameChang()">
                            <el-option
                                v-for="item in yearList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="会员价格" prop="price" v-if="loadInfo.type === 'edit'">
                    <el-input v-model="loadInfo.price_s" placeholder="请输入会员价格" style="width: 100%"></el-input>
                </el-form-item>
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

export default {
    data() {
        return {
            imgUrl: process.env.IMG_URL,
            vipNum: 'first',
            pageInfo: {
                search: ''
            },
            loadInfo: {
                phone: '',
                vipName: '',
                type: 'add',
                vipItemId: '',
                logTitle: '赠送会员',
                name: '1',
                year: '1',
                time: '1',
                price: '199'
            },
            yearList: [{
                value: '1',
                label: '年'
            }, {
                value: '2',
                label: '月'
            }],
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            vipNameList: [{
               value: '1',
               label: '高级会员'
            }],
            loadRules: {
                phone: [
                    { required: true, message: "请输入手机号码", trigger: "blur" },
                    { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
                    {
                        pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
                        message: "请输入正确的手机号码"
                    }
                ],
                vipName: [
                    {required: true, message: '请选择会员名称!', trigger: 'change'}
                ],
                price: [
                    {required: true, message: '请输入会员价格!', trigger: 'change'}
                ],
                name: [
                    {required: true, message: '请输入会员名称!', trigger: 'blur'}
                ]
            },
            dialoadFlag: false,
            scope: '',
            multipleSelection: [],
            tableData: [],
            tableLoading: false,
        }
    },
    mounted() {
        this.getVip();
    },
    methods: {
        queryData(search) {
            let that = this;
            that.tableLoading = true;
            if(that.vipNum === 'first'){
                loginService.getVipMem({
                    query:search,
                    pageNo:that.page.pageNum,
                    pageSize:that.page.pageSize
                }).then(function(res){
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
            } else {
                loginService.getVip({}).then(function(res){
                    if (res.data.success) {
                        let result = res.data.datas
                        that.tableData = result
                        that.page.total = Number(result.totalCount);
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        // 获取会员数组
        getVip() {
            let that = this;
            loginService.getVip({}).then(function(res){
                if (res.data.success) {
                    let result = res.data.datas
                    that.vipNameList = result
                    that.queryData(that.pageInfo.search);
                }
            }).catch(err => {
                console.log(err);
            })

        },
        vipNameChang(id) {
            this.loadInfo.vipItemId = id;
        },
        addAccDialogFn (formName, type) {
            let that = this
            if(type === 'add') {
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        loginService.postGroups({
                            name: that.loadInfo.name,
                            vipItemId: that.loadInfo.vipItemId
                        }).then(res => {
                            if(res.data.success) {
                                that.$message({
                                    message: '赠送成功',
                                    type: 'success'
                                });
                                that.dialoadFlag = false;
                                this.queryData(this.pageInfo.search)
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
                        loginService.putVip({
                            vipId: that.loadInfo.vipId,
                            createTime: that.loadInfo.time,
                            id: that.loadInfo.id,
                            name: that.loadInfo.name,
                            price_s: that.loadInfo.price_s,
                            price: that.loadInfo.price_s,
                            time: that.loadInfo.time,
                            per: that.loadInfo.per
                        }).then(res => {
                            if(res.data.success) {
                                that.$message({
                                    message: '组名更改为:' + that.loadInfo.name,
                                    type: 'success'
                                });
                                that.dialoadFlag = false;
                                this.queryData(this.pageInfo.search)
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
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleClick (item) {
            this.queryData(this.pageInfo.search)
        },
        giftMember(type, scope) {
            this.dialoadFlag = true;
            this.loadInfo.type = type;
            if(type === 'add') {
                this.loadInfo.logTitle = '赠送会员'
            } else {
                this.loadInfo = Object.assign(this.loadInfo, scope)
                this.loadInfo = JSON.parse(JSON.stringify(this.loadInfo))
                this.loadInfo.logTitle = '修改会员'
            }
        },
        userDetails(row) {
            this.$router.push({
                path: `/userDetails`,
                query: { id: row.id }
            });
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
        // 关闭按钮
        addAccDialoadCloseFn () {
            this.loadInfo.name = ''
            this.loadInfo.radio = true
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

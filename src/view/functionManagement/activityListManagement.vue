<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/articleManagement' }">功能</el-breadcrumb-item>
                <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
            <el-tabs v-model="activityName" @tab-click="handleClick">
                <el-tab-pane label="我的活动" name="first"></el-tab-pane>
                <el-tab-pane label="草稿箱" name="second"></el-tab-pane>
                <el-tab-pane label="签到员管理" name="three"></el-tab-pane>
            </el-tabs>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px" @submit.native.prevent>
            <el-form-item>
                <el-input v-model="pageInfo.search" placeholder="搜索账号/名称" class="wetuc-input3-col3"
                          @keyup.enter.native="queryData(pageInfo.search)">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                       @click="queryData(pageInfo.search)" style="cursor: pointer"></i>
                </el-input>
                <el-select v-model="pageInfo.activeState" placeholder="活动状态" class="wetuc-input3-col3"
                           v-if="activityName === 'first'" :clearable="true" @change="queryData(pageInfo.search)">
                    <el-option
                        v-for="item in activeStateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="pageInfo.registrationStatus" placeholder="报名状态" class="wetuc-input3-col3"
                           v-if="activityName === 'first'" :clearable="true" @change="queryData(pageInfo.search)">
                    <el-option
                        v-for="item in registrationStatusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="activityName === 'first' || activityName === 'second'">
                <el-button type="primary" @click="addReleaseActivitiesFn()">发布活动</el-button>
            </el-form-item>
            <el-form-item v-if="activityName !== 'first' && activityName !== 'second'">
                <el-button type="primary" @click="addReleaseActivitiesFn()">新增签到员</el-button>
            </el-form-item>
        </el-form>


        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column type="expand" v-if="activityName === 'first'">
                <template slot-scope="scope">
                    <span class="item-icon"><i class="el-icon-view"></i>{{scope.row.actReadNum}}</span>
                </template>
            </el-table-column>

            <el-table-column label="图片（查看大图）" key="1" min-width="120" v-if="activityName === 'first' || activityName === 'second'">
                <template slot-scope="scope">
                    <div class="tableImg">
                        <el-image class="table-td-thumb" :src="imgUrl + scope.row.activityPoster" :preview-src-list="[imgUrl + scope.row.activityPoster]"></el-image>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="活动名称" key="2" min-width="150" show-overflow-tooltip v-if="activityName === 'first' || activityName === 'second'">
                <template slot-scope="scope">
                    <span class="spanHover" style="display: block">{{scope.row.activityTitle}}</span>
                    <span style="display: block;color: #409EFF">￥{{scope.row.minTicketPrice / 100}} ~ ￥{{scope.row.maxTicketPrice / 100}}</span>
                </template>
            </el-table-column>
            <el-table-column label="活动状态" key="3" min-width="100" v-if="activityName !== 'second' && activityName !== 'three'">
                <template slot-scope="scope">
                    <span>{{scope.row.actStauts | activeState}}</span>
                </template>
            </el-table-column>
            <el-table-column label="报名状态" key="4" min-width="100" v-if="activityName !== 'second' && activityName !== 'three'">
                <template slot-scope="scope">
                    <span>{{scope.row.actApplyStauts | registrationStatus}}</span>
                </template>
            </el-table-column>
            <el-table-column label="发布时间" key="5" min-width="100" v-if="activityName !== 'second' && activityName !== 'three'">
                <template slot-scope="scope">
                    <span>{{scope.row.publishTime | stampFormate4}}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" key="6" min-width="100" v-if="activityName !== 'first' && activityName !== 'three'">
                <template slot-scope="scope">
                    <span>{{scope.row.publishTime | stampFormate4}}</span>
                </template>
            </el-table-column>

            <el-table-column label="微信头像（查看大图）" key="7" min-width="150" v-if="activityName !== 'first' && activityName !== 'second'">
                <template slot-scope="scope">
                    <div class="tableImg">
                        <el-image class="table-td-thumb" :src="scope.row.headImgUrl" :preview-src-list="[scope.row.headImgUrl]"></el-image>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="微信昵称" key="8" min-width="100" v-if="activityName !== 'first' && activityName !== 'second'">
                <template slot-scope="scope">
                    <span>{{scope.row.nickName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="审核状态" key="9" min-width="100" v-if="activityName !== 'first' && activityName !== 'second'">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">申请拒绝</span>
                    <span v-if="scope.row.status == 1">申请同意</span>
                    <span v-if="scope.row.status == 2">待审核</span>
                </template>
            </el-table-column>
            <el-table-column label="申请时间" key="10" min-width="100" v-if="activityName !== 'first' && activityName !== 'second'">
                <template slot-scope="scope">
                    <span>{{scope.row.applyTime | stampFormate4}}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" min-width="220" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" v-if="activityName === 'first'" @click.prevent="administration(scope.row)">管理</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" v-if="activityName === 'first'" @click.prevent="extensionFn(scope.row, 1)">推广</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" v-if="activityName === 'first'" @click.prevent="copyFn(scope.row)">复制</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" v-if="activityName === 'second'" @click.prevent="editFn(scope.row)">编辑</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" v-if="activityName === 'three'">撤销</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" v-if="activityName === 'three'">同意</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" v-if="activityName === 'three'">拒绝</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" size="small" @click.prevent="deteleFn(scope.row)" v-if="activityName !== 'three'">删除</el-button>
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


        <el-dialog :title="diaTtitle" :visible.sync="dialogVisible" width="16%" :destroy-on-close="true">
            <div id="qrCodeCanvas" class="qrCodeCanvas" v-show="dialogVisible"></div>
            <el-input id="botIpt" v-model="qrCodeUrl" style="position: relative;z-index:-1"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="copyUrl" size="mini" type="primary">复制链接</el-button>
                <el-button @click="downloadImg" size="mini" type="primary">下载二维码</el-button>
          </span>
        </el-dialog>


    </div>
</template>

<script>
    import {loginService} from '../../service/loginService';
    import {stampFormate4} from '../../filter/index'
    import {activeState, registrationStatus} from '../../filter/companyList'
    import QRCode from 'qrcodejs2'
    export default {
        data () {
            return {
                activityName: 'first',
                imgUrl: process.env.IMG_URL,
                qrCodeUrl: '',
                diaTtitle: '',
                dialogVisible: false,
                channelUrl: '',
                pageInfo: {
                    search: '',
                    activeState: '',
                    registrationStatus: ''
                },
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                activeStateList: [{
                    label: '未开始',
                    value: '0'
                }, {
                    label: '进行中',
                    value: '1'
                }, {
                    label: '已结束',
                    value: '2'
                }],
                registrationStatusList: [{
                    label: '未开始',
                    value: '0'
                }, {
                    label: '已开始',
                    value: '1'
                }, {
                    label: '已关闭',
                    value: '2'
                }],
                tableData: [],
                tableLoading: false,
            }
        },
        filters: {
            activeState,
            registrationStatus
        },
        computed: {
            apis() {
                return process.env.API_ROOT
            },
            picHead() {
                return process.env.IMG_URL
            },
            pcUrl() {
                return process.env.PC_URL
            }
        },
        mounted () {
            this.queryData(this.pageInfo.search);
        },
        methods: {
            // 管理
            administration(row) {
                let that = this;
                if(row.isClose === 0) {
                    if(row.passCode) {
                        const passCode = row.passCode
                        this.$prompt('请输入活动密码', '', {
                            closeOnClickModal:false,
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            inputPattern: new RegExp(`^${passCode}$`),
                            inputType:'passWord',
                            inputErrorMessage: '活动密码不正确'
                        }).then(({ value }) => {
                            that.$router.push({path: 'detailsActivity', query: {id: row.id}})
                        }).catch((err) => {
                            this.$message({
                                type: 'info',
                                message: '已取消'
                            });
                        });
                    }
                } else {
                    that.$confirm('您的活动已经被管理员关闭，是否继续管理？', '管理', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => { // 成功
                        that.$router.push({path: 'detailsActivity', query: {id: row.id}})
                    }).catch(() => { // 取消
                    });
                }
            },
            // 二维码
            getQRCode (url) {
                let qrCodeCanvas = new QRCode('qrCodeCanvas', url, (error) => {
                    width: 100
                    height: 100
                    if (error) {
                    } else {
                    }
                })
            },
            extensionFn(row, type) {
                this.dialogVisible = true
                if(type === 1) {
                    this.diaTtitle = '推广'
                    let url = this.pcUrl + `activity/${row.id}`
                    this.qrCodeUrl = url
                    setTimeout(() => {
                        this.getQRCode(url)
                    }, 1000)
                }
            },
            copyUrl() {
                let that = this;
                let obj = document.getElementById('botIpt');
                obj.select();
                document.execCommand("Copy");
                that.$message({
                    message: '复制成功！',
                    type: 'success'
                });
            },
            // 下载二维码
            downloadImg() {
                let canvas = document.getElementById('qrCodeCanvas').getElementsByTagName("canvas");
                let MIME_TYPE = 'image/png';
                let dlLink = document.createElement('a');
                dlLink.download = 'qrcode.png';
                dlLink.href = canvas[0].toDataURL('image/png');
                dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.href].join(':');
                document.body.appendChild(dlLink);
                dlLink.click();
                document.body.removeChild(dlLink);
            },
            queryData(search) {
                let that = this;
                that.tableLoading = true;
                if( that.activityName === 'first' ||  that.activityName === 'second'){
                    loginService.getActivitiesList({
                        search: search,
                        actStauts: that.activityName === 'first' ? that.pageInfo.activeState : '',
                        actApplyStauts: that.activityName === 'first' ? that.pageInfo.registrationStatus : '',
                        pageNo: that.page.pageNum,
                        pageSize: that.page.pageSize,
                        activityStatus: that.activityName === 'second' ? '3' : ''
                    }).then(function(res){
                        if (res.data.success) {
                            let result = res.data.datas
                            that.tableData = result.datas
                            that.page.total = Number(result.totalCount);
                            setTimeout(function () {
                                that.tableLoading = false
                            }, 300)
                        }
                    })
                } else {
                    loginService.getCheckadmins({
                        search: search,
                        pageNo: that.page.pageNum,
                        pageSize: that.page.pageSize,
                    }).then(res => {
                        if (res.data.success) {
                            let result = res.data.datas
                            that.tableData = result.datas
                            that.page.total = Number(result.totalCount)
                            setTimeout(function () {
                                that.tableLoading = false
                            }, 300)
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                    console.log('1')
                }
            },
            addReleaseActivitiesFn() {
                this.$router.push({path: 'addActivity'})
            },
            handleClick (item) {
                this.queryData(this.pageInfo.search)
            },
            editFn(row) {
                this.$router.push({path: 'editActivity', query: {id: row.id}})
            },
            copyFn(row) {
                this.$prompt('复制活动到草稿箱', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\S/,
                    inputValue: '[拷贝]' + row.activityTitle
                }).then(({ value }) => {
                    loginService.copyActivity({actId: row.id, name: row.activityTitle}).then(function (res) {
                        if (res.data.success) {
                            this.queryData(this.pageInfo.search)
                        } else {
                            this.$message.error(res.data.message);
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                }).catch((err) => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            deteleFn(row) {
                let that = this;
                that.$confirm('您是否确认删除此活动？删除后不可恢复?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    loginService.deleteActivity({actId: row.id}).then(function (res) {
                        if(res.data.success){
                            that.queryData(that.pageInfo.search)
                        }else{
                            that.$message.error(res.data.message);
                        }
                    }).catch(function (err) {
                        that.$router.push({name: 'error'});
                    });
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })

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

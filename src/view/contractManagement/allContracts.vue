<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/contractManagement' }">合同管理</el-breadcrumb-item>
                <el-breadcrumb-item>全部合同</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
            <el-tabs v-model="contractName" @tab-click="handleClick">
                <el-tab-pane name="first"> <span slot="label">待审核 <span style="color: #D71718">{{count.wait}}</span> </span>  </el-tab-pane>
                <el-tab-pane name="two"> <span slot="label">进行中 <span style="color: #D71718">{{count.ing}}</span> </span>  </el-tab-pane>
                <el-tab-pane name="three"> <span slot="label">全部合同 </span>  </el-tab-pane>
                <el-tab-pane name="four">
                    <span slot="label">
                        <el-tooltip class="item" effect="dark" :content="'筛选总计： ' + getFloatStr(this.totalAmount / 100)" placement="top-start">
                            <span>变动记录</span>
                         </el-tooltip>
                    </span>
                </el-tab-pane>
<!--                <el-tab-pane name="four"> <span slot="label">变动记录  <span style="color: #D71718">{{getFloatStr(totalAmount / 100)}}</span> </span>   </el-tab-pane>-->
            </el-tabs>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" label-width="10px" @submit.native.prevent :inline="true">
            <div :class="contractName !== 'four' ? 'wetuc-page-block' : 'wetuc-displayLft'">
                <el-input v-model="pageInfo.search" placeholder="请输入关键字搜索" class="wetuc-input3-col3"
                          @keyup.enter.native="queryData(pageInfo.search)">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                       @click="queryData(pageInfo.search)" style="cursor: pointer"></i>
                </el-input>

                <el-select v-model="pageInfo.amountMoney" placeholder="请选择状态" class="wetuc-input3-col3" :clearable="true" v-if="contractName === 'four'" @change="queryData(pageInfo.search)">
                    <el-option
                        v-for="item in amountMoneyList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>

                <el-select v-model="pageInfo.seal" placeholder="请选择合同状态" class="wetuc-input3-col3" :clearable="true" v-if="contractName !== 'four'" @change="queryData(pageInfo.search)">
                    <el-option
                        v-for="item in sealList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>

                <el-select v-model="pageInfo.billStatus" placeholder="请选择回款状态" class="wetuc-input3-col3" :clearable="true" v-if="contractName !== 'four'" @change="queryData(pageInfo.search)">
                    <el-option
                        v-for="item in billStatusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <div :class="contractName !== 'four' ? 'wetuc-page-block' : 'wetuc-displayLft'">
                <el-date-picker class="wetuc-input3-col3" v-model="pageInfo.time" type="daterange" value-format="timestamp" :default-time="pageInfo.time"
                                @change="queryData(pageInfo.search)"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>

                <el-select v-model="pageInfo.hostName" placeholder="请选择业务员" class="wetuc-input3-col3" :clearable="true" @change="hostNameChange" v-if="contractName !== 'four'">
                    <el-option
                        v-for="item in salesmanList"
                        :key="item.id"
                        :label="item.hostName"
                        :value="item.id">
                    </el-option>
                </el-select>

                <el-select v-model="pageInfo.sort" placeholder="" class="wetuc-input3-col3" v-if="contractName !== 'four'" @change="queryData(pageInfo.search)">
                    <el-option
                        v-for="item in sortList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
<!--            <el-button type="primary">筛 选</el-button>-->
        </el-form>


        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column key="1" prop="no" label="合同编号" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column key="2" prop="name" label="合同名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column key="3" label="合同金额" min-width="80" show-overflow-tooltip v-if="contractName !== 'four'">
                <template slot-scope="scope">
                    {{getFloatStr(scope.row.totalAmount / 100)}}
                </template>
            </el-table-column>
            <el-table-column key="4" label="签约时间" min-width="100" show-overflow-tooltip v-if="contractName !== 'four'">
                <template slot-scope="scope">
                    {{scope.row.signTime | stampFormate}}
                </template>
            </el-table-column>
            <el-table-column key="5" label="开票总额" min-width="80" show-overflow-tooltip v-if="contractName !== 'first' && contractName !== 'four'">
                <template slot-scope="scope">
                    {{getFloatStr(scope.row.invoiceAmount / 100)}}
                </template>
            </el-table-column>
            <el-table-column key="6" label="待开金额" min-width="80" show-overflow-tooltip v-if="contractName !== 'first' && contractName !== 'four'">
                <template slot-scope="scope">
                    {{getFloatStr(scope.row.waitInvoiceAmount / 100)}}
                </template>
            </el-table-column>
            <el-table-column key="7" label="已收总额" min-width="80" show-overflow-tooltip v-if="contractName !== 'first' && contractName !== 'four'">
                <template slot-scope="scope">
                    {{getFloatStr(scope.row.gatheringAmount / 100)}}
                </template>
            </el-table-column>
            <el-table-column key="8" label="应收总额" min-width="80" show-overflow-tooltip v-if="contractName !== 'first' && contractName !== 'four'">
                <template slot-scope="scope">
                    {{getFloatStr(scope.row.reciveAmount / 100)}}
                </template>
            </el-table-column>
            <el-table-column key="9" label="合同状态" min-width="80" show-overflow-tooltip v-if="contractName === 'three' && contractName !== 'four'">
                <template slot-scope="scope">
                    {{scope.row.stamp | contractStamp}}
                </template>
            </el-table-column>
            <el-table-column key="10" label="回款状态" min-width="80" show-overflow-tooltip v-if="contractName !== 'first' && contractName !== 'four'">
                <template slot-scope="scope">
                    {{scope.row.billStatus | billStatus}}
                </template>
            </el-table-column>
            <el-table-column key="11" label="进度" min-width="70" show-overflow-tooltip v-if="contractName === 'three' && contractName !== 'four'">
                <template slot-scope="scope">
                    {{scope.row.status | contractStatus}}
                </template>
            </el-table-column>
            <el-table-column key="13" prop="hostName" label="业务员" min-width="100" show-overflow-tooltip v-if="contractName !== 'four'"></el-table-column>
            <el-table-column key="14" label="变动事项" min-width="100" show-overflow-tooltip v-if="contractName === 'four'">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == '1'">开票金额</span>
                    <span v-else>已收金额</span>
                </template>
            </el-table-column>
            <el-table-column key="15" label="变动金额" min-width="100" show-overflow-tooltip v-if="contractName === 'four'">
                <template slot-scope="scope">
                    <span>{{getFloatStr(scope.row.amount / 100)}}</span>
                </template>
            </el-table-column>
            <el-table-column key="16" label="变动时间" min-width="100" show-overflow-tooltip v-if="contractName === 'four'">
                <template slot-scope="scope">
                    {{scope.row.changeTime | stampFormate}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" align="right" :min-width="contractName === 'two' ? '150' : '80'" show-overflow-tooltip fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" icon="el-icon-edit" v-if="contractName === 'first'" @click.prevent="toExamine(scope.row, contractName)">审核</el-button>
                    <el-button type="text" size="small" icon="el-icon-view" v-if="contractName === 'three'" @click.prevent="details(scope.row)" >详情</el-button>
                    <el-button type="text" size="small" icon="el-icon-edit" v-if="contractName === 'two'" @click.prevent="toExamine(scope.row, contractName)">修改</el-button>
                    <el-button type="text" size="small" icon="el-icon-edit" v-if="contractName === 'two'" @click.prevent="setCollectionTime(scope.row)">设置回款时间</el-button>
                    <el-button type="text" size="small" class="el-icon-delete" v-if="contractName === 'four'" @click.prevent="deleteClick(scope.row)">删除</el-button>
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


        <el-dialog title="设置回款时间" :visible.sync="dialogFormVisible">
            <el-form ref="editInfo" :model="editInfo" :rules="rules" :inline="true">
                <el-form-item label="回款开始时间" prop="billStartTime">
                    <el-date-picker
                        class="wetuc-input3-col3"
                        v-model="editInfo.billStartTime"
                        type="date"
                        format="yyyy-MM-dd 00:00:00"
                        value-format="timestamp"
                        placeholder="选择开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="回款截止时间" prop="billEndTime">
                    <el-date-picker
                        class="wetuc-input3-col3"
                        v-model="editInfo.billEndTime"
                        type="date"
                        placeholder="选择截止时间"
                        format="yyyy-MM-dd 23:59:59"
                        value-format="timestamp"
                        :picker-options="pickerOptions1">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="合同附件" style="width: 100%">
                    <el-upload
                        class="upload-demo"
                        :disabled="true"
                        :on-preview="handlePreview"
                        :action="apis + '/files/oss'"
                        v-model="editInfo.uploadContract"
                        :file-list="fileList">
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="determine('editInfo', editInfo)">确 定</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
import {loginService} from '../../service/loginService'
import {contractBillEndTime, billStatus, contractStamp, contractStatus} from '../../filter/companyList'
export default {
    data () {
        const validateStartTime = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入开始时间'))
            } else {
                if (new Date(this.editInfo.billStartTime).getTime() + 3600 * 1000 * 24 * 7 >= new Date(this.editInfo.billEndTime).getTime()) {
                    this.editInfo.billEndTime = ''
                } else {
                    callback()
                }
            }
        }
        const validateEndTime = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入截止时间'))
            } else {
                if (new Date(this.editInfo.billEndTime).getTime() <= new Date().getTime()) {
                    callback(new Error('截止时间必须大于当前时间!'))
                }else if (new Date(this.editInfo.billEndTime).getTime() <= new Date(this.editInfo.billStartTime).getTime() + 3600 * 1000 * 24 * 7) {
                    callback(new Error('截止时间必须大于开始时间7天！'))
                } else {
                    callback()
                }
            }
        }
        return {
            pageInfo: {
                search: '',
                seal: '',
                billStatus: '',
                time: [],
                hostName: '',
                hostId: '',
                sort: 1,
                status: 1,
                amountMoney: '1'
            },
            editInfo: {
                id: undefined,
                billStartTime: '',
                billEndTime: '',
                uploadContract: ''
            },
            dialogFormVisible: false,
            totalAmount: 0,
            contractName: 'first',
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            fileList: [],
            billTimeFlag: false,
            count: {
                all: '',
                ing: '',
                wait: '',
            },
            sealList: [{
                value: 1,
                label: '均未盖章'
            }, {
                value: 2,
                label: '我方已盖章'
            },{
                value: 3,
                label: '对方已盖章'
            }, {
                value: 4,
                label: '双方已盖章'
            }],
            billStatusList: [{
                value: 1,
                label: '未开始'
            }, {
                value: 2,
                label: '回款中'
            },{
                value: 3,
                label: '即将超时'
            }, {
                value: 4,
                label: '已超时'
            }],
            sortList: [{
                value: 1,
                label: '按合同时间排序'
            }, {
                value: 2,
                label: '按待开金额排序'
            },{
                value: 3,
                label: '按应收金额排序'
            }, {
                value: 4,
                label: '按回款时间排序'
            }],
            amountMoneyList: [{
                value: '1',
                label: '开票金额'
            },{
                value: '2',
                label: '已收金额'
            }],
            salesmanList: [],
            tableData: [],
            tableLoading: false,
            rules: {
                billStartTime: [{ type: 'string', required: true, trigger: 'change',  validator: validateStartTime }],
                billEndTime: [{type: 'string', required: true, trigger: 'change', validator: validateEndTime}]
            },
        }
    },
    mounted () {
        this.getAllStaffCount();
        this.contractsCount();
        this.queryData(this.pageInfo.search);
    },
    filters: {
        contractBillEndTime,
        billStatus,
        contractStamp,
        contractStatus
    },
    computed: {
        pickerOptions1() {
            return {
                disabledDate: (time) => {
                    if(this.editInfo.billStartTime && this.editInfo.billStartTime >= time.getTime()) {
                        return time.getTime() < new Date(this.editInfo.billStartTime).getTime()
                    } else {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                }
            }
        },
        apis() {
            return process.env.API_ROOT
        },
        picHead() {
            return process.env.IMG_URL
        }
    },
    methods: {
        // 获取列表
        queryData(search) {
            let that = this;
            that.tableLoading = true;
            loginService.getAllContractsList({
                sortField: that.pageInfo.sort,
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize,
                param: search,
                status: that.contractName === 'first' ? 1 : that.contractName === 'two' ? 3 : '',
                billStatus:that.pageInfo.billStatus,
                stamp: that.pageInfo.seal,
                staffId: that.pageInfo.hostId,
                startTime: that.pageInfo.time && that.pageInfo.time[0] ? that.pageInfo.time[0] : '',
                endTime: that.pageInfo.time && that.pageInfo.time[1] ? that.pageInfo.time[1] : '',
            }).then(res => {
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
        hostNameChange(item) {
            this.pageInfo.hostId = item;
            this.queryData(this.pageInfo.search)
        },
        // 获取业务员
        getAllStaffCount() {
            loginService.getAllStaffCount({
                staffFunction: 1
            }).then(res => {
                this.salesmanList = res.data.datas;
            }).catch(err =>{
                console.log(err);
            })
        },
        // 获取数量
        contractsCount() {
            loginService.contractsCount({
            }).then(res => {
                this.count.all = res.data.datas.all;
                this.count.ing = res.data.datas.ing;
                this.count.wait = res.data.datas.wait;
            }).catch(err => {
                console.log(err);
            })
        },
        getFloatStr(num){
            num += '';
            num = num.replace(/[^0-9|\.]/g, ''); //清除字符串中的非数字非.字符
            if(/^0+/) //清除字符串开头的0
                num = num.replace(/^0+/, '');
            if(!/\./.test(num)) //为整数字符串在末尾添加.00
                num += '.00';
            if(/^\./.test(num)) //字符以.开头时,在开头添加0
                num = '0' + num;
            num += '00';        //在字符串末尾补零
            return num = num.match(/\d+\.\d{2}/)[0];
        },
        getContractsLogs(search) {
            let that = this;
            loginService.getContractsLogs({
                type: that.pageInfo.amountMoney,
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize,
                param: search,
                startTime: that.pageInfo.time && that.pageInfo.time[0] ? that.pageInfo.time[0] : '',
                endTime: that.pageInfo.time && that.pageInfo.time[1] ? that.pageInfo.time[1] : '',
            }).then(res => {
                let result = res.data.datas;
                that.totalAmount = result.totalAmount;
                that.tableData = result.pages.datas;
                that.page.total = Number(result.pages.totalCount);
            }).catch(err => {
                console.log(err);
            })
        },
        handleClick (item) {
            if(item.name === 'four') {
                this.getContractsLogs(this.pageInfo.search);
            } else {
                this.queryData(this.pageInfo.search);
            }
        },
        handlePreview(file) {
            let hetf = file.url;
            window.open(hetf, '_blank');
        },
        determine(formName, row) {
            console.log(row);
            let that = this;
            let billEndTimes = '';
            if(!that.billTimeFlag) {
                billEndTimes = that.editInfo.billEndTime + ((24*60*60*1000) - 1)
            } else {
                billEndTimes = that.editInfo.billEndTime
            }
            that.$refs[formName].validate((valid) => {
                if(valid) {
                    loginService.editPutContractsAudit({
                        id: row.id,
                        billStartTime: row.billStartTime,
                        billEndTime: billEndTimes,
                    }).then(res => {
                        if (res.data.success) {
                            that.$message({
                                message: '设置成功！',
                                type: 'success'
                            });
                            setTimeout(() => {
                                that.dialogFormVisible = false;
                                this.queryData(this.pageInfo.search)
                            }, 200);
                        } else {
                            that.$message.error(res.data.message)
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        // 删除
        deleteClick(row) {
            let that = this;
            let title = row.type === 1 ? '开票金额' : '已收金额';
            that.$confirm('确定删除该条' + title + '记录吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                loginService.deleteContractsLogs(row.id, {
                }).then(res => {
                    if(res.data.success) {
                        that.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.queryData(this.pageInfo.search)
                    }
                }).catch(err => {
                    console.log(err);
                })
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 详情
        details(row) {
            this.$router.push({path: '/detailsContract', query: {id: row.id}})
        },
        // 审核 or 修改
        toExamine(row, type) {
            // 写 store
            if(type === 'first') {
                this.$store.commit('setReviewComments', 'reviewComments')
            } else if (type === 'two') {
                this.$store.commit('setReviewComments', 'ing')
            }
            this.$router.push({path: 'editContract', query: {id: row.id}})
        },
        // 设置回款时间
        setCollectionTime(row) {
            let that = this;
            that.dialogFormVisible = true
            that.editInfo.id = row.id
            that.getContractsFiles(row);
            loginService.detailsContracts(row.id, {
            }).then(res => {
                that.billTimeFlag = res.data.datas.contract.billStartTime ? true : false,
                that.editInfo.billStartTime = res.data.datas.contract.billStartTime ? res.data.datas.contract.billStartTime : '';
                that.editInfo.billEndTime = res.data.datas.contract.billEndTime ? res.data.datas.contract.billEndTime : '';
            }).catch(err => {
                console.log(err);
            })
        },
        // 获取合同
        getContractsFiles(row) {
            let that = this;
            loginService.getContractsFiles(row.id, {}).then(res=> {
                res.data.datas.forEach(item => {
                    item.name = '[' + that.formartDate(item.createTime) + ']' + '-' + '[' + item.hostName + ']' + '-' + '[' +item.contractFileName + ']';
                    item.url = that.picHead + item.contractFileUrl;
                });
                that.fileList = res.data.datas;
            }).catch(err => {
                console.log(err);
            })
        },
        formartDate(param) {
            let date = new Date(Number(param));
            let Y = date.getFullYear() + '-';
            let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
            let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
            let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
            let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return Y + M + D + h + m + s;
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
    /deep/ .upload-demo .el-upload{
        display: none !important;
    }
</style>

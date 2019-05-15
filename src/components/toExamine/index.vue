<template>
    <div>
        <el-form ref="pageInfo" :model="pageInfo" label-width="10px" :inline="true">
            <el-form-item>
                <el-input v-model="pageInfo.query" :placeholder="queryPlaceHolder" class="wetuc-input3-col3"
                          @keyup.enter.native="queryData(accounType, pageInfo.state)">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                       @click="queryData(accounType, pageInfo.state)" style="cursor: pointer"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="pageInfo.state" placeholder="请选择状态" class="wetuc-input3-col3" @change="stateChangeFn">
                    <el-option
                        v-for="item in stateOptionsList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column label="账号类型" min-width="60" show-overflow-tooltip v-if="accounType === 'examine'">
                <template slot-scope="scope">
                    <span v-if="scope.row.type === '0'">作者</span>
                    <span v-if="scope.row.type === '4'">主办方</span>
                </template>
            </el-table-column>
            <el-table-column prop="account" label="账号" min-width="80" show-overflow-tooltip v-if="accounType === 'examine'"></el-table-column>
            <el-table-column prop="adminCompany" label="名称" min-width="60" show-overflow-tooltip v-if="accounType === 'examine'"></el-table-column>
            <el-table-column prop="adminName" label="联系人" min-width="60" show-overflow-tooltip v-if="accounType === 'examine'"></el-table-column>
            <el-table-column prop="adminPhone" label="联系手机" min-width="60" show-overflow-tooltip v-if="accounType === 'examine'"></el-table-column>
            <el-table-column label="申请时间" min-width="80" show-overflow-tooltip v-if="accounType === 'examine'">
                <template slot-scope="scope">
                    <span>{{scope.row.applyTime | stampFormate}}</span>
                </template>
            </el-table-column>
            <!--认证审核-->
            <el-table-column label="申请时间" min-width="100" show-overflow-tooltip v-if="accounType === 'authentication'">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | stampFormate4}}</span>
                </template>
            </el-table-column>
            <el-table-column label="认证类型" min-width="80" show-overflow-tooltip v-if="accounType === 'authentication'">
                <template slot-scope="scope">
                    <span v-if="scope.row.authType === 1">个人认证</span>
                    <span v-if="scope.row.authType === 2">企业认证</span>
                </template>
            </el-table-column>
            <el-table-column prop="account" label="申请人账号" min-width="100" show-overflow-tooltip v-if="accounType === 'authentication'"></el-table-column>
            <el-table-column label="名称" min-width="120" show-overflow-tooltip v-if="accounType === 'authentication'">
                <template slot-scope="scope">
                    <span v-if="scope.row.authType === 1">{{scope.row.realName}}</span>
                    <span v-if="scope.row.authType === 2">{{scope.row.companyName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="机构代码/身份证号" min-width="120" show-overflow-tooltip v-if="accounType === 'authentication'">
                <template slot-scope="scope">
                    <span v-if="scope.row.authType === 1">{{scope.row.cardNo}}</span>
                    <span v-if="scope.row.authType === 2">{{scope.row.companyCode}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="bankCardNo" label="银行卡" min-width="120" show-overflow-tooltip v-if="accounType === 'authentication'"></el-table-column>
            <el-table-column fixed="right" label="操作" min-width="80" align="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small">详情</el-button>
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
        name: 'to-examine',
        props: {
            accounType: String,
            queryPlaceHolder: String
        },
        data () {
            return {
                tableData: [],
                tableLoading: false,
                pageInfo: {
                    query: '',
                    state: '0'
                },
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                stateOptionsList: [{
                    label: '待审核',
                    value: '0'
                }, {
                    label: '已通过',
                    value: '1'
                }, {
                    label: '已拒绝',
                    value: '2'
                }]
            }
        },
        mounted () {
            this.queryData(this.accounType, this.pageInfo.state);
        },
        methods: {
            queryData(type, state) {
                let that = this;
                that.tableLoading = true;
                if(type === 'examine') {
                    loginService.getVarifys({
                        varifyResult: state,
                        account: that.pageInfo.query,
                        pageNo: that.page.pageNum,
                        pageSize: that.page.pageSize,
                        type: 0
                    }).then(res => {
                        if(res.data.success) {
                            let result = res.data.datas;
                            that.tableData = result.datas;
                            that.page.total = Number(result.totalCount)
                        }
                        that.tableLoading = false;
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    loginService.getAdminscertificationlist({
                        authStatus: ++state,
                        searchName: that.pageInfo.query,
                        pageNo: that.page.pageNum,
                        pageSize: that.page.pageSize
                    }).then(res => {
                        if(res.data.success) {
                            let result = res.data.datas;
                            that.tableData = result.datas;
                            that.page.total = Number(result.totalCount)
                        }
                        that.tableLoading = false;
                    }).catch(err => {
                        console.log(err)
                    })
                }
            },
            // 状态切换搜索
            stateChangeFn(value) {
                this.queryData(this.accounType, value)
            },
            // 分页
            handleSizeChange (val) {
                this.page.pageSize = val;
                this.queryData(this.accounType, this.pageInfo.state)
            },
            handleCurrentChange (val) {
                if (val !== 0) {
                    this.page.pageNum = val;
                    this.queryData(this.accounType, this.pageInfo.state)
                }
            }
        }
    }
</script>

<style scoped>

</style>

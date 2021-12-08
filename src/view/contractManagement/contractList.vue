<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/contractManagement' }">合同管理</el-breadcrumb-item>
                <el-breadcrumb-item>合同列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
            <el-tabs v-model="contractName" @tab-click="handleClick">
                <el-tab-pane label="合同列表" name="0"></el-tab-pane>
                <el-tab-pane label="草拟合同" name="1"></el-tab-pane>
            </el-tabs>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" label-width="10px" @submit.native.prevent :inline="true">
            <el-input v-model="pageInfo.search" placeholder="请输入关键字搜索" class="wetuc-input3-col3"
                      @keyup.enter.native="queryData(pageInfo.search)">
                <i slot="suffix" class="el-input__icon el-icon-search"
                   @click="queryData(pageInfo.search)" style="cursor: pointer"></i>
            </el-input>

            <el-button type="primary" @click="addContract">新增合同</el-button>
        </el-form>


        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="no" label="合同编号" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="合同名称" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="合同金额" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{getFloatStr(scope.row.totalAmount / 100)}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="开票总额" min-width="80" show-overflow-tooltip v-if="contractName === '0'">
                <template slot-scope="scope">
                    {{getFloatStr(scope.row.invoiceAmount / 100)}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="已收总额" min-width="80" show-overflow-tooltip v-if="contractName === '0'">
                <template slot-scope="scope">
                    {{getFloatStr(scope.row.gatheringAmount / 100)}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="合同状态" min-width="80" show-overflow-tooltip v-if="contractName === '0'">
                <template slot-scope="scope">
                    {{scope.row.stamp | contractStamp}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="回款时间" min-width="80" show-overflow-tooltip v-if="contractName === '0'">
                <template slot-scope="scope">
                    {{scope.row.billEndTime | contractBillEndTime}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="进度" min-width="70" show-overflow-tooltip v-if="contractName === '0'">
                <template slot-scope="scope">
                    {{scope.row.status | contractStatus}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" min-width="100" align="right" show-overflow-tooltip fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" class="el-icon-edit" size="small" @click.prevent="modify(scope.row, contractName)">
                        修改
                    </el-button>
                    <el-button type="text" class="el-icon-view" size="small" @click.prevent="details(scope.row)">
                        详情
                    </el-button>
                    <el-button type="text" class="el-icon-delete red" size="small" @click.prevent="deteleFn(scope.row)" v-if="contractName === '1'">
                        删除
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
import {contractStamp, contractBillEndTime, contractStatus} from "../../filter/companyList";

export default {
    data () {
        return {
            pageInfo: {
                search: ''
            },
            contractName: '0',
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            tableData: [],
            tableLoading: false
        }
    },
    filters: {
        contractStamp,
        contractBillEndTime,
        contractStatus
    },
    mounted () {
        this.queryData(this.pageInfo.search);
    },
    methods: {
        // 获取列表
        queryData(search) {
            let that = this;
            that.tableLoading = true;
            loginService.getContractsList({
                param: search,
                draft: that.contractName,
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize
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
        addContract() {
            this.$router.push({path: '/addContract'})
        },
        handleClick (item) {
            this.queryData(this.pageInfo.search)
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
        },
        // 修改
        modify(row) {
            if(this.contractName === '0') {
                this.$store.commit('setReviewComments', 'edit')
            } else {
                this.$store.commit('setReviewComments', 'draft')
            }
            this.$router.push({path: '/editContract', query: {id: row.id}})
        },
        // 删除
        deteleFn(row) {
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                loginService.deleteContracts(row.id, {}).then(res => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!!'
                    });
                    this.queryData(this.pageInfo.search);
                }).catch(err => {
                    console.log(err);
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 详情
        details(row) {
            this.$router.push({path: '/detailsContract', query: {id: row.id}})
        }
    }
}
</script>

<style scoped>

</style>

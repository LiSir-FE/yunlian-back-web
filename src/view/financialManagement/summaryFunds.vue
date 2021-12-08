<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/summaryFunds' }">财务管理</el-breadcrumb-item>
                <el-breadcrumb-item>资金总览</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" label-width="10px" @submit.native.prevent :inline="true">
            <el-input v-model="pageInfo.search" placeholder="请输入关键字搜索" class="wetuc-input3-col3"
                      @keyup.enter.native="queryData(pageInfo.search)">
                <i slot="suffix" class="el-input__icon el-icon-search"
                   @click="queryData(pageInfo.search)" style="cursor: pointer"></i>
            </el-input>
            <el-button type="primary">导出记录</el-button>
        </el-form>

        <div class="divider">
            <div>累计总收入（元）<span><countTo class="wetuc-spanRed" :startVal='0' :endVal='Number(totalMoney)' :duration='3000'></countTo></span></div>
            <el-divider direction="vertical"></el-divider>
            <div>在线支付累计（元）<span><countTo class="wetuc-spanRed" :startVal='0' :endVal='Number(onlineMoney)' :duration='3000'></countTo></span></div>
            <el-divider direction="vertical"></el-divider>
            <div>线下收入导入（元）<span><countTo class="wetuc-spanRed" :startVal='0' :endVal='Number(offlineMoney)' :duration='3000'></countTo></span></div>
            <el-divider direction="vertical"></el-divider>
        </div>
        <div class="divider">
            <div>可提现金额（元）<span><countTo class="wetuc-spanRed" :startVal='0' :endVal='Number(availableMoney)' :duration='3000'></countTo></span></div>
            <el-divider direction="vertical"></el-divider>
            <div>已累计提现（元）<span><countTo class="wetuc-spanRed" :startVal='0' :endVal='Number(withdrawMoney)' :duration='3000'></countTo></span></div>
            <el-divider direction="vertical"></el-divider>
            <div>正在申请中（元）<span><countTo class="wetuc-spanRed" :startVal='0' :endVal='Number(withdrawApplyMoney)' :duration='3000'></countTo></span></div>
            <el-divider direction="vertical"></el-divider>
            <div>冻结金额（元）<span><countTo class="wetuc-spanRed" :startVal='0' :endVal='Number(frozenMoney)' :duration='3000'></countTo></span></div>
            <el-divider direction="vertical"></el-divider>
        </div>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column label="创建时间" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span> {{scope.row.createTime | stampFormate}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="订单号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column label="类型" min-width="50" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.type | typeFormate}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="typeTitle" label="名称" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column label="金额（元）" min-width="50" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.flowAmount | moneyFormate}}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" min-width="60" align="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-view" size="small" @click="detailsFn(scope.row)">详情</el-button>
<!--                    <el-button type="text" icon="el-icon-delete" class="red" size="small">删除</el-button>-->
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


        <el-dialog title="收入详情" :visible.sync="dialogVisible" width="30%">

            <el-descriptions title="买家信息">
                <el-descriptions-item label="姓名" label-class-name="my-label">{{ orderNoPage.name }}</el-descriptions-item>
                <el-descriptions-item label="手机" label-class-name="my-label">{{ orderNoPage.phone }}</el-descriptions-item>
                <el-descriptions-item label="公司" label-class-name="my-label">{{ orderNoPage.company }}</el-descriptions-item>
                <el-descriptions-item label="职位" label-class-name="my-label">{{ orderNoPage.position }}</el-descriptions-item>
            </el-descriptions>

            <el-descriptions title="订单信息">
                <el-descriptions-item label="创建时间" label-class-name="my-label">{{ orderNoPage.createTime | stampFormate }}</el-descriptions-item>
                <el-descriptions-item label="商品名称" label-class-name="my-label">{{ orderNoPage.orderTitle }}</el-descriptions-item>
                <el-descriptions-item label="单价/数量" label-class-name="my-label">{{ orderNoPage.ticketPrice | moneyFormate }} / {{orderNoPage.status}}</el-descriptions-item>
                <el-descriptions-item label="金额" label-class-name="my-label">{{ orderNoPage.amount |  moneyFormate}}</el-descriptions-item>
                <el-descriptions-item label="订单号" label-class-name="my-label">{{ orderNoPage.orderNo }}</el-descriptions-item>
            </el-descriptions>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>



    </div>
</template>

<script>
    import {loginService} from "../../service/loginService";
    import countTo from 'vue-count-to'
    export default {
        data() {
            return {
                totalMoney: '',
                onlineMoney: '',
                offlineMoney: '',
                availableMoney: '',
                withdrawMoney: '',
                withdrawApplyMoney: '',
                frozenMoney: '',
                dialogVisible: false,
                pageInfo: {
                    search: '',
                    adminId: ''
                },
                orderNoPage: {
                    position: '',
                    name: '',
                    phone: '',
                    company: '',
                    orderNo: '',
                    createTime: '',
                    orderTitle: '',
                    ticketPrice: 0,
                    status: 0,
                    amount: 0
                },
                tableLoading: false,
                tableData: [],
                imgUrl: process.env.IMG_URL,
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
            }
        },
        components: { countTo },
        mounted() {
            this.getAdminInfo()
        },
        methods: {
            queryData(search) {
                let that = this;
                that.tableLoading = true;
                loginService.getwallets({
                    query: search,
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                    searchType: 1,
                    adminId: that.pageInfo.adminId
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
            detailsFn(row) {
                let that = this;
                that.dialogVisible = true;
                loginService.getOdersNo({
                    orderNo: row.orderNo
                }).then(res => {
                    if(res.data.success) {
                        that.$nextTick(() => {
                            that.orderNoPage.name = res.data.datas.orderDetails[0].adminApplyInfo.姓名
                            that.orderNoPage.phone = res.data.datas.orderDetails[0].adminApplyInfo.手机
                            that.orderNoPage.company = res.data.datas.orderDetails[0].adminApplyInfo.公司
                            that.orderNoPage.position = res.data.datas.orderDetails[0].adminApplyInfo.职位
                            that.orderNoPage.orderNo = res.data.datas.orderNo
                            that.orderNoPage.orderTitle = res.data.datas.orderTitle
                            that.orderNoPage.amount = res.data.datas.amount
                            that.orderNoPage.ticketPrice = res.data.datas.orderDetails[0].ticketPrice,
                            that.orderNoPage.status = res.data.datas.orderDetails[0].status,

                            that.orderNoPage.createTime = res.data.datas.orderLogs[0].createTime
                        })
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            // 获取管理员信息
            getAdminInfo() {
                let that = this;
                loginService.getAdminInfo().then(function (res){
                    if(res.data.success) {
                        that.queryData(that.pageInfo.search);
                        that.getmoneys(res.data.datas.id);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            // 获取元
            getmoneys(id) {
                let that = this;
                loginService.getAdminInfo(id, {}).then(function (res){
                    if(res.data.success) {
                        that.totalMoney = res.data.datas.wallet.totalMoney
                        that.onlineMoney = res.data.datas.wallet.onlineMoney
                        that.offlineMoney = res.data.datas.wallet.offlineMoney
                        that.availableMoney = res.data.datas.wallet.availableMoney
                        that.withdrawMoney = res.data.datas.wallet.withdrawMoney
                        that.withdrawApplyMoney = res.data.datas.wallet.withdrawApplyMoney
                        that.frozenMoney = res.data.datas.wallet.frozenMoney
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            // 分页
            handleSizeChange (val) {
                this.page.pageSize = val;
                this.queryData(this.pageInfo.search);
            },
            handleCurrentChange (val) {
                if (val !== 0) {
                    this.page.pageNum = val;
                    this.queryData(this.pageInfo.search);
                }
            },
        },
    }
</script>

<style scoped>
</style>

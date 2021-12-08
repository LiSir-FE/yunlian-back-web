<template>
    <div class="wetuc-page-content">
        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="80px">
            <el-input v-model="pageInfo.search" placeholder="搜索账号/名称" class="wetuc-input3-col3"
                      @keyup.enter.native="queryData">
                <i slot="suffix" class="el-input__icon el-icon-search"
                   @click="queryData" style="cursor: pointer"></i>
            </el-input>


            <el-select v-model="pageInfo.orderStatus" placeholder="请选择状态" class="wetuc-input3-col3"
                       @change="queryData()">
                <el-option
                    v-for="item in orderStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <el-select v-model="pageInfo.online" placeholder="请选择支付方式" class="wetuc-input3-col3" @change="queryData()">
                <el-option
                    v-for="item in online"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" @click.prevent="exportInfo()">导出</el-button>
        </el-form>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column :key="Math.random()" label="姓名" prop="orderDetails[0].applyName" min-width="80"
                             show-overflow-tooltip></el-table-column>
            <el-table-column :key="Math.random()" label="公司" prop="orderDetails[0].applyInfo.公司" min-width="80"
                             show-overflow-tooltip></el-table-column>
            <el-table-column :key="Math.random()" label="手机号" prop="orderDetails[0].applyPhone" min-width="100"
                             show-overflow-tooltip></el-table-column>
            <el-table-column :key="Math.random()" label="票券类型" prop="orderDetails[0].ticketName" min-width="80"
                             show-overflow-tooltip></el-table-column>
            <el-table-column :key="Math.random()" label="总额/数量(元/张)" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.amount | moneyFormate }}/{{ scope.row.orderDetails[0].ticketNum }}
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" label="支付方式" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.online">线上支付</span>
                    <span v-else>线下支付</span>
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" label="订单状态" prop="status" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{ scope.row.status | orderStatus }}
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="80" align="right" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="detailsFn(scope.row)">查看
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

        <el-dialog title="订单详情" :visible.sync="dialogVisible" width="30%">
            <el-descriptions title="买家信息">
                <template v-for="(v, key) of orderNoPage.user">
                    <el-descriptions-item  :label="key" label-class-name="my-label">{{v}}</el-descriptions-item>
                </template>
            </el-descriptions>

            <el-descriptions title="订单信息">
                <el-descriptions-item label="创建时间" label-class-name="my-label">{{orderNoPage.createTime | stampFormate }}</el-descriptions-item>
                <el-descriptions-item label="商品名称" label-class-name="my-label">{{orderNoPage.orderTitle }}</el-descriptions-item>
                <el-descriptions-item label="单价/数量" label-class-name="my-label">{{ orderNoPage.ticketPrice | moneyFormate }} / {{ orderNoPage.ticketNum }}</el-descriptions-item>
                <el-descriptions-item label="金额" label-class-name="my-label">{{ orderNoPage.amount |  moneyFormate }}</el-descriptions-item>
                <el-descriptions-item label="订单号" label-class-name="my-label">{{orderNoPage.orderNo }}</el-descriptions-item>
                <el-descriptions-item label="订单状态" label-class-name="my-label">{{status[orderNoPage.status] }}</el-descriptions-item>
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
import {orderStatus} from '../../filter/companyList'

export default {
    props: {
        id: {
            type: String
        }
    },
    data() {
        return {
            pageInfo: {
                search: '',
                orderStatus: '',
                online: false,
            },
            status:['',
                '待支付','待审核','已付款','已取消','交易关闭','退款待审核','退款中','退款失败','审核通过',
                '审核不通过','退款申请中','退款拒绝','撤销退款','订单支付超时','退款成功','待领取','代发货','已发货','交易完成'
            ],
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            tableData: [],
            dialogVisible: false,
            multipleSelection: [],
            tableLoading: false,
            orderNoPage: {
                position: '',
                name: '',
                phone: '',
                company: '',
                orderNo: '',
                createTime: '',
                orderTitle: '',
                ticketPrice: 0,
                ticketNum: 0,
                status: 0,
                amount: 0,
                user: ''
            },
            orderStatus: [{
                value: '',
                label: '全部'
            }, {
                value: '1',
                label: '成功报名'
            }, {
                value: '2',
                label: '待审核'
            }, {
                value: '3',
                label: '待支付'
            }, {
                value: '4',
                label: '已关闭'
            }, {
                value: '5',
                label: '已拒绝'
            }],
            online: [{
                value: true,
                label: '线上支付(支付宝或微信)'
            }, {
                value: false,
                label: '线下支付'
            }]
        }
    },
    filters: {
        orderStatus
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
    mounted() {
        this.$nextTick(() => {
            this.queryData()
        })
    },
    methods: {
        queryData() {
            let that = this;
            loginService.getActivityOrder({
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize,
                query: that.pageInfo.search,
                actId: that.id,
                orderStatus: that.pageInfo.orderStatus,
                online: that.pageInfo.online
            }).then(function (res) {
                if (res.data.success) {
                    let result = res.data.datas
                    that.tableData = result.datas
                    that.page.total = Number(result.totalCount);
                    setTimeout(function () {
                        that.tableLoading = false
                    }, 300)
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) { // 捕获异常
                console.log(err);
            });
        },
        // 导出数据
        exportInfo() {
            let that = this
            loginService.exportInfo('export/act_order', {
                activityId: that.id
            });
        },
        detailsFn(row) {
            let that = this;
            that.dialogVisible = true;
            loginService.getOdersNo({
                orderNo: row.orderNo
            }).then(res => {
                if (res.data.success) {
                    that.$nextTick(() => {
                        that.orderNoPage.user = res.data.datas.orderDetails[0].applyInfo
                        that.orderNoPage.orderNo = res.data.datas.orderNo
                        that.orderNoPage.orderTitle = res.data.datas.orderTitle
                        that.orderNoPage.amount = res.data.datas.amount
                        that.orderNoPage.ticketPrice = res.data.datas.orderDetails[0].ticketPrice,
                        that.orderNoPage.ticketNum = res.data.datas.orderDetails[0].ticketNum,
                        that.orderNoPage.status = res.data.datas.orderDetails[0].status,
                        that.orderNoPage.createTime = res.data.datas.orderLogs[0].createTime
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 分页
        handleSizeChange(val) {
            this.page.pageSize = val
            this.queryData()
        },
        handleCurrentChange(val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.queryData()
            }
        },
        // table选择
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 取消
        cancel() {
            this.$router.push({path: 'activityListManagement'})
        },
    },
}
</script>

<style scoped>

</style>

<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/companyList' }">工作台</el-breadcrumb-item>
                <el-breadcrumb-item>公司列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" label-width="5px" @submit.native.prevent :inline="true">

            <el-input v-model="pageInfo.search" placeholder="搜索账号/名称" class="wetuc-input3-col3"
                      @keyup.enter.native="queryData(pageInfo.search)">
                <i slot="suffix" class="el-input__icon el-icon-search"
                   @click="queryData(pageInfo.search)" style="cursor: pointer"></i>
            </el-input>

            <el-select v-model="pageInfo.staffFunction" placeholder="请选择一级人员" class="wetuc-input3-col3" clearable @change="staffFunctionChange">
                <el-option
                    v-for="item in staffFunction"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <el-select v-model="pageInfo.staffId" placeholder="请选择二级人员" class="wetuc-input3-col3" clearable @change="staffIdChange">
                <el-option
                    v-for="item in staffIdList"
                    :key="item.id"
                    :label="item.hostCompany"
                    :value="item.id">
                </el-option>
            </el-select>

            <el-select v-model="pageInfo.radio" placeholder="" class="wetuc-input3-col3"  @change="radioChange">
                <el-option
                    v-for="item in optionsList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-button type="primary" @click="addCompany">添加公司</el-button>
        </el-form>
        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="name" label="公司" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="companyVip" label="企业会员" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.companyVip | companyVip}}
                </template>
            </el-table-column>
            <el-table-column prop="sellChargeName" label="营销顾问" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="pressChargeName" label="媒体顾问" min-width="100" show-overflow-tooltip></el-table-column>

            <el-table-column prop="userNum" label="成员" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="articleNum" label="动态" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="activityNum" label="活动" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jobNum" label="轨迹" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="infoNum" label="商机" min-width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="fieldName" label="一级行业" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="subFieldName" label="二级行业" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" min-width="320" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click="modify(scope.row)">修改</el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click="modify(scope.row)">高级修改</el-button>
                    <el-button type="text" icon="el-icon-view" size="small" @click="getCompaniesFieldlogs(scope.row)">查看修改日志</el-button>
                    <el-button type="text" icon="el-icon-view" size="small" @click="detailsFn(scope.row)">详情</el-button>
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


        <el-dialog title="查看修改日志" :visible.sync="dialogTableVisible">
            <el-table :data="gridData">
                <el-table-column label="时间" min-width="80">
                    <template slot-scope="scope">
                        {{scope.row.changeTime | stampFormate}}
                    </template>
                </el-table-column>
                <el-table-column property="log" label="修改内容" min-width="450" show-overflow-tooltip></el-table-column>
                <el-table-column property="adminHostName" label="操作人" width="80"></el-table-column>
            </el-table>
            <div class="wetuc-pagination-panel">
                <el-pagination
                    @size-change="gridDatahandleSizeChange"
                    @current-change="gridDatahandleCurrentChange"
                    :current-page="gridDataPage.pageNum"
                    :page-sizes="[5, 10, 20, 50]"
                    :page-size="gridDataPage.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="gridDataPage.total">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {loginService} from '../../service/loginService'
import {field, staffNum, againField, againTwoField, companyVip} from '../../filter/companyList'

export default {
    data () {
        return {
            pageInfo: {
                staffFunction: '',
                staffId: '',
                search: '',
                radio: ''
            },
            gridData: [],
            dialogTableVisible: false,
            gridDataPage:{
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            // 人员顾问
            staffFunction: [{
                value: '1',
                label: '销售-未分配'
            },{
                value: '2',
                label: '媒体-未分配'
            },{
                value: '3',
                label: '行业-未分配'
            },{
                value: '0',
                label: '全部-未分配'
            },{
                value: '4',
                label: '全部-已分配'
            },{
                value: '5',
                label: '销售-已分配'
            },{
                value: '6',
                label: '媒体-已分配'
            },{
                value: '7',
                label: '行业-已分配'
            }],
            staffIdList: [],
            optionsList: [{
                value: '1',
                label: '未填'
            }, {
                value: '2',
                label: '已填'
            }, {
                value: '',
                label: '全部'
            }],
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
        field,
        staffNum,
        againField,
        againTwoField,
        companyVip
    },
    mounted () {
        this.queryData(this.pageInfo.search);
    },
    methods: {
        // 获取列表
        queryData(search) {
            let that = this;
            that.tableLoading = true;
            loginService.getCompaniesAll({
                param: search,
                provCode: that.pageInfo.radio,
                staffFunction: that.pageInfo.staffFunction,
                staffId: that.pageInfo.staffId,
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize
            }).then(res => {
                if(res.data.success) {
                    let result = res.data.datas;
                    that.tableData = result.datas;
                    that.page.total = Number(result.totalCount);
                    setTimeout(function () {
                        that.tableLoading = false
                    }, 300)
                } else {
                    that.$message.error(res.data.message)
                }
            }).catch(err => {
                console.log('err', err);
            });
        },
        // 获取一级人员
        staffFunctionChange(item) {
            this.pageInfo.staffId = '';
            this.staffIdList = [];
            if (item >= 5) {
                item = item - 4;
            }
            loginService.getStaff({
                staffFunction: item
            }).then(res => {
                if (res.data.success) {
                    let result = res.data.datas;
                    result.forEach(item => {
                        this.staffIdList.push({
                            hostCompany: item.hostName,
                            id: item.id
                        })
                    })
                    this.queryData(this.pageInfo.search);
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 二级人员
        staffIdChange() {
            this.queryData(this.pageInfo.search);
        },
        // 全部
        radioChange() {
            this.queryData(this.pageInfo.search);
        },
        // 添加公司
        addCompany() {
            this.$store.commit('setAddCompanyUrl', '/companyList');
            this.$store.commit('setAddCompanyName', '公司列表');
            this.$router.push({path: '/addCompany'})
        },
        // // 编辑-修改
        modify(scope) {
            this.$store.commit('setAddCompanyUrl', '/companyList');
            this.$store.commit('setAddCompanyName', '公司列表');
            this.$router.push({path: '/editCompany', query: {id: scope.id}})
        },
        getCompaniesFieldlogs(row) {
            let that = this;
            that.dialogTableVisible = true;
            loginService.getCompaniesFieldlogs(row.id,{
                pageNo: that.gridDataPage.pageNum,
                pageSize: that.gridDataPage.pageSize
            }).then(res => {
                if(res.data.success) {
                    let result = res.data.datas;
                    that.gridData = result.datas;
                    that.gridDataPage.total = Number(result.totalCount);
                }
            }).catch(err => {
                console.log('err', err);
            });
        },
        // // 查看详情
        detailsFn(scope) {
            this.$store.commit('setAddCompanyUrl', '/companyList');
            this.$store.commit('setAddCompanyName', '公司列表');
            this.$router.push({path: 'detailsCompany', query: {id: scope.id}})
        },
        // 关注
        collectFlase(scope) {
            let that = this;
            loginService.collectFlase({
                companyId: scope.id
            }).then(res => {
                if(res.data.success) {
                    this.queryData(this.pageInfo.search);
                } else {
                    if(res.data.code === 550102) {
                        that.$message({
                            type: 'info',
                            message: res.data.message
                        })
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 取消关注
        collectTrue(scope) {
            let that = this;
            loginService.collectTrue({
                companyId: scope.id
            }).then(res => {
                if(res.data.success) {
                    this.queryData(this.pageInfo.search);
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 删除
        deleteFn(scope) {
            this.$confirm('是否确定删除？', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                loginService.deleteCompanies(scope.id, {
                }).then(res => {
                    if(res.data.success) {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.queryData(this.pageInfo.search);
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });

        },
        // 分页
        gridDatahandleSizeChange(val) {
            this.gridDataPage.pageSize = val;
            this.getCompaniesFieldlogs();
        },
        gridDatahandleCurrentChange(val) {
            this.gridDataPage.pageNum = val;
            this.getCompaniesFieldlogs();
        },
        // 分页
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.queryData(this.pageInfo.search);
        },
        handleCurrentChange(val) {
            this.page.pageNo = val;
            this.queryData(this.pageInfo.search);
        }
    }
}
</script>

<style scoped>

</style>

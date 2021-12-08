<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/companyList' }">工作台</el-breadcrumb-item>
                <el-breadcrumb-item>分配列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" label-width="5px" @submit.native.prevent :inline="true">

            <el-input v-model="pageInfo.search" placeholder="搜索账号/名称" class="wetuc-input3-col3"
                      @keyup.enter.native="getAdminInfo">
                <i slot="suffix" class="el-input__icon el-icon-search"
                   @click="getAdminInfo" style="cursor: pointer"></i>
            </el-input>

            <el-select v-model="pageInfo.findustry" placeholder="请选择一级行业" class="wetuc-input3-col3" clearable @change="industryChange">
                <el-option
                    v-for="item in findustry"
                    :key="item.field"
                    :label="item.name"
                    :value="item.field">
                </el-option>
            </el-select>

            <el-select v-model="pageInfo.tindustry" placeholder="请选择二级行业" class="wetuc-input3-col3" clearable @change="getAdminInfo">
                <el-option
                    v-for="item in tindustry"
                    :key="item.field"
                    :label="item.name"
                    :value="item.field">
                </el-option>
            </el-select>
        </el-form>
        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="name" label="公司" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="fieldName" label="一级行业" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="subFieldName" label="二级行业" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userNum" label="成员" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="articleNum" label="动态" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jobNum" label="轨迹" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" min-width="120" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="details(scope.row)">
                        详情
                    </el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" v-if="scope.row.collect === false" @click.prevent="collectFlase(scope.row)">
                        关注
                    </el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" size="small" v-if="scope.row.collect === true" @click.prevent="collectTrue(scope.row)">
                        取消关注
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
import {field, staffNum, againField, againTwoField, companyVip} from '../../filter/companyList'

export default {
    data () {
        return {
            tableLoading: false,
            pageInfo: {
                company: '',
                findustry: '',
                tindustry: '',
            },
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            findustry: [],
            tindustry: [],
            tableData: []
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
        this.getAdminInfo();
        this.getindustryOptions();
    },
    methods: {
        // 获取列表
        getAdminInfo() {
            let that = this;
            that.tableLoading = true;
            loginService.getDistribution({
                param: that.pageInfo.company,
                field: that.pageInfo.findustry,
                subField: that.pageInfo.tindustry,
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize
            }).then(res => {
                if(res.data.code == 200) {
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
        // 获取一级行业
        getindustryOptions() {
            loginService.getindustryOptions({
                level: 1
            }).then(res => {
                this.findustry = res.data.datas;
            }).catch(err => {
                console.log(err);
            })
        },
        // 获取二级
        industryChange(value) {
            this.pageInfo.tindustry = '';
            this.tindustry = [];
            loginService.getindustryOptions({
                level: 2,
                fField: value
            }).then(res => {
                this.tindustry = res.data.datas;
                this.getAdminInfo()
            }).catch(err => {
                console.log(err);
            })
        },
        details(row) {
            this.$store.commit('setAddCompanyUrl', '/distributionList');
            this.$store.commit('setAddCompanyName', '分配列表');
            this.$router.push({path: 'detailsCompany', query: {id: row.id}})
        },
        // 筛选
        screen() {
            this.page.pageNo = 1;
            this.getAdminInfo();
        },
        // 添加公司
        // addCompany() {
        //     this.$router.push({name: 'addCompany'})
        // },
        // // 编辑-修改
        // modify(scope) {
        //     this.$router.push({name: 'editCompany', query: {id: scope.id}})
        // },
        // // 查看详情
        // details(scope) {
        //     this.$router.push({name: 'detailsCompany', query: {id: scope.id}})
        // },
        // 关注
        collectFlase(scope) {
            let that = this;
            loginService.collectFlase({
                companyId: scope.id
            }).then(res => {
                if(res.data.success) {
                    that.getAdminInfo();
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
                    that.getAdminInfo();
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
                        this.getAdminInfo();
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
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.getAdminInfo()
        },
        handleCurrentChange(val) {
            this.page.pageNo = val;
            this.getAdminInfo()
        }
    }
}
</script>

<style scoped>

</style>

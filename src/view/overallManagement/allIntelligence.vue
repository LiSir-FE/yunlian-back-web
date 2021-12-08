<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/allArticles' }">总体管理</el-breadcrumb-item>
                <el-breadcrumb-item>所有商机</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="pageInfo" :model="pageInfo" label-width="80px" @submit.native.prevent :inline="true">
            <div class="wetuc-page-block">

                <el-input v-model="pageInfo.search" placeholder="搜索课程名称" class="wetuc-input3-col3"
                          @keyup.enter.native="wholeAll">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                       @click.prevent="wholeAll" style="cursor: pointer"></i>
                </el-input>

                <el-select v-model="pageInfo.type" placeholder="请选择碎片类型" class="wetuc-input133-col130" clearable @change="wholeAll()">
                    <el-option
                        v-for="item in typeOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>

            </div>

        </el-form>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="infoType" label="碎片类型" min-width="80">
                <template slot-scope="scope">
                    {{scope.row.infoType | infoType}}
                </template>
            </el-table-column>
            <el-table-column prop="infoTitle" label="碎片标题" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="hostName" label="发现人" min-width="60" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="时间" min-width="100">
                <template slot-scope="scope">
                    {{scope.row.createTime | stampFormate4}}
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="60" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="details(scope.row)">
                        详情
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
    import {infoType} from '../../filter/companyList'
    import {stampFormate4} from '../../filter/index'

    export default {
        data () {
            return {
                tableLoading: false,
                pageInfo: {
                    title: '',
                    type: ''
                },
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0
                },
                typeOption: [{
                    value: '1',
                    label: '商机'
                },{
                    value: '2',
                    label: '重要信息'
                },{
                    value: '3',
                    label: '其他信息'
                }],
                tableData: []
            }
        },
        filters: {
            infoType
        },
        mounted () {
            this.wholeAll();
        },
        methods: {
            // 查全部
            wholeAll() {
                let that = this;
                that.tableLoading = true;
                loginService.informationListAll({
                    param: that.pageInfo.title,
                    infoType: that.pageInfo.type,
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize
                }).then(res => {
                    if (res.data.code == 200) {
                        let result = res.data.datas;
                        that.tableData = result.datas;
                        that.page.total = Number(result.totalCount);
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    } else {
                        that.$message.error(res.data.message)
                    }
                }).catch(err =>{
                    console.log(err);
                })
            },
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
            // 筛选
            screen() {
                this.page.pageNo = 1;
                this.wholeAll();
            },
            // // 编辑-修改
            // modify(scope) {
            //     this.$router.push({name: 'editInformation', query: {id: scope.id}})
            // },
            // 查看详情
            details(scope) {
                this.$store.commit('setAddCompanyUrl', '/opportunityList');
                this.$store.commit('setAddCompanyName', '商机列表');
                this.$router.push({path: 'detailsOpportunity', query: {id: scope.id}})
            },
            // 分页
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.wholeAll();
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.wholeAll();
            }
        }
    }
</script>

<style scoped>

</style>

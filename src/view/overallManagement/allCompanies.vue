<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/allArticles' }">总体管理</el-breadcrumb-item>
                <el-breadcrumb-item>所有公司</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" label-width="5px" @submit.native.prevent :inline="true">
            <div class="wetuc-block">
                <el-input v-model="pageInfo.search" placeholder="搜索公司名称" class="wetuc-input3-col3"
                          @keyup.enter.native="getAdminInfo()">
                    <i slot="suffix" class="el-input__icon el-icon-search"
                       @click="getAdminInfo()" style="cursor: pointer"></i>
                </el-input>

                <el-select v-model="pageInfo.findustry" placeholder="请选择一级行业" class="wetuc-input3-col3" clearable @change="industryChange">
                    <el-option
                        v-for="item in findustry"
                        :key="item.field"
                        :label="item.name"
                        :value="item.field">
                    </el-option>
                </el-select>

                <el-select v-model="pageInfo.tindustry" placeholder="请选择二级行业" class="wetuc-input3-col3" clearable>
                    <el-option
                        v-for="item in tindustry"
                        :key="item.field"
                        :label="item.name"
                        :value="item.field">
                    </el-option>
                </el-select>

                <el-select v-model="pageInfo.companyVip" placeholder="请选择企业会员" class="wetuc-input3-col3" clearable>
                    <el-option
                        v-for="item in companyVipList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>

            <el-cascader
                v-if="flag"
                class="wetuc-input3-col3"
                placeholder="请选择城市"
                :props="props"
                v-model="pageInfo.options">
            </el-cascader>

            <el-select v-model="pageInfo.staffFunction" placeholder="请选择一级人员" class="wetuc-input3-col3" clearable @change="staffFunctionChange">
                <el-option
                    v-for="item in staffFunctionList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <el-select v-model="pageInfo.staffId" placeholder="请选择二级人员" class="wetuc-input3-col3">
                <el-option
                    v-for="item in staffIdList"
                    :key="item.id"
                    :label="item.hostCompany"
                    :value="item.id">
                </el-option>
            </el-select>

            <el-button type="primary" @click="screen">筛 选</el-button>
        </el-form>
        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="name" label="公司" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="companyVip" label="企业会员" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.companyVip | companyVip}}
                </template>
            </el-table-column>
            <el-table-column prop="fieldName" label="一级行业" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="subFieldName" label="二级行业" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userNum" label="成员" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="articleNum" label="动态" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="activityNum" label="活动" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="jobNum" label="轨迹" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="infoNum" label="商机" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" min-width="120" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="detailsFn(scope.row)">
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
    import axios from "axios";

    export default {
        data () {
            return {
                tableLoading: false,
                flag: true,
                pageInfo: {
                    search: '',
                    findustry: '',
                    tindustry: '',
                    companyVip: '',
                    options: [this.$route.params.code ? this.$route.params.name + '/' + this.$route.params.code : '', ''],
                    staffFunction: this.$route.params.staffFunction ? this.$route.params.staffFunction : '',
                    staffId: ''
                },
                staffFunctionList: [{
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
                props:{
                    lazy: true,
                    checkStrictly: true,
                    lazyLoad: (node, resolve) => this.loadNode(node, resolve)
                },
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    total: 0,
                },
                companyVipList: [{
                    value: 1,
                    label: '会员'
                },{
                    value: 2,
                    label: '潜在会员'
                },{
                    value: 3,
                    label: '非会员'
                }],
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
            this.getindustryOptions();
            this.getAdminInfo();
        },
        methods: {
            // 获取列表
            getAdminInfo() {
                let that = this;
                that.tableLoading = true;
                loginService.getCompaniesAll({
                    param: that.pageInfo.search,
                    field: that.pageInfo.findustry,
                    subField: that.pageInfo.tindustry,
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                    companyVip: that.pageInfo.companyVip,

                    staffFunction: that.pageInfo.staffFunction,
                    staffId: that.pageInfo.staffId,
                    provCode: that.pageInfo.options[0] ? that.pageInfo.options[0].split('/')[1] : '',
                    cityCode: that.pageInfo.options[1] ? that.pageInfo.options[1].split('/')[1] : ''
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
                }).catch(err => {
                    console.log(err);
                })
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
            detailsFn(scope) {
                this.$store.commit('setAddCompanyUrl', '/allCompanies');
                this.$store.commit('setAddCompanyName', '所有公司');
                this.$router.push({path: 'detailsCompany', query: {id: scope.id}})
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
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            loadNode(node, resolve) {
                const { level } = node
                console.log(level);
                let code = 0
                if(level != 0) {
                    code = node.data.value.split('/')[1]
                }
                let apis = process.env.API_ROOT
                let url = apis + 'citys'
                if(level > 0) {
                    url = apis + `citys/${code}`
                }
                axios.get(url).then(res => {
                    let nodes = res.data.datas.map(({ name, cityId }) => {
                        return {
                            label: name,
                            value: `${name}/${cityId}`,
                            leaf: level >= 1
                        }
                    });
                    resolve(nodes)
                })
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

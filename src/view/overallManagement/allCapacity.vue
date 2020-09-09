<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/allArticles' }">总体管理</el-breadcrumb-item>
                <el-breadcrumb-item>所有车队</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <el-form ref="pageInfo" :model="pageInfo" label-width="80px">

            <el-input v-model="pageInfo.query" placeholder="搜索" class="wetuc-input3-col3"
                      @keyup.enter.native="queryData(pageInfo.classId, pageInfo.tagId, pageInfo.status)">
                <i slot="suffix" class="el-input__icon el-icon-search"
                   @click="queryData(pageInfo.classId, pageInfo.tagId, pageInfo.status)" style="cursor: pointer"></i>
            </el-input>

            <el-select v-model="pageInfo.carName" class="wetuc-input3-col3" @change="carNameChange" clearable>
                <el-option
                    v-for="item in carNameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>

            <el-button type="primary">筛 选</el-button>

        </el-form>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="name" label="车队名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="companyName" label="服务公司" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="bandName" label="品牌" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="carTeamLine" label="线路" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="carNum" label="车辆总数" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="driverNum" label="司机总数" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" min-width="60" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="detailsClick(scope.row)">
                        详情
                    </el-button>
                    <!--<el-button type="text" size="small" @click="editClick(scope.row)">-->
                    <!--修改-->
                    <!--</el-button>-->
                    <!--<el-button type="text" size="small" @click="deleteClick(scope.row)">-->
                    <!--删除-->
                    <!--</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <div class="wetuc-pagination-panel">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total">
            </el-pagination>
        </div>


    </div>
</template>

<script>
    import {loginService} from '../../service/loginService'

    export default {
        data () {
            return {
                pageInfo: {
                    query: '',
                    carName: ''
                },
                carNameList: [{
                    label: '车队名称',
                    value: '1'
                }, {
                    label: '车辆品牌',
                    value: '2'
                }, {
                    label: '车辆数',
                    value: '3'
                }, {
                    label: '线路',
                    value: '5'
                }],
                tableLoading: false,
                tableData: [],
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        mounted () {
            this.getfleetList();
        },
        methods: {
            // 获取列表
            getfleetList() {
                let that = this;
                that.tableLoading = true;
                loginService.getfleetList({
                    type: that.pageInfo.carName,
                    param: that.pageInfo.query,
                    startName: that.pageInfo.startCity ? that.pageInfo.startCity : that.pageInfo.startProvince,
                    endName: that.pageInfo.endCity ? that.pageInfo.endCity : that.pageInfo.endProvince,
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                    lowNum: that.pageInfo.carName !== '3' ? '' : that.pageInfo.stateNum,
                    topNum: that.pageInfo.carName !== '3' ? '' : that.pageInfo.endNum,
                }).then(res => {
                    if (res.data.code == 200) {
                        let result = res.data.datas;
                        that.tableData = result.datas;
                        that.page.total = Number(result.totalCount);
                    } else {
                        that.$message.error(res.data.message)
                    }
                    setTimeout(function () {
                        that.tableLoading = false
                    }, 300)
                }).catch(err => {
                    console.log(err);
                })
            },
            // 修改
            editClick(row) {
                this.$router.push({path: '/editfleet', query: {id: row.id}});
            },
            // 详情
            detailsClick(row) {
                this.$router.push({path: '/fleetDetails', query: {id: row.id}});
            },
            // 分页
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.getfleetList();
            },
            carNameChange() {
                this.pageInfo.query = '';
            },
            handleCurrentChange(val) {
                this.page.pageNum = val;
                this.getfleetList();
            }
        }
    }
</script>

<style scoped>

</style>

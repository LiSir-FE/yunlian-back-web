<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/advertisingManagement' }">版权管理</el-breadcrumb-item>
                <el-breadcrumb-item>版权列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="name" label="版位名称" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="link" label="落地页" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.status | copyrightStates}}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                    <p>{{scope.row.createTime | stampFormate}}</p>
                </template>
            </el-table-column>
            <el-table-column fixed="right" align="right" label="操作" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click.prevent="modify(scope)">
                        修改
                    </el-button>
                    <el-button type="text" size="small" @click.prevent="deleteFn(scope)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {loginService} from '../../service/loginService'
    import {copyrightStates} from '../../filter/companyList'

    export default {
        data () {
            return {
                location: this.$route.query.location,
                picWidth: this.$route.query.picWidth,
                tableData: [],
                tableLoading: false
            }
        },
        filters: {
            copyrightStates
        },
        mounted () {
            this.getGuanggaoInfo();
        },
        methods: {
            // 获取版位列表
            getGuanggaoInfo() {
                let that = this;
                that.tableLoading = true;
                loginService.getGuanggaoInfo({
                    location: that.location,
                }).then(res => {
                    if (res.data.code == 200) {
                        let result = res.data.datas;
                        that.tableData = result;
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    } else {
                        that.$message.error(res.data.message)
                    }
                }).catch(err => {
                    console.log(err);
                })
            },

            // 编辑
            modify(scope) {
                this.$router.push({path: '/editVertisingManagement', query: {id: scope.row.id, location: scope.row.location, picWidth: this.picWidth}})
            },

            // 删除
            deleteFn(scope) {
                let that = this;
                that.$confirm('确认删除' + scope.row.name + '吗?', '严重警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    loginService.deleteGuanggaoInfo(scope.row.id, {}).then(res => {
                        if (res.data.code == 200) {
                            that.$message({
                                message: '删除成功！',
                                type: 'success'
                            });
                            that.getGuanggaoInfo();
                        } else {
                            that.$message.error(res.data.message)
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>

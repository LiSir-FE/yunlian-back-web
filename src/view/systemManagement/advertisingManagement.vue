<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/roleManagement' }">系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>版权管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--<div class="wetuc-page-header">-->
            <!--<p>版位管理</p>-->
        <!--</div>-->


        <el-table :data="tableData" style="width: 100%" element-loading-text="拼命加载中">
            <el-table-column prop="name" label="版位名称" min-width="150"></el-table-column>
            <el-table-column prop="size" label="尺寸" min-width="100"></el-table-column>
            <el-table-column prop="type" label="类型" min-width="100"></el-table-column>
            <el-table-column fixed="right" prop="date" label="详情" min-width="200" align="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click.prevent="advertisingList(scope)">
                        版权列表
                    </el-button>
                    <el-button type="text" size="small" @click.prevent="addAd(scope)">
                        添加版权
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                tableData: [{
                    name: 'PC-首页导航下方',
                    size: '1120px*90px',
                    type: '轮播',
                    location: 1,
                    picWidth: 1120
                },{
                    name: 'PC-首页焦点图下方',
                    size: '750px*100px',
                    type: '轮播',
                    location: 2,
                    picWidth: 750
                },{
                    name: 'PC-首页侧边栏上方',
                    size: '326px*183px',
                    type: '轮播',
                    location: 3,
                    picWidth: 326
                },{
                    name: 'PC-首页侧边栏下方',
                    size: '326px*auto',
                    type: '轮播',
                    location: 4,
                    picWidth: 326
                }]
            }
        },
        mounted () {
        },
        methods: {
            // 广告列表
            advertisingList(scope) {
                this.$router.push({path: '/advertisingList', query: {location: scope.row.location, picWidth: scope.row.picWidth}})
            },
            // 添加广告
            addAd(scope) {
                this.$router.push({path: '/addVertisingManagement', query: {location: scope.row.location, picWidth: scope.row.picWidth}})
            }
        }
    }
</script>

<style scoped>

</style>

<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/roleManagement' }">系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>推荐设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>



    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        }
    }
</script>

<style lang="scss">
    .el-table__empty-block{
        display: none;
    }
    .el-table{
        margin-bottom: 40px;
    }
</style>

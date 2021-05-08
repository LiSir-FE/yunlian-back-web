<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/' }">管理</el-breadcrumb-item>
                <el-breadcrumb-item>管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div>
        </div>


    </div>

</template>

<script>
import {loginService} from '../../service/loginService'

export default {
    data () {
        return {
            pageInfo: {

            },
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
        }
    },
    mounted () {
        this.queryList();
    },
    methods: {
        // 获取列表
        queryList() {

        },
        // 分页
        handleSizeChange (val) {
            this.page.pageSize = val
            this.queryList()
        },
        handleCurrentChange (val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.queryList()
            }
        }
    }
}
</script>

<style scoped>

</style>

<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/activityListManagement' }">活动管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <tucEditActivit :id="id" :btnFlag="true"></tucEditActivit>
    </div>
</template>

<script>
import tucEditActivit from '../../components/tuc-editActivity/index'
export default {
    data() {
        return {
            id: this.$route.query.id
        }
    },
    components: {
        tucEditActivit
    },
    mounted() {
    },
    methods: {},
}
</script>

<style scoped>

</style>

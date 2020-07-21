<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/roleManagement' }">系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>推荐设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <div>
            <el-card class="box-card" v-for="(item, idx) in tableData" :key="idx">
                <div slot="header" class="clearfix">
                    <span>{{item.name}}</span>
                    <el-button style="float: right; padding: 3px 0" type="text">编辑</el-button>
                </div>
                <div v-for="(k, l) in item.ids" :key="l" class="text item">
                    <!--<span v-if="(tablaName.hasOwnProperty(k))"><e v-if="l == 0">人工推荐:</e><e v-else>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</e>{{tablaName[k]}}</span>-->
                </div>

                <div class="text item">
                    <span>状态: 123</span>
                </div>
                <div class="text item">
                    <span>过期时间: 123</span>
                </div>
            </el-card>

        </div>

    </div>
</template>

<script>
    import {loginService} from '../../service/loginService'

    export default {
        data () {
            return {
                type: '',
                tablaName: null,
                tableData: []
            }
        },
        mounted () {
            this.getAd();
        },
        methods: {
            // 获取推荐
            getAd:function(){
                let that = this;
                loginService.getAd().then(function (res) {
                    if(res.data.code==200){
                        that.tableData = res.data.datas.data
                        that.tablaName = res.data.datas.name
                    }
                });
            },
        }
    }
</script>

<style lang="scss">
    .box-card{
        /*width: 30%;*/
        /*display: inline-block;*/
        margin-top: 10px;
    }
    /*.box-card:nth-child(2) {*/
        /*margin-left: 2%;*/
        /*margin-right: 2%;*/
    /*}*/
    .el-table__empty-block {
        display: none;
    }

    .el-table {
        margin-bottom: 40px;
    }

</style>

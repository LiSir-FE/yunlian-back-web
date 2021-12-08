<template>
    <div class="wetuc-page-content">
        <el-collapse accordion v-model="activeNames" v-for="(item, index) in tableData" :key="index">
            <el-collapse-item :name="index">
                <template slot="title">
                    <span class="title">{{item.content}}</span>
                    <span class="time">{{item.sendTime | stampFormate}}</span>
                </template>
                <div class="content">{{item.content}}</div>
                <a class="seemore" @click="seeMore(item.modelType,item.id)">查看详情</a>
            </el-collapse-item>
        </el-collapse>

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
import {loginService} from "../service/loginService";

export default {
    data() {
        return {
            activeNames: ['1'],
            page: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            letterid1: null,
            tableData: [],
            chushiId1: {index: 0}
        }
    },
    mounted() {
        this.queryData(this.chushiId1)
    },
    methods: {
        // 获取未读消息的条数
        getlogin(){
            const that = this;
            loginService.getAdminInfo({}).then(function (res) {
                let User = res.data.datas
                that.mesLength = Number(User.unreadMsgNum)
            })
        },
        queryData(tab, event) {
            const that = this
            loginService.getInformation({
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize,
                type:3,
            }).then(function (res) {
                if(res.data.success){
                    if(res.data.success) {
                        let result = res.data.datas;
                        that.tableData = result.datas;
                        that.page.total = Number(result.totalCount);
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    } else {
                        that.$message.error(res.data.message)
                    }
                    //遍历当前未读的个数
                    let arr = []
                    let i = that.tableData.length
                    for(var j=0;j<that.tableData.length;j++){
                        if(that.tableData[j].readStatus == false){
                            arr.push(that.tableData[j].id)
                        }
                    }
                    that.arr = arr
                    that.letterid1 = arr.join(",")
                    // 未读 ==> 已读
                    if(that.letterid1 != ''){that.getRead(that.letterid1,1)}
                }
            })
        },
        // 标记为已读
        getRead(item,type){
            const that = this
            loginService.readLetter({letterIds:item}).then(function (res) {
                if(res.data.success){
                    that.getlogin()
                    that.$forceUpdate()
                }else{
                }
            })
        },
        seeMore(type,id){
            // 普通用户
            console.log('type',type)
            if(type == 21){this.$router.push({path:'activityListManagement'})} //有用户活动报名待审核==>活动管理页面
            else if(type == 20){this.$router.push({path:'notFound'})} //用户提交了退款申请==>交易退款页面
            else if(type == 10 || type == 11){this.$router.push({path:'accountSettings'})} //您提交的账户认证申请已通过==>账户认证页面
            else if(type == 12 || type == 13){this.$router.push({path:'notFound'})} //您的提现申请已经通过==>收入提现页面
            else if(type == 14 || type == 15){this.$router.push({path:'notFound'})} //您的短信模板申请已经通过==>短信模板页面
            else if(type == 16 || type == 17){this.$router.push({path:'articleManagement'})} //您的文章发布审核已经通过==>我的文章页面
            else if(type == 18 || type == 19){this.$router.push({path:'activityListManagement'})} //您的活动<活动的名称>被管理员关闭==>活动管理页面
            //超级管理员
            else if(type == 4){this.$router.push({path:'accountSettings'})} //账户认证申请待处理==>认证审核页面
            else if(type == 5){this.$router.push({path:'accountSettings'})} //提现申请待处理==>提现审核页面
            else if(type == 9){this.$router.push({path:'accountSettings'})} //账号申请待处理==>账号审核页面
            else if(type == 6){this.$router.push({path:'articleManagement'})} //文章审核待处理==>文章审核页面
            else if(type == 7){this.$router.push({path:'notFound'})} //短信模板审核待处理 ==> 模板审核页面
            else if(type == 8){this.$router.push({path:'allActivities'})} //申请活动开启==>所有活动页面
        },
        handleChange(val) {
            console.log(val);
        },
        // 分页
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.queryData()
        },
        handleCurrentChange(val) {
            this.page.pageNo = val;
            this.queryData()
        }
    },
}
</script>

<style scoped>
.seemore{
    margin-top: 10px;
    display: inline-block;
    font-size: 14px;
    color: #20A0FF;
    cursor: pointer;
}
</style>

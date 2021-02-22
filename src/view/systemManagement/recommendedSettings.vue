<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/roleManagement' }">系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>推荐设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <div class="box-card-div" v-loading="loadingFlag">
            <el-card class="box-card" v-for="(item, idx) in tableData" :key="idx">
                <div slot="header" class="clearfix">
                    <span>{{item.name}}</span>
                    <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-edit" @click="editModify(item)">编辑</el-button>
                </div>


                <div class="text item">
                    <span class="wetuc-left-div text item">状态: </span>
                    <span v-if="item.active" class="wetuc-right-div text item">已启用</span>
                    <span v-else class="wetuc-right-div text item">未启用</span>
                </div>
                <div class="text item">
                    <span class="wetuc-left-div text item">过期时间: </span>
                    <span class="wetuc-right-div text item">{{item.endTime | stampFormate4}}</span>
                </div>

                <div class="text item">
                    <span class="wetuc-left-div">人工推荐:</span>
                    <div v-for="(k, l) in item.ids" :key="l" class="text item wetuc-right-div">
                        <span>{{tablaName[k + '']}}</span>
                    </div>
                </div>

            </el-card>

        </div>



        <!--编辑-->

        <el-dialog :title="loadInfo.title" :visible.sync="dialoadFlag" v-loading="loadingFlag2" width="35%" min-width="35%" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="addAccDialoadCloseFn">
            <el-form ref="loadInfo" :model="loadInfo" label-width="100px" :rules="loadRules">
                <el-form-item label="人工推荐">
                    <el-select
                        class="wetuc-input-col3"
                        v-model="loadInfo.manualValue"
                        multiple
                        filterable
                        remote
                        :multiple-limit='5'
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="是否启用">
                    <el-switch v-model="loadInfo.active" active-color="#20A0FF" inactive-color="#ccc"></el-switch>
                </el-form-item>


                <el-form-item label="过期时间">
                    <el-date-picker
                        v-model="loadInfo.endTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>


            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="putAd('loadInfo', loadInfo.id)">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import {loginService} from '../../service/loginService'
    import {common} from '../../common/common'

    export default {
        data () {
            return {
                type: '',
                tablaName: null,
                tableData: [],
                dialoadFlag: false,
                active: false,
                loadInfo: {
                    id: '',
                    title: '',
                    active: '',
                    manualValue: [],
                    endTime: ''
                },
                loadingFlag: false,
                loadingFlag2: false,
                options: [],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                loadRules: {
                    name: [{required: true, message: '请输入名称', trigger: 'blur'}]
                }
            }
        },
        mounted () {
            this.getAd();
        },
        methods: {
            // 获取推荐
            getAd:function(){
                let that = this;
                that.loadingFlag = true;
                loginService.getAd().then(function (res) {
                    if(res.data.code==200){
                        that.tableData = res.data.datas.data;
                        that.tablaName = res.data.datas.name;
                        setTimeout(function () {
                            that.loadingFlag = false
                        }, 300)
                    }
                });
            },
            // 修改推荐-弹框
            editModify(item) {
                let that = this;
                that.dialoadFlag = false;
                that.loadingFlag2 = true;
                loginService.getAdid(item.id, {}).then(function (res) {
                    if(res.data.code == 200){
                        that.dialoadFlag = true;
                        setTimeout(function () {
                            that.loadingFlag2 = false
                        }, 300)
                        let data = res.data.datas;
                        that.loadInfo.title = data.data.name
                        that.loadInfo.active = data.data.active
                        let time = common.getFormatOfDate(data.data.endTime, 'yyyy-MM-dd hh:mm:ss')
                        that.loadInfo.endTime = new Date(time)
                        that.options = data.name;
                        that.loadInfo.manualValue = data.data.ids
                        that.loadInfo.id = data.data.id
                    }
                });
            },

            // 修改弹框内容
            putAd() {
                let that = this;
                let endTime = that.loadInfo.endTime.getTime();
                loginService.putAd({id: that.loadInfo.id, ids: that.loadInfo.manualValue, active: that.loadInfo.active, endTime: endTime}).then(function (res) {
                    if(res.data.code == 200){
                        that.getAd()
                        that.$message({type: 'success',message: '修改成功!'});
                        setTimeout(function () {
                            that.dialoadFlag = false
                        }, 300)
                    }else{
                        that.$message.error(res.data.message);
                    }
                });

            },

            // 关闭弹窗按钮
            addAccDialoadCloseFn () {
                setTimeout(function () {
                    this.dialoadFlag = false
                }, 300)
            },



            remoteMethod(query){
                let that = this;
                if (query != '' && query != ' ') {
                    loginService.getAdname({type: that.type, query: query}).then(function (res) {
                        if(res.data.code == 200){
                            that.options = res.data.datas
                        }
                    });
                }else {
                    this.options = [];
                }
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

    .text {
        font-size: 14px;
    }

    .item {
        margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    .wetuc-left-div{
        width: 5%;
        float: left;
    }

    .wetuc-right-div{
        width: 95%;
        float: right;
    }





</style>

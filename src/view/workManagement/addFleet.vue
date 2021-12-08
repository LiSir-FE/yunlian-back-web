<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/fleetList' }">车队列表</el-breadcrumb-item>
                <el-breadcrumb-item>新增车队</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" label-width="100px" :inline="true" :rules="rules">
            <el-form-item label="车队名称" prop="carName">
                <el-input v-model="pageInfo.carName" class="wetuc-input3-col3" placeholder="请输入车队名称"></el-input>
            </el-form-item>

            <el-form-item label="对接人" prop="docker">
                <el-input v-model="pageInfo.docker" class="wetuc-input3-col3" placeholder="请输入对接人姓名"></el-input>
            </el-form-item>

            <el-form-item label="服务公司" prop="companies">
                <el-select
                    class="wetuc-input3-col3"
                    v-model="pageInfo.companies"
                    value-key="name"
                    filterable
                    remote
                    multiple
                    :multiple-limit="3"
                    placeholder="请选择服务公司"
                    @change="relationChangeKeyWord"
                    :remote-method="relationRemoteMethod"
                    :loading="relationLoading">
                    <el-option
                        v-for="item in getRelationArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="车队年收入" prop="fleetNum">
                <el-select v-model="pageInfo.fleetNum" class="wetuc-input3-col3">
                    <el-option
                        v-for="item in fleetNumList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="车辆总数" prop="vehiclesNum">
                <el-input v-model.number="pageInfo.vehiclesNum" class="wetuc-input3-col3" placeholder="请输入车辆总数"></el-input>
            </el-form-item>
            <el-form-item label="自有司机" prop="ownedDriver">
                <el-input v-model="pageInfo.ownedDriver" class="wetuc-input3-col3" placeholder="请输入自有司机数量"></el-input>
            </el-form-item>
            <el-form-item label="外协司机" prop="externalDriver">
                <el-input v-model="pageInfo.externalDriver" class="wetuc-input3-col3" placeholder="请输入外协司机数量"></el-input>
            </el-form-item>
            <div class="wetuc-block">
                <el-form-item label="车队备注" prop="fleetRemarks">
                    <el-input type="textarea" :rows="6" v-model="pageInfo.fleetRemarks" class="wetuc-input-col890" maxlength="500" placeholder="请输入车队备注"></el-input>
                </el-form-item>
            </div>

            <el-form-item label=" ">
                <el-button type="primary" @click="preservation('pageInfo')">保存</el-button>
                <el-button type="primary" @click="returnFn">返回</el-button>
            </el-form-item>

        </el-form>


    </div>
</template>

<script>
import {loginService} from "../../service/loginService";

export default {
    data() {
        return {
            pageInfo: {
                carName: '',
                companies: '',
                docker: '',
                vehiclesNum: '',
                ownedDriver: '',
                externalDriver: '',
                fleetRemarks: '',
                fleetNum: ''
            },
            companiesArray: [],
            getRelationArr: [],
            relationLoading: false,
            fleetNumList: [{
                label: '小于500万',
                value: 1
            },{
                label: '500万~2000万',
                value: 2
            },{
                label: '2000万~5000万',
                value: 3
            },{
                label: '5000万~1亿',
                value: 4
            },{
                label: '1亿以上',
                value: 5
            }],
            rules: {
                carName: [{
                    required: true, message: '请填写车队名称', trigger: 'blur'
                }],
                fleetNum: [{
                    required: true, message: '请选择收入', trigger: 'change'
                }],
                vehiclesNum: [{
                    required: true, message: '请填写车辆总数', trigger: 'blur'
                },{
                    type: 'number', message: '车辆总数必须为数字值'
                }],
                ownedDriver: [{
                    required: true, message: '请填写自有司机', trigger: 'blur'
                }],
                externalDriver: [{
                    required: true, message: '请填写外协司机', trigger: 'blur'
                }],
            }
        }
    },
    mounted() {
    },
    methods: {
        preservation(formName) {
            let that = this;
            that.$refs[formName].validate((valid) => {
                if(valid) {
                    loginService.addfleetList({
                        name: that.pageInfo.carName,
                        companies: that.companiesArray.toString(),
                        size: that.pageInfo.fleetNum,
                        chargeName: that.pageInfo.docker,
                        carNum: that.pageInfo.vehiclesNum,
                        inDriverNum: that.pageInfo.ownedDriver,
                        outDriverNum: that.pageInfo.externalDriver,
                        content: that.pageInfo.fleetRemarks,
                    }).then(res => {
                        if (res.data.success) {
                            that.$message({
                                message: '保存成功！',
                                type: 'success'
                            });
                            setTimeout(() => {
                                that.$router.push({path: 'fleetList'})
                            }, 300)
                        } else {
                            that.$message.error(res.data.message)
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        relationChangeKeyWord(val) {
            this.companiesArray = []
            if (val !== null) {
                val.forEach(item => {
                    this.companiesArray.push(item.id);
                })
            } else {
                this.companiesArray = [];
            }
        },
        relationRemoteMethod(query) {
            let that = this;
            if (query !== '') {
                that.relationLoading = true;
                setTimeout(() => {
                    that.relationLoading = false;
                    that.getRelationArr = that.getRelationList(query); // 文章关键词
                }, 200);
            } else {
                that.getRelationArr = [];
            }
        },
        getRelationList(query) {
            let that = this
            let relationArray = [];
            loginService.getCompaniesAll({
                param: query,
                pageNo: 1,
                pageSize: 10
            }).then(function (res) {
                if (res.data.success) {
                    let newArr = res.data.datas.datas;
                    for (let i = 0; i < newArr.length; i++) {
                        relationArray.push({id: newArr[i].id, name: newArr[i].name});
                    }
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                console.log(err);
            });
            return relationArray;
        },
        returnFn() {
            this.$router.push({path: 'fleetList'})
        }
    },
}
</script>

<style scoped>

</style>

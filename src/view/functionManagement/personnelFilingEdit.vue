<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/detailsActivity', query: {id: ids, activeName: 'f'} }">人员归档</el-breadcrumb-item>
                <el-breadcrumb-item>编辑人员</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="detailedInfo" :model="detailedInfo" label-width="100px" :inline="true" :rules="rules">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="detailedInfo.name" placeholder="请输入用户名" class="wetuc-input3-col3"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="detailedInfo.phone" placeholder="请输入手机号" class="wetuc-input3-col3"></el-input>
            </el-form-item>
            <el-form-item label="公司">
                <el-input v-model="detailedInfo.company" placeholder="请选择公司" class="wetuc-input3-col3" :disabled="true"></el-input>
            </el-form-item>


            <el-form-item label="关联公司" prop="companies">
                <el-select
                    class="wetuc-input3-col3"
                    v-model="detailedInfo.companies"
                    value-key="name"
                    filterable
                    remote
                    placeholder="请选择活动关联公司"
                    :remote-method="relationRemoteMethod"
                    :loading="relationLoading">
                    <el-option
                        v-for="item in getRelationArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>



            <el-form-item label="业务员" prop="salesman">
                <el-select v-model="detailedInfo.salesman" placeholder="请选择业务员" class="wetuc-input3-col3">
                    <el-option
                        v-for="item in salesmanList"
                        :key="item.id"
                        :label="item.hostName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="门票性质" prop="ticketNature">
                <el-select v-model="detailedInfo.ticketNature" placeholder="请选择门票性质" class="wetuc-input3-col3">
                    <el-option
                        v-for="item in ticketNatureList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="状态" prop="state">
                <el-select v-model="detailedInfo.state" placeholder="请选择状态" class="wetuc-input3-col3">
                    <el-option
                        v-for="item in stateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="备注" prop="remarks">
                <el-input type="textarea" :rows="8" placeholder="经过本人或者编辑修改后的内容" v-model="detailedInfo.remarks" class="wetuc-input-col983"></el-input>
            </el-form-item>

            <el-form-item label=" ">
                <el-button type="primary" @click="submitForm('detailedInfo', 1)">保存</el-button>
                <el-button type="primary" @click="submitForm('detailedInfo', 2)">归档</el-button>
                <el-button @click="cancel">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {loginService} from "../../service/loginService";

export default {
    data() {
        // 设置手机号的验证规则
        let checkPhone = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入联系方式'))
            } else {
                const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
                if (reg.test(value)) {
                    callback()
                } else {
                    return callback(new Error('请输入正确的电话'))
                }
            }
        }
        // 中名验证
        let chnName = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入中文名'))
            } else {
                const reg = /^[\u4e00-\u9fa5]+$/
                if (value.length < 100 && reg.test(value)) {
                    callback()
                } else {
                    return callback(new Error('请输入正确的中文名'))
                }
            }
        }
        let relationfleet = (rule, value, callback) => {
            if(!value) {
                callback(new Error('请选择公司'))
            } else {
                callback()
            }
        }
        return {
            ids: this.$route.query.ids,
            id: this.$route.query.id,
            actId: this.$route.query.actId,
            detailedInfo: {
                name: '',
                phone: '',
                company: '',
                companies: '',
                salesman: '',
                ticketNature: '',
                state: '',
                remarks: ''
            },
            relationLoading: false,
            getRelationArr: [],
            salesmanList: [],
            ticketNatureList: [{
                value: '1',
                label: '普通'
            },{
                value: '2',
                label: '赠票'
            },{
                value: '3',
                label: '赞助'
            },{
                value: '4',
                label: '嘉宾'
            }],
            stateList: [{
                value: '1',
                label: '已付款已到场'
            },{
                value: '2',
                label: '未付款已到场'
            },{
                value: '3',
                label: '已付款未到场'
            },{
                value: '4',
                label: '异常'
            }],
            rules:{
                name: [{required: true, validator: chnName, trigger: ['blur','change']}],
                phone: [{required: true, validator: checkPhone, trigger: 'change'}],
                companies: [
                    {required: true, validator: relationfleet, trigger: ['blur', 'change']}
                ],
                salesman: [{required: true, message: '请选择业务员', trigger: 'change'}],
                ticketNature: [{required: true, message: '请选择门票性质', trigger: 'change'}],
                state: [{required: true, message: '请选择状态', trigger: 'change'}]
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getRelationArr = this.getRelationList('');// 关联公司
            this.getAllStaffCount()
            this.getInfo()
        })
    },
    methods: {
        submitForm(formName, type) {
            let that = this;
            if(type == 1) {
                that.$refs[formName].validate((valid) => {
                    if(valid) {
                        loginService.postpersonnelFilingEdit(that.id, {
                            available: false,
                            actId: that.actId,
                            name: that.detailedInfo.name,
                            phone: that.detailedInfo.phone,
                            companyName: that.detailedInfo.company,
                            companyId: that.detailedInfo.companies,
                            staffId: that.detailedInfo.salesman,
                            ticketType: that.detailedInfo.ticketNature,
                            ticketStatus: that.detailedInfo.state,
                            content: that.detailedInfo.remarks
                        }).then(res => {
                            if (res.data.success) {
                                that.$message({
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                this.$router.push({path: 'detailsActivity', query: {id: this.ids, activeName: 'f'}})
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
            } else {
                that.$confirm('归档后信息不能再修改, 确定归档吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$refs[formName].validate((valid) => {
                        if(valid) {
                            loginService.postpersonnelFilingEdit(that.id, {
                                available: true,
                                actId: that.actId,
                                name: that.detailedInfo.name,
                                phone: that.detailedInfo.phone,
                                companyName: that.detailedInfo.company,
                                companyId: that.detailedInfo.companies,
                                staffId: that.detailedInfo.salesman,
                                ticketType: that.detailedInfo.ticketNature,
                                ticketStatus: that.detailedInfo.state,
                                content: that.detailedInfo.remarks
                            }).then(res => {
                                if (res.data.success) {
                                    that.$message({
                                        message: '归档成功！',
                                        type: 'success'
                                    });
                                    this.$router.push({path: 'detailsActivity', query: {id: this.ids, activeName: 'f'}})
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
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消归档'
                    });
                });
            }
        },
        getInfo() {
            let that = this;
            loginService.getpersonnelFilingEdit(that.id, {}).then(res => {
                if(res.data.success) {
                    that.detailedInfo.name = res.data.datas.name;
                    that.detailedInfo.phone = res.data.datas.phone;
                    that.detailedInfo.company = res.data.datas.companyName;


                    if(res.data.datas.companyId) {
                        that.detailedInfo.companies = res.data.datas.companyId;
                        if (JSON.stringify(that.getRelationArr).indexOf(res.data.datas.companyId) === -1) {
                            that.getRelationArr.unshift({
                                id: res.data.datas.companyId,
                                name: res.data.datas.companyName2
                            });
                        }
                    }


                    that.detailedInfo.salesman = res.data.datas.staffId ? res.data.datas.staffId : '';
                    that.detailedInfo.ticketNature = res.data.datas.ticketType ? res.data.datas.ticketType.toString() : '';
                    that.detailedInfo.state = res.data.datas.ticketStatus ? res.data.datas.ticketStatus.toString() : '';
                    that.detailedInfo.remarks = res.data.datas.content ? res.data.datas.content : '';
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 获取业务员
        getAllStaffCount() {
            loginService.getAllStaffCount({
                staffFunction: 1
            }).then(res => {
                this.salesmanList = res.data.datas;
            }).catch(err =>{
                console.log(err);
            })
        },

        getRelationList(query) {
            let that = this, relationArray = [];
            loginService.getCompaniesAll({
                param: query,
                pageNo: 1,
                pageSize: 20
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
        cancel() {
            this.$router.push({path: 'detailsActivity', query: {id: this.ids, activeName: 'f'}})
        }
    },
}
</script>

<style scoped>

</style>

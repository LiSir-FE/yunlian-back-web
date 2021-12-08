<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/contractList' }">合同列表</el-breadcrumb-item>
                <el-breadcrumb-item>新增合同</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <el-form :model="pageInfo" :inline="true" ref="pageInfo" label-width="100px" :rules="rules">
            <el-form-item label="合同名称" prop="name">
                <el-input v-model="pageInfo.name" placeholder="请输入合同名称" class="wetuc-input-col2"></el-input>
            </el-form-item>
            <el-form-item label="合同类型" prop="contractType">
                <el-select v-model="pageInfo.contractType" placeholder="请选择称谓" class="wetuc-input-col2">
                    <el-option
                        v-for="item in contractList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联公司" prop="companies">
                <el-select
                    class="wetuc-input-col2"
                    v-model="pageInfo.companies"
                    value-key="subFieldName"
                    filterable
                    remote
                    placeholder="请选择关联公司"
                    @change="relationChangeKeyWord"
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
            <el-form-item label="签约日期" prop="contractDate">
                <el-date-picker
                    class="wetuc-input-col2"
                    v-model="pageInfo.contractDate"
                    type="date"
                    value-format="timestamp"
                    placeholder="请选择签约日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="付款方式" prop="paymentMethod">
                <el-select v-model="pageInfo.paymentMethod" placeholder="请选择付款方式" class="wetuc-input-col2">
                    <el-option
                        v-for="item in paymentMethodList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同金额" prop="contractAmount">
                <el-input type="number" v-model.number="pageInfo.contractAmount" placeholder="请输入合同金额" class="wetuc-input-col2"></el-input>
            </el-form-item>

            <el-form-item label="特殊说明" prop="specialInstructions">
                <el-input type="textarea" :rows="2" v-model="pageInfo.specialInstructions" class="wetuc-input-col983" placeholder="请输入特殊说明"></el-input>
            </el-form-item>

            <el-form-item label=" ">
                <el-button type="primary" @click="submitForm('pageInfo', 0)">提交</el-button>
                <el-button type="primary" @click="submitForm('pageInfo', 1)">保存到草稿</el-button>
                <el-button type="primary" @click="cancel">取消</el-button>
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
                name: '',
                contractType: '',
                companies: '',
                contractDate: '',
                paymentMethod: '',
                contractAmount: '',
                specialInstructions: ''
            },
            getRelationArr: [],
            relationLoading: false,
            companiesArray: [],
            contractList: [{
                value: '1',
                label: '会务'
            },
            {
                value: '2',
                label: '门票'
            }, {
                value: '3',
                label: '赞助'
            }, {
                value: '4',
                label: '调研'
            }, {
                value: '5',
                label: 'FA'
            }, {
                value: '6',
                label: '软文'
            }],
            paymentMethodList: [{
                value: '1',
                label: '先款后票'
            },
            {
                value: '2',
                label: '先票后款'
            }],
            rules: {
                name: [
                    {required: true, message: '请输入合同名称', trigger: 'blur'}
                ],
                companies: [
                    {required: true, message: '请选择关联公司', trigger: 'change'}
                ],
                contractType: [
                    {required: true, message: '请选择合同类型', trigger: 'change'}
                ],
                contractDate: [
                    {required: true, message: '请选择日期', trigger: 'change'}
                ],
                paymentMethod: [
                    {required: true, message: '请选择付款方式', trigger: 'change'}
                ],
                contractAmount: [
                    {required: true, message: '请输入合同金额', trigger: 'blur'}
                ]
            }
        }
    },
    mounted() {
        this.getRelationArr = this.getRelationList('');
    },
    methods: {
        // 提交
        submitForm(formName, type) {
            let that = this;
            that.$refs[formName].validate((valid) => {
                if(valid) {
                    loginService.addContracts({
                        name: that.pageInfo.name,
                        companyId: that.pageInfo.companies,
                        type: that.pageInfo.contractType,
                        signTime: that.pageInfo.contractDate,
                        payType: that.pageInfo.paymentMethod,
                        draft: type,
                        totalAmount: that.pageInfo.contractAmount * 100,
                        staffOpinion: that.pageInfo.specialInstructions
                    }).then(res => {
                        let no = res.data.datas.no;
                        if(type === 0) {
                            that.$confirm('合同编号'+no+'已生成,点击[继续]上传电子合同', '还差一步', {
                                confirmButtonText: '继续',
                                cancelButtonText: '稍后',
                                type: 'warning'
                            }).then(({ value }) => {
                                this.$router.push({path: '/editContract', query: {id: res.data.datas.id}});
                            }).catch(() => {
                                if (res.data.success) {
                                    that.$message({
                                        message: '保存成功！',
                                        type: 'success'
                                    });
                                    that.$router.push({path: '/contractList'})
                                } else {
                                    that.$message.error(res.data.message)
                                }
                            });
                        } else if(type === 1) {
                            that.$message({
                                message: '保存到草拟合同成功！',
                                type: 'success'
                            });
                            that.$router.push({path: '/contractList'})
                        }
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        // 取消
        cancel() {
            this.$router.go(-1);
        },
        relationChangeKeyWord(val) {
            this.companiesArray = [];
            if (val !== null) {
                this.companiesArray.push(val.id);
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
    },
}
</script>

<style scoped>

</style>

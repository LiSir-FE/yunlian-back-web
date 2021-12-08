<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/contractList' }">合同列表</el-breadcrumb-item>
                <el-breadcrumb-item>合同详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <el-form :model="pageInfo" :inline="true" ref="pageInfo" label-width="100px" :rules="rules">
            <el-form-item label="合同编号" prop="code">
                <el-input v-model="pageInfo.code" placeholder="请输入合同名称" class="wetuc-input-col2" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item prop="salesman" label="业务员">
                <el-select v-model="pageInfo.salesman" placeholder="业务员" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in salesmanList"
                        :key="item.id"
                        :label="item.hostName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同名称" prop="name">
                <el-input v-model="pageInfo.name" placeholder="请输入合同名称" class="wetuc-input-col2" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="合同类型" prop="contractType">
                <el-select v-model="pageInfo.contractType" placeholder="请选择称谓" class="wetuc-input-col2" :disabled="true">
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
                    :disabled="true"
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
                    :disabled="true"
                    class="wetuc-input-col2"
                    v-model="pageInfo.contractDate"
                    type="date"
                    value-format="timestamp"
                    placeholder="请选择签约日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="合同金额" prop="contractAmount">
                <el-input type="number" v-model.number="pageInfo.contractAmount" placeholder="请输入合同金额" class="wetuc-input-col2" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="开票金额" prop="amountInvoice" class="displayInline">
                <el-input v-model.number="pageInfo.amountInvoice" placeholder="请输入合同金额" class="wetuc-input-col2" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="已收金额" prop="amountReceived" class="displayInline">
                <el-input v-model.number="pageInfo.amountReceived" placeholder="请输入合同金额" class="wetuc-input-col2" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="付款方式" prop="paymentMethod">
                <el-select v-model="pageInfo.paymentMethod" placeholder="请选择付款方式" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in paymentMethodList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="盖章状态" prop="seal" class="displayInline">
                <el-select v-model="pageInfo.seal" placeholder="请选择合同类型" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in sealList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="特殊说明" prop="specialInstructions">
                <el-input type="textarea" :rows="2" v-model="pageInfo.specialInstructions" class="wetuc-input-col983" placeholder="请输入特殊说明" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="管理意见" prop="specialInstructions2">
                <el-input type="textarea" :rows="2" v-model="pageInfo.specialInstructions2" class="wetuc-input-col983" placeholder="请输入管理意见" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="财务意见" prop="specialInstructions3">
                <el-input type="textarea" :rows="2" v-model="pageInfo.specialInstructions3" class="wetuc-input-col983" placeholder="请输入财务意见" :disabled="true"></el-input>
            </el-form-item>


            <el-form-item label="查看合同" prop="uploadContract">
                <el-upload
                    :disabled="true"
                    class="wetuc-input-col983"
                    :action="this.apis + '/files/oss'"
                    :on-preview="handlePreview"
                    :on-success="handSuccess"
                    :on-remove="handleRemove"
                    :before-upload="beforeAvatarUpload"
                    :before-remove="beforeRemove"
                    :on-exceed="handleExceed"
                    v-model="pageInfo.uploadContract"
                    :file-list="fileList">
                </el-upload>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
import {loginService} from "../../service/loginService";

export default {
    data() {
        return {
            id: this.$route.query.id,
            pageInfo: {
                code: '',
                name: '',
                contractType: '',
                companies: '',
                contractDate: '',
                paymentMethod: '',
                contractAmount: '',
                specialInstructions: '',
                uploadContract: '',
                amountInvoice: '',
                amountReceived: '',
                specialInstructions2: '',
                specialInstructions3: ''
            },
            getRelationArr: [],
            salesmanList: [],
            relationLoading: false,
            companiesArray: [],
            fileList: [],
            sealList: [{
                value: 1,
                label: '均未盖章'
            },{
                value: 2,
                label: '我方已盖章'
            },{
                value: 3,
                label: '对方已盖章'
            },{
                value: 4,
                label: '双方已盖章'
            }],
            contractList: [{
                value: 1,
                label: '会务'
            }, {
                value: 2,
                label: '门票'
            }, {
                value: 3,
                label: '赞助'
            }, {
                value: 4,
                label: '调研'
            }, {
                value: 5,
                label: 'FA'
            }, {
                value: 6,
                label: '软文'
            }],
            paymentMethodList: [{
                value: 1,
                label: '先款后票'
            },
            {
                value: 2,
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
    computed: {
        apis() {
            return process.env.API_ROOT
        },
        picHead() {
            return process.env.IMG_URL
        }
    },
    mounted() {

        this.getRelationArr = this.getRelationList('');
        setTimeout(() => {
            this.$nextTick(() => {
                this.getAllStaffCount()
            })
        }, 300)
    },
    methods: {
        // 获取业务员
        getAllStaffCount() {
            loginService.getAllStaffCount({
            }).then(res => {
                this.salesmanList = res.data.datas;
                this.detailsContracts();
            }).catch(err =>{
                console.log(err);
            })
        },
        // 获取详情
        detailsContracts() {
            let that = this;
            loginService.detailsContracts(that.id, {}).then(res => {
                if(res.data.success) {
                    that.getContractsFiles();
                    let result = res.data.datas.contract;
                    that.pageInfo.code = result.no;
                    that.pageInfo.name = result.name;
                    that.pageInfo.salesman = result.staffId;
                    that.pageInfo.contractType = result.type;
                    that.pageInfo.contractDate = result.signTime;
                    that.pageInfo.paymentMethod = result.payType;
                    that.pageInfo.contractAmount = result.totalAmount / 100;
                    that.pageInfo.amountInvoice = result.invoiceAmount / 100;
                    that.pageInfo.amountReceived = result.gatheringAmount / 100;
                    that.pageInfo.seal = result.stamp;
                    that.pageInfo.specialInstructions2 = result.auditOpinion;
                    that.pageInfo.specialInstructions3 = result.accountingOpinion;
                    that.pageInfo.specialInstructions = result.staffOpinion;
                    that.pageInfo.uploadContract = that.picHead + result.contractFile;
                    if (JSON.stringify(that.getRelationArr).indexOf(result.companyId) === -1) {
                        that.getRelationArr.unshift({
                            id: result.companyId,
                            name: res.data.datas.companyName
                        })
                    }
                    that.pageInfo.companies = result.companyId;
                }
            }).catch(err =>{
                console.log(err);
            })
        },
        // 提交
        submitForm(formName, type) {
            let that = this;
            that.$refs[formName].validate((valid) => {
                if(valid) {
                    loginService.editContractsStaff({
                        id: that.id,
                        name: that.pageInfo.name,
                        companyId: that.pageInfo.companies,
                        type: that.pageInfo.contractType,
                        signTime: that.pageInfo.contractDate,
                        payType: that.pageInfo.paymentMethod,
                        draft: type,
                        totalAmount: that.pageInfo.contractAmount * 100,
                        staffOpinion: that.pageInfo.specialInstructions,
                    }).then(res => {
                        if (res.data.success) {
                            if(type === 0) {
                                that.$message({
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                that.$router.push({path: '/contractList'})
                            } else if(type === 1) {
                                that.$message({
                                    message: '保存到草拟合同成功！',
                                    type: 'success'
                                });
                                that.$router.push({path: '/contractList'})
                            }
                        } else {
                            that.$message.error(res.data.message)
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
        handleRemove(file, fileList) {
            let that = this;
            if(file.deleted) {
                loginService.deleteContractsFiles(file.id, {}).then(res => {
                    that.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    that.getContractsFiles();
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        handlePreview(file) {
            let hetf = file.url;
            window.open(hetf, '_blank');
        },
        handSuccess(response, file, fileList) {
            this.fileUrl = file.response.datas.filePath;
            let hetf = file.response.datas.resourceUrl + file.response.datas.file;
            this.pageInfo.uploadContract = hetf;
            loginService.contractsFiles({
                contractId: this.id,
                contractFileName: file.name,
                contractFileUrl: file.response.datas.file
            }).then(res => {
                this.$message({
                    message: '上传成功！',
                    type: 'success'
                });
                this.getContractsFiles();
            }).catch(err => {
                console.log(err);
            })
        },
        handleExceed(files, fileList) {
            this.$message.warning(`不支持多选`);
        },
        beforeRemove(file, fileList) {
            let that = this;
            let a = true;
            if(file && file.deleted) {
                a = that.$confirm(`确定移除 ${ file.name } 吗？`);
            } else {
                a = that.$message(`只能移除当前用户的!`);
                that.getContractsFiles();
            }
            return a
        },
        beforeAvatarUpload(file) {
            const isPDF = file.type === 'application/pdf';

            if (!isPDF) {
                this.$message.error('上传格式只能是 PDF 格式!');
            }
            return isPDF;
        },
        // 获取合同
        getContractsFiles() {
            let that = this;
            loginService.getContractsFiles(that.id).then(res=> {
                res.data.datas.forEach(item => {
                    item.name = '[' + that.formartDate(item.createTime) + ']' + '-' + '[' + item.hostName + ']' + '-' + '[' +item.contractFileName + ']';
                    item.url = that.picHead + item.contractFileUrl;
                });
                that.fileList = res.data.datas;
            }).catch(err => {
                console.log(err);
            })
        },
        formartDate(param) {
            let date = new Date(Number(param));
            let Y = date.getFullYear() + '-';
            let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
            let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
            let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
            let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return Y + M + D + h + m + s;
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
    /deep/ .wetuc-input-col983 .el-upload{
        display: none !important;
    }
</style>

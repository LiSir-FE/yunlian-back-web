<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/contractList' }">合同列表</el-breadcrumb-item>
                <el-breadcrumb-item>修改合同</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <el-form :model="pageInfo" :inline="true" ref="pageInfo" label-width="100px" :rules="rules">

            <el-form-item label="合同编号" prop="code" v-if="reviewComments === 'reviewComments'">
                <el-input v-model="pageInfo.code" placeholder="请输入合同编号" class="wetuc-input-col2" :readonly="true"></el-input>
            </el-form-item>

            <el-form-item prop="salesman" label="业务员" v-if="reviewComments === 'reviewComments'">
                <el-select v-model="pageInfo.salesman" placeholder="业务员" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in salesmanList"
                        :key="item.id"
                        :label="item.hostName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>



            <el-form-item label="合同金额" prop="contractAmount">
                <el-input type="number" v-model.number="pageInfo.contractAmount" placeholder="请输入合同金额" class="wetuc-input-col2" :readonly="status === 3 || reviewComments === 'ing'"></el-input>
            </el-form-item>

            <el-form-item label="盖章状态" prop="seal" v-if="reviewComments === 'ing'">
                <el-select v-model="pageInfo.seal" placeholder="请选择合同类型" class="wetuc-input-col2">
                    <el-option
                        v-for="item in sealList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="签约日期" prop="contractDate">
                <el-date-picker
                    :disabled="status === 3 && reviewComments === 'reviewComments'"
                    class="wetuc-input-col2"
                    v-model="pageInfo.contractDate"
                    type="date"
                    value-format="timestamp"
                    placeholder="请选择签约日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="开票金额日期" prop="value1" v-if="reviewComments === 'ing'">
                <el-date-picker
                    class="wetuc-input-col2"
                    v-model="pageInfo.value1"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择开票金额日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="开票金额" prop="amountInvoice" v-if="reviewComments === 'ing'">
                <el-input type="Number" v-model="pageInfo.amountInvoice" class="wetuc-input-col2" @change="amountInvoiceChange"></el-input>
            </el-form-item>

            <el-form-item label="累计金额" prop="cumulative1" v-if="reviewComments === 'ing'">
                <el-input type="Number" v-model="pageInfo.cumulative1" class="wetuc-input-col2" :readonly="true"></el-input>
            </el-form-item>

            <el-form-item label="已收金额日期" prop="value2" v-if="reviewComments === 'ing'">
                <el-date-picker
                    class="wetuc-input-col2"
                    v-model="pageInfo.value2"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择已收金额日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="已收金额" prop="amountReceived" v-if="reviewComments === 'ing'">
                <el-input type="Number" v-model="pageInfo.amountReceived" class="wetuc-input-col2" @change="amountReceivedChange"></el-input>
            </el-form-item>

            <el-form-item label="累计金额" prop="cumulative2" v-if="reviewComments === 'ing'">
                <el-input type="Number" v-model="pageInfo.cumulative2" class="wetuc-input-col2" :readonly="true"></el-input>
            </el-form-item>

            <el-form-item v-if="reviewComments === 'ing'" class="wetuc-input-col983" label=" ">
                <el-timeline>
                    <template v-for="(activity, index) in pageInfo.activities">
                        <el-timeline-item :timestamp="activity.changeTime | stampFormate('yyyy-MM-dd')" placement="top">
                            <el-card>
                                <h4 v-if="activity.type == 1">开票金额</h4>
                                <h4 v-if="activity.type == 2">已收金额</h4>
                                <p>金额: {{activity.amount / 100}}</p>
                            </el-card>
                        </el-timeline-item>
                    </template>
                </el-timeline>
            </el-form-item>


            <el-form-item label="财务意见" prop="finance" v-if="reviewComments === 'ing'">
                <el-input type="textarea" :rows="2" v-model="pageInfo.finance" class="wetuc-input-col983" placeholder="请输入财务意见"></el-input>
            </el-form-item>





            <el-form-item label="合同编号" prop="code" v-if="reviewComments === 'ing'">
                <el-input v-model="pageInfo.code" placeholder="请输入合同编号" class="wetuc-input-col2" :disabled="status === 3 || reviewComments === 'ing'"></el-input>
            </el-form-item>



            <el-form-item label="合同名称" prop="name">
                <el-input v-model="pageInfo.name" placeholder="请输入合同名称" class="wetuc-input-col2" :disabled="status === 3 || reviewComments === 'ing'"></el-input>
            </el-form-item>
            <el-form-item label="合同类型" prop="contractType">
                <el-select v-model="pageInfo.contractType" placeholder="请选择称谓" class="wetuc-input-col2" :disabled="status === 3 || reviewComments === 'ing'">
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
                    :disabled="status === 3 || reviewComments === 'ing'"
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

            <el-form-item label="付款方式" prop="paymentMethod">
                <el-select v-model="pageInfo.paymentMethod" placeholder="请选择付款方式" class="wetuc-input-col2" :disabled="status === 3 || reviewComments === 'ing'">
                    <el-option
                        v-for="item in paymentMethodList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item prop="salesman" label="业务员" v-if="reviewComments === 'ing'">
                <el-select v-model="pageInfo.salesman" placeholder="业务员" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in salesmanList"
                        :key="item.id"
                        :label="item.hostName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>


            <el-form-item label="特殊说明" prop="specialInstructions">
                <el-input type="textarea" :rows="2" v-model="pageInfo.specialInstructions" class="wetuc-input-col983" placeholder="请输入特殊说明" :disabled="status === 3 || reviewComments === 'ing'"></el-input>
            </el-form-item>

            <el-form-item label="审核意见" prop="specialInstructions" v-if="reviewComments === 'reviewComments' || reviewComments === 'ing'">
                <el-input type="textarea" :rows="2" v-model="pageInfo.reviewComments" class="wetuc-input-col983" placeholder="请输入审核意见" :disabled="reviewComments === 'ing'"></el-input>
            </el-form-item>


            <el-form-item label="上传合同" prop="uploadContract">
                <el-upload
                    :disabled="status === 3"
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
                    <el-button type="primary" :disabled="status === 3">上传<i class="el-icon-upload el-icon--right"></i></el-button>
                    <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
                </el-upload>
            </el-form-item>



            <el-form-item label=" " v-if="status !== 3 || reviewComments === 'ing'">
                <el-button type="primary" @click="submitForm('pageInfo', 0)">提交</el-button>
                <el-button type="primary" @click="submitForm('pageInfo', 2)" v-if="reviewComments === 'reviewComments'">保存</el-button>
                <el-button type="primary" @click="submitForm('pageInfo', 1)" v-if="reviewComments === 'draft'">保存到草稿</el-button>
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
            id: this.$route.query.id,
            reviewComments: this.$store.getters.getReviewComments,
            pageInfo: {
                code: '',
                name: '',
                seal: '',
                contractType: '',
                companies: '',
                contractDate: '',
                paymentMethod: '',
                contractAmount: '',
                specialInstructions: '',
                uploadContract: '',
                reviewComments: '',


                value1: '',
                amountInvoice: '',
                cumulative1: '',
                value2: '',
                amountReceived: '',
                cumulative2: '',
                salesman: '',


                finance: '',
                reverse: true,
                activities: []

            },
            salesmanList: [],
            getRelationArr: [],
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
            },
            {
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
            status: undefined,
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
    created() {
        if(sessionStorage.getItem('reviewComments')) {
            this.$store.replaceState(
                Object.assign({}, this.$store.state, sessionStorage.getItem('reviewComments'))
            )
        }

        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem('reviewComments', this.$store.getters.getReviewComments)
        })
    },
    mounted() {
        this.getRelationArr = this.getRelationList('');
        this.getContractsFiles();
        this.getAllStaffCount()
        this.detailsContractsLogs(this.id);
        setTimeout(() => {
            this.$nextTick(() => {
                this.detailsContracts();
            })
        }, 300)
    },
    methods: {
        // 获取详情
        detailsContracts() {
            let that = this;
          loginService.detailsContracts(that.id, {}).then(res => {
              if(res.data.success) {
                  let result = res.data.datas.contract;
                  that.pageInfo.code = result.no;
                  that.pageInfo.name = result.name;
                  that.pageInfo.seal = result.stamp;
                  that.pageInfo.salesman = result.staffId;
                  that.pageInfo.contractType = result.type;
                  that.pageInfo.contractDate = result.signTime;
                  that.pageInfo.paymentMethod = result.payType;
                  that.pageInfo.contractAmount = result.totalAmount / 100;
                  that.pageInfo.specialInstructions = result.staffOpinion;
                  that.pageInfo.reviewComments = result.auditOpinion;
                  that.status = result.status;
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
                    if(that.reviewComments === 'reviewComments') {
                        loginService.editContractsAudit({
                            operate: type === 0 ? 1 : 2,
                            id: that.id,
                            name: that.pageInfo.name,
                            companyId: that.pageInfo.companies,
                            signTime: that.pageInfo.contractDate,
                            payType: that.pageInfo.paymentMethod,
                            auditOpinion: that.pageInfo.reviewComments,
                        }).then(res => {
                            if (res.data.success) {
                                that.$message({
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                that.$router.push({path: '/allContracts'})
                            } else {
                                that.$message.error(res.data.message)
                            }
                        }).catch(err => {
                            console.log(err);
                        });

                    } else {
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
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        amountInvoiceChange(val) {
            if(Number(val) + Number(this.pageInfo.cumulative1) > Number(this.pageInfo.contractAmount)) {
                this.$alert('累计开票金额已大于合同金额', '提示', {
                    confirmButtonText: '我已知晓',
                    callback: action => {
                        console.log('1')
                    }
                });
            }
        },
        amountReceivedChange(val) {
            if(Number(val) + Number(this.pageInfo.cumulative2) > Number(this.pageInfo.contractAmount)) {
                this.$alert('累计已收金额已大于合同金额', '提示', {
                    confirmButtonText: '我已知晓',
                    callback: action => {
                        console.log('1')
                    }
                });
            }
        },
        // 获取业务员
        getAllStaffCount() {
            loginService.getAllStaffCount({
            }).then(res => {
                this.salesmanList = res.data.datas;
            }).catch(err =>{
                console.log(err);
            })
        },
        detailsContractsLogs(id) {
            loginService.detailsContractsLogs(id, {
            }).then(res => {
                if(res.data.success) {
                    this.$nextTick(() => {
                        this.pageInfo.activities = res.data.datas;
                    })
                }
            }).catch(err => {
                console.log(err);
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
    /deep/.el-timeline-item::marker{
        display: none !important;
    }
</style>

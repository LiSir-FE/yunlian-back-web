<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: `${beforeUrl}` }">{{ beforeName }}</el-breadcrumb-item>
                <el-breadcrumb-item>添加公司</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="100px" :rules="rules">
            <el-form-item label="公司" prop="company">
                <el-input v-model="pageInfo.company" placeholder="例如：运联" class="wetuc-input-col2"></el-input>
            </el-form-item>
            <el-form-item label="公司全称" prop="companyName">
                <el-input v-model="pageInfo.companyName" placeholder="例如：运联慧科技有限公司" class="wetuc-input-col2"></el-input>
            </el-form-item>
            <el-form-item label="网址" prop="website">
                <el-input v-model="pageInfo.website" placeholder="请输入公司网址" class="wetuc-input-col2"></el-input>
            </el-form-item>

            <el-form-item label="企业会员" prop="vip">
                <el-select v-model="pageInfo.vip" placeholder="请选择企业规模" class="wetuc-input-col2">
                    <el-option
                        v-for="item in vipList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="企业规模" prop="scale">
                <el-select v-model="pageInfo.scale" placeholder="请选择企业规模" class="wetuc-input-col2">
                    <el-option
                        v-for="item in scaleList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="投融阶段" prop="financing">
                <el-select v-model="pageInfo.financing" placeholder="请选择企业规模" class="wetuc-input-col2">
                    <el-option
                        v-for="item in financingList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="一级行业" prop="industry">
                <el-select v-model="pageInfo.industry" placeholder="请选择一级行业" class="wetuc-input-col2" @change="industryChange">
                    <el-option
                        v-for="item in industryList"
                        :key="item.field"
                        :label="item.name"
                        :value="item.field">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级行业" prop="subField">
                <el-select v-model="pageInfo.subField" placeholder="请选择二级行业" class="wetuc-input-col2">
                    <el-option
                        v-for="item in subFieldList"
                        :key="item.field"
                        :label="item.name"
                        :value="item.field">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="员工" prop="staff">
                <el-select v-model="pageInfo.staff" placeholder="请选择员工" class="wetuc-input-col2">
                    <el-option
                        v-for="item in staffList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="营销顾问" prop="marketing">
                <el-select v-model="pageInfo.marketing.sellChargeName" placeholder="请选择员工" class="wetuc-input-col2" @change="yingxiaoguwenClick">
                    <el-option
                        v-for="item in marketingList"
                        :key="item.id"
                        :label="item.hostCompany"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="媒体顾问" prop="media">
                <el-select v-model="pageInfo.media.pressChargeName" placeholder="请选择员工" class="wetuc-input-col2" @change="meitiguwenClick">
                    <el-option
                        v-for="item in mediaList"
                        :key="item.id"
                        :label="item.hostCompany"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="行业顾问" prop="industryConsultant">
                <el-select v-model="pageInfo.industryConsultant.fieldChargeName" placeholder="请选择员工" class="wetuc-input-col2" @change="hangyeguwenClick">
                    <el-option
                        v-for="item in industryConsultantList"
                        :key="item.id"
                        :label="item.hostCompany"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="竞品公司" prop="companies">
                <el-select
                    class="wetuc-input-col2"
                    v-model="pageInfo.companies"
                    value-key="name"
                    filterable
                    remote
                    multiple
                    :multiple-limit="3"
                    placeholder="请选择竞品公司"
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
            <el-form-item label="地区" prop="options">
                <el-cascader
                    v-if="flag"
                    class="wetuc-input-col2"
                    :props="props"
                    v-model="pageInfo.options">
                </el-cascader>
            </el-form-item>

            <el-form-item label="详细地址" prop="detailAddress">
                <el-input v-model="pageInfo.detailAddress" class="wetuc-input-col2">
                </el-input>
            </el-form-item>

            <div class="wetuc-block">
                <el-form-item label="是否公开" prop="publicShow">
                    <el-select v-model="pageInfo.publicShow" placeholder="请选择员工" class="wetuc-input-col2">
                        <el-option
                            v-for="item in publicShowList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>



            <el-form-item label=" ">
                <el-button type="primary" @click="submitForm('pageInfo')">提交</el-button>
                <el-button type="primary" @click="returnFn()">返回</el-button>
            </el-form-item>
        </el-form>



    </div>
</template>

<script>
import {loginService} from "../../service/loginService";
import axios from "axios";

export default {
    data() {
        return {
            beforeUrl: sessionStorage.getItem('addCompanyUrl') || this.$store.getters.getAddCpmpanyUrl,
            beforeName: sessionStorage.getItem('addCompanyName') || this.$store.getters.getAddCpmpanyName,
            flag: true,
            pageInfo: {
                company: '',
                companyName: '',
                website: '',
                scale: '',
                vip: '',
                financing: '',
                industry: '',
                subField: '',
                staff: '',
                industryConsultant: {
                    fieldChargeName: '',
                    fieldChargeId: ''
                },
                media: {
                    pressChargeName: '',
                    pressChargeId: ''
                },
                marketing: {
                    sellChargeName: '',
                    sellChargeId: ''
                },
                companies: '',
                options: '',
                detailAddress: '',
                publicShow: 1
            },
            props: {
                lazy: true,
                lazyLoad: (node, resolve) => this.loadNode(node, resolve)
            },
            companiesArray: [],
            getRelationArr: [],
            relationLoading: false,
            marketingList: [],
            mediaList: [],
            industryConsultantList: [],
            scaleList: [{
                value: 1,
                label: '1000万以下'
            }, {
                value: 2,
                label: '1000万-1亿'
            }, {
                value: 3,
                label: '1亿-10亿'
            }, {
                value: 4,
                label: '10亿以上'
            }],
            vipList: [{
                value: 1,
                label: '会员'
            }, {
                value: 2,
                label: '潜在会员'
            }, {
                value: 3,
                label: '非会员'
            }],
            financingList: [{
                value: 1,
                label: 'IPO'
            }, {
                value: 2,
                label: 'pre-IPO'
            }, {
                value: 3,
                label: 'F轮'
            }, {
                value: 4,
                label: 'E轮'
            }, {
                value: 5,
                label: 'D轮'
            }, {
                value: 6,
                label: 'C轮'
            }, {
                value: 7,
                label: 'B轮'
            }, {
                value: 8,
                label: 'A轮'
            }, {
                value: 9,
                label: 'pre-A轮'
            }, {
                value: 10,
                label: '天使轮'
            }, {
                value: 11,
                label: '未融资'
            }, {
                value: 12,
                label: '战略投资'
            }, {
                value: 13,
                label: '被收购'
            }],
            industryList: [],
            subFieldList: [],
            staffList: [{
                value: 1,
                label: '100人以下'
            }, {
                value: 2,
                label: '100-1000人'
            }, {
                value: 3,
                label: '1000-10000人'
            }, {
                value: 4,
                label: '10000人以上'
            }],
            publicShowList: [{
                value: 0,
                label: '是'
            }, {
                value: 1,
                label: '否'
            }],
            rules: {
                company: [
                    {required: true, message: '请输入公司名称', trigger: 'blur'}
                ],
                companyName: [
                    {required: true, message: '请输入公司全称', trigger: 'blur'}
                ],
            }
        }
    },
    mounted() {
        this.getindustryOptions()
        this.getStaff()
        this.getRelationArr = this.getRelationList('');
    },
    methods: {
        submitForm(formName) {
            let that = this;
            that.$refs[formName].validate((valid) => {
                if (valid) {
                    loginService.addCompanies({
                        name: that.pageInfo.company,
                        field: that.pageInfo.industry,
                        subField: that.pageInfo.subField,
                        fullName: that.pageInfo.companyName,
                        size: that.pageInfo.scale,
                        staffNum: that.pageInfo.staff,
                        url: that.pageInfo.website,
                        stage: that.pageInfo.financing,
                        companyVip: that.pageInfo.vip,
                        competitors: that.companiesArray.toString(),
                        publicShow: that.pageInfo.publicShow === 0 ? true : false,

                        pressChargeId: that.pageInfo.media.pressChargeId,
                        pressChargeName: that.pageInfo.media.pressChargeName,
                        fieldChargeId: that.pageInfo.industryConsultant.fieldChargeId,
                        fieldChargeName: that.pageInfo.industryConsultant.fieldChargeName,
                        sellChargeId: that.pageInfo.marketing.sellChargeId,
                        sellChargeName: that.pageInfo.marketing.sellChargeName,


                        prov: that.pageInfo.options[0].split('/')[0],
                        provCode: that.pageInfo.options[0].split('/')[1],
                        city: that.pageInfo.options[1].split('/')[0],
                        cityCode: that.pageInfo.options[1].split('/')[1],
                        dist: that.pageInfo.options[2].split('/')[0],
                        distCode: that.pageInfo.options[2].split('/')[1],
                        address: that.pageInfo.detailAddress,

                    }).then(res => {
                        if (res.data.success) {
                            that.$message({
                                type: 'success',
                                message: '新增成功'
                            })
                            setTimeout(() => {
                                this.$router.push({path: `${that.beforeUrl}`})
                            }, 300)
                        } else {
                            that.$message.error(res.data.message)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 获取一级行业
        getindustryOptions() {
            loginService.getindustryOptions({
                level: 1
            }).then(res => {
                this.industryList = res.data.datas;
            }).catch(err => {
                console.log(err);
            })
        },
        // 获取二级
        industryChange(value) {
            this.pageInfo.subField = '';
            this.subFieldList = [];
            loginService.getindustryOptions({
                level: 2,
                fField: value
            }).then(res => {
                this.subFieldList = res.data.datas;
            }).catch(err => {
                console.log(err);
            })
        },
        // 获取顾问
        getStaff() {
            for (let i = 1; i < 4; i++) {
                loginService.getStaff({
                    staffFunction: i
                }).then(res => {
                    if (res.data.success) {
                        let result = res.data.datas;
                        if(i === 1) {
                            result.forEach(item => {
                                this.marketingList.push({
                                    hostCompany: item.hostName,
                                    id: item.id
                                })
                            })
                        }
                        if(i === 2) {
                            result.forEach(item => {
                                this.mediaList.push({
                                    hostCompany: item.hostName,
                                    id: item.id
                                })
                            })
                        }
                        if(i === 3) {
                            result.forEach(item => {
                                this.industryConsultantList.push({
                                    hostCompany: item.hostName,
                                    id: item.id
                                })
                            })
                        }
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
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
        loadNode(node, resolve) {
            const { level } = node
            let code = 0
            if(level != 0) {
                code = node.data.value.split('/')[1]
            }
            let apis = process.env.API_ROOT
            let url = apis + 'citys'
            if(level > 0) {
                url = apis + `citys/${code}`
            }
            axios.get(url).then(res => {
                let nodes = res.data.datas.map(({ name, cityId }) => {
                    return {
                        label: name,
                        value: `${name}/${cityId}`,
                        leaf: level >= 2
                    }
                });
                resolve(nodes)
            })
        },
        meitiguwenClick(val) {
            this.pageInfo.media = {
                pressChargeId: val.id,
                pressChargeName: val.hostCompany
            }
        },
        hangyeguwenClick(val) {
            this.pageInfo.industryConsultant = {
                fieldChargeId: val.id,
                fieldChargeName: val.hostCompany
            }
        },
        yingxiaoguwenClick(val) {
            this.pageInfo.marketing = {
                sellChargeId: val.id,
                sellChargeName: val.hostCompany
            }
        },
        returnFn() {
            this.$router.push({path: `${this.beforeUrl}`})
        },
    },
}
</script>

<style scoped>

</style>

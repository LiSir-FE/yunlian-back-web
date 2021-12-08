<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/userManagement' }">用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>修改用户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="100px" :rules="rules">
            <el-form-item label="用户姓名" prop="name">
                <el-input v-model="pageInfo.name" placeholder="请输入用户姓名" class="wetuc-input-col2"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
                <el-input v-model="pageInfo.phone" placeholder="请输入联系方式" class="wetuc-input-col2" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="称谓" prop="sex">
                <el-select v-model="pageInfo.sex" placeholder="请选择称谓" class="wetuc-input-col2">
                    <el-option
                        v-for="item in sexList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="公司" prop="companies">
                <el-select
                    class="wetuc-input-col2"
                    v-model="pageInfo.companies"
                    value-key="subFieldName"
                    filterable
                    remote
                    placeholder="请选择其他公司"
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
            <el-form-item label="车队" prop="fleet">
                <el-select
                    class="wetuc-input-col2"
                    v-model="pageInfo.fleet"
                    value-key="bandName"
                    filterable
                    remote
                    placeholder="请选择车队"
                    @change="fleetChangeKeyWord"
                    :remote-method="fleetRemoteMethod"
                    :loading="fleetLoading">
                    <el-option
                        v-for="item in getFleetArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职位" prop="position">
                <el-select v-model="pageInfo.position" placeholder="请选择职位" class="wetuc-input-col2">
                    <el-option
                        v-for="item in positionList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职能" prop="intJob">
                <el-select v-model="pageInfo.intJob" multiple :multiple-limit="3" placeholder="请选择职能" class="wetuc-input-col2">
                    <el-option
                        v-for="item in intJobList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所在地区" prop="options">
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


            <el-form-item label="邮箱" prop="email">
                <el-input v-model="pageInfo.email" class="wetuc-input-col2"></el-input>
            </el-form-item>

            <el-form-item label="简介" prop="descripthion">
                <el-input v-model="pageInfo.descripthion" class="wetuc-input-col615"></el-input>
            </el-form-item>

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
        var checkPhone = (rule, value, callback) => {
            const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
            if (!value) {
                return callback(new Error('电话号码不能为空'))
            }
            setTimeout(() => {
                // Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
                // 所以我就在前面加了一个+实现隐式转换

                if (!Number.isInteger(+value)) {
                    callback(new Error('请输入数字值'))
                } else {
                    if (phoneReg.test(value)) {
                        callback()
                    } else {
                        callback(new Error('电话号码格式不正确'))
                    }
                }
            }, 100)
        }
        var checkEmail = (rule, value, callback) => {
            const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
            if (!value) {
                return callback(new Error('邮箱不能为空'))
            }
            setTimeout(() => {
                if (mailReg.test(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确的邮箱格式'))
                }
            }, 100)
        }
        return {
            flag: false,
            pageInfo: {
                name: '',
                phone: '',
                sex: '',
                companies: '',
                fleet: '',
                position: '',
                intJob: '',
                email: '',
                options: undefined,
                descripthion: '',
                detailAddress: ''
            },
            id: this.$route.query.id,
            props: {
                lazy: true,
                lazyLoad: (node, resolve) => this.loadNode(node, resolve)
            },
            getRelationArr: [],
            getFleetArr: [],
            companiesArray: [],
            fleetArray: [],
            relationLoading: false,
            fleetLoading: false,
            sexList: [{
                value: 1,
                label: '男士'
            },{
                value: 2,
                label: '女士'
            }],
            positionList: [{
                value: 1,
                label: '董事长/总经理'
            }, {
                value: 2,
                label: '副总裁/副总经理'
            }, {
                value: 3,
                label: '事业部总经理'
            }, {
                value: 4,
                label: '总监'
            }, {
                value: 5,
                label: '高级经理/经理'
            }, {
                value: 6,
                label: '主管/车队长'
            }, {
                value: 7,
                label: '专员/司机'
            }, {
                value: 8,
                label: '总裁秘书/助理'
            }, {
                value: 9,
                label: '创始人/联合创始人/合伙人'
            }],
            intJobList: [{
                value: 1,
                label: '运营'
            }, {
                value: 2,
                label: '采购'
            }, {
                value: 3,
                label: '销售'
            }, {
                value: 4,
                label: '人力'
            }, {
                value: 5,
                label: '市场/公关'
            }, {
                value: 6,
                label: '财务'
            }, {
                value: 7,
                label: '战略/投资'
            }],
            rules: {
                position: [
                    {required: true, message: '请选择职位', trigger: 'change'}
                ],
                options: [
                    {required: true, message: '请选择省市区', trigger: 'change'}
                ],
                sex: [
                    {required: true, message: '请选择称谓', trigger: 'change'}
                ],
                name: [
                    {required: true, message: '请输入用户姓名', trigger: 'blur'}
                ],
                phone: [
                    {required: true, validator: checkPhone, trigger: 'blur'}
                ],
                email: [
                    {required: true, validator: checkEmail, trigger: 'blur'}
                ],
                intJob: [
                    {type: 'array', required: true, message: '请选择职能', trigger: 'change'}
                ],
                detailAddress: [
                    {required: true, message: '请填写详细地址', trigger: 'blur'}
                ],
                companies: [
                    {required: true, validator: this.relationfleet, trigger: 'change'}
                ],
                fleet: [
                    {required: true, validator: this.relationfleet, trigger: 'change'}
                ]
            }
        }
    },
    components: {
    },
    mounted() {
        this.getRelationArr = this.getRelationList('');
        this.getFleetArr = this.getfleetList('');
        setTimeout(() => {
            if(this.getRelationArr && this.getFleetArr) {
                this.detailUsers()
            }
        }, 500)
    },
    methods: {
        // 获取详情
        detailUsers() {
            let that = this;
            that.flag = false;
            loginService.detailUsers(that.id, {}).then(res => {
                if (res.data.success) {
                    that.$nextTick(() => {
                        let obj = res.data.datas.user;
                        let carTeam = res.data.datas.carTeam;
                        let com = res.data.datas.company;
                        that.pageInfo.intJob = obj.functions ? obj.functions : '';
                        that.pageInfo.position = obj.intJob ? obj.intJob : '';
                        that.pageInfo.email = obj.email;
                        that.pageInfo.descripthion = obj.descripthion;
                        that.pageInfo.name = obj.name;
                        that.pageInfo.phone = obj.phone;
                        that.pageInfo.sex = obj.sex;
                        that.pageInfo.detailAddress = obj.address.detailAdress ? obj.address.detailAdress : '';
                        if (com) {
                            if (JSON.stringify(that.getRelationArr).indexOf(com.id) === -1) {
                                that.getRelationArr.unshift({
                                    id: com.id,
                                    name: com.name
                                })
                            }
                            that.pageInfo.companies = com.id;
                        }
                        if (carTeam) {
                            if (JSON.stringify(that.getFleetArr).indexOf(carTeam.id) === -1) {
                                that.getFleetArr.unshift({
                                    id: carTeam.id,
                                    name: carTeam.name
                                })
                            }
                            that.pageInfo.fleet = carTeam.id;
                        }
                        // 这里是赋值
                        const { provinceName, provinceId, cityName, cityId, districtName, districtId } = obj.address;
                        that.pageInfo.options = [`${provinceName}/${provinceId}`, `${cityName}/${cityId}`, `${districtName}/${districtId}`];
                        that.flag = true;
                    })
                }
            }).catch(err => {
                console.log(err);
            })
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
        // 提交
        submitForm (formName) {
            let that = this
            that.$refs[formName].validate((valid) => {
                if (valid) {
                    loginService.editUsers({
                        id: that.id,
                        name: that.pageInfo.name,
                        phone: that.pageInfo.phone,
                        sex: that.pageInfo.sex,
                        functions: that.pageInfo.intJob,
                        intJob: that.pageInfo.position,
                        email: that.pageInfo.email,

                        companyId: that.pageInfo.companies,
                        carTeamId: that.pageInfo.fleet,

                        descripthion: that.pageInfo.descripthion,
                        detailAdress: that.pageInfo.detailAddress,

                        provinceName: that.pageInfo.options[0].split('/')[0],
                        provinceId: that.pageInfo.options[0].split('/')[1],
                        cityName: that.pageInfo.options[1].split('/')[0],
                        cityId: that.pageInfo.options[1].split('/')[1],
                        districtName: that.pageInfo.options[2].split('/')[0],
                        districtId: that.pageInfo.options[2].split('/')[1]

                    }).then(res => {
                        if (res.data.success) {
                            that.$message({
                                type: 'success',
                                message: '修改成功'
                            })
                            setTimeout(() => {
                                that.$router.go(-1)
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
        returnFn() {
            this.$router.go(-1)
        },
        // 验证
        relationfleet(rule, value, callback) {
            if (!this.pageInfo.companies && this.pageInfo.fleet === null) {
                return callback(new Error('请选择公司或车队!'));
            } else {
                callback();
            }
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
        fleetChangeKeyWord(val) {
            this.fleetArray = []
            if (val !== null) {
                this.fleetArray.push(val);
            } else {
                this.fleetArray = [];
            }
        },
        getfleetList(query) {
            let that = this, relationArrayX = [];
            loginService.getfleetList({
                param: query,
                type: 1,
                pageNo: 1,
                pageSize: 20
            }).then(function (res) {
                if (res.data.success) {
                    let newArr = res.data.datas.datas;
                    for (let i = 0; i < newArr.length; i++) {
                        relationArrayX.push({id: newArr[i].id, name: newArr[i].name});
                    }
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                console.log(err);
            });
            return relationArrayX;
        },
        fleetRemoteMethod(query) {
            let that = this;
            if (query !== '') {
                that.fleetLoading = true;
                setTimeout(() => {
                    that.fleetLoading = false;
                    that.getFleetArr = that.getfleetList(query); // 文章关键词
                }, 200);
            } else {
                that.getFleetArr = [];
            }
        }
    },
}
</script>

<style scoped>

</style>

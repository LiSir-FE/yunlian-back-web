<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/workList' }">工作列表</el-breadcrumb-item>
                <el-breadcrumb-item>新增工作</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="70px" :rules="rules">
            <el-form-item label="用户姓名" prop="userName">
                <el-select
                    class="wetuc-input3-col3"
                    v-model="pageInfo.userName"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入用户姓名"
                    @change="changeKeyWord"
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                        v-for="item in userNameArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-tooltip class="item" effect="dark" content="增加用户信息" placement="top-start">
                    <i class="el-icon-s-order" @click="addUser"></i>
                </el-tooltip>
            </el-form-item>

            <el-form-item label="场景" prop="moscenedel">
                <el-select v-model="pageInfo.moscenedel" placeholder="请选择场景" class="wetuc-input3-col3">
                    <el-option
                        v-for="item in sceneOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <el-tooltip placement="top">
                    <div slot="content">一对一场景<br/>对目标公司进行采访，调研<br/>与目标公司签约成交，达成市场广告合作</div>
                    <div slot="content">一对多<br/>作为第三方撮合另外两方或者多方达成合作或建立联系</div>
                    <div slot="content">其他场景<br/>行业交流活动中偶遇或其他偶发场景</div>
                    <i class="el-icon-info"></i>
                </el-tooltip>
            </el-form-item>

            <el-form-item label="沟通方式" prop="mode">
                <el-select v-model="pageInfo.mode" placeholder="请选择沟通方式" class="wetuc-input3-col3">
                    <el-option
                        v-for="item in modeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="时间" prop="deadline" disabled="true">
                <el-date-picker
                    class="wetuc-input3-col3"
                    v-model="pageInfo.deadline"
                    :picker-options="pickerOptions"
                    type="date"
                    format="yyyy-MM-dd HH:mm"
                    value-format="timestamp"
                    placeholder="请选择时间">
                </el-date-picker>
            </el-form-item>

            <el-collapse v-model="activeNames" accordion @change="handleChange">
                <el-collapse-item title="" name="b">

                    <template v-if="activeNames === 'b'">
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="pageInfo.title" placeholder="请输入标题" class="wetuc-input3-col3"></el-input>
                        </el-form-item>


                        <el-form-item label="分类" prop="classification">
                            <el-select v-model="pageInfo.classification" class="wetuc-input3-col3">
                                <el-option
                                    v-for="item in classificationOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="关联公司" prop="companies">
                            <el-select
                                class="wetuc-input3-col3"
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

                        <el-form-item label="碎片分类" prop="fragment">
                            <el-select v-model="pageInfo.fragment" class="wetuc-input3-col3">
                                <el-option
                                    v-for="item in fragmentOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="内容" prop="content">
                            <el-input type="textarea" :rows="6" v-model="pageInfo.content" class="wetuc-input-col523" maxlength="500"></el-input>
                        </el-form-item>

                        <el-form-item label="碎片内容" prop="fragmentContent">
                            <el-input type="textarea" :rows="6" v-model="pageInfo.fragmentContent" class="wetuc-input-col523" maxlength="500"></el-input>
                        </el-form-item>
                    </template>

                </el-collapse-item>
            </el-collapse>




            <el-form-item label=" ">
                <el-button type="primary" @click="submitForm('pageInfo', 1)">提 交</el-button>
                <el-button type="primary" @click="submitForm('pageInfo', 2)" v-if="activeNames === 'b'">提交并完善商机</el-button>
                <el-button type="primary" @click="returnFn">取 消</el-button>
            </el-form-item>
        </el-form>


    </div>
</template>

<script>
import {loginService} from "../../service/loginService";

export default {
    data() {
        let userName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('姓名不能为空'));
            } else {
                callback();
            }
        };
        return {
            activeNames: 'a',
            pageInfo: {
                userName: '',
                userId: '',
                moscenedel: '',
                mode: '',
                deadline: '',


                title: '',
                classification: '',
                companies: '',
                content: '',


                fragment: '',
                fragmentContent: ''
            },
            userNameArr: [],
            sceneOptions: [{
                value: 1,
                label: '一对一'
            }, {
                value: 2,
                label: '一对多'
            }, {
                value: 3,
                label: '其他'
            }],
            modeOptions: [{
                value: 1,
                label: '电话'
            }, {
                value: 2,
                label: '微信'
            }, {
                value: 3,
                label: '邮件'
            }, {
                value: 4,
                label: '见面'
            }, {
                value: 5,
                label: '视频会议'
            }],
            fragmentOptions: [{
                value: 1,
                label: '商机'
            }, {
                value: 2,
                label: '重要信息'
            }, {
                value: 3,
                label: '其他信息'
            }],
            companiesArray: [],
            getRelationArr: [],
            relationLoading: false,
            classificationOptions: [{
                value: 1,
                label: '信息沟通'
            }, {
                value: 2,
                label: '商务合作'
            }, {
                value: 3,
                label: '资源对接'
            }, {
                value: 4,
                label: '采访报道'
            }, {
                value: 5,
                label: '培训咨询'
            }],
            loading: false,
            pickerOptions: { // 时间
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            rules: {
                userName: [
                    {required: true, validator: userName, trigger: 'change'}
                ],
                moscenedel: [
                    {required: true, message: '请选择场景', trigger: 'change'}
                ],
                mode: [
                    {required: true, message: '请选择沟通方式', trigger: 'change'}
                ],
                deadline: [
                    {required: true, message: '请选择时间', trigger: 'change'}
                ],
                title: [
                    {required: true, message: '请输入标题', trigger: 'blur'}
                ],
                classification: [
                    {required: true, message: '请选择分类', trigger: 'change'}
                ],
                content: [
                    {required: true, message: '请输入内容', trigger: 'blur'}
                ]
            }
        }
    },
    mounted() {
        this.getRelationArr = this.getRelationList('');
    },
    methods: {
        submitForm(formName, type) {
            let that = this;
            that.$refs[formName].validate((valid) => {
                if(valid) {
                    if(that.activeNames === 'a') {
                        loginService.addWork({
                            userId: that.pageInfo.userId,
                            scene: that.pageInfo.moscenedel,
                            communicateMethod: that.pageInfo.mode,
                            visitTime: that.pageInfo.deadline,
                            step: '1'
                        }).then(res => {
                            if(res.data.success) {
                                that.$message({
                                    message: '添加成功！',
                                    type: 'success'
                                });
                                setTimeout(() => {
                                    that.$router.push({path: 'workList'})
                                }, 300)
                            }
                        }).catch(err => {
                            console.log(err);
                        })
                    } else if (that.activeNames === 'b') {
                        loginService.addWork({
                            userId: that.pageInfo.userId,
                            companies: that.companiesArray.toString(),
                            scene: that.pageInfo.moscenedel,
                            communicateMethod: that.pageInfo.mode,
                            title: that.pageInfo.title,
                            type: that.pageInfo.classification,
                            content: that.pageInfo.content,
                            infoType: that.pageInfo.fragment,
                            visitTime: that.pageInfo.deadline,
                            infoContent: that.pageInfo.fragmentContent,
                            operate: type,
                            step: '2'
                        }).then(res => {
                            if(res.data.success) {
                                that.$message({
                                    message: '添加成功！',
                                    type: 'success'
                                });
                                setTimeout(() => {
                                    if(type === 1) {
                                        that.$router.push({path: 'workList'})
                                    } else if(type === 2) {
                                        that.$router.push({path: 'editInformation', query: {id: res.data.datas.id}})
                                    }
                                }, 300)
                            }
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },

        handleChange(val) {
            console.log(val);
        },
        changeKeyWord(val) {
            this.pageInfo.userName = val;
            this.pageInfo.userId = val;
        },
        // 查询用户名
        remoteMethod(query) {
            let that = this;
            if (query !== '') {
                that.loading = true;
                setTimeout(() => {
                    that.loading = false;
                    that.userNameArr = that.getUserNameList(query); // 文章关键词
                }, 200);
            } else {
                that.userNameArr = [];
            }
        },
        getUserNameList(query) {
            let that = this, array = [];
            loginService.serceUserName({
                groupId: 1,
                pageNo: 1,
                pageSize: 10,
                search: query
            }).then(function (res) {
                if (res.data.success) {
                    let newArr = res.data.datas.datas;
                    for (let i = 0; i < newArr.length; i++) {
                        array.push({id: newArr[i].id, name: newArr[i].name});
                    }
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                console.log(err);
            });
            return array;
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
        addUser() {
            this.$router.push({path: 'userAdd'})
        },
        returnFn() {
            this.$router.push({path: 'workList'})
        }
    },
}
</script>

<style scoped>
/deep/.el-icon-info, .el-icon-s-order{
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 15px;
}
/deep/.el-collapse{
    border-top: 0 !important;
    border-bottom: 0 !important;
    margin-bottom: 11px;
}
</style>

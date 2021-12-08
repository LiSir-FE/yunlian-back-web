<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: `${beforeUrl}` }">{{ beforeName }}</el-breadcrumb-item>
                <el-breadcrumb-item>商机详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="80px" :rules="rules">
            <div class="commentDiv">
                <template v-for="item in commentTable">
                    <el-form-item :label="item.hostName" style="width: 100%">
                        <el-input type="textarea" :rows="2" v-model="item.content" class="wetuc-input-col983" resize="none" :disabled="true"></el-input>
                        <p style="color:#ccc;">{{item.createTime | stampFormate4}}</p>
                    </el-form-item>
                </template>
            </div>


            <el-form-item label="评论" prop="commentInput">
                <el-input type="textarea" :rows="4" v-model="pageInfo.commentInput" class="wetuc-input-col983"></el-input>
            </el-form-item>
            <div class="wetuc-block">
                <el-form-item label=" ">
                    <el-button type="primary" @click="commentClick('pageInfo')">发表评论</el-button>
                    <el-button type="primary" @click="comments">查看全部评论</el-button>
                </el-form-item>
            </div>




            <el-collapse v-model="activeNames" accordion @change="handleChange">
                <el-collapse-item title="" name="a">
                    <el-form-item label="碎片分类" prop="infoType">
                        <el-select v-model="pageInfo.infoType" class="wetuc-input-col2" clearable placeholder="请选择碎片分类" :disabled="true">
                            <el-option
                                v-for="item in infoTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关联用户" prop="userName">
                        <el-select
                            :disabled="true"
                            class="wetuc-input-col2"
                            v-model="pageInfo.userName"
                            value-key="id"
                            filterable
                            remote
                            multiple
                            :multiple-limit="3"
                            placeholder="请选择关联用户"
                            @change="userChangeKeyWord"
                            :remote-method="userRemoteMethod"
                            :loading="userLoading">
                            <el-option
                                v-for="item in getUserNameArr"
                                :key="item.id"
                                :label="item.name"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关联公司" prop="companies">
                        <el-select
                            :disabled="true"
                            class="wetuc-input-col2"
                            v-model="pageInfo.companies"
                            value-key="name"
                            filterable
                            remote
                            multiple
                            :multiple-limit="3"
                            placeholder="请选择关联公司"
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

                    <el-form-item label="碎片标题" prop="infoTitle">
                        <el-input v-model="pageInfo.infoTitle" placeholder="请输入碎片标题" class="wetuc-input-col943" :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="碎片内容" prop="content">
                        <el-input type="textarea" :rows="6" v-model="pageInfo.content" class="wetuc-input-col943" maxlength="500" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="用户姓名">
                        <el-input v-model="pageInfo.name" placeholder="请输入用户名" class="wetuc-input-col2"
                                  :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="场景" prop="scene">
                        <el-select v-model="pageInfo.scene" placeholder="请选择场景" class="wetuc-input-col2" :disabled="true">
                            <el-option
                                v-for="item in sceneOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="沟通方式" prop="communicateMethod">
                        <el-select v-model="pageInfo.communicateMethod" placeholder="请选择沟通方式" class="wetuc-input-col2"
                                   :disabled="true">
                            <el-option
                                v-for="item in communicateMethodOptions"
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
                            v-model="pageInfo.companies1"
                            value-key="name"
                            filterable
                            remote
                            multiple
                            :multiple-limit="3"
                            placeholder="请选择关联公司"
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
                    <el-form-item label="分类" prop="type">
                        <el-select v-model="pageInfo.type" class="wetuc-input-col2" :disabled="true">
                            <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间" prop="createTime">
                        <el-date-picker
                            :disabled="true"
                            class="wetuc-input-col2"
                            v-model="pageInfo.createTime"
                            type="date"
                            :picker-options="pickerOptions"
                            format="yyyy-MM-dd HH:mm"
                            value-format="timestamp"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="标题" prop="title">
                        <el-input v-model="pageInfo.title" placeholder="请输入标题" class="wetuc-input-col943" :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="原始内容" prop="content1">
                        <el-input type="textarea" :rows="6" v-model="pageInfo.content1" class="wetuc-input-col943" maxlength="500" :disabled="true"></el-input>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse>
        </el-form>
    </div>
</template>

<script>
import {loginService} from "../../service/loginService";

export default {
    data() {
        return {
            id: this.$route.query.id,
            beforeUrl: sessionStorage.getItem('addCompanyUrl') || this.$store.getters.getAddCpmpanyUrl,
            beforeName: sessionStorage.getItem('addCompanyName') || this.$store.getters.getAddCpmpanyName,
            activeNames: 'a',
            commentTable: [],
            pageInfo: {
                infoType: '',
                userName: '',
                companies: '',
                infoTitle: '',

                name: '',
                scene: '',
                communicateMethod: '',
                companies1: '',
                type: '',
                createTime: '',
                title: '',
                content1: '',




                commentInput: '',
            },
            companiesArray: [],
            getRelationArr: [],
            relationLoading: false,

            userNameArr: [],
            getUserNameArr: [],
            userLoading: false,
            infoTypeOptions: [{
                value: 1,
                label: '商机'
            }, {
                value: 2,
                label: '重要信息'
            }, {
                value: 3,
                label: '其他信息'
            }],
            typeOptions: [{
                value: 1,
                label: '信息沟通'
            },{
                value: 2,
                label: '商务合作'
            },{
                value: 3,
                label: '资源对接'
            },{
                value: 4,
                label: '采访报道'
            },{
                value: 5,
                label: '培训咨询'
            }],
            communicateMethodOptions: [{
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
                label: '面谈'
            }, {
                value: 5,
                label: '视频会议'
            }],
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
            pickerOptions: { // 时间
                disabledDate: (time) => {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            rules: {
                commentInput: [{
                    required: true, message: '请填写评论内容', trigger: 'blur'
                }]
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getRelationArr = this.getRelationList('');
            this.getUserNameArr = this.getUserNameList('');
            setTimeout(() => {
                this.getcomments()
                this.informationDetails();
            }, 300)
        })
    },
    methods: {
        // 发表评论
        commentClick(formName) {
            let that = this;
            that.$refs[formName].validate((valid) => {
                if (valid) {
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        target: document.querySelector('.commentDiv')
                    });
                    loginService.commentClick(that.id, {
                        content: that.pageInfo.commentInput
                    }).then(res =>{
                        if(res.data.success) {
                            setTimeout(() => {
                                loading.close();
                                that.getcomments();
                            }, 500);
                        } else {
                            setTimeout(() => {
                                loading.close();
                                that.$message({
                                    type: 'info',
                                    message: res.data.message
                                });
                            }, 500);
                        }
                    }).catch(err =>{
                        console.log(err);
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 获取评论
        getcomments() {
            let that = this;
            loginService.getcomments(that.id, {
                pageNo: 1,
                pageSize: 3
            }).then(res =>{
                if(res.data.success) {
                    that.commentTable = res.data.datas.datas;
                }
            }).catch(err =>{
                console.log(err);
            })
        },
        // 查看全部评论
        comments() {
            let that = this;
            that.$router.push({path: 'commentAll', query: {id: that.id}})
        },
        // 获取信息
        informationDetails() {
            let that = this;
            loginService.informationDetails(that.id, {}).then(res => {
                if (res.data.success) {
                    that.$nextTick(() => {
                        let obj = res.data.datas.info;
                        let users = res.data.datas.users;
                        let com = res.data.datas.companies;
                        that.pageInfo.infoType = obj.infoType ? obj.infoType : '';
                        that.pageInfo.infoTitle = obj.infoTitle;
                        that.pageInfo.content = obj.infoContent;

                        if (com) {
                            com.forEach(item => {
                                that.pageInfo.companies.push({
                                    id: item.id,
                                    name: item.name
                                });
                                if(JSON.stringify(that.getRelationArr).indexOf(item.id) === -1) {
                                    that.getRelationArr.unshift({
                                        id: item.id,
                                        name: item.name
                                    });
                                }
                                that.companiesArray.push(item.id)
                            });
                        }
                        if (users) {
                            users.forEach(item => {
                                that.pageInfo.userName.push({
                                    id: item.id,
                                    name: item.name
                                });
                                if(JSON.stringify(that.getUserNameArr).indexOf(item.id) === -1) {
                                    that.getUserNameArr.unshift({
                                        id: item.id,
                                        name: item.name
                                    });
                                }
                                that.userNameArr.push(item.id)
                            });
                        }
                        that.jonId(res.data.datas.info.jobId)
                    })
                } else {
                    that.$message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // jobId
        jonId(id) {
            let that = this;
            loginService.detailsWork(id).then(res => {
                if (res.data.success) {
                    let obj = res.data.datas.job;
                    let com = res.data.datas.companies;
                    that.pageInfo.name = obj.user.name
                    that.pageInfo.scene = obj.scene
                    that.pageInfo.communicateMethod = obj.communicateMethod
                    that.pageInfo.title = obj.title
                    that.pageInfo.type = obj.type
                    that.pageInfo.createTime = obj.createTime
                    that.pageInfo.content1 = obj.content
                    that.pageInfo.companies1 = [];
                    if (com) {
                        com.forEach(item => {
                            that.pageInfo.companies1.push({
                                id: item.id,
                                name: item.name
                            });
                            if(JSON.stringify(that.getRelationArr).indexOf(item.id) === -1) {
                                that.getRelationArr.unshift({
                                    id: item.id,
                                    name: item.name
                                });
                            }
                        });
                    }
                }
            }).catch(err => {
                console.log(err);
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



        userChangeKeyWord(val) {
            this.userNameArr = []
            if (val !== null) {
                val.forEach(item => {
                    this.userNameArr.push(item.id);
                })
            } else {
                this.userNameArr = [];
            }
        },
        userRemoteMethod(query) {
            let that = this;
            if (query !== '') {
                that.userLoading = true;
                setTimeout(() => {
                    that.userLoading = false;
                    that.getUserNameArr = that.getUserNameList(query); // 文章关键词
                }, 200);
            } else {
                that.getUserNameArr = [];
            }
        },
        // 用户
        getUserNameList(query) {
            let that = this
            let array = [];
            loginService.serceUserName({
                param: query,
                pageNo: 1,
                pageSize: 20
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
        returnFn() {
            this.$router.push({path: 'opportunityList'})
        },
        handleChange(val) {
            console.log(val);
        },
    },
}
</script>

<style scoped>
/deep/.el-collapse{
    border-top: 0 !important;
}
</style>

<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/allActivities' }">活动管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" label-width="100px" :inline="true">
            <el-form-item label="活动名称" prop="title">
                <el-input v-model="pageInfo.title" :maxlength="50" class="wetuc-input-col2"
                          :disabled="true"></el-input>
            </el-form-item>


            <el-form-item label="活动主题" prop="classId">
                <el-select v-model="pageInfo.classId" placeholder="请选择活动主题" class="wetuc-input-col2 relation" value-key="value">
                    <el-option
                        v-for="item in classify"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value + '/' + item.text">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="活动模板">
                <el-select v-model="pageInfo.template" placeholder="请选择模板" class="wetuc-input-col2 relation">
                    <el-option
                        v-for="item in templateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>



            <el-form-item label="活动标签" prop="label">
                <el-select v-model="pageInfo.label" placeholder="请选择活动标签" class="wetuc-input-col2 relation" value-key="value">
                    <el-option
                        v-for="item in labelList"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value + '/' + item.text">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="活动公司" prop="companies">
                <el-select
                    class="wetuc-input-col2"
                    v-model="pageInfo.companies"
                    value-key="name"
                    filterable
                    remote
                    multiple
                    :multiple-limit="3"
                    placeholder="请选择活动关联公司"
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

            <el-form-item label="活动密码">
                <el-input type="password" v-model="pageInfo.passCode" placeholder="请输入活动密码" show-password class="wetuc-input-col2"></el-input>
            </el-form-item>

            <div class="wetuc-block">
                <el-form-item label=" ">
                    <el-button type="primary" @click="submitForm">提交</el-button>
                </el-form-item>
            </div>

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
                title: '',
                classId: '',
                label: '',
                companies: '',
                template: '',
                passCode: '',
            },
            templateList: [{
                label: '普通模板',
                value: 1
            },{
                label: '扩展内容',
                value: 2
            }],
            relationLoading: false,
            companiesArray: [],
            classify: [],
            labelList: [],
            getRelationArr: [],
        }
    },
    mounted() {
        this.$nextTick(() =>{
            this.classify = this.getTypeList(4, ''); // 活动主题
            this.labelList = this.getTypeList(5, ''); // 活动标签
            this.getRelationArr = this.getRelationList('');// 关联公司
            this.getDetail(this.id);
        })
    },
    methods: {
        submitForm() {
            let that = this;
            loginService.editTwoActivitys(that.id, {
                operate: 1,
                type: 3,
                typeId: that.id,
                activityTitle: that.pageInfo.title,

                actThemeId: that.pageInfo.classId ? that.pageInfo.classId.split('/')[1] : '',
                actTheme: that.pageInfo.classId ? that.pageInfo.classId.split('/')[0] : '',

                actTag: that.pageInfo.label ? that.pageInfo.label.split('/')[1] : '',
                actTagId: that.pageInfo.label ? that.pageInfo.label.split('/')[0] : '',
                companyIds: that.companiesArray.toString(),
                template: that.pageInfo.template,
                passCode: that.pageInfo.passCode
            }).then(res => {
                if (res.data.success) {
                    that.$message({
                        message: "修改成功",
                        type: "success"
                    });
                    setTimeout(() =>{
                        that.$router.push({path: 'allActivities'})
                    }, 300)
                }
            }).catch(err => {
                console.log(err);
            });
        },
        // 详情
        getDetail(id) {
            let that = this;
            loginService.getActivityDetail({id: id}).then(function (res) {
                if (res.data.success) {
                    let result = res.data.datas;
                    that.pageInfo.title = result.activityTitle;
                    that.pageInfo.passCode = result.passCode;
                    that.pageInfo.template = result.template;

                    that.pageInfo.classId = result.actTheme + '/' + result.actThemeId;
                    that.pageInfo.label = result.actTagId + '/' + result.actTag
                    loginService.getTwoCompanys({
                        type: 3,
                        typeId: id
                    }).then(res => {
                        if (res.data.success) {
                            let com = res.data.datas;
                            if (com) {
                                com.forEach(item => {
                                    that.pageInfo.companies.push({
                                        id: item.id,
                                        name: item.name
                                    });
                                    if (JSON.stringify(that.getRelationArr).indexOf(item.id) === -1) {
                                        that.getRelationArr.unshift({
                                            id: item.id,
                                            name: item.name
                                        });
                                    }
                                    that.companiesArray.push(item.id);
                                });
                            }
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }
            })
        },
        getTypeList(typ, query) {
            let that = this, array = [];
            loginService.getArticlesType({type: typ, tagName: query}).then(function (res) {
                if (res.data.success) {
                    let newArr = res.data.datas;
                    for (let i = 0; i < newArr.length; i++) {
                        array.push({text: newArr[i].tagName, value: newArr[i].id});
                    }
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                that.$router.push({name: 'error'});
            });
            return array;
        },
        // 关联活动公司
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
        }
    },
}
</script>

<style scoped>

</style>

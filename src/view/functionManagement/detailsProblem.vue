<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/problemList' }">问题管理</el-breadcrumb-item>
                <el-breadcrumb-item>问题详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="100px" :rules="rules" :disabled="true">
            <el-form-item label="问题标题" prop="title">
                <el-input v-model="pageInfo.title" placeholder="请输入问题标题" class="wetuc-input-col2"></el-input>
            </el-form-item>
            <el-form-item label="问题分类">
                <el-select v-model="pageInfo.type" class="wetuc-input-col2">
                    <el-option
                        v-for="item in typeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <div class="wetuc-block">
                <el-form-item label="问题描述" prop="answer">
                    <el-input type="textarea" :rows="4" v-model="pageInfo.answer" placeholder="请输入问题描述" class="wetuc-input-col618"></el-input>
                </el-form-item>
            </div>

            <el-table :data="optionData" style="width: 60%;min-width: 60%;margin-left: 30px" highlight-current-row
                      @current-change="handleCurrentChange" v-if="optionData.length >= 1">
                <el-table-column label="序号" width="75">
                    <template slot-scope="scope">
                        <span>{{scope.row.no | answerIdx}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="选项内容" min-width="150"></el-table-column>
                <el-table-column label="正确选项" min-width="150">
                    <template slot-scope="scope">
                        <el-radio v-model="scope.row.no" :label="rightNo"></el-radio>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </div>
</template>

<script>
import {loginService} from "../../service/loginService";
import {answerIdx} from '../../filter/companyList'
export default {
    data() {
        return {
            id: this.$route.query.id,
            pageInfo: {
                title: '',
                type: 1,
                answer: '',
                option: ''
            },
            typeList: [{
                label: '行业',
                value: 1
            }, {
                label: '企业',
                value: 2
            }, {
                label: '运联',
                value: 3
            }, {
                label: '其它',
                value: 4
            }],
            optionData:[],
            currentRow:null,
            rules: {
                title: [{required: true, message: '请输入问题标题', trigger: 'blur'}],
                answer: [{required: true, message: '请输入问题答案', trigger: 'blur'}],
                option: [{required: true, message: '请输入选项', trigger: 'blur'}]
            }
        }
    },
    filters: {
        answerIdx
    },
    mounted() {
        this.getAnswerDetrails()
    },
    methods: {
        submitForm(formName) {
            let that = this;
            that.$refs[formName].validate((valid) => {
                if (valid) {
                    if(that.optionData.length >= 2) {
                        let result = that.optionData.some(function (item, index) {
                            if(item.radio === 1) {
                                that.rightNo = ++index;
                                return true
                            }
                        });
                        if(result) {
                            let answerArray = [];
                            that.optionData.forEach(item => {
                                answerArray.push(item.title)
                            });
                            loginService.addQuizes({
                                title: that.pageInfo.title,
                                desc: that.pageInfo.answer,
                                classify: that.pageInfo.type,
                                rightNo: that.rightNo,
                                answerArray: answerArray
                            }).then(res => {
                                if (res.data.success) {
                                    that.$message({
                                        message: '新增成功！',
                                        type: 'success'
                                    });
                                    that.$router.push({path: 'problemList'})
                                } else {
                                    that.$message.error(res.data.message)
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                        } else {
                            that.$message.error('请选择正确答案');
                        }
                    } else {
                        that.$message.error('至少添加2项选择');
                    }
                }
            });
        },
        getAnswerDetrails() {
            let that = this;
            loginService.getAnswerDetrails(that.id, {
            }).then(res => {
                if(res.data.success) {
                    that.pageInfo.title = res.data.datas.title;
                    that.pageInfo.type = res.data.datas.classify;
                    that.pageInfo.answer = res.data.datas.desc;
                    that.rightNo = res.data.datas.rightNo;
                    that.optionData = res.data.datas.answers;
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 添加选项
        addOption(val, index) {
            let that = this;
            that.optionData.push({
                title: val,
                radio: 0,
                no: index
            })
        },
        // 删除
        deleteCLick(val) {
            let Index = this.optionData.findIndex(item => {
                if (item.title == val.title) {
                    return true
                }
            });
            this.optionData.splice(Index, 1)
        },
        radioCharge(val, index) {
            this.optionData.forEach(item => {
                item.radio = 0
            });
            this.optionData[index].radio = 1;
        },
        // 单选
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        resetForm() {
            this.$router.push({path: 'problemList'})
        }
    },
}
</script>

<style scoped>
/deep/.el-radio .el-radio__label{
    display: none !important;
}
/deep/.el-radio .el-radio__input.is-checked .el-radio__inner{
    background: #409EFF;
}
</style>

<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/detailsFleet', query: {id: this.id} }">车队详情</el-breadcrumb-item>
                <el-breadcrumb-item>{{ name }}/备忘录</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="80px" :rules="rules">
            <el-timeline class="commentDiv">
                <el-timeline-item :timestamp="item.createTime | stampFormate4" placement="top" v-for="(item, index) in commentTable" :key="index">
                    <el-card>
                        <h4>{{ item.hostName }}</h4>
                        <p>{{item.content}}</p>
                    </el-card>
                </el-timeline-item>
            </el-timeline>

            <el-form-item label="备忘录" prop="commentInput">
                <el-input type="textarea" :rows="4" v-model="pageInfo.commentInput" placeholder="请输入内容" class="wetuc-input-col885"></el-input>
            </el-form-item>

            <div class="wetuc-block">
                <el-form-item label=" ">
                    <el-button type="primary" @click="commentClick('pageInfo')">添加备忘录</el-button>
                </el-form-item>
            </div>

        </el-form>



        <div class="wetuc-pagination-panel">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page.pageNum"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {loginService} from "../../service/loginService";

export default {
    data() {
        return {
            id: this.$route.query.id,
            name: '',
            pageInfo: {
                commentInput: ''
            },
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            commentTable: [],
            rules: {
                commentInput: [{
                    required: true, message: '请填写评论内容', trigger: 'blur'
                }]
            }
        }
    },
    mounted() {
        this.getcomments()
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
                    loginService.addcarCommentsList(that.id, {
                        content: that.pageInfo.commentInput
                    }).then(res =>{
                        if(res.data.success) {
                            that.$message({
                                message: '添加成功！',
                                type: 'success'
                            });
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
            loginService.getcarCommentsList(that.id, {
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize
            }).then(res => {
                if (res.data.success) {
                    let result = res.data.datas;
                    that.name = result.carTeam.name;
                    that.commentTable = result.comments.datas;
                    that.page.total = Number(result.comments.totalCount);
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 分页
        handleSizeChange (val) {
            this.page.pageSize = val
            this.getcomments()
        },
        handleCurrentChange (val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.getcomments()
            }
        }
    },
}
</script>

<style scoped>
.commentDiv{
    padding: 0 245px 0 50px;
    box-sizing: border-box;
}
</style>

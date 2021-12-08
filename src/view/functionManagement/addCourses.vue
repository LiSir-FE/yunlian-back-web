<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/coursesList' }">课程管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增课程</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="100px" :rules="rules">
            <el-form-item label="课程名称" prop="title">
                <el-input v-model="pageInfo.title" placeholder="请输入课程名称" class="wetuc-input-col2"></el-input>
            </el-form-item>
            <el-form-item label="讲师名称" prop="lecturerName">
                <el-select v-model="pageInfo.lecturerName" placeholder="请选择讲师" class="wetuc-input-col2">
                    <el-option
                        v-for="item in lecturerNameList"
                        :key="item.id"
                        :label="item.hostName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <div class="wetuc-block">
                <el-form-item label="课程简介" prop="courseIntroduction">
                    <el-input type="textarea" :rows="4" v-model="pageInfo.courseIntroduction" placeholder="请输入课程简介" class="wetuc-input-col618"></el-input>
                </el-form-item>
            </div>

            <div class="wetuc-block">
                <el-form-item label="上传视频" prop="uploadVideo">
                    <el-upload
                        class="wetuc-input-col618 uploadVideo"
                        :http-request="fnUploadRequest"
                        action
                        :limit="1"
                        :v-model="pageInfo.uploadVideo"
                        :on-exceed="beyondFile"
                        :on-success="handleVideoSuccess"
                        :before-upload="beforeUploadVideo"
                        :before-remove="remobeFn"
                        :file-list="fileList">
                        <el-button size="small" type="primary" v-if="!pageInfo.uploadVideo">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip" v-if="!pageInfo.uploadVideo" style="display: inline-block;padding-left: 20px;box-sizing: border-box;color: #9B9B9B">只能上传mp4文件</div>
                    </el-upload>
                    <input type="text" v-model="pageInfo.time" ref="dur" name='0' v-show="false"/>
                </el-form-item>
            </div>

            <div class="wetuc-block">
                <el-form-item label="上传课件" prop="uploadContract">
                    <el-upload
                        class="wetuc-input-col618 uploadContract"
                        action
                        :http-request="fnUploadRequestPdf"
                        :limit="1"
                        :on-exceed="beyondFilePdf"
                        :on-success="handlePdfSuccess"
                        :before-upload="beforeUploadPdf"
                        :before-remove="remobeFn"
                        :v-model="pageInfo.uploadContract"
                        :file-list="fileList">
                        <el-button size="small" type="primary" v-if="!pageInfo.uploadContract">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip" v-if="!pageInfo.uploadContract" style="display: inline-block;padding-left: 20px;box-sizing: border-box;color: #9B9B9B">只能上传pdf文件</div>
                    </el-upload>
                </el-form-item>
            </div>



            <template v-for="(item, index) in pageInfo.homeworkAfter">
                <el-form-item label="课后作业" :prop="'homeworkAfter.' + index + '.cwTitle'" :rules="{required: true, message: '请填写作业', trigger: 'blur'}">
                    <el-input v-model="item.cwTitle" placeholder="请输入课后作业" class="wetuc-input-col2"></el-input>
                    <i class="el-icon-circle-plus wetuc-ortion" style="color: #409EFF;cursor: pointer" @click="addOption" v-if="index == 0"></i>
                    <i class="el-icon-delete wetuc-ortion" style="cursor: pointer" @click="removecourse(item)" v-if="index != 0"></i>
                </el-form-item>
            </template>

            <div class="wetuc-block">
                <el-form-item label=" ">
                    <el-button type="primary" @click="submitForm('pageInfo')">保存</el-button>
                    <el-button @click="resetForm">返回</el-button>
                </el-form-item>
            </div>


        </el-form>



    </div>
</template>

<script>
import {loginService} from "../../service/loginService";
import oss from '../../assets/js/oss.js'

export default {
    data() {
        return {
            appServer: this.apis + 'oss/stsToken',
            oSStsToken: '',
            bucket: 'wetuc',
            uid: 'x',
            region: 'oss-cn-shanghai',

            pageInfo: {
                title: '',
                lecturerName: '',
                courseIntroduction: '',
                uploadContract: '',
                uploadVideo: '',
                time: '',
                homeworkAfter: [{
                    cwTitle: ''
                }],
            },
            fileList: [],
            lecturerNameList: [],
            rules: {
                title: [{required: true, message: '请输入课程名称', trigger: 'blur'}],
                courseIntroduction: [{required: true, message: '请输入课程简介', trigger: 'blur'}],
                uploadVideo: [
                    {required: true, message: '请上传视频', trigger: 'change'}
                ],
                uploadContract: [
                    {required: true, message: '请上传课件', trigger: 'change'}
                ],
                lecturerName: [
                    {required: true, message: '请选择讲师', trigger: 'change'}
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
        this.getAllStaffCount()
    },
    methods: {
        submitForm(formName) {
            let that = this;
            that.$refs[formName].validate((valid) => {
                if (valid) {
                    loginService.addCourse({
                        title: that.pageInfo.title,
                        video: that.pageInfo.uploadVideo,
                        file: that.pageInfo.uploadContract,
                        time: that.pageInfo.time,
                        teacherId: that.pageInfo.lecturerName,
                        content: that.pageInfo.courseIntroduction,
                        courseWorks: JSON.stringify(that.pageInfo.homeworkAfter)
                    }).then(res => {
                        if(res.data.success) {
                            that.$message({
                                message: "新增成功",
                                type: "success"
                            });
                            that.$router.push({path: 'coursesList'})
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 获取业务员
        getAllStaffCount() {
            loginService.getAllStaffCount({
            }).then(res => {
                this.lecturerNameList = res.data.datas;
            }).catch(err =>{
                console.log(err);
            })
        },

        //添加课后作业
        addOption() {
            this.pageInfo.homeworkAfter.push({
                cwTitle: ''
            });
        },
        // 删除课后作业
        removecourse(item) {
            let index = this.pageInfo.homeworkAfter.indexOf(item);
            if (index !== -1) {
                this.pageInfo.homeworkAfter.splice(index, 1);
            }
        },



        async fnUploadRequest(option) {
            oss.ossUploadFile(option, 'vadio');
        },
        // 视频上传
        beforeUploadVideo(file) {
            // todo
        },
        // 视频添加多个视频文件事件
        beyondFile(files, fileList) {
        },
        // 视频上传成功后
        handleVideoSuccess(response, file, fileList) {
            if(response !== undefined) {
                document.querySelector('.uploadVideo .el-upload--text').style = 'display: none'
                this.pageInfo.uploadVideo = response.name;
                this.pageInfo.time = response.res.timing;
                console.log(response.res.timing, response);
            }
            // todo
        },


        async fnUploadRequestPdf(option) {
            oss.ossUploadFile(option, 'pdf');
        },
        // pdf上传
        beforeUploadPdf(file) {
            // todo
        },
        // pdf添加多个pdf文件事件
        beyondFilePdf(files, fileList) {
        },
        // pdf上传成功后
        handlePdfSuccess(response, file, fileList) {
            if(response !== undefined) {
                document.querySelector('.uploadContract .el-upload--text').style = 'display: none'
                this.pageInfo.uploadContract = response.name;
            }
            // todo
        },
        remobeFn(file, fileFist) {
            if(file && file.status === 'success') {
                let type = file.name.split('.')[1]
                if(type === 'mp4') {
                    this.pageInfo.uploadVideo = ''
                    document.querySelector('.uploadVideo .el-upload--text').style = 'display: inline-block'
                } else if (type === 'pdf') {
                    this.pageInfo.uploadContract = ''
                    document.querySelector('.uploadContract .el-upload--text').style = 'display: inline-block'
                }
            }
        },
        resetForm() {
            this.$router.push({path: 'coursesList'})
        }

    },
}
</script>

<style scoped>

</style>

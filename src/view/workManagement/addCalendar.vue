<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/calendarList' }">日历列表</el-breadcrumb-item>
                <el-breadcrumb-item>新增日历项</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="100px" :rules="rules">
            <el-form-item label="标题" prop="title">
                <el-input v-model="pageInfo.title" placeholder="请输入标题" class="wetuc-input-col2"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="type">
                <el-select v-model="pageInfo.type" placeholder="请选择分类" class="wetuc-input-col2">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="执行时间" prop="dateValue">
                <el-date-picker v-model="pageInfo.dateValue" value-format="timestamp" type="date" placeholder="请选择日期" class="wetuc-input-col2"></el-date-picker>
            </el-form-item>
            <el-form-item label="人员" prop="hostName">
                <el-select v-model="pageInfo.hostName" multiple :multiple-limit="5" placeholder="请选择通知人员" class="wetuc-input-col2" @change="hostChange">
                    <el-option
                        v-for="item in salesmanList"
                        :key="item.id"
                        :label="item.hostName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="权限" prop="jurisdiction">
                <el-select v-model="pageInfo.jurisdiction" placeholder="请选择权限" class="wetuc-input-col2">
                    <el-option
                        v-for="item in jurisdictionOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="微信推送" prop="sendWxTemplateMsg">
                <el-select v-model="pageInfo.sendWxTemplateMsg" placeholder="请选择微信推送" class="wetuc-input-col2">
                    <el-option
                        v-for="item in sendWxTemplateMsgOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="内容" prop="content">
                <quill-editor ref="myQuillEditor" v-model="pageInfo.content" :options="editorOption" class="wetuc-input-col983"></quill-editor>
            </el-form-item>

            <el-upload
                class="avatar-uploader"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :action="actionUrl"
                :http-request="reverseCardFile"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload">
                <img v-if="pageInfo.contentImg" :src="pageInfo.contentImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-form-item label=" ">
                <el-button type="primary" @click="submitForm('pageInfo')">提交</el-button>
                <el-button type="primary" @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import {loginService} from "../../service/loginService";
import {quillEditor, Quill} from 'vue-quill-editor'
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)

export default {
    data() {
        return {
            pageInfo: {
                title: '',
                type: '',
                dateValue: '',
                hostName: '',
                jurisdiction: 1,
                sendWxTemplateMsg: 2,
                content: '',
                contentImg: '',
            },
            actionUrl: process.env.API_ROOT + `oss/policy`,
            imgUrl: process.env.IMG_URL,
            editorOption:{
                modules: {
                    toolbar: {
                        container: container,
                        handlers: {
                            'image': function (val) {
                                if(val) {
                                    // 调用iview图片上传
                                    document.querySelector('.avatar-uploader input').click()
                                } else {
                                    this.quill.format('image', false);
                                }
                            }
                        }
                    }
                }
            },
            rules: {
                title: [
                    { required: true, message: '请填写标题', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请填写内容', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择分类', trigger: 'change' }
                ],
                dateValue: [
                    { required: true, message: '请选择时间', trigger: 'change' }
                ]
            },
            typeOptions: [{
                label: '内容',
                value: 1
            },{
                label: '活动',
                value: 2
            },{
                label: '内部',
                value: 3
            }],
            jurisdictionOptions: [{
                label: '公开',
                value: 1
            },
            {
                label: '私密',
                value: 2
            }],
            sendWxTemplateMsgOptions: [{
                label: '是',
                value: 1
            },
            {
                label: '否',
                value: 2
            }],
            salesmanList: [],
            admins: [],
        }
    },
    components: { quillEditor },
    mounted() {
        this.getAllStaffCount()
    },
    methods: {
        //提交
        submitForm(formName) {
            let that = this;
            that.$refs[formName].validate((valid) => {
                if(valid) {
                    loginService.addCalendars({
                        title: that.pageInfo.title,
                        content: that.pageInfo.content,
                        type: that.pageInfo.type,
                        time: that.pageInfo.dateValue,
                        admins: that.admins,
                        sendWxTemplateMsg: that.pageInfo.sendWxTemplateMsg === 1 ? true : false, //that.pageInfo.sendWxTemplateMsg
                        open: that.pageInfo.jurisdiction === 1 ? true : false
                    }).then(res => {
                        if (res.data.success) {
                            that.$message({
                                message: '新增成功！',
                                type: 'success'
                            });
                            setTimeout(() => {
                                that.$router.push({path: 'calendarList'})
                            }, 200);
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
        // 获取业务员
        getAllStaffCount() {
            loginService.getAllStaffCount({
            }).then(res => {
                this.salesmanList = res.data.datas;
            }).catch(err =>{
                console.log(err);
            })
        },
        reverseCardFile(param) {
            this.uploadSectionFile(param)
        },
        uploadSectionFile (param) {
            loginService.getPolicy({}).then(res => {
                let that = this
                let quill = that.$refs.myQuillEditor.quill;
                const randomName = new Date().getTime() + '.' + param.file.name.split('.').pop()
                const fd = new FormData()
                const {accessid, host, policy, signature, dir, expire} = res.data.datas
                fd.append('name', randomName)
                fd.append('OSSAccessKeyId', accessid)
                fd.append('policy', policy)
                fd.append('signature', signature)
                fd.append('key', dir + randomName)
                fd.append('expire', expire)
                fd.append('success_action_status', 200)
                fd.append('file', param.file)
                if (!param.file.type.match('image.*')) {
                    that.$message.error('请上传图片格式的文件!')
                    return
                }
                const xhr = new XMLHttpRequest()
                xhr.open('post', host, true)
                xhr.upload.addEventListener('progress', (evt) => {
                    that.progress = Math.round((evt.loaded) * 100 / evt.total)
                }, false)
                xhr.addEventListener('load', (e) => {
                    if (e.target.status !== 200) {
                        that.$message.error('上传失败!')
                        return
                    }
                    if (e.target.status === 200) {
                        that.$nextTick(() => {
                            that.pageInfo.contentImg = process.env.IMG_URL + dir + randomName
                            // 获取光标所在位置
                            let length = quill.getSelection().index;
                            // 插入图片  res.info为服务器返回的图片地址
                            quill.insertEmbed(length, 'image', that.pageInfo.contentImg)
                            // 调整光标到最后
                        })
                        return
                    }
                }, false)
                xhr.send(fd)
            }).catch(err => {
                console.log(err)
            })
        },
        beforeAvatarUpload (file) {
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const isGIF = file.type === 'image/gif'
            const isBMP = file.type === 'image/bmp'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG && !isGIF && !isPNG && !isBMP) {
                this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return (isJPG || isBMP || isGIF || isPNG) && isLt2M
        },
        hostChange(row) {
            console.log(row);
            this.admins = row.join();
        },
        // 取消
        cancel() {
            this.$router.push({path: 'calendarList'});
        },
    },
}
</script>

<style scoped>
.avatar-uploader{
    display: none;
}
</style>

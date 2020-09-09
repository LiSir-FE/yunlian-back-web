<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/advertisingManagement' }">版权管理</el-breadcrumb-item>
                <el-breadcrumb-item>添加版权</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="wetuc-page-header">
            <p>添加版权</p>
        </div>


        <el-form ref="pageInfo" :model="pageInfo" label-width="80px" :rules="rules" class="demo-ruleForm"  v-loading="copyrightLoading">

            <el-form-item label="图片" prop="imageUrl">
                <el-upload
                    v-loading="pictureLoading"
                    class="avatar-uploader"
                    accept="image/jpeg,image/gif,image/png,image/bmp"
                    :action="actionUrl"
                    :http-request="uploadSectionFile"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="pageInfo.imageUrl" :src="pageInfo.imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <el-form-item label="名称" prop="name">
                <el-input v-model="pageInfo.name" class="wetuc-input-col3"></el-input>
            </el-form-item>

            <el-form-item label="落地页" prop="landingPage">
                <el-input v-model="pageInfo.landingPage" class="wetuc-input-col3"></el-input>
            </el-form-item>

            <el-form-item label="联系人" prop="contacts">
                <el-input v-model="pageInfo.contacts" class="wetuc-input-col3"></el-input>
            </el-form-item>

            <el-form-item label="联系方式" prop="contactInformation">
                <el-input v-model="pageInfo.contactInformation" class="wetuc-input-col3"></el-input>
            </el-form-item>

            <el-form-item label="上下线时间">
                <el-date-picker
                    class="wetuc-input-col3"
                    v-model="pageInfo.time"
                    type="datetimerange"
                    align="right"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>


            <el-form-item label=" ">
                <el-button type="primary" @click="submitForm('pageInfo', 1)">提 交</el-button>
                <el-button type="primary" @click="cancel">取 消</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    import {loginService} from '../../service/loginService'

    export default {
        data () {
            return {
                location: this.$route.query.location,
                picWidth: this.$route.query.picWidth,
                copyrightLoading: false,
                pictureLoading: false,
                actionUrl: process.env.API_ROOT + `oss/policy`,
                pageInfo: {
                    imageUrl: '',
                    name: '',
                    landingPage: '',
                    contacts: '',
                    contactInformation: '',
                    time: ''
                },
                rules: {
                    imageUrl: [{required: true, message: '请上传头像!', trigger: 'change'}],
                    name: [{required: true, message: '请输入名称!', trigger: 'blur'}],
                    landingPage: [{required: true, message: '请输入落地页!', trigger: 'blur'}],
                    contacts: [{required: true, message: '请输入联系人!', trigger: 'blur'}],
                    contactInformation: [{required: true, message: '请输入联系方式!', trigger: 'blur'}]
                }
            }
        },
        mounted () {
        },
        methods: {

            // 提交
            submitForm(formName) {
                let that = this;
                that.copyrightLoading = true;
                let imageUrl = ''
                if (that.pageInfo.imageUrl.indexOf(process.env.IMG_URL) === -1) {
                    imageUrl = that.pageInfo.imageUrl.substring(0, that.pageInfo.imageUrl.length)
                } else {
                    imageUrl = that.pageInfo.imageUrl.substring(8, that.pageInfo.imageUrl.length)
                }
                let onlineTime = that.pageInfo.time[0] ? that.pageInfo.time[0].getTime() : '';
                let offlineTime = that.pageInfo.time[1] ? that.pageInfo.time[1].getTime() : '';
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        loginService.addGuanggaoInfo({
                            name: that.pageInfo.name,
                            pic: imageUrl,
                            link: that.pageInfo.landingPage,
                            chargeName: that.pageInfo.contacts,
                            chargePhone: that.pageInfo.contactInformation,
                            onlineTime: onlineTime,
                            offlineTime: offlineTime,
                            location: that.location
                        }).then(res => {
                            if (res.data.code == 200) {
                                that.$message({
                                    message: '新增成功！',
                                    type: 'success'
                                });
                                that.copyrightLoading = false;
                                that.cancel();
                                // that.$router.push({name: 'advertisingManagement', query: {location: that.location, picWidth: that.picWidth}})
                            } else {
                                that.$message.error(res.data.message)
                            }
                        }).catch(err => {
                            console.log(err);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            // 取消
            cancel() {
               this.$router.go(-1)
            },




            // 上传
            handleAvatarSuccess (res, file) {
                this.pageInfo.imageUrl = URL.createObjectURL(file.raw)
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
            uploadSectionFile (param) {
                let that = this;
                that.pictureLoading = true;
                loginService.getPolicy({}).then(res => {
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
                                that.pageInfo.imageUrl = process.env.IMG_URL + dir + randomName;
                                that.$message.success('上传成功!')
                                that.pictureLoading = false;
                            })
                            return
                        }
                    }, false)
                    xhr.send(fd);
                    that.pictureLoading = false;
                }).catch(err => {
                    console.log(err)
                })
            },
        }
    }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>

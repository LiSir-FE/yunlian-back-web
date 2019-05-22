<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ name: 'home' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/accountSettings' }">账号设置</el-breadcrumb-item>
                <el-breadcrumb-item>账号</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-tabs v-model="accountName" @tab-click="handleClick">
                <el-tab-pane label="账号设置" name="settings">
                    <el-form ref="setPageInfo" :model="setPageInfo" label-width="100px" :rules="rules">
                        <el-form-item label="头像" prop="imageUrl">
                            <el-upload
                                class="avatar-uploader"
                                accept="image/jpeg,image/gif,image/png,image/bmp"
                                :action="actionUrl"
                                :http-request="uploadSectionFile"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="setPageInfo.imageUrl" :src="setPageInfo.imageUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </el-form-item>

                        <el-form-item label="微信绑定" prop="qrCodeUrl">
                            <div id="qrCodeCanvas" class="qrCodeCanvas" v-show="qrCodeFlag"></div>
                            <el-input v-model="setPageInfo.qrCodeInput" :disabled="true" v-show="!qrCodeFlag"
                                      class="wetuc-input-col3"></el-input>
                        </el-form-item>

                        <el-form-item label="账号" prop="accountNum">
                            <el-input type="text" v-model="setPageInfo.accountNum" class="wetuc-input-col3"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="名称" prop="name">
                            <el-input type="text" v-model="setPageInfo.name" class="wetuc-input-col3"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人" prop="contacts">
                            <el-input type="text" v-model="setPageInfo.contacts" class="wetuc-input-col3"></el-input>
                        </el-form-item>
                        <el-form-item label="联系手机" prop="phone">
                            <el-input type="text" v-model="setPageInfo.phone" class="wetuc-input-col3"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="mailbox">
                            <el-input type="text" v-model="setPageInfo.mailbox" class="wetuc-input-col3"></el-input>
                        </el-form-item>
                        <el-form-item label="简介" prop="briefIntroduction">
                            <el-input type="textarea" v-model="setPageInfo.briefIntroduction" rows="3"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('setPageInfo')">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="账号认证" name="authentication">账号认证</el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import {loginService} from '../../service/loginService'
    import QRCode from 'qrcodejs2'

    export default {
        data () {
            let validatePhone = (rule, value, callback) => {
                let mobile = /^(1+\d{10})$/
                if (!value) {
                    return callback(new Error('请输入手机号码!'))
                } else if (!mobile.test(value)) {
                    return callback(new Error('请输入正确的手机号码!'))
                } else {
                    callback()
                }
            }
            let validateEmail = (rule, value, callback) => {
                let email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
                if (value === '') {
                    callback(new Error('请输入联系人邮箱'))
                } else if (!email.test(value)) {
                    callback(new Error('请输入正确的邮箱'))
                } else {
                    callback()
                }
            }
            return {
                accountName: 'settings',
                actionUrl: process.env.API_ROOT + `oss/policy`,
                setPageInfo: {
                    accountNum: '',
                    qrCodeInput: '已认证',
                    qrCodeUrl: '',
                    imageUrl: '',
                    name: '',
                    contacts: '',
                    phone: '',
                    mailbox: '',
                    briefIntroduction: ''
                },
                qrCodeFlag: false,
                rules: {
                    imageUrl: [{required: true, message: '请上传头像!', trigger: 'change'}],
                    name: [{required: true, message: '请输入名称!', trigger: 'blur'},
                        {min: 2, max: 5, message: '长度在 2 到 5 个字符!', trigger: 'blur'}],
                    contacts: [{required: true, message: '请输入联系人!', trigger: 'blur'},
                        {min: 2, max: 5, message: '长度在 2 到 5 个字符!', trigger: 'blur'}],
                    phone: [{required: true, validator: validatePhone, trigger: 'blur'}],
                    mailbox: [{required: true, validator: validateEmail, trigger: 'blur'}],
                    briefIntroduction: [{required: true, message: '请输入简介!', trigger: 'blur'}]
                }
            }
        },
        // 方法
        methods: {
            getsettPageInfo () {
                let that = this
                loginService.getAdminInfo({}).then(res => {
                    if (res.data.datas.wechatBind) {
                        that.qrCodeFlag = false
                    } else {
                        that.qrCodeFlag = true
                    }
                    that.setPageInfo.imageUrl = process.env.IMG_URL + res.data.datas.hostLogo
                    that.setPageInfo.accountNum = res.data.datas.account
                    that.setPageInfo.name = res.data.datas.hostCompany
                    that.setPageInfo.contacts = res.data.datas.hostName
                    that.setPageInfo.phone = res.data.datas.hostPhone
                    that.setPageInfo.mailbox = res.data.datas.hostEmail
                    that.setPageInfo.briefIntroduction = res.data.datas.hostDesc
                    if (that.qrCodeFlag) {
                        that.getWechaturl()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 二维码
            getWechaturl () {
                loginService.getWechaturl({}).then(res => {
                    if (res.data.success) {
                        this.setPageInfo.qrCodeUrl = res.data.datas
                        this.getQRCode(res.data.datas)
                    }
                }).catch(err => {
                    console.log(err)
                })

            },
            getQRCode (url) {
                let qrCodeCanvas = new QRCode('qrCodeCanvas', url, (error) => {
                    width: 100
                    height: 100
                    if (error) {
                    } else {
                    }
                })
            },
            // 上传
            handleAvatarSuccess (res, file) {
                this.setPageInfo.imageUrl = URL.createObjectURL(file.raw)
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
                loginService.getPolicy({}).then(res => {
                    let that = this
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
                                that.setPageInfo.imageUrl = process.env.IMG_URL + dir + randomName
                            })
                            return
                        }
                    }, false)
                    xhr.send(fd)
                }).catch(err => {
                    console.log(err)
                })
            },
            // 提交
            submitForm (formName) {
                let that = this
                let hostLogo = ''
                if (that.setPageInfo.imageUrl.indexOf(process.env.IMG_URL) === -1) {
                    hostLogo = that.setPageInfo.imageUrl.substring(0, that.setPageInfo.imageUrl.length)
                } else {
                    hostLogo = that.setPageInfo.imageUrl.substring(8, that.setPageInfo.imageUrl.length)
                }
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        loginService.postAdminInfo({
                            hostCompany: that.setPageInfo.contacts,
                            hostLogo: hostLogo,
                            hostPhone: that.setPageInfo.phone,
                            hostName: that.setPageInfo.name,
                            hostEmail: that.setPageInfo.mailbox,
                            hostDesc: that.setPageInfo.briefIntroduction,
                        }).then(res => {
                            if (res.data.success) {
                                that.$message({
                                    type: 'success',
                                    message: '保存成功'
                                })
                                that.getsettPageInfo()
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
            handleClick (tab, event) {
                console.log(tab, event)
            }
        },
        // 页面初始化
        mounted () {
            this.getsettPageInfo()
        }
    }
</script>

<style>
    .qrCodeCanvas {
        width: 180px !important;
        height: 180px !important;
        border: 1px dashed #d9d9d9;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .qrCodeCanvas img{
        width: 160px;
        height: 160px;
    }

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

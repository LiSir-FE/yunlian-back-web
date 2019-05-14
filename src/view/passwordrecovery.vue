<template>
    <div class="warp">
        <div class="login-page-container">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px"
                     class="demo-ruleForm login-container">
                <h3 class="title">找回密码</h3>
                <el-form-item prop="account">
                    <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="phoneNum">
                    <el-input type="text" v-model="ruleForm.phoneNum" auto-complete="off" placeholder="手机号"></el-input>
                </el-form-item>
                <div id="captcha-box"></div>
                <el-form-item prop="vCode">
                    <div class="vCode">
                        <el-input v-model="ruleForm.vCode" placeholder="短信验证码" class="vCodeInput"></el-input>
                        <el-button :loading="vCodeFlag" class="vCodeBtn" @click="getAuthCode">{{vCodeText}}</el-button>
                    </div>
                </el-form-item>
                <el-form-item prop="newPassWord">
                    <el-input type="password" v-model="ruleForm.newPassWord" placeholder="新密码" show-password></el-input>
                </el-form-item>
                <el-form-item style="width:100%;">
                    <el-button type="primary" style="width:100%;" @click="handleSubmit('ruleForm')"
                               :loading="submiFlag">提交
                    </el-button>
                </el-form-item>
                <el-button type="text" class="remember" @click="returnLogin">返回登录</el-button>
            </el-form>
        </div>
    </div>

</template>

<script>
    import {loginService} from '../service/loginService'

    export default {
        props: {},
        data () {
            let validateAccount = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入账号'))
                } else {
                    callback()
                }
            };
            let validatePhone = (rule, value, callback) => {
                let mobile = /^(1+\d{10})$/
                if (!value) {
                    return callback(new Error('请输入手机号!'))
                } else if (!mobile.test(value)) {
                    return callback(new Error('请输入正确的手机号!'))
                } else {
                    callback()
                }
            };
            let validateSmsCode = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入短信验证码'));
                }else{
                    callback();
                }
            };
            let validatePassword = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('请输入新密码'));
                }else{
                    callback();
                }
            };
            return {
                ruleForm: {
                    account: '',
                    phoneNum: '',
                    vCode: '',
                    newPassWord: ''
                },
                geetestInfo: {},
                authTime: 0,
                submiFlag: false,
                vCodeFlag: false,
                vCodeText: '获取短信验证码',
                rules: {
                    account: [{validate: validateAccount, trigger: 'blur'}],
                    phoneNum: [{validate: validatePhone, trigger: 'blur'}],
                    vCode: [{validate: validateSmsCode, trigger: 'blur'}],
                    newPassWord: [{validate: validatePassword, trigger: 'blur'}]
                }
            }
        },
        mounted: function () {
            this.getGaptchas()
        },
        methods: {
            getGaptchas () {
                let that = this
                let captchaBox = document.getElementById('captcha-box')
                loginService.getGaptchas({}).then(res => {
                    initGeetest({
                        // 以下配置参数来自服务端 SDK
                        gt: res.data.gt,
                        challenge: res.data.challenge,
                        product: 'float', // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                        offline: res.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                        width: '100%',
                    }, function (captchaObj) {
                        // 这里可以调用验证实例 captchaObj 的实例方法
                        captchaObj.appendTo(captchaBox)
                        captchaObj.onSuccess(function () {
                            let result = captchaObj.getValidate()
                            that.geetestInfo = result
                            that.captchaObj = captchaObj
                            that.geetesst = true
                        })
                    })
                })
            },
            getAuthCode () {
                let that = this
                let geetesst = that.geetesst
                let mobile = /^(1+\d{10})$/
                if (!that.ruleForm.phoneNum) {
                    this.$message.error('请输入手机号')
                    return false
                } else if (!mobile.test(that.ruleForm.phoneNum)) {
                    this.$message.error('请输入正确的手机号')
                    return false
                }
                if (!geetesst) {
                    this.$message.error('请重新拖动划块')
                    return false
                }
                let seccode2 = that.geetestInfo.geetest_seccode.split('|')
                seccode2 = seccode2.join(',')
                loginService.getSms({
                    type: 6,
                    phone: that.ruleForm.phoneNum,
                    challenge: that.geetestInfo.geetest_challenge,
                    validate: that.geetestInfo.geetest_validate,
                    seccode: seccode2
                }).then(res => {
                    if (res.data.code === 200) {
                        that.vCodeFlag = true
                        that.authTime = 6
                        let authTime2 = setInterval(() => {
                            that.authTime--
                            that.vCodeText = that.authTime + '重新获取'
                            if (that.authTime <= 0) {
                                that.vCodeFlag = false
                                that.vCodeText = '重新获取'
                                clearInterval(authTime2)
                                that.captchaObj.reset()
                                that.getGaptchas()
                            }
                        }, 1000)
                    } else {
                        this.$message.error(res.data.message)
                        that.captchaObj.reset()
                        that.getGaptcha()
                    }
                }).catch(err => {
                    that.vCodeFlag = false
                    console.log(err)
                })

            },
            handleSubmit (formName) {
                let that = this
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        loginService.putAccountspassword({
                            smsCode: that.ruleForm.vCode,
                            type: 6,
                            account: that.ruleForm.account,
                            phone: that.ruleForm.phoneNum,
                            password: that.ruleForm.newPassWord
                        }).then(res => {
                            console.log(res)
                            if (res.data.success) {
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                that.$router.push({name: 'login'})
                            } else {
                                that.$message.error(res.data.message)
                            }
                            that.timesms = 0
                            that.captchaObj.reset()
                            that.getGaptchas()
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        return false
                    }
                })
            },
            returnLogin () {
                this.$router.push({name: 'login'})
            }
        }
    }
</script>

<style scoped>
    .warp {
        width: 100%;
        height: 100%;
        background-color: #2d3a4b;
    }

    .login-page-container {
        width: 100%;
        height: 100%;
        display: flex;
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
    }

    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        width: 350px;
        padding: 35px 35px 15px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        position: absolute;
    }

    #captcha-box {
        width: 100%;
        height: 44px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #C0C4CC;
        margin-bottom: 22px;
        display: inline-block;
        overflow: hidden;
    }

    .vCode {
        width: 100%;
        display: inline-block;
    }

    .vCodeInput {
        width: 55%;
        float: left;
    }

    .vCodeBtn {
        width: 45%;
        display: inline-block;
        color: #FFF;
        background-color: #409EFF;
        border-color: #409EFF;
    }


</style>

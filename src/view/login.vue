<template>
    <div class="warp">
        <div class="login-page-container">
            <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px"
                     class="demo-ruleForm login-container">
                <h3 class="title">欢迎 登录运联</h3>
                <el-form-item prop="account">
                    <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"
                              placeholder="密码"></el-input>
                </el-form-item>
                <div id="captcha-box"></div>
                <el-button type="text" class="remember rememberLeft" @click="passwordrecoveryFn">忘记密码</el-button>
                <el-button type="text" class="remember rememberRight" @click="shenqing">没有账号?立即申请</el-button>
                <el-form-item style="width:100%;">
                    <el-button type="primary" style="width:100%;" @click="handleSubmit2" :loading="logining">登录
                    </el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>

</template>

<script>
    import {loginService} from '../service/loginService'

    export default {
        props: {},
        data () {
            return {
                logining: false,
                geetestInfo: {},
                captchaObj: {},
                geetesst: false,
                ruleForm2: {
                    account: 'liliang',
                    checkPass: '123456'
                },
                rules2: {
                    account: [{
                        required: true,
                        message: '请输入账号',
                        trigger: 'blur'
                    }],
                    checkPass: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }]
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
                    console.log(res)
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
            handleSubmit2 () {
                let that = this
                that.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        that.logining = true
                        if (that.geetesst) {
                            loginService.login({
                                account: this.ruleForm2.account,
                                password: this.ruleForm2.checkPass,
                                platform: 'ADMIN_PC',
                                challenge: that.geetestInfo.geetest_challenge,
                                validate: that.geetestInfo.geetest_validate,
                                seccode: that.geetestInfo.geetest_seccode
                            }).then(res => {
                                console.log(res)
                                if (res.data.success) {
                                    that.logining = false
                                    localStorage.token = res.data.datas
                                    that.$router.push({name: 'home'})
                                    that.$message({
                                        message: '恭喜你，登录成功!',
                                        type: 'success'
                                    })
                                } else {
                                    that.logining = false
                                    that.$message({
                                        message: res.data.message,
                                        type: 'warning'
                                    })
                                    that.captchaObj.reset()
                                    that.getGaptchas()
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        } else {
                            that.logining = false
                            that.$message({
                                message: '请点击按钮进行验证！',
                                type: 'warning'
                            })
                        }
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            passwordrecoveryFn() {
                this.$router.push({name: 'passwordrecovery'})
            },
            shenqing() {
                window.location.href = 'https://wetuc.com/sponsor';
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

    .remember {
        margin-bottom: 22px;
        font-size: 14px;
        position: relative;
        z-index: 2
    }

    .rememberLeft {
        float: left;
        cursor:pointer
    }

    .rememberRight {
        float: right;
        cursor:pointer
    }

</style>

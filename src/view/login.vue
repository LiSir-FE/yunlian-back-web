<template>
    <div class="warp" :style="styleObject">
        <div class="login-page-container">
            <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px"
                     class="demo-ruleForm login-container">
                <div class="loginQrcode">
                    <i class="el-icon-s-grid" @click.prevent="loginQrcode = !loginQrcode" v-if="loginQrcode"></i>
                    <i class="el-icon-s-platform" @click.prevent="loginQrcode = !loginQrcode" v-if="!loginQrcode"></i>

                    <div class="popup" v-if="loginQrcode">
                        扫码登录在这里
                    </div>
                </div>
                <h3 class="title" v-show="loginQrcode">欢迎 登录运联</h3>

                <div class="login-wetuc" v-show="loginQrcode">
                    <el-form-item prop="account">
                        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
                    </el-form-item>
                    <el-form-item prop="checkPass">
                        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"
                                  placeholder="密码" show-password></el-input>
                    </el-form-item>
                    <div id="captcha-box"></div>
                    <el-button type="text" class="remember rememberLeft" @click="passwordrecoveryFn">忘记密码</el-button>
                    <el-button type="text" class="remember rememberRight" @click="apply">没有账号?立即申请</el-button>
                    <el-form-item style="width:100%;">
                        <el-button type="primary" style="width:100%;border-radius: 4px" @click="handleSubmit2" :loading="logining">登 录</el-button>
                    </el-form-item>
                </div>
                <!--二维码登录-->
                <div class="login-wetuc login-wetuc1" v-show="!loginQrcode">
                    <wxlogin :appid="appid" :scope="scope" :redirect_uri="redirect_uri" :state="state" href="data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7CndpZHRoOiAxNTBweDsKbWFyZ2luLXRvcDogMTVweDsKYm9yZGVyOiAxcHggc29saWQgI0UyRTJFMjsKfQppZnJhbWV7CndpZHRoOjEwMCUKfQ=="></wxlogin>
                </div>

            </el-form>

        </div>
    </div>

</template>

<script>
    import vueBg from '../assets/img/logo/vueBackGlound.jpg'
    import wxlogin from 'vue-wxlogin'
    import {loginService} from '../service/loginService'
    export default {
        props: {},
        data () {
            return {
                styleObject: {
                    background: 'url('+ vueBg +') center center no-repeat',
                    backgroundSize: 'cover'
                },
                loginQrcode: true,
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
                },
                appid: 'wx0e895a548ba53875',
                scope: 'snsapi_login',
                redirect_uri: 'https://admin.wetuc.com/wxlogin',
                state: String(Math.ceil(Math.random()*1000))
            }
        },
        components: {
            wxlogin
        },
        mounted: function () {
            this.getGaptchas();
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
            handleSubmit2 () {
                let that = this
                that.$refs.ruleForm2.validate((valid) => {
                    if (valid) {
                        that.logining = true
                        if (that.geetesst) {
                            loginService.login({
                                account: that.ruleForm2.account,
                                password: that.ruleForm2.checkPass,
                                platform: 'ADMIN_PC',
                                challenge: that.geetestInfo.geetest_challenge,
                                validate: that.geetestInfo.geetest_validate,
                                seccode: that.geetestInfo.geetest_seccode
                            }).then(res => {
                                if (res.data.success) {
                                    that.logining = false;
                                    localStorage.token = res.data.datas;
                                    that.$router.push('/')
                                    that.$message({
                                        message: '恭喜你，登录成功!',
                                        type: 'success'
                                    })
                                } else {
                                    that.logining = false;
                                    that.$message({
                                        message: res.data.message,
                                        type: 'warning'
                                    })
                                    that.captchaObj.reset();
                                    that.getGaptchas();
                                }
                            }).catch(err => {
                                console.log(err);
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
            apply() {
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
        /*background-image: url("../assets/img/logo/logoBg.jpg");*/
        /*background-repeat: no-repeat;*/
        /*background-size: 100% 100%;*/
    }

    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        width: 350px;
        padding: 50px 35px 5px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        position: relative;
    }

    #captcha-box {
        width: 100%;
        height: 44px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #C0C4CC;
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

    .login-wetuc{
        width: 350px;
        height: 280px;
    }

    .login-container{
        background-color: rgba(255, 255, 255, .5);
    }

    .loginQrcode i{
        position: absolute;
        right: -4px;
        top: -4px;
        font-size: 52px;
        cursor: pointer;
        color: #3a8ee6;
    }


    .loginQrcode .popup{
        position: absolute;
        top: 5px;
        right: 60px;
        height: 26px;
        width:100px;
        line-height: 26px;
        background:#fff;
        padding:1px 10px;
        font-size: 12px;
        color:#3a8ee6;
        border-radius:2px;
        border:1px solid #3a8ee6;
    }

    .loginQrcode .popup:before{
        content:'';
        display:block;
        width:0;
        height:0;
        position:absolute;
        top:6px;
        right:-9px;
        border-left:9px solid #3a8ee6;
        border-top:7px solid transparent;
        border-bottom:7px solid transparent;
    }

    .loginQrcode .popup:after{
        content:'';
        display:block;
        width:0;
        height:0;
        position:absolute;
        top:8px;
        right:-7px;
        border-left:7px solid #fff;
        border-top:5px solid transparent;
        border-bottom:5px solid transparent;
    }

    .login-wetuc1 div{
        width: 100%;
        height: 100%;
    }

    .login-wetuc1 div iframe{
        width: 100%;
        height: 100%;
    }

    .title{
        position: absolute;
        top: 15px;
    }


</style>

<template>
    <div class="header">
        <div class="nav-top">
            <div class="topLeft" @click.prevent="logoFun">
<!--                <el-image :src="url" class="logo" @click="logoFun" v-if="!collapse"></el-image>-->
                <el-image :src="logos" class="logos"></el-image>
            </div>
            <div class="logoText">运联后台管理系统</div>
            <div class="topRight">
                <div class="rightHome clearfix">
<!--                    <a href="https://wetuc.com " target="_blank">网站首页</a>-->
                    <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
<!--                        <router-link to="/system/message"></router-link>-->
                        <i class="el-icon-bell"></i>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="message"></span>
                </div>
                <div class="User">
                    <div class="UserImg">
                        <img class="image" :src="adminPhoto"/>
                    </div>
                    <div class="name">{{sysUserName}}<i class="el-icon-caret-bottom"></i></div>
                    <div class="logout">
                        <p @click="accountSettings">账号设置</p>
                        <p @click="passWorddialogVisible = true">修改密码</p>
                        <p @click="logoutFun">退出</p>
                    </div>
                </div>

            </div>
        </div>
        <!--修改密码-->
        <el-dialog title="修改密码" :visible.sync="passWorddialogVisible" width="30%">
            <el-form ref="passInfo" :model="passInfo" label-width="80px" :rules="rules">
                <el-form-item label="原始密码" prop="originalPassword">
                    <el-input type="password" v-model="passInfo.originalPassword" placeholder="请输入原始密码"
                              show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="passInfo.newPassword" placeholder="请输入新密码"
                              show-password></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="passInfo.confirmPassword" placeholder="请再次输入新密码"
                              show-password></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changePassword('passInfo')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import bus from '../../common/bus';
import logo from '../../assets/img/logo/logo.png'
import logos from '../../assets/img/logo/logos.png'
import {loginService} from "../../service/loginService";
export default {
    data() {
        let originalPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入原始密码!'))
            } else {
                callback()
            }
        }
        let newPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码!'))
            } else if (value === this.passInfo.originalPassword) {
                callback(new Error('新密码与旧密码一致!'))
            } else {
                callback()
            }
        }
        let confirmPassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码!'))
            } else if (value !== this.passInfo.newPassword) {
                callback(new Error('新密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            passWorddialogVisible: false,
            fullscreen: false,
            url: logo,
            logos: logos,
            name: 'linxin',
            message: 2,
            collapse: false,
            unreadNum: '',
            adminPhoto: '',
            sysUserName: '',
            passInfo: {
                originalPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            rules: {
                originalPassword: [{required: true, validator: originalPassword, trigger: 'blur'}],
                newPassword: [{required: true, validator: newPassword, trigger: 'blur'}],
                confirmPassword: [{required: true, validator: confirmPassword, trigger: 'blur'}]
            }
        };
    },
    computed: {
        username() {
            let username = localStorage.getItem('ms_username');
            return username ? username : this.name;
        }
    },
    methods: {
        // 获取信息
        getAdminInfo () {
            let that = this;
            let imgurl = process.env.IMG_URL;
            loginService.getAdminInfo().then(function (res) {
                if (res.data.code == 200) {
                    let obj = res.data.datas
                    that.adminPhoto = imgurl + obj.hostLogo
                    that.sysUserName = obj.hostCompany
                    that.unreadNum = obj.unreadMsgNum
                } else {
                    that.$message.error(res.data.message)
                }
            });
        },
        // 侧边栏折叠
        // logo点击
        logoFun() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        logoutFun: function () {
            let that = this
            this.$confirm('确认退出吗?', '提示', {}).then(() => {
                loginService.myExit({}).then(res => {
                    if (res.data.success) {
                        localStorage.removeItem('token')
                        that.$router.push({name: 'login'})
                    }
                }).catch(err => {
                    console.log(err)
                })
            }).catch(() => {

            })
        },
        // 账号设置
        accountSettings () {
            this.$router.push({path: 'accountSettings'})
        },
        // 修改密码
        changePassword (formName) {
            let that = this
            that.$refs[formName].validate((valid) => {
                if (valid) {
                    loginService.postPassword({
                        oldPassWord: that.passInfo.originalPassword,
                        newPassWord: that.passInfo.newPassword,
                        newPassword1: that.passInfo.confirmPassword
                    }).then(res => {
                        if (res.data.success) {
                            localStorage.removeItem('token')
                            that.$message({
                                type: 'success',
                                message: '修改密码成功'
                            })
                            that.$router.push({name: 'login'})
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
        }
    },
    mounted() {
        let that = this;
        // that.getAdminInfo();
        // loginService.getAdmin({}).then(res => {
        //     that.sysUserName = res.data.datas.hostCompany
        // }).catch(err => {
        //     console.log(err)
        // })
        if (document.body.clientWidth < 1500) {
            that.logoFun();
        }
    }
}
</script>

<style scoped lang="scss">
    .logout {
        display: none;
        position: absolute;
        top: 56px;
        right: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #fff;
        width: 100px;
        text-align: center;
        cursor: pointer;
        z-index: 9999;

        p {
            line-height: 32px;
            text-align: center;
            cursor: pointer;
            color: #333;
        }

        p:hover {
            background: #ccc;
        }
    }
    .User:hover .logout {
        display: block;

    }
    .UserImg{
        margin-right: 10px;
    }
    .header {
        height: 60px;
        line-height: 60px;
        background-color: rgba(255, 255, 255, .5);

        .userinfo {
            text-align: right;
            float: right;
            margin-right: 60px;
            box-sizing: border-box;

            .userinfo-inner {
                cursor: pointer;
            }
        }

        .logo {
            float: left;
            padding-left: 40px;
            padding-top: 10px;
            box-sizing: border-box;
        }

        .logoText{
            float: left;
            width: 250px;
            font-size: 22px;
            line-height: 60px;
        }

        .logo-width {
            width: 230px;
        }

        .logo-collapse-width {
            width: 60px;
        }

        .tools {
            padding: 0 23px;
            width: 14px;
            height: 60px;
            line-height: 60px;
            cursor: pointer;
        }
    }
    .btn-bell-badge {
        position: absolute;
        right: 7px;
        top: 14px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .nav-top {
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        box-sizing: border-box;
    }

    .right-top {
        width: 100%;
        height: 60px;
        padding: 0 40px;
        box-sizing: border-box;
        background: #f1f2f3
    }

    .nav-top .topLeft, .right-top .topLeft {
        height: 60px;
        line-height: 60px;
        float: left;
        font-size: 26px;
        color: #333;
        font-weight: normal;
        padding: 0 21px;
    }

    .nav-top .topLeft .logo {
        width: 165px;
        height: 40px;
        cursor: pointer;
        padding-top: 10px;
    }

    .nav-top .topLeft .logos {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-top: 10px;
        box-sizing: border-box;
    }

    .nav-top .topRight, .right-top .topRight {
        height: 60px;
        float: right;
    }

    .nav-top .topRight .rightHome, .right-top .topRight .rightHome {
        float: left;
        line-height: 60px;
    }

    .right-top .topRight .rightHome {
        width: 100px;
    }

    .nav-top .topRight .rightHome {
        font-size: 22px;
        height: 100%;
        position: relative;
        width: 30px;
        text-align: center;
        cursor: pointer;
        color: #666;
        border-right: 1px solid #e6e6e6;
        margin-right: 10px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;

        a {
            /*float: left;*/
            padding-right: 10px;
            margin-right: 10px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;

            color: #666;
            text-decoration: none;

            span {
                padding: 0px 5px;
                line-height: 14px;
                background: red;
                border-radius: 7px;
                margin-left: 4px;
                color: #fff;
            }
        }

        span {
            color: #666;
        }
    }

    .nav-top .topRight .User, .right-top .topRight .User {
        height: 60px;
        line-height: 60px;
        text-align: center;
        float: left;
    }

    .nav-top .topRight .User .UserImg, .right-top .topRight .User .UserImg {
        width: 42px;
        height: 40px;
        border-radius: 100%;
        float: left;
        border: 2px solid #eeeeee;
        overflow: hidden;
        margin-top: 10px;
        cursor: pointer;
    }

    .nav-top .topRight .User .UserImg .image, .right-top .topRight .User .UserImg .image {
        width: 100%;
        height: 100%;
    }

    .nav-top .topRight .User .name, .right-top .topRight .User .name {
        float: left;
        //width: 80px;
        text-align: center;
        color: #969896;
        line-height: 60px;
        font-size: 14px;
        cursor: pointer;
    }

    .nav-top .topRight .User .name i {
        margin-left: 6px;
    }

    .el-icon-message-solid{
        font-size: 20px;
    }

</style>

<template>
    <div class="home-container">
        <el-row class="container">
            <div class="nav-top">
                <div class="topLeft">
                    <el-image :src="url" class="logo"></el-image>
                </div>
                <div class="topRight">
                    <div class="rightHome clearfix"><a href="https://wetuc.com " target="_blank">网站首页</a>
                        <router-link to="/system/message">消息<span>{{unreadNum}}</span></router-link>
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
            <el-col :span="24" class="main">
                <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                    <!--导航菜单-->
                    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router
                             v-show="!collapsed">
                        <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                            <el-submenu :index="index+''" v-if='!item.leaf' :key='index'>
                                <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                                <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path"
                                              v-if="!child.hidden">
                                    {{child.name}}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-if='item.leaf && item.children.length>0' :index='item.children[0].path'
                                          :key='index'><i
                                :class="item.iconCls"></i>{{item.children[0].name}}
                            </el-menu-item>
                        </template>
                    </el-menu>
                    <!--导航菜单-折叠后-->
                    <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
                        <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item"
                            :key="index">
                            <template v-if="!item.leaf">
                                <div class="el-submenu__title" style="padding-left: 20px;"
                                     @mouseover="showMenu(index,true)"
                                     @mouseout="showMenu(index,false)">
                                    <i :class="item.iconCls"></i>
                                </div>
                                <ul class="el-menu submenu" :class="'submenu-hook-'+index"
                                    @mouseover="showMenu(index,true)"
                                    @mouseout="showMenu(index,false)">
                                    <li v-for="child in item.children" v-if="!child.hidden" :key="child.path"
                                        class="el-menu-item"
                                        style="padding-left: 40px;height: 56px;line-height: 56px;"
                                        :class="$route.path==child.path?'is-active':''"
                                        @click="$router.push(child.path)">{{child.name}}
                                    </li>
                                </ul>
                            </template>
                            <template v-else>
                                <ul>
                                    <li class="el-submenu">
                                        <div class="el-submenu__title el-menu-item"
                                             style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                                             :class="$route.path==item.children[0].path?'is-active':''"
                                             @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i>
                                        </div>
                                    </li>
                                </ul>
                            </template>
                        </li>
                    </ul>
                </aside>
                <section class="content-container">
                    <div class="grid-content bg-purple-light">
                        <el-col :span="24" class="content-wrapper">
                            <transition name="fade" mode="out-in">
                                <router-view></router-view>
                            </transition>
                        </el-col>
                    </div>
                </section>
            </el-col>
        </el-row>


        <!--修改密码-->
        <el-dialog title="修改密码" :visible.sync="passWorddialogVisible" width="30%">
            <el-form ref="passInfo" :model="passInfo" label-width="80px" :rules="rules">
                <el-form-item label="原始密码" prop="originalPassword">
                    <el-input type="password" v-model="passInfo.originalPassword" placeholder="请输入原始密码" class=""></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="passInfo.newPassword" placeholder="请输入新密码" class=""></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="passInfo.confirmPassword" placeholder="请再次输入新密码" class=""></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changePassword('passInfo')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {loginService} from '../service/loginService'
    import logo from '../assets/img/logo/logo.png'

    export default {
        components: {},
        data () {
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
                sysUserName: '',
                collapsed: false,
                url: logo,
                adminPhoto: '',
                unreadNum: '',

                passWorddialogVisible: false,
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
            }
        },
        methods: {
            // 获取信息
            getAdminInfo () {
                let that = this
                let imgurl = process.env.IMG_URL
                loginService.getAdminInfo().then(function (res) {
                    if (res.data.code == 200) {
                        let obj = res.data.datas
                        that.adminPhoto = imgurl + obj.hostLogo
                        that.sysUserName = obj.hostCompany
                        that.unreadNum = obj.unreadMsgNum
                    } else {
                        that.$message.error(res.data.message)
                    }
                })
            },
            showMenu (i, status) {
                this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none'
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
                                that.$message.error(res.data.message);
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
        mounted () {
            this.getAdminInfo()
            loginService.getAdmin({}).then(res => {
                this.sysUserName = res.data.datas.hostCompany
            }).catch(err => {
                console.log(err)
            })
        }
    }
</script>

<style scoped lang="scss">
    .container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;

        .logout {
            display: none;
            position: absolute;
            top: 56px;
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

        .header {
            height: 60px;
            line-height: 60px;
            border-bottom: 1px solid #ccc;

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

        .main {
            display: flex;
            position: absolute;
            top: 60px;
            bottom: 0;
            overflow: hidden;

            aside {
                flex: 0 0 230px;
                width: 230px;

                .el-menu {
                    height: 100%;
                    background-color: #f1f2f3;
                }

                .collapsed {
                    width: 60px;

                    .item {
                        position: relative;
                    }

                    .submenu {
                        position: absolute;
                        top: 0;
                        left: 60px;
                        z-index: 99999;
                        height: auto;
                        display: none;
                    }
                }
            }

            .menu-collapsed {
                flex: 0 0 60px;
                width: 60px;
            }

            .menu-expanded {
                flex: 0 0 230px;
                width: 230px;
                background-color: #f1f2f3;
            }

            .content-container {
                flex: 1;
                overflow-y: scroll;
                padding: 20px;

                .breadcrumb-container {
                    .title {
                        width: 200px;
                        float: left;
                        color: #475669;
                    }

                    .breadcrumb-inner {
                        float: left;
                        cursor: pointer;
                    }
                }

                .content-wrapper {
                    box-sizing: border-box;
                }
            }
        }
    }

    .nav-top {
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
        padding: 0 40px;
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
        width: 300px;
        height: 60px;
        line-height: 60px;
        float: left;
        font-size: 26px;
        color: #333;
        font-weight: normal;
    }

    .nav-top .topLeft .logo {
        width: 165px;
        height: 40px;
        padding-top: 10px;
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
        font-size: 14px;
        height: 14px;
        line-height: 14px;
        margin-top: 23px;
        color: #666;

        a {
            float: left;
            padding-right: 10px;
            margin-right: 10px;
            border-right: 1px solid #666;
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
        width: 80px;
        text-align: center;
        color: #969896;
        line-height: 60px;
        font-size: 14px;
        cursor: pointer;
    }

    .nav-top .topRight .User .name i {
        margin-left: 6px;
    }
</style>

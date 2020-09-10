<template>
    <div class="home-container">
        <el-row class="container">
            <div class="nav-top">
                <div class="topLeft">
                    <el-image :src="url" class="logo" @click="logoFun" v-if="!collapsed"></el-image>
                    <el-image :src="logos" class="logos" @click="logoFun" v-if="collapsed"></el-image>
                </div>
                <div class="topRight">
                    <div class="rightHome clearfix">
                        <!--<a href="https://wetuc.com " target="_blank">网站首页</a>-->
                        <router-link to="/system/message">
                            <el-badge :value="unreadNum" class="item"><i class="el-icon-message-solid"></i></el-badge>
                        </router-link>
                    </div>
                    <div class="User">
                        <div class="UserImg">
                            <el-avatar class="image" :src="adminPhoto"></el-avatar>
                            <!--<img class="image" :src="adminPhoto"/>-->
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
                             v-show="!collapsed" style="width: 100%">
                        <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
                            <!--{{item}}-->
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
                                        style="min-width:180px; padding-left: 40px;height: 56px;line-height: 56px;"
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
                            <div v-if="$route.meta.keepalive">
                                <tuc-data-display :option="disOption"></tuc-data-display>
                                <tuc-data-tabs :option="tabsOption"></tuc-data-tabs>


                                <el-collapse-transition>
                                    <el-tabs v-model="matter" type="card" @tab-click="handleClick">
                                        <el-tab-pane label="代办事项" name="todo">
                                            <div class="todo-box-div" v-for="item in todoCheckedList">
                                                <div class="todo-box-div-check" :style="{background: item.background}">
                                                    <el-checkbox v-model="item.todocheck" :key="item.title" @change="todoCheckedFn(item)">
                                                        <span style="margin-right: 48px;box-sizing: border-box">{{item.title}}</span>
                                                    </el-checkbox>
                                                    <i :class="item.icon1"></i>
                                                    <i :class="item.icon2"></i>
                                                    <i :class="item.icon3"></i>
                                                </div>
                                            </div>
                                        </el-tab-pane>
                                        <el-tab-pane label="已办事项" name="done">
                                            <div class="todo-box-div" v-for="item in doneCheckedList">
                                                <div class="todo-box-div-check" :style="{background: item.background}">
                                                    <el-checkbox v-model="item.todocheck" :key="item.title" @change="todoCheckedFn(item)">
                                                        <span style="margin-right: 48px;box-sizing: border-box">{{item.title}}</span>
                                                    </el-checkbox>
                                                    <i :class="item.icon1"></i>
                                                    <i :class="item.icon2"></i>
                                                    <i :class="item.icon3"></i>
                                                </div>
                                            </div>
                                        </el-tab-pane>
                                    </el-tabs>
                                </el-collapse-transition>

                                <template>
                                    <el-tabs v-model="workList" type="card" @tab-click="handleWorkListClick">
                                        <el-tab-pane label="工作台" name="work">
                                            <div id="myChart" class="myChart" ref="myChart"></div>
                                            <div id="myChart1" class="myChart" ref="myChart1"></div>
                                            <div id="myChart2" class="myChart" ref="myChart2"></div>
                                        </el-tab-pane>
                                        <el-tab-pane label="财务清单" name="finance">

                                        </el-tab-pane>
                                    </el-tabs>
                                </template>



                            </div>
                        </el-col>
                    </div>
                </section>
            </el-col>
            <!--<div class="nav-footer">版权所有: 李亮个人</div>-->
        </el-row>

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
    import {loginService} from '../service/loginService'
    import logo from '../assets/img/logo/logo.png'
    import logos from '../assets/img/logo/logos.png'
    import {common} from '../assets/js/common/common'
    import tucDataDisplay from '../components/tuc-data-display/index'
    import tucDataTabs from '../components/tuc-data-tabs/index'
    import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
    export default {
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
                logos: logos,
                adminPhoto: '',
                unreadNum: '',

                passWorddialogVisible: false,
                passInfo: {
                    originalPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                },
                adminList: [],
                disOption: {
                    span: 8,
                    color: '#15A0FF',
                    data: [
                        {
                            count: 1000,
                            title: '日活跃数'
                        },
                        {
                            count: 3000,
                            title: '月活跃数'
                        },
                        {
                            count: 20000,
                            title: '年活跃数'
                        }
                    ]
                },
                tabsOption: {
                    span: 6,
                    data: [
                        {
                            title: '分类统计',
                            subtitle: '实时',
                            count: 7993,
                            allcount: 10222,
                            text: '当前分类总记录数',
                            color: 'rgb(49, 180, 141)',
                            key: '类'
                        },
                        {
                            title: '附件统计',
                            subtitle: '实时',
                            count: 3112,
                            allcount: 10222,
                            text: '当前上传的附件数',
                            color: 'rgb(56, 161, 242)',
                            key: '附'
                        },
                        {
                            title: '文章统计',
                            subtitle: '实时',
                            count: 908,
                            allcount: 10222,
                            text: '评论次数',
                            color: 'rgb(117, 56, 199)',
                            key: '评'
                        },
                        {
                            title: '新闻统计',
                            subtitle: '实时',
                            count: 908,
                            allcount: 10222,
                            text: '评论次数',
                            color: 'rgb(59, 103, 164)',
                            key: '新'
                        }
                    ]
                },

                // 事项
                matter: 'todo',
                todoCheckedList: [{
                    title: '物流嘉年华于今日开会,请确认',
                    todocheck: true,
                    background: 'rgba(255, 140, 0, 0.15)',
                    icon1: 'el-icon-edit',
                    icon2: 'el-icon-star-on',
                    icon3: 'el-icon-delete'
                },{
                    title: '今日收到款项 8203 元,请查收并签字确认,还有5200元未入账',
                    todocheck: false,
                    background: 'rgba(255, 69, 0, 0.15)',
                    icon1: 'el-icon-edit',
                    icon2: 'el-icon-star-on',
                    icon3: 'el-icon-delete'
                },{
                    title: '李亮于今日来运联参观,请确认',
                    todocheck: false,
                    background: 'rgba(144, 238, 144, 0.15)',
                    icon1: 'el-icon-edit',
                    icon2: 'el-icon-star-on',
                    icon3: 'el-icon-delete'
                },{
                    title: '今日重点会议,请前往会议室',
                    todocheck: false,
                    background: 'rgba(255, 215, 0, 0.15)',
                    icon1: 'el-icon-edit',
                    icon2: 'el-icon-star-on',
                    icon3: 'el-icon-delete'
                }],
                doneCheckedList: [],
                todoChecked: '',



                // 工作台 // 财务清单
                workList: 'work',
                rules: {
                    originalPassword: [{required: true, validator: originalPassword, trigger: 'blur'}],
                    newPassword: [{required: true, validator: newPassword, trigger: 'blur'}],
                    confirmPassword: [{required: true, validator: confirmPassword, trigger: 'blur'}]
                }
            }
        },
        components: {
            tucDataDisplay,
            tucDataTabs,
        },
        component: {
            CollapseTransition
        },
        methods: {
            // logo点击
            logoFun() {
              this.collapsed = !this.collapsed
            },
            // 事项
            handleClick(tab, event) {
                console.log(tab, event);
            },
            todoCheckedFn(item) {
                let that = this;
                if(item.todocheck) {
                    that.doneCheckedList.push(item)
                } else {
                    if(that.doneCheckedList.indexOf(item) > -1) {
                        that.doneCheckedList.splice(item, 1)
                    }
                }
            },



            // 工作台 // 财务清单
            handleWorkListClick(tab, event) {
                console.log(tab, event);
            },
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                // let myChart = this.$echarts.init(document.getElementById('myChart'))
                // let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
                // let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
                let myChart = this.$refs.myChart;
                let myChart1 = this.$refs.myChart1;
                let myChart2 = this.$refs.myChart2;
                // 绘制图表
                if(myChart) {
                    myChart = this.$echarts.init(myChart);
                    myChart.setOption({
                        tooltip: {
                            formatter: '{a} <br/>{b} : {c}%'
                        },
                        series: [
                            {
                                name: '业务指标',
                                type: 'gauge',
                                detail: {formatter: '{value}%'},
                                data: [{value: 50, name: '完成率'}]
                            }
                        ]
                    });
                }

                if(myChart1) {
                    myChart1 = this.$echarts.init(myChart1);
                    // 绘制图表
                    myChart1.setOption({
                        color: ['#3398DB'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [
                            {
                                name: '直接访问',
                                type: 'bar',
                                barWidth: '60%',
                                data: [10, 52, 200, 334, 390, 330, 220]
                            }
                        ]
                    });
                }




                if(myChart2) {
                    myChart2 = this.$echarts.init(myChart2);
                    // 绘制图表
                    myChart2.setOption({
                        xAxis: {
                            type: 'category',
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                        },
                        yAxis: {
                            type: 'value'
                        },
                        series: [{
                            data: [820, 932, 901, 934, 1290, 1330, 1320],
                            type: 'line',
                            smooth: true
                        }]
                    });
                }

            },
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
                // 待办事项
                that.todoCheckedList.forEach(item => {
                    if(item.todocheck) {
                        that.doneCheckedList.push(item)
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
            admin (value) {
                let that = this
                if (that.adminList.indexOf(value) > -1) {
                    that.$router.options.routes.forEach(item => {
                        if (item.roles) {
                            if (item.roles === value) {
                                item.hidden = false
                            }
                        }
                        if (item.children) {
                            item.children.forEach(items => {
                                if (items.roles === value) {
                                    items.hidden = false
                                }
                            })
                        }
                    })
                }
            }
        },
        mounted () {
            let that = this
            that.getAdminInfo();
            that.drawLine();
            loginService.getAdmin({}).then(res => {
                that.sysUserName = res.data.datas.hostCompany
            }).catch(err => {
                console.log(err)
            })
            let r = that.$route.name
            let token = window.localStorage.getItem('token')
            if (token == null) {
                that.$router.replace({name: 'login'})
            } else {
                let JWT = token.split('.')
                let info = JWT[1]
                let tokenData = common.packageUserInfo(info)
                that.adminList = tokenData.permissions
                window.localStorage.setItem('jurisdiction', JSON.stringify(that.adminList))
            }
            let adminListArr = []
            that.$router.options.routes.forEach(item => {
                if (item.children) {
                    item.children.forEach(items => {
                        if (items.roles) {
                            adminListArr.push(item.roles, items.roles)
                        }
                    })
                }
            })
            adminListArr.forEach(item => {
                that.admin(item)
            })
        }
    }
</script>

<style scoped lang="scss">
    .home-container{
        height: 100%;
    }

    .nav-footer{
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        color: #ccc;
        font-size: 14px;
        left: 0;
    }


    .el-tab-pane .todo-box-div-check{
        display: inline-block;
        padding: 10px 20px 10px 10px;
        background: #ebebeb;
        border-radius: 4px;
        margin: 10px 0;
        /*color: #fff;*/
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    .todo-box-div-check i {
        cursor: pointer;
    }


    .el-tab-pane .todo-box-div{
        width: 100%;
        display: inline-block;
    }

    .el-checkbox__input.is-checked+.el-checkbox__label{
        color: #fff !important;
    }
    .myChart{
        width: 33%;
        height: 300px;
        float: left;
    }
    .transition-box {
        margin-bottom: 10px;
        width: 200px;
        height: 100px;
        border-radius: 4px;
        background-color: #409EFF;
        text-align: center;
        color: #fff;
        padding: 40px 20px;
        box-sizing: border-box;
        margin-right: 20px;
    }
    .container {
        position: absolute;
        background: #fff;
        /*background-color: rgba(0,0,0,0.5);*/
        /*background:rgba(255, 255, 255, 8.5);*/
        filter:alpha(Opacity=85);
        -moz-opacity:0.85;
        opacity: 0.85;
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
                    width: 100%;

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
                flex: 0 0 180px;
                width: 180px;
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
        cursor: pointer;
        padding-top: 10px;
    }

    .nav-top .topLeft .logos {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-top: 10px;
        margin-left: -30px;
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
        font-size: 14px;
        /*height: 14px;*/
        /*line-height: 14px;*/
        /*margin-top: 23px;*/
        height: 100%;
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


    .el-icon-message-solid{
        font-size: 20px;
    }


</style>

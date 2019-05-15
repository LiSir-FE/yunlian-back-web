import Vue from 'vue'
import Router from 'vue-router'
// 引入组件

import login from '../view/login.vue'
import notFound from '../view/404.vue'
import home from '../view/home.vue'
import passwordrecovery from '../view/passwordrecovery'
// 系统管理
import roleManagement from '../view/systemManagement/roleManagement'
import accountManagement from '../view/systemManagement/accountManagement'
import classifiedManagement from '../view/systemManagement/classifiedManagement'
// 总体管理
import allArticles from '../view/overallManagement/allArticles'
//功能
import articleManagement from '../view/functionManagement/articleManagement'
//用户管理
import userManagement from '../view/userManagement/userManagement'
//工作管理
import companyList from '../view/workManagement/companyList'
//财务管理
import summaryFunds from '../view/financialManagement/summaryFunds'
//统计分析
import trafficAnalysis from '../view/statisticalAnalysis/trafficAnalysis'
//账号管理
import accountSettings from '../view/accountManagement/accountSettings'
// 要告诉 vue 使用 vueRouter
Vue.use(Router)
export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'login',
            component: login,
            hidden: true
        },
        {
            path: '/404',
            component: notFound,
            name: 'notFound',
            hidden: true
        },
        {
            path: '/home',
            component: home,
            name: 'home',
            hidden: true
        },
        {
            path: '/passwordrecovery',
            component: passwordrecovery,
            name: 'passwordrecovery',
            hidden: true
        },
        {
            path: '/home',
            component: home,
            name: '系统管理',
            iconCls: 'el-icon-monitor',
            children: [{
                path: '/roleManagement',
                component: roleManagement,
                name: '角色管理'
            },{
                path: '/accountManagement',
                component: accountManagement,
                name: '账号管理'
            },{
                path: '/classifiedManagement',
                component: classifiedManagement,
                name: '分类管理'
            }]
        },
        {
            path: '/home',
            component: home,
            name: '总体管理',
            iconCls: 'el-icon-edit-outline',
            children: [{
                path: '/allArticles',
                component: allArticles,
                name: '所有文章'
            }]
        },{
            path: '/home',
            component: home,
            name: '功能',
            iconCls: 'el-icon-pie-chart',
            children: [{
                path: '/articleManagement',
                component: articleManagement,
                name: '文章管理'
            }]
        },{
            path: '/home',
            component: home,
            name: '用户管理',
            iconCls: 'el-icon-user',
            children: [{
                path: '/userManagement',
                component: userManagement,
                name: '用户列表'
            }]
        },{
            path: '/home',
            component: home,
            name: '工作管理',
            iconCls: 'el-icon-notebook-2',
            children: [{
                path: '/companyList',
                component: companyList,
                name: '公司列表'
            }]
        },{
            path: '/home',
            component: home,
            name: '财务管理',
            iconCls: 'el-icon-refrigerator',
            children: [{
                path: '/summaryFunds',
                component: summaryFunds,
                name: '资金总览'
            }]
        },{
            path: '/home',
            component: home,
            name: '统计分析',
            iconCls: 'el-icon-copy-document',
            children: [{
                path: '/trafficAnalysis',
                component: trafficAnalysis,
                name: '流量分析'
            }]
        },{
            path: '/home',
            component: home,
            name: '账号设置',
            iconCls: 'el-icon-setting',
            children: [{
                path: '/accountSettings',
                component: accountSettings,
                name: '账号'
            }]
        }
    ]
})

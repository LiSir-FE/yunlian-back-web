import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
// 引入组件

import login from '../view/login.vue'
import notFound from '../view/404.vue'
import home from '../view/home.vue'
import passwordrecovery from '../view/passwordrecovery'
// 系统管理
import roleManagement from '../view/systemManagement/roleManagement'
import accountManagement from '../view/systemManagement/accountManagement'
import classifiedManagement from '../view/systemManagement/classifiedManagement'
import recommendedSettings from '../view/systemManagement/recommendedSettings'
import focusMapManagement from '../view/systemManagement/focusMapManagement'
import advertisingManagement from '../view/systemManagement/advertisingManagement'
// 总体管理
import allArticles from '../view/overallManagement/allArticles'
import allActivities from '../view/overallManagement/allActivities'
import allInformation from '../view/overallManagement/allInformation'
import allComments from '../view/overallManagement/allComments'
import allCompanies from '../view/overallManagement/allCompanies'
import allWork from '../view/overallManagement/allWork'
import allIntelligence from '../view/overallManagement/allIntelligence'
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
            path: '/login',
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
            path: '/',
            component: home,
            name: 'home',
            hidden: true,
            meta: {
                keepalive: true
            }
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
            roles: '100:query',
            hidden: true,
            iconCls: 'el-icon-monitor',
            children: [{
                path: '/roleManagement',
                component: roleManagement,
                name: '角色管理',
                hidden: true,
                roles: '110:query'
            },{
                path: '/accountManagement',
                component: accountManagement,
                name: '账号管理',
                hidden: true,
                roles: '120:query'
            },{
                path: '/classifiedManagement',
                component: classifiedManagement,
                name: '分类管理',
                hidden: true,
                roles: '130:query'
            },{
                path: '/recommendedSettings',
                component: recommendedSettings,
                name: '推荐设置',
                hidden: true,
                roles: '140:query'
            },{
                path: '/focusMapManagement',
                component: focusMapManagement,
                name: '焦点图管理',
                hidden: true,
                roles: '150:query'
            },{
                path: '/advertisingManagement',
                component: advertisingManagement,
                name: '广告管理',
                hidden: true,
                roles: '160:query'
            }]
        },
        {
            path: '/home',
            component: home,
            name: '总体管理',
            roles: '200:query',
            hidden: true,
            iconCls: 'el-icon-edit-outline',
            children: [{
                path: '/allArticles',
                component: allArticles,
                roles: '210:query',
                hidden: true,
                name: '所有文章'
            },{
                path: '/allActivities',
                component: allActivities,
                roles: '220:query',
                hidden: true,
                name: '所有活动'
            },{
                path: '/allInformation',
                component: allInformation,
                roles: '230:query',
                hidden: true,
                name: '所有资料'
            },{
                path: '/allComments',
                component: allComments,
                roles: '250:query',
                hidden: true,
                name: '所有评论'
            },{
                path: '/allCompanies',
                component: allCompanies,
                roles: '260:query',
                hidden: true,
                name: '所有公司'
            },{
                path: '/allWork',
                component: allWork,
                roles: '270:query',
                hidden: true,
                name: '所有工作'
            },{
                path: '/allIntelligence',
                component: allIntelligence,
                roles: '280:query',
                hidden: true,
                name: '所有商机'
            }]
        },{
            path: '/home',
            component: home,
            name: '功能',
            roles: '300:query',
            hidden: true,
            iconCls: 'el-icon-pie-chart',
            children: [{
                path: '/articleManagement',
                component: articleManagement,
                roles: '310:query',
                hidden: true,
                name: '文章管理'
            }]
        },{
            path: '/home',
            component: home,
            name: '用户管理',
            roles: '400:query',
            hidden: true,
            iconCls: 'el-icon-user',
            children: [{
                path: '/userManagement',
                component: userManagement,
                roles: '420:query',
                hidden: true,
                name: '用户列表'
            }]
        },{
            path: '/home',
            component: home,
            name: '工作管理',
            roles: '800:query',
            hidden: true,
            iconCls: 'el-icon-notebook-2',
            children: [{
                path: '/companyList',
                component: companyList,
                roles: '810:query',
                hidden: true,
                name: '公司列表'
            }]
        },{
            path: '/home',
            component: home,
            name: '财务管理',
            roles: '500:query',
            hidden: true,
            iconCls: 'el-icon-refrigerator',
            children: [{
                path: '/summaryFunds',
                component: summaryFunds,
                roles: '510:query',
                hidden: true,
                name: '资金总览'
            }]
        },{
            path: '/home',
            component: home,
            name: '统计分析',
            roles: '600:query',
            hidden: true,
            iconCls: 'el-icon-copy-document',
            children: [{
                path: '/trafficAnalysis',
                component: trafficAnalysis,
                roles: '610:query',
                hidden: true,
                name: '流量分析'
            }]
        },{
            path: '/home',
            component: home,
            name: '账号设置',
            roles: '700:query',
            hidden: true,
            iconCls: 'el-icon-setting',
            children: [{
                path: '/accountSettings',
                component: accountSettings,
                roles: '710:query',
                hidden: true,
                name: '账号'
            }]
        }
    ]
})



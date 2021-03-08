import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
// 引入组件

import login from '../view/login.vue'
import notFound from '../view/404.vue'
import home from '../components/tuc-home/index.vue'
import dashboard from '../view/dashboard.vue'
import passwordrecovery from '../view/passwordrecovery'
// 系统管理
import roleManagement from '../view/systemManagement/roleManagement' // 角色管理
import accountManagement from '../view/systemManagement/accountManagement' // 账号管理
import classifiedManagement from '../view/systemManagement/classifiedManagement' // 分类管理
import recommendedSettings from '../view/systemManagement/recommendedSettings' // 推荐设置
import focusMapManagement from '../view/systemManagement/focusMapManagement' // 焦点图管理

import advertisingManagement from '../view/systemManagement/advertisingManagement' // 版权管理 (广告)
import advertisingList from '../view/systemManagement/advertisingList' // 版权列表
import addVertisingManagement from '../view/systemManagement/addVertisingManagement' // 添加版权
import editVertisingManagement from '../view/systemManagement/editVertisingManagement' // 修改版权


// 总体管理
import allArticles from '../view/overallManagement/allArticles' // 所有文章
import allActivities from '../view/overallManagement/allActivities' // 所有活动
import allInformation from '../view/overallManagement/allInformation' // 所有资料
import allComments from '../view/overallManagement/allComments' // 所有评论
import allCompanies from '../view/overallManagement/allCompanies' // 所有公司
import allWork from '../view/overallManagement/allWork' // 所有工作
import allIntelligence from '../view/overallManagement/allIntelligence' // 所有商机
import allCapacity from '../view/overallManagement/allCapacity' // 所有车队

//功能
import articleManagement from '../view/functionManagement/articleManagement' // 文章管理
import activityListManagement from '../view/functionManagement/activityListManagement' //活动管理
import datummanageManagement from '../view/functionManagement/datummanageManagement' //资料管理
import commentManagement from '../view/functionManagement/commentManagement' //评论管理
import brandManagement from '../view/functionManagement/brandManagement' //微站管理
import lotteryListManagement from '../view/functionManagement/lotteryListManagement' //现场互动


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
import fa from "element-ui/src/locale/lang/fa";
// 要告诉 vue 使用 vueRouter
Vue.use(Router)
export default new Router({
    // mode: 'history',
    routes: [
        {
            path: '/',
            hidden: true,
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: home,
            hidden: false,
            iconCls: 'el-icon-monitor',
            index: '0',
            children: [{
                path: '/dashboard',
                component: dashboard,
                name: '主页',
                hidden: false
            }]
        },
        {
            path: '/login',
            name: 'login',
            component: login,
            hidden: true,
            meta: { title: '登录' }
        },
        {
            path: '/notFound',
            component: notFound,
            name: 'notFound',
            hidden: true,
            redirect: '/notFound'
        },
        {
            path: '/passwordrecovery',
            component: passwordrecovery,
            name: 'passwordrecovery',
            hidden: true,
            meta: { title: '修改密码' }
        },
        {
            path: '/home',
            component: home,
            name: '系统管理',
            roles: '100:query',
            hidden: true,
            iconCls: 'el-icon-monitor',
            index: '1',
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
                name: '版权管理',
                hidden: true,
                roles: '160:query'
            },{
                path: '/advertisingList',
                component: advertisingList,
                name: '版权列表',
                hidden: true,
                roles: '170:query'
            },{
                path: '/addVertisingManagement',
                component: addVertisingManagement,
                name: '添加版权',
                hidden: true,
                roles: '180:query'
            },{
                path: '/editVertisingManagement',
                component: editVertisingManagement,
                name: '修改版权',
                hidden: true,
                roles: '190:query'
            }]
        },
        {
            path: '/home',
            component: home,
            name: '总体管理',
            roles: '200:query',
            hidden: true,
            iconCls: 'el-icon-edit-outline',
            index: '2',
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
            },{
                path: '/allCapacity',
                component: allCapacity,
                roles: '290:query',
                hidden: true,
                name: '所有车队'
            }]
        },{
            path: '/home',
            component: home,
            name: '功能',
            roles: '300:query',
            hidden: true,
            iconCls: 'el-icon-pie-chart',
            index: '3',
            children: [{
                path: '/articleManagement',
                component: articleManagement,
                roles: '310:query',
                hidden: true,
                name: '文章管理'
            },{
                path: '/activityListManagement',
                component: activityListManagement,
                roles: '320:query',
                hidden: true,
                name: '活动管理'
            },{
                path: '/datummanageManagement',
                component: datummanageManagement,
                roles: '330:query',
                hidden: true,
                name: '资料管理'
            },{
                path: '/commentManagement',
                component: commentManagement,
                roles: '340:query',
                hidden: true,
                name: '评论管理'
            },{
                path: '/brandManagement',
                component: brandManagement,
                roles: '350:query',
                hidden: true,
                name: '微站管理'
            },{
                path: '/lotteryListManagement',
                component: lotteryListManagement,
                roles: '360:query',
                hidden: true,
                name: '现场互动'
            }]
        },{
            path: '/home',
            component: home,
            name: '用户管理',
            roles: '400:query',
            hidden: true,
            iconCls: 'el-icon-user',
            index: '4',
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
            index: '5',
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
            index: '6',
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
            index: '7',
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
            index: '8',
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



import store from '../store'
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
import message from '../view/message.vue'
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
import editAllActivities from '../view/overallManagement/editAllActivities' // 所有活动-修改

import allInformation from '../view/overallManagement/allInformation' // 所有资料
import allComments from '../view/overallManagement/allComments' // 所有评论

import allCompanies from '../view/overallManagement/allCompanies' // 所有公司
import allWork from '../view/overallManagement/allWork' // 所有工作
import allIntelligence from '../view/overallManagement/allIntelligence' // 所有商机
import allCapacity from '../view/overallManagement/allCapacity' // 所有车队

//功能
import articleManagement from '../view/functionManagement/articleManagement' // 文章管理
import addArticle from '../view/functionManagement/addArticle' // 文章管理
import editArticle from '../view/functionManagement/editArticle' // 文章管理


import activityListManagement from '../view/functionManagement/activityListManagement' //活动管理
import addActivity from '../view/functionManagement/addActivity' // 发布活动
import editActivity from '../view/functionManagement/editActivity' // 编辑活动
import detailsActivity from '../view/functionManagement/detailsActivity' // 活动详情
import personnelFilingEdit from '../view/functionManagement/personnelFilingEdit' // 编辑人员归档


import datummanageManagement from '../view/functionManagement/datummanageManagement' //资料管理
import commentManagement from '../view/functionManagement/commentManagement' //评论管理

import brandManagement from '../view/functionManagement/brandManagement' //微站管理
import lotteryListManagement from '../view/functionManagement/lotteryListManagement' //现场互动

import problemList from '../view/functionManagement/problemList' //问题管理
import addProblem from '../view/functionManagement/addProblem' //添加问题
import detailsProblem from '../view/functionManagement/detailsProblem' //问题详情

import coursesList from '../view/functionManagement/coursesList' //课程管理
import addCourses from '../view/functionManagement/addCourses' //新增课程
import editCourses from '../view/functionManagement/editCourses' //编辑课程


//用户管理
import userManagement from '../view/userManagement/userManagement'  // 全部用户
import vip from '../view/userManagement/vip'   // 会员用户
import userDetails from '../view/userManagement/userDetails'   // 用户详情
import userEdit from '../view/userManagement/userEdit'   // 编辑用户
import userAdd from '../view/userManagement/userAdd'   // 新增用户

//工作台管理
import companyList from '../view/workManagement/companyList'      // 公司列表
import addCompany from '../view/workManagement/addCompany'      // 新增公司
import editCompany from '../view/workManagement/editCompany'      // 修改公司
import detailsCompany from '../view/workManagement/detailsCompany'      // 公司详情

import workList from '../view/workManagement/workList'         // 工作列表
import addWork from '../view/workManagement/addWork'         // 新增工作
import editWork from '../view/workManagement/editWork'         // 编辑工作
import detailsWork from '../view/workManagement/detailsWork'         // 工作详情


import opportunityList from '../view/workManagement/opportunityList'  // 商机列表
import editOpportunity from '../view/workManagement/editOpportunity'  // 修改商机
import detailsOpportunity from '../view/workManagement/detailsOpportunity'  // 修改商机
import commentAll from '../view/workManagement/commentAll'  // 全部评论


import followList from '../view/workManagement/followList'       // 关注列表

import fleetList from '../view/workManagement/fleetList'        // 车队列表
import editFleet from '../view/workManagement/editFleet'        // 修改车队
import detailsFleet from '../view/workManagement/detailsFleet'        // 车队详情
import addFleet from '../view/workManagement/addFleet'        // 新增车队
import fleetMemorandum from '../view/workManagement/fleetMemorandum'        // 车队备忘录

import distributionList from '../view/workManagement/distributionList' // 分配列表

import calendarList from '../view/workManagement/calendarList'     // 日历列表
import addCalendar from '../view/workManagement/addCalendar'     // 日历列表
import editCalendar from '../view/workManagement/editCalendar'     // 日历列表


// 合同管理
import contractManagement from '../view/contractManagement/contractList' //合同列表
import allContracts from '../view/contractManagement/allContracts' //全部合同
import editContract from '../view/contractManagement/editContract' //修改合同
import addContract from '../view/contractManagement/addContract' //新增合同
import detailsContract from '../view/contractManagement/detailsContract' //合同详情


//财务管理
import summaryFunds from '../view/financialManagement/summaryFunds' // 资金总览
//统计分析
import trafficAnalysis from '../view/statisticalAnalysis/trafficAnalysis' //流量分析
import userAnalysis from '../view/statisticalAnalysis/userAnalysis'       //用户分析
import contentAnalysis from '../view/statisticalAnalysis/contentAnalysis' //内容分析
import incomeAnalysis from '../view/statisticalAnalysis/incomeAnalysis'   //收入分析
import workAnalysis from '../view/statisticalAnalysis/workAnalysis'       //工作分析
import answerAnalysis from '../view/statisticalAnalysis/answerAnalysis'   //答题统计
import contractStatistics from '../view/statisticalAnalysis/contractStatistics'        // 合同统计
import contractNumStatistics from '../view/statisticalAnalysis/contractNumStatistics'  // 内容统计
//账号管理
import accountSettings from '../view/accountManagement/accountSettings' // 账号管理 // 审核
import auditDetails from '../view/accountManagement/auditDetails'  // 审核详情

import fa from "element-ui/src/locale/lang/fa";
// 要告诉 vue 使用 vueRouter
Vue.use(Router)
export default new Router({
    mode: 'history',
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
            meta: {title: '登录'}
        },
        {
            path: '/passwordrecovery',
            component: passwordrecovery,
            name: 'passwordrecovery',
            hidden: true,
            meta: {title: '修改密码'}
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
            }, {
                path: '/accountManagement',
                component: accountManagement,
                name: '账号管理',
                hidden: true,
                roles: '120:query'
            }, {
                path: '/classifiedManagement',
                component: classifiedManagement,
                name: '分类管理',
                hidden: true,
                roles: '130:query'
            }, {
                path: '/recommendedSettings',
                component: recommendedSettings,
                name: '推荐设置',
                hidden: true,
                roles: '140:query'
            }, {
                path: '/focusMapManagement',
                component: focusMapManagement,
                name: '焦点图管理',
                hidden: true,
                roles: '150:query'
            }, {
                path: '/advertisingManagement',
                component: advertisingManagement,
                name: '广告管理',
                hidden: true,
                roles: '160:query'
            }, {
                path: '/advertisingList',
                component: advertisingList,
                name: '广告列表',
                hidden: true,
                roles: '170:query'
            }, {
                path: '/addVertisingManagement',
                component: addVertisingManagement,
                name: '广告',
                hidden: true,
                roles: '180:query'
            }, {
                path: '/editVertisingManagement',
                component: editVertisingManagement,
                name: '修改广告',
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
                name: '所有文章' // store.getters.getArticlesNmae
            }, {
                path: '/allActivities',
                component: allActivities,
                roles: '220:query',
                hidden: true,
                name: '所有活动'
            }, {
                path: '/allInformation',
                component: allInformation,
                roles: '230:query',
                hidden: true,
                name: '所有资料'
            }, {
                path: '/allComments',
                component: allComments,
                roles: '250:query',
                hidden: true,
                name: '所有评论'
            }, {
                path: '/allCompanies',
                component: allCompanies,
                roles: '260:query',
                hidden: true,
                name: '所有公司'
            }, {
                path: '/allWork',
                component: allWork,
                roles: '270:query',
                hidden: true,
                name: '所有工作'
            }, {
                path: '/allIntelligence',
                component: allIntelligence,
                roles: '280:query',
                hidden: true,
                name: '所有商机'
            }, {
                path: '/allCapacity',
                component: allCapacity,
                roles: '290:query',
                hidden: true,
                name: '所有车队'
            }]
        }, {
            path: '/home',
            component: home,
            name: '功能管理',
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
            }, {
                path: '/activityListManagement',
                component: activityListManagement,
                roles: '320:query',
                hidden: true,
                name: '活动管理'
            }, {
                path: '/datummanageManagement',
                component: datummanageManagement,
                roles: '340:query',
                hidden: true,
                name: '资料管理'
            }, {
                path: '/commentManagement',
                component: commentManagement,
                roles: '350:query',
                hidden: true,
                name: '评论管理'
            }, {
                path: '/brandManagement',
                component: brandManagement,
                roles: '360:query',
                hidden: true,
                name: '微站管理'
            },
                //     { 日后做
                //     path: '/lotteryListManagement',
                //     component: lotteryListManagement,
                //     roles: '370:query',
                //     hidden: true,
                //     name: '现场互动'
                // },
                {
                    path: '/problemList',
                    component: problemList,
                    roles: '380:query',
                    hidden: true,
                    name: '问题管理'
                }, {
                    path: '/coursesList',
                    component: coursesList,
                    roles: '390:query',
                    hidden: true,
                    name: '课程管理'
                }, {
                    path: '/addProblem',
                    component: addProblem,
                    meta: {
                        roles: '391:query'
                    },
                    hidden: true,
                    name: '添加问题'
                }, {
                    path: '/detailsProblem',
                    component: detailsProblem,
                    meta: {
                        roles: '391:query'
                    },
                    hidden: true,
                    name: '问题详情'
                }, {
                    path: '/addCourses',
                    component: addCourses,
                    meta: {
                        roles: '391:query'
                    },
                    hidden: true,
                    name: '新增课程'
                }, {
                    path: '/editCourses',
                    component: editCourses,
                    meta: {
                        roles: '391:query'
                    },
                    hidden: true,
                    name: '编辑课程'
                }, {
                    path: '/addArticle',
                    component: addArticle,
                    meta: {
                        roles: '391:query'
                    },
                    hidden: true,
                    name: '发布文章'
                }, {
                    path: '/editArticle',
                    component: editArticle,
                    meta: {
                        roles: '391:query'
                    },
                    hidden: true,
                    name: '编辑文章'
                }, {
                    path: '/editAllActivities',
                    component: editAllActivities,
                    meta: {
                        roles: '391:query'
                    },
                    hidden: true,
                    name: '编辑全部活动'
                }, {
                    path: '/addActivity',
                    component: addActivity,
                    meta: {
                        roles: '391:query'
                    },
                    hidden: true,
                    name: '发布活动'
                }, {
                    path: '/editActivity',
                    component: editActivity,
                    meta: {
                        roles: '391:query'
                    },
                    hidden: true,
                    name: '编辑活动'
                }, {
                    path: '/detailsActivity',
                    component: detailsActivity,
                    meta: {
                        roles: '391:query',
                        keepAlive: true
                    },
                    hidden: true,
                    name: '活动详情'
                }, {
                    path: '/personnelFilingEdit',
                    component: personnelFilingEdit,
                    meta: {
                        roles: '391:query'
                    },
                    hidden: true,
                    name: '编辑人员'
                }]
        }, {
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
                meta: {
                    roles: '421:query'
                },
                name: '全部用户'
            }, {
                path: '/vip',
                component: vip,
                roles: '430:query',
                hidden: true,
                name: '会员用户'
            }, {
                path: '/userDetails',
                component: userDetails,
                hidden: true,
                meta: {
                    roles: '420:query'
                },
                name: '用户详情'
            }, {
                path: '/userEdit',
                component: userEdit,
                hidden: true,
                meta: {
                    roles: '420:query'
                },
                name: '编辑用户'
            }, {
                path: '/userAdd',
                component: userAdd,
                hidden: true,
                meta: {
                    roles: '421:query'
                },
                name: '新增用户'
            }]
        }, {
            path: '/home',
            component: home,
            name: '工作台',
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
            }, {
                path: '/workList',
                component: workList,
                roles: '820:query',
                hidden: true,
                name: '工作列表'
            }, {
                path: '/opportunityList',
                component: opportunityList,
                roles: '830:query',
                hidden: true,
                name: '商机列表'
            }, {
                path: '/followList',
                component: followList,
                roles: '840:query',
                hidden: true,
                name: '关注列表'
            }, {
                path: '/fleetList',
                component: fleetList,
                roles: '850:query',
                hidden: true,
                name: '车队列表'
            }, {
                path: '/distributionList',
                component: distributionList,
                roles: '860:query',
                hidden: true,
                name: '分配列表'
            }, {
                path: '/calendarList',
                component: calendarList,
                roles: '870:query',
                hidden: true,
                name: '日历列表'
            }, {
                path: '/addCompany',
                component: addCompany,
                meta: {
                    roles: '811:query',
                },
                hidden: true,
                name: '新增公司'
            }, {
                path: '/editCompany',
                component: editCompany,
                meta: {
                    roles: '812:query',
                },
                hidden: true,
                name: '修改公司'
            }, {
                path: '/detailsCompany',
                component: detailsCompany,
                meta: {
                    roles: '812:query',
                },
                hidden: true,
                name: '公司详情'
            }, {
                path: '/addWork',
                component: addWork,
                meta: {
                    roles: '812:query',
                },
                hidden: true,
                name: '新增工作'
            }, {
                path: '/editWork',
                component: editWork,
                meta: {
                    roles: '812:query',
                },
                hidden: true,
                name: '编辑工作'
            }, {
                path: '/detailsWork',
                component: detailsWork,
                meta: {
                    roles: '813:query',
                },
                hidden: true,
                name: '工作详情'
            }, {
                path: '/editOpportunity',
                component: editOpportunity,
                meta: {
                    roles: '814:query',
                },
                hidden: true,
                name: '修改商机'
            }, {
                path: '/detailsOpportunity',
                component: detailsOpportunity,
                meta: {
                    roles: '814:query',
                },
                hidden: true,
                name: '商机详情'
            }, {
                path: '/commentAll',
                component: commentAll,
                meta: {
                    roles: '814:query',
                },
                hidden: true,
                name: '全部评论'
            }, {
                path: '/editFleet',
                component: editFleet,
                meta: {
                    roles: '814:query',
                },
                hidden: true,
                name: '修改车队'
            }, {
                path: '/detailsFleet',
                component: detailsFleet,
                meta: {
                    roles: '814:query',
                },
                hidden: true,
                name: '车队详情'
            }, {
                path: '/addFleet',
                component: addFleet,
                meta: {
                    roles: '814:query',
                },
                hidden: true,
                name: '新增车队'
            }, {
                path: '/fleetMemorandum',
                component: fleetMemorandum,
                meta: {
                    roles: '814:query',
                },
                hidden: true,
                name: '车队备忘录'
            }, {
                path: '/addCalendar',
                component: addCalendar,
                meta: {
                    roles: '814:query',
                },
                hidden: true,
                name: '新增日历项'
            }, {
                path: '/editCalendar',
                component: editCalendar,
                meta: {
                    roles: '814:query',
                },
                hidden: true,
                name: '修改日历'
            }]
        }, {
            path: '/home',
            component: home,
            name: '合同管理',
            roles: '900:query',
            hidden: true,
            iconCls: 'el-icon-tickets',
            index: '6',
            children: [{
                path: '/contractList',
                component: contractManagement,
                roles: '910:query',
                hidden: true,
                name: '合同列表'
            }, {
                path: '/allContracts',
                component: allContracts,
                roles: '920:query',
                hidden: true,
                name: '全部合同'
            }, {
                path: '/editContract',
                component: editContract,
                hidden: true,
                meta: {
                    roles: '921:query',
                },
                name: '修改合同'
            }, {
                path: '/addContract',
                component: addContract,
                hidden: true,
                meta: {
                    roles: '922:query',
                },
                name: '新增合同'
            }, {
                path: '/detailsContract',
                component: detailsContract,
                hidden: true,
                meta: {
                    roles: '923:query',
                },
                name: '合同详情'
            }]

        }, {
            path: '/home',
            component: home,
            name: '财务管理',
            roles: '500:query',
            hidden: true,
            iconCls: 'el-icon-refrigerator',
            index: '7',
            children: [{
                path: '/summaryFunds',
                component: summaryFunds,
                roles: '510:query',
                hidden: true,
                name: '资金总览'
            }]
        }, {
            path: '/home',
            component: home,
            name: '统计分析',
            roles: '600:query',
            hidden: true,
            iconCls: 'el-icon-copy-document',
            index: '8',
            children: [{
                path: '/trafficAnalysis',
                component: trafficAnalysis,
                roles: '610:query',
                hidden: true,
                name: '流量分析'
            }, {
                path: '/userAnalysis',
                component: userAnalysis,
                roles: '620:query',
                hidden: true,
                name: '用户分析'
            }, {
                path: '/contentAnalysis',
                component: contentAnalysis,
                roles: '630:query',
                hidden: true,
                name: '内容分析'
            },
                //     {
                //     path: '/incomeAnalysis',
                //     component: incomeAnalysis,
                //     roles: '610:query',
                //     hidden: true,
                //     name: '收入分析'
                // },
                {
                    path: '/workAnalysis',
                    component: workAnalysis,
                    roles: '650:query',
                    hidden: true,
                    name: '工作分析'
                }, {
                    path: '/answerAnalysis',
                    component: answerAnalysis,
                    roles: '660:query',
                    hidden: true,
                    name: '答题统计'
                }, {
                    path: '/contractStatistics',
                    component: contractStatistics,
                    roles: '670:query',
                    hidden: true,
                    name: '合同统计'
                }, {
                    path: '/contractNumStatistics',
                    component: contractNumStatistics,
                    roles: '680:query',
                    hidden: true,
                    name: '内容统计'
                }]
        }, {
            path: '/home',
            component: home,
            name: '账号设置',
            roles: '700:query',
            hidden: true,
            iconCls: 'el-icon-setting',
            index: '9',
            children: [{
                path: '/accountSettings',
                component: accountSettings,
                roles: '710:query',
                hidden: true,
                name: '账号'
            }, {
                path: '/auditDetails',
                component: auditDetails,
                name: '审核详情',
                hidden: true,
                meta: {title: '审核详情'}
            }, {
                path: '/message',
                component: message,
                name: '消息',
                hidden: true,
                meta: {title: '消息'}
            }, {
                path: '/notFound',
                component: notFound,
                name: 'notFound',
                hidden: true,
                meta: {title: '404'}
            },]
        }
    ]
})



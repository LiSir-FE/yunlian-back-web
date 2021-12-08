import axios from 'axios'
import qs from 'qs'

// let apis = process.env;
let apis = process.env.API_ROOT
export const loginService = {
    api: {},
    // 登录
    login: function (params) {
        return axios.post(apis + 'tokens/password', qs.stringify(params))
    },
    /* 获取Geetest */
    getGaptchas: function (params) {
        return axios.get(apis + 'gaptchas' + this.getParams(params))
    },
    /* 校验Geetest */
    postGaptchas: function (params) {
        return axios.post(apis + 'gaptchas', qs.stringify(params))
    },
    // 获取短信验证码
    getSms: function (params) {
        return axios.get(apis + 'sms' + this.getParams(params))
    },
    //修改密码
    putAccountspassword: function (params) {
        return axios.put(apis + 'accounts/password', qs.stringify(params))
    },
    // 获取个人信息
    getAdmin: function (params) {
        return axios.get(apis + 'admins' + this.getParams(params))
    },
    // 获取内部员工工作天数
    getStaffpagesAccounts: function (params) {
        return axios.get(apis + 'accounts/staffhiretime' + this.getParams(params));
    },
    // 上传头像
    getPolicy: function (params) {
        return axios.get(apis + `oss/policy`)
    },
    // 账号设置
    postAdminInfo: function (params) {
        return axios.put(apis + 'admins/' + this.getParams(params))
    },
    // 获取账户审核详情
    getVarifysid: function (id) {
        return axios.get(apis + `varifys/${id}`);
    },
    // 获取单个认证审核列表
    getAdminsIdadminId: function (id, adminid) {
        return axios.get(apis + `admins/certification/${id}/${adminid}`);
    },
    // 认证通过
    putAdminsPass: function (params) {
        return axios.put(apis + 'admins/certification/Pass' + this.getParams(params) );
    },
    // 删除账户申请
    deleteVarifys: function (params) {
        return axios.delete(apis + 'varifys' + this.getParams(params));
    },
    // 拒绝账户申请
    putVarifysrefuse: function (params) {
        return axios.put(apis + 'varifys/refuse' + this.getParams(params));
    },
    // 同意账户申请
    putVarifysaggree: function (params) {
        return axios.put(apis + 'varifys/aggree' + this.getParams(params));
    },
    // 撤销账户申请
    putVarifysrevoke: function (params) {
        return axios.put(apis + 'varifys/revoke' + this.getParams(params));
    },
    // 认证拒绝
    putAdminsnoPass: function (params) {
        return axios.put(apis + 'admins/certification/noPass' + this.getParams(params) );
    },
    // 修改密码
    postPassword: function (params) {
        return axios.put(apis + 'admins/password' + this.getParams(params))
    },
    /* 管理员信息 */
    getAdminInfo: function () {
        return axios.get(apis + 'admins')
    },


    // 首页 日历视图
    getCalendarsChart: function(param) {
        return axios.get(apis + `calendars/chart` + this.getParams(param))
    },

    // 查询具体某一天的所有日历项
    getCalendarsDetails: function(param) {
        return axios.get(apis + `calendars/details` + this.getParams(param))
    },



    /* 账单列表 */
    getwallets: function (params) {
        return axios.get(apis + 'moneys/walletlist'+ this.getParams(params));
    },
    /*获取账单详情*/
    getOdersNo: function (params) {
        return axios.get(apis + 'orders/orderNo'+ this.getParams(params));
    },
    /* 账单列表元 */
    getmoneys: function (id) {
        return axios.get(apis + `moneys/${id}`);
    },

    // 获取认证二维码
    getWechaturl: function () {
        return axios.get(apis + 'admins/wechaturl')
    },
    //  通用：获取短信验证码
    getValidateMess: function (params) {
        return axios.get(apis + 'sms' + this.getParams(params))
    },
    // 申请认证
    applyCertification: function (params) {
        return axios.post(apis + 'admins/certification', qs.stringify(params));
    },

    // 查询认证信息
    getCertification: function (id, adminId, params) {
        return axios.get(apis + `admins/certification/${id}/${adminId}` + this.getParams(params));
    },

    // 获取角色列表
    getRoles: function (params) {
        return axios.get(apis + 'roles' + this.getParams(params))
    },

    // 获取权限树
    getPermissions: function (params) {
        return axios.get(apis + 'permissions/tree' + this.getParams(params))
    },
    // 获取单个角色信息
    getRolesid: function (id) {
        return axios.get(apis + 'roles/' + id)
    },
    // 新建角色
    postRoles: function (params) {
        return axios.post(apis + 'roles' + this.getParams(params))
    },
    // 删除角色
    deleteRoles: function (params) {
        return axios.delete(apis + 'roles' + this.getParams(params))
    },

    // 获取账号列表
    getAccounts: function (params) {
        return axios.get(apis + 'accounts' + this.getParams(params))
    },
    // 验证账号
    getAccountsvalite: function (params) {
        return axios.get(apis + 'accounts/valite' + this.getParams(params))
    },
    // 新增账号列表
    postAccounts: function (params) {
        return axios.post(apis + 'accounts', qs.stringify(params))
    },
    // 编辑账号列表
    putAccounts: function (params) {
        return axios.put(apis + 'accounts', qs.stringify(params))
    },
    // 获取单个账号
    getAccountsid: function (id) {
        return axios.get(apis + `accounts/${id}`)
    },
    // 删除账号列表
    deleteAccounts: function (params) {
        return axios.delete(apis + 'accounts' + this.getParams(params))
    },
    /*  个人中心设置退出 接口 */
    myExit: function () {
        return axios.delete(apis + 'tokens')
    },

    //获取账户审核
    getVarifys: function (params) {
        return axios.get(apis + 'varifys' + this.getParams(params))
    },

    // 获取认证审核列表
    getAdminscertificationlist: function (params) {
        return axios.get(apis + 'admins/certification/list' + this.getParams(params))
    },

    //文章分类
    getDictionaryslist: function (params) {
        return axios.get(apis + 'dictionarys/list' + this.getParams(params))
    },

    // 新建分类名称
    addTextDiction: function (params) {
        return axios.post(apis + 'dictionarys' + this.getParams(params))
    },
    //获取单个分类名称
    getDictionarysid: function (id) {
        return axios.get(apis + `dictionarys/${id}`);
    },
    // 修改分类名称
    editTextDiction: function (id, params) {
        return axios.put(apis + 'dictionarys/' + id + this.getParams(params))
    },
    // 删除分类
    deleTextDiction: function (id) {
        return axios.delete(apis + `dictionarys/${id}`);
    },


    // 获取焦点图list
    getBannerslist: function (params) {
        return axios.get(apis + 'banners/list' + this.getParams(params));
    },
    // 新增焦点图
    postBanners: function (params) {
        return axios.post(apis + 'banners', qs.stringify(params));
    },
    // 编辑焦点图
    putBanners: function (params) {
        return axios.put(apis + 'banners' + this.getParams(params));
    },
    // 获取单个轮播图
    getBannersid: function (id) {
        return axios.get(apis + `banners/${id}`);
    },
    // 删除轮播图
    putBannersstatus: function (params) {
        return axios.put(apis + 'banners/status' + this.getParams(params));
    },
    //获取推荐列表
    getAdname: function (params) {
        return axios.get(apis + 'ad/name' + this.getParams(params));
    },
    //获取推荐
    getAd: function (params) {
        return axios.get(apis + 'ad' + this.getParams(params));
    },
    //获取单个推荐
    getAdid: function (id) {
        return axios.get(apis + `ad/${id}`);
    },
    // 修改推荐
    putAd: function (params) {
        return axios.put(apis + 'ad' + this.getParams(params) );
    },

    // 广告管理
    // 获取版位列表
    getGuanggaoInfo: function (params) {
        return axios.get(apis + 'ads' + this.getParams(params));
    },

    // 新增版权
    addGuanggaoInfo: function (params) {
        return axios.post(apis + 'ads' + this.getParams(params));
    },

    // 删除版权
    deleteGuanggaoInfo: function (id) {
        return axios.delete(apis + `ads/${id}`);
    },

    // 获取版权详情
    detailsGuanggao: function (id) {
        return axios.get(apis + `ads/${id}`);
    },

    // 修改版权
    editGuanggaoInfo: function (params) {
        return axios.put(apis + '/ads' + this.getParams(params));
    },










    // 获取文章分类 获取文章标签
    getArticlesType: function (param) {
        return axios.get(apis + 'dictionarys/nolist' + this.getParams(param))
    },
    // 添加一篇文章
    addArticle: function (param) {
        return axios.post(apis + 'articles', qs.stringify(param))
    },
    // 撤销一篇文章
    withdraw: function (param) {
        return axios.put(apis + 'articles/reback', qs.stringify(param))
    },
    // 删除一篇文章
    deleteArticle: function (param) {
        return axios.delete(apis + 'articles/' + param.articleId)
    },
    // 获取全部文章列表
    getList: function (param) {
        return axios.get(apis + 'articles' + this.getParams(param))
    },
    // 获得文章详情
    getArticle: function (param) {
        return axios.get(apis + 'articles/' + param.id )
    },
    // 编辑一篇文章
    editArticle: function (param) {
        return axios.put(apis + 'articles', qs.stringify(param))
    },
    // 取消置顶一篇文章
    disStickArticle: function (param) {
        return axios.put(apis + 'articles/disstick', qs.stringify(param))
    },
    // 获得申请列表
    getVarifysList: function (param) {
        return axios.get(apis + 'varifys' + this.getParams(param))
    },
    // 审核通过
    agree: function (param) {
        return axios.put(apis + 'varifys/aggree', qs.stringify(param))
    },
    // 审核拒绝
    refuse: function (param) {
        return axios.put(apis + 'varifys/refuse', qs.stringify(param))
    },
    // 置顶一篇文章
    stickArticle: function (param) {
        return axios.put(apis + 'articles/stick', qs.stringify(param))
    },
    // 关闭/开启一篇文章
    switchArticle: function (param) {
        return axios.put(apis + 'articles/close', qs.stringify(param))
    },
    // 修改文章-公司
    editTwoActivity: function (param) {
        return axios.put(apis + 'companies/items/' + this.getParams(param))
    },
    // 获取文章-公司
    getTwoCompanys: function (param) {
        return axios.get(apis + 'companies/items2Compines/' + this.getParams(param))
    },
    // 获取全部活动列表
    getActivities: function (param) { // 活动列表
        return axios.get(apis + 'activities' + this.getParams(param))
    },
    // 获取活动用户列表
    getActusersList: function (param) {
        return axios.get(apis + 'actusers' + this.getParams(param))
    },
    // 签到员
    getCheckWorker: function (param) {
        return axios.get(apis + 'checkadmins' + this.getParams(param))
    },
    // 查询所有自定义分组
    getActivityGroup: function(param){
        return axios.get(apis + 'activities/group' + this.getParams(param))
    },
    // 添加分组
    addActivityGroup: function (param) {
        return axios.post(apis + 'activities/ticket_add_group', qs.stringify(param))
    },
    // 删除分组
    deleteActivityGroup: function (param) {
        return axios.delete(apis + 'activities/order_del_group', qs.stringify(param))
    },
    // 移动到分组
    moveAnotherGroup: function(param){
        return axios.put(apis + 'activities/move_to_group', qs.stringify(param))
    },
    // 导出
    exportInfo:function (url, param) {
        window.location.href = apis + url + this.getParams(param);
    },
    // 单个导入
    importSingle: function (param) {
        return axios.put(apis + 'activities/order_import', qs.stringify(param))
    },
    // 批量导入
    importMultiple: function (param) {
        return axios.put(apis + 'activities/orders_import', qs.stringify(param))
    },
    // 电子票签到/ 取消签到
    signTicket: function (param) {
        return axios.put(apis + 'activities/ticket_sign', qs.stringify(param))
    },
    // 获取短信模板
    getSmsTemplate: function (param) {
        return axios.get(apis + 'smstemplates' + this.getParams(param))
    },
    // 发送电子票
    sendMessage: function (param) {
        return axios.put(apis + 'activities/send_ticket', qs.stringify(param))
    },
    // 发送短信
    sendSms: function (param) {
        return axios.put(apis + 'activities/send_sms', qs.stringify(param))
    },
    // 获取右侧-详情
    getTicketDetail: function (param) {
        return axios.get(apis + 'activities/people/myticket' + this.getParams(param))
    },
    // 编辑-右侧
    editActPeople: function (param) {
        return axios.put(apis + 'activities/ticket_edit', qs.stringify(param,{allowDots: true}))
    },
    // 上传文件
    uploadFile: function (param) {
        return axios.post(apis + 'files', param)
    },
    // 导入预览
    importPreview: function (param) {
        return axios.get(apis + 'activities/excel_import' + this.getParams(param))
    },
    // 修改分组
    editActivityGroup: function (param) {
        return axios.put(apis + 'groups', qs.stringify(param))
    },
    // 生成合同
    postActuser2contracts: function (param) {
        return axios.post(apis + `actuser2contracts`, qs.stringify(param))
    },
    // 活动详情
    getActivityDetail: function (param) {
        return axios.get(apis + 'activities/' + param.id)
    },
    // 订单查询
    getActivityOrder: function (param) {
        return axios.get(apis + 'activities/order'+ this.getParams(param))
    },
    // 下载二维码
    downloadQRCode: function(param){
        window.location.href = apis + 'downloads/ticket_qrcode'+ this.getParams(param);
    },
    // 编辑活动详情
    editTwoActivitys: function (id, param) {
        return axios.put(apis + `activities/${id}` + this.getParams(param))
    },
    // 置顶一个活动actId
    stickActivity: function (param) {
        return axios.put(apis + 'activities/stick', qs.stringify(param))
    },
    // 取消置顶一个活动actId
    distickActivity: function (param) {
        return axios.put(apis + 'activities/distick', qs.stringify(param))
    },
    // 开启/关闭一个活动
    openCloseActivity: function (param) {
        return axios.put(apis + 'activities/close', qs.stringify(param))
    },
    // 添加一个活动
    addActivity: function (param) {
        return axios.post(apis + 'activities', qs.stringify(param, {allowDots: true}))
    },
    // 编辑一个活动
    editActivity: function (param) {
        return axios.put(apis + 'activities', qs.stringify(param, {allowDots: true}))
    },
    // 删除一个活动actId
    deleteActivity: function (param) {
        return axios.delete(apis + 'activities'+ this.getParams(param))
    },
    // 复制活动
    copyActivity: function (param) {
        return axios.post(apis + 'activities/copy', qs.stringify(param))
    },

    // 活动列表
    getActivitiesList: function (params) {
        return axios.get(apis + 'activities'+ this.getParams(params));
    },
    // 获得活动人员列表
    getListActivityPeople:function (param) {
        return axios.get(apis + 'activities/people' + this.getParams(param))
    },
    // 签到员管理
    getCheckadmins: function (params) {
        return axios.get(apis + 'checkadmins'+ this.getParams(params));
    },
    // 获取人员归档详情
    getpersonnelFilingEdit: function(id) {
        return axios.get(apis + `mytickets/${id}/archiveTmp`)
    },
    // 人员归档
    postpersonnelFilingEdit: function(id, param) {
        return axios.post(apis + `mytickets/${id}/archive`, qs.stringify(param))
    },
    // 扩展内容单项保存
    preserExpandContent: function (data, param) { //
        return axios.post(apis + `activities/${data}/descContent`, qs.stringify(param))
    },
    // 获取扩展内容
    getActivityDetails: function (data) {
        return axios.get(apis + `/activities/${data}`)
    },
    // 扩展内容排序
    sortExpandContent: function (data, datas, param) { //
        return axios.post(apis + `activities/${data}/desc/${datas}` + this.getParams(param))
    },

    // 扩展内容删除
    delateExpandContent: function (data, datas) { //
        return axios.delete(apis + `activities/${data}/desc/${datas}`)
    },
    // 扩展内容编辑
    editExpandContent: function (data, param) {
        return axios.post(apis + `activities/${data}/desc` + this.getParams(param))
    },
    // 扩展内容新增
    addExpandContent: function (data, param) { //
        return axios.put(apis + `activities/${data}/desc` + this.getParams(param))
    },
    //扩展详情
    getExpandContent: function (data, param) { //
        return axios.get(apis + `activities/${data}/desc` + this.getParams(param))
    },
    // 修改标题
    editTitleDescType: function (id, param) {
        return axios.post(apis + `activities/${id}/descType` + this.getParams(param))
    },

    // 现场活动
    fieldActivitiesList: function (params) {
        return axios.get(apis + 'interactives/list'+ this.getParams(params));
    },

    // 问题管理列表
    getQuizesList: function (params) {
        return axios.get(apis + 'quizes/all'+ this.getParams(params));
    },
    // 新增问题
    addQuizes: function (param) {
        return axios.post(apis + `quizes` + this.getParams(param))
    },
    // 问题详情
    getAnswerDetrails: function(id) {
        return axios.get(apis + `quizes/${id}`)
    },
    // 开启关闭问题接口
    putQuizes: function(id, param) {
        return axios.put(apis + `quizes/${id}` + this.getParams(param))
    },

    //课程list
    getCourseList: function(param) {
        return axios.get(apis + `courses` + this.getParams(param))
    },
    // 新增课程
    addCourse: function(param) {
        return axios.post(apis + `courses`, qs.stringify(param))
    },
    // 修改课程
    editCourse: function(id, param) {
        return axios.post(apis + `courses/${id}`, qs.stringify(param))
    },
    // 查询课程详情
    detailsCourse: function(id) {
        return axios.get(apis + `courses/${id}`)
    },
    // 删除课程
    deleteCourse: function (id) {
        return axios.delete(apis + `courses/${id}`)
    },

    // 获取文章评审list
    // 文章评审列表
    getArticlesList: function(param) {
        return axios.get(apis + `articles` + this.getParams(param))
    },

    //合格or不合格
    articlesQualified: function(id, param) {
        return axios.put(apis + `/articles/${id}/qualified` + this.getParams(param))
    },


    // 用户
    // 获取全部用户下拉列表
    getAllUsrtList: function(id, param) {
        return axios.get(apis + `groups/list` + this.getParams(param))
    },
    // 获取用户列表
    getUserGroupsUser: function (groupId, params) {
        return axios.get(apis + 'groups/' + groupId + '/users'+ this.getParams(params));
    },
    // 移动用户到组
    moveGroups: function (params) {
        return axios.put(apis + 'groups/move2group', qs.stringify(params));
    },
    // 将用户从组移除
    removeGroups: function (params) {
        return axios.put(apis + 'groups/remove', qs.stringify(params));
    },
    // 新建分组
    postGroups:function (params) {
        return axios.post(apis + 'groups', qs.stringify(params));
    },
    // 编辑分组
    editGroups: function (params) {
        return axios.put(apis + 'groups'+ this.getParams(params));
    },
    // 删除分组
    delGroups: function (params) {
        return axios.delete(apis + 'groups'+ this.getParams(params));
    },
    // 获取会员列表
    getVip: function (params) {
        return axios.get(apis + 'admins/vips'+ this.getParams(params));
    },
    // 获取vip会员列表
    getVipMem: function (params) {
        return axios.get(apis + 'admins/vips/mem'+ this.getParams(params));
    },
    // 赠送会员
    putGiveVip:function (params) {
        return axios.put(apis + 'admins/vips/giveVip', qs.stringify(params));
    },
    // 修改会员
    putVip: function (params) {
        return axios.put(apis + 'admins/vips', qs.stringify(params));
    },

    // 用户详情
    detailUsers: function (id) {
        return axios.get(apis + `users/${id}`)
    },
    // 用户轨迹
    detailUsersTable: function (id, param) {
        return axios.get(apis + `users/${id}/items` + this.getParams(param))
    },
    // 浏览轨迹
    getFootprint: function (param) {
        return axios.get(apis + `users/footprint` + this.getParams(param))
    },
    // 消费轨迹
    getFootprintActusers: function (id, param) {
        return axios.get(apis + `users/${id}/orders` + this.getParams(param))
    },


    // 获取一级员工
    getStaff: function (param) {
        return axios.get(apis + 'accounts/staffs' + this.getParams(param))
    },



    // 车队接口

    // 车队列表
    getfleetList: function (param) {
        return axios.get(apis + `carteam` + this.getParams(param))
    },
    // 新增车队
    addfleetList: function (param) {
        return axios.post(apis + `carteam` + this.getParams(param))
    },
    // 删除车队
    deletefleetList: function (id) {
        return axios.delete(apis + `carteam/${id}`)
    },
    // 车队详情
    detailsfleet: function (id) {
        return axios.get(apis + `carteam/${id}`)
    },
    // 车队修改
    editfleet: function (param) {
        return axios.put(apis + `carteam` + this.getParams(param))
    },
    // 获取父子版本
    getversionList: function (param) {
        return axios.get(apis + `carteam/version`)
    },
    // 添加父子版本
    addversionList: function (id, param) {
        return axios.post(apis + `carteam/${id}/detailversion` + this.getParams(param))
    },
    // 删除车队线路
    deletecarTeamLines: function (id) {
        return axios.delete(apis + `carteam/carline/${id}`)
    },
    // 新增车队线路
    addcarTeamLines: function (id, param) {
        return axios.post(apis + `carteam/${id}/carline` + this.getParams(param))
    },
    // 详情里的成员信息
    getVehicleData: function (id, param) {
        return axios.get(apis + `carteam/${id}/items` + this.getParams(param))
    },
    // 备忘录列表
    getcarCommentsList: function (id, param) {
        return axios.get(apis + `carteam/${id}/comments` + this.getParams(param))
    },

    // 新增备忘录
    addcarCommentsList: function (id, param) {
        return axios.post(apis + `carteam/${id}/comments` + this.getParams(param))
    },


    // 获得城市省联动
    getFirstLevelCity: function (param) {
        return axios.get(apis + 'citys' + this.getParams(param));
    },
    // 获得城市市联动
    getSecondLevelCity: function (param) {
        return axios.get(apis + 'citys/' + param.cityId + this.getParams(param));
    },
    // 编辑用户
    editUsers: function (param) {
        return axios.post(apis + 'users/' + this.getParams(param))
    },
    // 新增用户
    addUsers: function (param) {
        return axios.post(apis + 'users/' + this.getParams(param))
    },






    // 获取资料列表
    getDocumentslist: function (params) {
        return axios.get(apis + 'documents/list' + this.getParams(params));
    },
    // 删除资料
    deleteDocuments: function (id) {
        return axios.delete(apis + `documents/${id}`);
    },
    // 单独资料
    getDocumentsid: function (id) {
        return axios.get(apis + `documents/${id}`);
    },
    // 资料上传
    postDocuments: function (params) {
        return axios.post(apis + 'documents' + this.getParams(params));
    },

    // 获取评论接口
    getComments:function(param){
        return axios.get(apis + 'admin/comments'+ this.getParams(param));
    },
    /*  删除评论 */
    delComments:function(params){
        return axios.delete(apis + 'admin/comments'+ this.getParams(params));
    },
    // 获取评论接口
    postComments:function(param){
        return axios.post(apis + 'admin/comments', qs.stringify(param));
    },


    getCompaniesAll: function (param) {
        return axios.get(apis + 'companies/all' + this.getParams(param))
    },

    // 删除公司
    deleteCompanies: function (data, param) {
        return axios.delete(apis + `companies/${data}`)
    },

    // 关注
    collectFlase: function (param) {
        return axios.post(apis + `/companyCollects/` + this.getParams(param))
    },
    // 关注公司列表
    myConcernList: function (param) {
        return axios.get(apis + `companies/` + this.getParams(param))
    },
    // 取消关注公司
    collectTrue: function (param) {
        return axios.delete(apis + `/companyCollects/` + this.getParams(param))
    },

    // 获取一级行业
    getindustryOptions: function (param) {
        return axios.get(apis + `companies/fields` + this.getParams(param))
    },

    // 新增公司
    addCompanies: function (param) {
        return axios.post(apis + 'companies/', qs.stringify(param))
    },

    // 修改公司
    editCompanies: function (param) {
        return axios.put(apis + 'companies/', qs.stringify(param))
    },

    // 分页查询公司下的子项
    getCompanyItem: function (id, param) {
        return axios.get(apis +`companies/${id}/items` + this.getParams(param))
    },

    // 插入接口
    insertCompanyItem: function (id, param) {
        return axios.put(apis + `companies/${id}/items` + this.getParams(param))
    },

    // 获取公司日志详情
    getCompaniesFieldlogs: function (id, param) {
        return axios.get(apis + `companies/${id}/fieldlogs` + this.getParams(param))
    },

    // 公司详情
    detailsCompanies: function (adminId) {
        return axios.get(apis + `companies/${adminId}`)
    },

    // 工作管理列表
    getWorkList: function (param) {
        return axios.get(apis + 'jobs' + this.getParams(param))
    },
    // 查询用户姓名
    serceUserName: function (param) { //  添加文章分类
        return axios.get(apis + 'groups/1/jobusers/' + this.getParams(param))
    },
    // 新增工作
    addWork: function (param) {
        return axios.post(apis + 'jobs', qs.stringify(param))
    },
    // 编辑工作
    editWork: function (param) {
        return axios.put(apis + 'jobs', qs.stringify(param))
    },
    // 删除工作
    getWorkDelete: function (id) {
        return axios.delete(apis + `jobs/${id}`)
    },

    // 工作详情
    detailsWork: function (id) {
        return axios.get(apis + `jobs/${id}`)
    },

    // 修改商机
    informationEdit: function (param) {
        return axios.put(apis + `infos/` + this.getParams(param))
    },
    // 删除情报
    informationDelete: function (id) {
        return axios.delete(apis + `infos/${id}`)
    },
    // 发表评论
    commentClick: function (id, param) {
        return axios.post(apis + `infos/${id}/comments`, qs.stringify(param))
    },
    // 获取评论
    getcomments: function (id, param) {
        return axios.get(apis + `infos/${id}/comments/` + this.getParams(param))
    },
    // 工作普通用户列表所有
    getWorkListAll: function (param) {
        return axios.get(apis + 'jobs/all' + this.getParams(param))
    },

    // 工作统计
    getWorkStatistics: function (param) {
        return axios.get(apis + `jobs/statistics` + this.getParams(param))
    },

    // 情报列表
    informationList: function (param) {
        return axios.get(apis + 'infos/' + this.getParams(param))
    },
    // 情报列表-全部
    informationListAll: function (param) {
        return axios.get(apis + `infos/all` + this.getParams(param))
    },
    // 情报详情
    informationDetails: function (id) {
        return axios.get(apis + `infos/${id}`)
    },

    // 获取日历分页
    getCalendars: function(param) {
        return axios.get(apis + `calendars/my` + this.getParams(param))
    },
    //删除日历
    deleteCalendars: function(id) {
        return axios.delete(apis + `calendars/${id}`)
    },
    // 新增日历
    addCalendars: function(param) {
        return axios.post(apis + `calendars`, qs.stringify(param))
    },
    // 获取日历详情
    getCalendarEditList: function(id) {
        return axios.get(apis + `calendars/${id}`)
    },
    // 修改日历
    putCalendars: function(param) {
        return axios.put(apis + `calendars`, qs.stringify(param))
    },

    // 获取地图
    getCompaniesMaps: function (params) {
        return axios.get(apis + 'companies/maps' + this.getParams(params))
    },

    // 获取总体数据接口
    getStatisticsIndex: function (params) {
        return axios.get(apis + 'statistics/index' + this.getParams(params))
    },
    // 获取公司 用户活跃度
    getStatisticsActives: function (params) {
        return axios.get(apis + 'statistics/actives' + this.getParams(params))
    },
    // 获取公司 用户活跃度
    getStatisticsStaffhiretime: function (params) {
        return axios.get(apis + 'accounts/staffhiretime' + this.getParams(params))
    },
    // 获取工作排名图表
    getTatisticsJob: function (params) {
        return axios.get(apis + 'tatistics/job' + this.getParams(params))
    },
    // 获取公司分配图标
    getCompaniesStatistics: function (params) {
        return axios.get(apis + 'companies/statistics' + this.getParams(params))
    },

    // 分配列表
    getDistribution: function (param) {
        return axios.get(apis + `companies/my` + this.getParams(param))
    },

    // 合同列表
    getContractsList: function(param) {
        return axios.get(apis + `contracts` + this.getParams(param))
    },
    // 全部合同列表
    getAllContractsList: function(param) {
        return axios.get(apis + `contracts/all` + this.getParams(param))
    },
    // 新增合同
    addContracts: function(param) {
        return axios.post(apis + `contracts`, qs.stringify(param))
    },
    // 获取多传合同
    getContractsFiles: function(id) {
        return axios.get(apis + `contracts/${id}/files`)
    },
    // 新增合同 多传
    contractsFiles: function(param) {
        return axios.post(apis + `contracts/files` + this.getParams(param))
    },
    // 删除 合同
    deleteContractsFiles: function(id) {
        return axios.delete(apis + `contracts/files/${id}`)
    },
    // 合同详情
    detailsContracts: function(id) {
        return axios.get(apis + `contracts/${id}`)
    },
    // 修改合同
    editContractsStaff: function(param) {
        return axios.put(apis + `contracts/staff`, qs.stringify(param))
    },
    // 设置回款时间
    editPutContractsAudit: function(param) {
        return axios.put(apis + `contracts/auditBillTime`, qs.stringify(param))
    },
    // 开票金额跟已收金额增加累计信息的回显
    detailsContractsLogs: function(id) {
        return axios.get(apis + `contracts/${id}/logs`)
    },
    // 修改审核合同
    editContractsAudit: function(param) {
        return axios.put(apis + `contracts/audit`, qs.stringify(param))
    },
    // 删除草拟合同
    deleteContracts: function(id) {
        return axios.delete(apis + `contracts/${id}`)
    },
    // 变动记录列表查询接口
    getContractsLogs: function(param) {
        return axios.get(apis + `contracts/logs` + this.getParams(param))
    },

    // 变动记录删除接口
    deleteContractsLogs: function (id) {
        return axios.delete(apis + `contracts/logs/${id}`)
    },
    // 获取业务员
    getAllStaffCount: function(param) {
        return axios.get(apis + `accounts/staffs` + this.getParams(param))
    },
    // 获取业务员
    contractsCount: function(param) {
        return axios.get(apis + `contracts/count` + this.getParams(param))
    },


    // 工作分析列表接口
    workStatistics: function (param) {
        return axios.get(apis+ `tatistics/job` + this.getParams(param))
    },

    // 答题统计列表接口
    getQuizesStatistics: function(param) {
        return axios.get(apis + `quizes/statistics` + this.getParams(param))
    },

    // 内容统计列表接口
    getArticlesQualifiedStatistice: function(param) {
        return axios.get(apis + `articles/qualifiedStatistics` + this.getParams(param))
    },
    // 内容统计列表详情接口
    getArticlesQualifiedStatisticeCreateUserId: function(param) {
        return axios.get(apis + `articles` + this.getParams(param))
    },
    // 内容统计金额数量接口
    getContractsAllCount: function(param) {
        return axios.get(apis + `contracts/allCount` + this.getParams(param))
    },
    // 内容统计柱状图接口
    getContractsStatistics: function (param) {
        return axios.get(apis + `contracts/statistics` + this.getParams(param))
    },


    // 用户分析接口
    getTatisticsuser: function (params) {
        return axios.get(apis + 'tatistics/user' + this.getParams(params));
    },

    // 内容分析接口
    getTatisticscontent: function (params) {
        return axios.get(apis + 'statistics/content' + this.getParams(params));
    },

    // 流量分析接口
    getTatisticsflow: function (params) {
        return axios.get(apis + 'tatistics/flow' + this.getParams(params));
    },


    // 合同统计列表接口
    getContractsAllStaffCount: function(param) {
        return axios.get(apis + `contracts/allStaffCount` + this.getParams(param))
    },


    // 获取微站管理-基本设置
    getBrandsHome: function (params) {
        return axios.get(apis + 'brands/home' + this.getParams(params))
    },
    /* 编辑首页管理 */
    postBrandsHome: function (params) {
        return axios.put(apis + 'brands/home', qs.stringify(params))
    },
    // 获取关联活动
    getRelatedActivities: function(params) {
        return axios.get(apis + 'activities/' + this.getParams(params))
    },
    // 获取资料列表
    getDocumentList: function (params) {
        return axios.get(apis + 'brands/document/contact' + this.getParams(params))
    },
    // 删除站点配置-首页列表
    delWebOne: function (params,id) {
        return axios.delete(apis + `brands/web/${id}` + this.getParams(params))
    },
    // 删除焦点图
    delBrandsBanner:function (params,id) {
        return axios.delete(apis + `brands/banner/${id}` + this.getParams(params));
    },
    // 删除内容详情
    delBrandsContent:function (params,id) {
        return axios.delete(apis + `brands/content/${id}` + this.getParams(params));
    },
    // 删除新闻单个详情
    delBrandsNews:function (params,id) {
        return axios.delete(apis + `brands/news/${id}` + this.getParams(params));
    },
    // 删除资料
    delBrandsDocument:function (params,id) {
        return axios.delete(apis + `brands/document/${id}` + this.getParams(params));
    },
    // 删除图片
    delBrandsImg:function (params,id) {
        return axios.delete(apis + `brands/media/${id}` + this.getParams(params));
    },
    // 获取站点配置-首页单个详情
    getWebOne: function (params,id) {
        return axios.get(apis + `brands/web/${id}` + this.getParams(params))
    },
    // 获取单个焦点图
    getBannerOne: function (params,id) {
        return axios.get(apis + `brands/banner/${id}` + this.getParams(params))
    },
    /* 获取单个内容管理 */
    getContentOne: function (params,id) {
        return axios.get(apis + `brands/content/${id}` + this.getParams(params))
    },
    // 获取新闻单个详情
    getNewsOne: function (params,id) {
        return axios.get(apis + `brands/news/${id}` + this.getParams(params))
    },
    // 获取单个资料
    getDocumentOne: function (params,id) {
        return axios.get(apis + `brands/document/${id}` + this.getParams(params))
    },
    // 获取单个图片
    getBrandsOne: function (params,id) {
        return axios.get(apis + `brands/media/${id}` + this.getParams(params))
    },
    // 获取微站管理-首页设置
    getBrandsWeb: function (params) {
        return axios.get(apis + 'brands/web' + this.getParams(params))
    },
    // 获取微站管理-获取焦点图
    getBrandsBanner: function (params) {
        return axios.get(apis + 'brands/banner' + this.getParams(params))
    },
    // 获取微站管理-内容管理
    getBrandsContent: function (params) {
        return axios.get(apis + 'brands/content' + this.getParams(params))
    },

    /* 获取微站管理-新闻列表 */
    getBrandsNews: function (params) {
        return axios.get(apis + 'brands/news' + this.getParams(params))
    },

    // 获取微站管理-资料列表
    getBrandsDocument: function (params) {
        return axios.get(apis + 'brands/document' + this.getParams(params))
    },
    // 获取微站管理-图片列表
    getBrandsImg: function (params) {
        return axios.get(apis + 'brands/media' + this.getParams(params))
    },
    // 编辑站点配置
    putBrandsWeb: function (params) {
        return axios.put(apis + 'brands/web', qs.stringify(params))
    },
    // 编辑焦点图
    putBrandsBanner: function (params) {
        return axios.put(apis + 'brands/banner', qs.stringify(params))
    },
    // 编辑内容管理
    putBrandsContent: function (params) {
        return axios.put(apis + 'brands/content', qs.stringify(params))
    },
    // 编辑新闻内容
    putBrandsNews: function (params) {
        return axios.put(apis + 'brands/news',qs.stringify(params))
    },
    // 编辑资料
    putBrandsDocument: function (params) {
        return axios.put(apis + 'brands/document',qs.stringify(params))
    },
    // 编辑图片
    putBrandsImg: function (params) {
        return axios.put(apis + 'brands/media',qs.stringify(params))
    },




    // 个人中心消息
    getInformation:function(params){
        return axios.get(apis + 'admin/innerletter' + this.getParams(params));
    },
    // 个人中心消息已读
    postInformation:function(params){
        return axios.post(apis + 'innerletter',qs.stringify(params));
    },
    // 设置消息为已读
    readLetter: function(params){
        return axios.post(apis + 'admin/innerletter',qs.stringify(params))
    },



    getParams: function (param) {
        let url = ''
        for (let key in param) {
            if (param[key] !== null) {
                url ? url += '&' + key + '=' + param[key] : url += key + '=' + param[key]
            }
        }
        return url ? '?' + url : ''
    }

}
export default {loginService}

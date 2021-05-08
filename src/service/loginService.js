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
    // 上传头像
    getPolicy: function (params) {
        return axios.get(apis + `oss/policy`)
    },
    // 账号设置
    postAdminInfo: function (params) {
        return axios.put(apis + 'admins/' + this.getParams(params))
    },
    // 修改密码
    postPassword: function (params) {
        return axios.put(apis + 'admins/password' + this.getParams(params))
    },
    /* 管理员信息 */
    getAdminInfo: function () {
        return axios.get(apis + 'admins')
    },

    // 获取认证二维码
    getWechaturl: function () {
        return axios.get(apis + 'admins/wechaturl')
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
    // 获取全部文章列表
    getList: function (param) {
        return axios.get(apis + 'articles' + this.getParams(param))
    },
    // 获得申请列表
    getVarifysList: function (param) {
        return axios.get(apis + 'varifys' + this.getParams(param))
    },

    // 获取全部活动列表
    getActivities: function (param) { // 活动列表
        return axios.get(apis + 'activities' + this.getParams(param))
    },


    // 获取文章评审list
    // 文章评审列表
    getArticlesList: function(param) {
        return axios.get(apis + `/articles` + this.getParams(param))
    },

    //合格or不合格
    articlesQualified: function(id, param) {
        return axios.put(apis + `/articles/${id}/qualified` + this.getParams(param))
    },



    // 车队接口

    // 车队列表
    getfleetList: function (param) {
        return axios.get(apis + `/carteam` + this.getParams(param))
    },





    // 获取资料列表
    getDocumentslist: function (params) {
        return axios.get(apis + 'documents/list' + this.getParams(params));
    },

    // 获取评论接口
    getComments:function(param){
        return axios.get(apis + 'admin/comments'+ this.getParams(param));
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
    // 取消关注公司
    collectTrue: function (param) {
        return axios.delete(apis + `/companyCollects/` + this.getParams(param))
    },

    // 获取一级行业
    getindustryOptions: function (param) {
        return axios.get(apis + `companies/fields` + this.getParams(param))
    },


    // 工作普通用户列表所有
    getWorkListAll: function (param) {
        return axios.get(apis + 'jobs/all' + this.getParams(param))
    },

    // 工作统计
    getWorkStatistics: function (param) {
        return axios.get(apis + `jobs/statistics` + this.getParams(param))
    },


    // 情报列表-全部
    informationListAll: function (param) {
        return axios.get(apis + `infos/all` + this.getParams(param))
    },



    // 合同列表
    getContractsList: function(param) {
        return axios.get(apis + `contracts` + this.getParams(param))
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

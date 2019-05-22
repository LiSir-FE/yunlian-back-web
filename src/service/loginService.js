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

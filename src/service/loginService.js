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
    getSms: function(params) {
        return axios.get(apis + 'sms' + this.getParams(params));
    },
    //修改密码
    putAccountspassword: function(params) {
        return axios.put(apis + '/accounts/password', qs.stringify(params));
    },
    // 获取个人信息
    getAdmin: function (params) {
        return axios.get(apis + 'admins' + this.getParams(params))
    },
    // 上传头像
    getPolicy: function (params) {
        return axios.get(apis + `/oss/policy`)
    },
    // 账号设置
    postAdminInfo: function (params) {
        return axios.put(apis + '/admins/'+ this.getParams(params));
    },
    // 修改密码
    postPassword: function (params) {
        return axios.put(apis + '/admins/password'+ this.getParams(params));
    },
    /* 管理员信息 */
    getAdminInfo: function () {
        return axios.get(apis + '/admins');
    },
    
    
    // 获取角色列表
    getRoles: function (params) {
        return axios.get(apis + '/roles' + this.getParams(params));
    },
    
    // 获取权限树
    getPermissions: function (params) {
        return axios.get(apis + '/permissions/tree' + this.getParams(params));
    },
    // 获取单个角色信息
    getRolesid: function (id) {
        return axios.get(apis + '/roles/' + id);
    },
    // 新建角色
    postRoles: function (params) {
        return axios.post(apis + '/roles' + this.getParams(params));
    },
    // 删除角色
    deleteRoles: function (params) {
        return axios.delete(apis + '/roles' + this.getParams(params));
    },
    /*  个人中心设置退出 接口 */
    myExit: function () {
        return axios.delete(apis + 'tokens')
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

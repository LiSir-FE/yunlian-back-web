// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/base.css'
import '@/assets/style/rules.scss'
import QRCode from 'qrcodejs2'
import axios from 'axios'
import store from './store'
import router from './router'
import App from './App'
import Watermark from './watermark';
import echarts from 'echarts'
import moment from "moment";
import de from "element-ui/src/locale/lang/de";
Vue.use(ElementUI)
Vue.use(Vuex);

// 注册上面引入的各大模块
let win = typeof window
let isClient = false
if (win && win != 'undefined') {
    isClient = true
}
Vue.prototype.$echarts = echarts;
Vue.prototype.$moment = moment;//赋值使用
// ajax
Vue.prototype.$http = axios.create({
    timeout: 60000
})
Vue.prototype.$ajax = axios
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前加toke
    let xtoken = isClient ? localStorage.token : null
    if (xtoken != null) {
        config.headers['Authorization'] = 'bearer ' + xtoken
    }
    return config
}, function (error) {
    // 请求错误
    return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 响应数据基本判断
    // 对token过期的跳转登录页面
    if (response && response.data.code == 510100 && !(response.config.url.indexOf('/apis/admins') > 0)) {
        if (isClient) {
            localStorage.clear()
            // localStorage.redirectUrl = location.href
            // location.href = location.origin
        }
    }
    return response
}, function (err) {
    if (!isClient) return
    // 对响应错误做点什么
    if (err && err.response) {
        switch (err.response.status) {
            case 400:
                err.message = '请求错误(400)'
                break
            case 401:
                err.message = '未授权，请重新登录(401)'
                break
            case 403:
                err.message = '拒绝访问(403)'
                break
            case 404:
                err.message = '请求出错(404)'
                break
            case 408:
                err.message = '请求超时(408)'
                break
            case 500:
                err.message = '服务器错误(500)'
                break
            case 501:
                err.message = '服务未实现(501)'
                break
            case 502:
                err.message = '网络错误(502)'
                break
            case 503:
                err.message = '服务不可用(503)'
                break
            case 504:
                err.message = '网络超时(504)'
                break
            case 505:
                err.message = 'HTTP版本不受支持(505)'
                break
            default:
                err.message = `连接出错(${err.response.status})!`
        }

    } else {
        if (!isClient) return
        err.message = '连接服务器失败!'
    }
    return Promise.reject(err)
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App),
    components: {App},
    created() {
        Watermark.set('物流嘉年华');
    },
    template: '<App/>'
})

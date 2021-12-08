import Vue from 'vue'

Vue.filter('stampFormate', function (id) {
    let date = new Date(id * 1)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
    let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D
})

Vue.filter('stampFormate2', function (id) {
    let date = new Date(id * 1)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
    let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':'
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()

    return Y + M + D + h + m + s
})

Vue.filter('stampFormate4', function (id) {
    let date = new Date(id * 1)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
    let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
    let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ' ' : date.getMinutes()

    return Y + M + D + h + m
})

Vue.filter('moneyFormate',function(v) {
    let l = 2
    if((v/100+'').indexOf('.')>-1){
        l = (v/100+'').split('.')[1].length
    }else{
        l=0
    }
    return ((v / 100).toFixed(l) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');;
})

Vue.filter('typeFormate',function(value) {
    let result =''
    switch (value*1) {
        case 1:
            result = '文章';break;
        case 2:
            result = '活动';break;
        case 3:
            result = '知识';break;
        case 5:
            result = 'VIP';break;
        case 6:
            result = '直播';break;
        case 7:
            result = '商品';break;
        case 8:
            result = '版本';break;
        case 9:
            result = '充值';break;
        case 10:
            result = '短信包';break;
        case 11:
            result = '提现';break;
    }
    return result
})

Vue.filter('resultPage',function(val) {
    if (val > 0 && val < 60) {
        return val + '秒'
    } else if(val > 60 && val <= 3599) {
        return parseInt(val / 60) + '分' + (parseInt(val % 60) == '0' ? '' : parseInt(val % 60) + '秒')
    } else if(val >= 3600) {
        return parseInt(val / 3600) + '小时' + (parseInt(val % 3600 / 60) == '0' ? '' : parseInt(val % 3600 / 60) + '分') + (parseInt(val % 60) == '0' ? '' : parseInt(val % 60) + '秒')
    }
})

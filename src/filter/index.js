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

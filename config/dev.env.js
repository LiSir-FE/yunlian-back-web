'use strict'
// const merge = require('webpack-merge')
// const prodEnv = require('./prod.env')
//
// module.exports = merge(prodEnv, {
//     NODE_ENV: '"development"',
//     API_ROOT: '"/apis/"',
//     IMG_URL: '"/picHead/"',
//     PC_URL: '"/frontEndDomainName/"'
// })


const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
    NODE_ENV: '"testing"',
    API_ROOT: '"/apis/"',
    IMG_URL: '"/picHead/"',
    PC_URL: '"/frontEndDomainName/"'
})

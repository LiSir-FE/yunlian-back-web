import Vue from 'vue';
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        articlesNmae: '', // 全部文章 左侧 导航名字
        reviewComments: sessionStorage.getItem('reviewComments') || undefined, // 审核意见
        addCompanyUrl: sessionStorage.getItem('addCompanyUrl') || '', // 新增公司返回上次路由地址
        addCompanyName: sessionStorage.getItem('addCompanyName') || '', // 新增公司返回上次路由名字
    },
    mutations: {
        setArticlesNmae(state, articlesNmae) { // 设置全部文章 左侧 导航名字 or 文章列表
            state.articlesNmae = articlesNmae
        },
        setReviewComments(state, reviewComments) { // 设置全部文章 左侧 导航名字 or 文章列表
            sessionStorage.setItem('reviewComments', reviewComments)
            state.reviewComments = reviewComments
        },
        setAddCompanyUrl(state, addCompanyUrl) {
            sessionStorage.setItem('addCompanyUrl', addCompanyUrl)
            state.addCompanyUrl = addCompanyUrl
        },
        setAddCompanyName(state, addCompanyName) {
            sessionStorage.setItem('addCompanyName', addCompanyName)
            state.addCompanyName = addCompanyName
        }
    },
    getters: {
        // 获取全部文章 左侧 导航名字 or 文章列表
        getArticlesNmae:state => state.articlesNmae,
        getReviewComments:state => sessionStorage.getItem('reviewComments') || state.reviewComments,
        getAddCpmpanyUrl:state => sessionStorage.getItem('addCompanyUrl') || state.addCompanyUrl,
        getAddCpmpanyName:state => sessionStorage.getItem('addCompanyName') || state.addCompanyName
    }
});

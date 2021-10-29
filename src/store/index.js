import Vue from 'vue';
import Vuex from "vuex";
Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        articlesNmae: '', // 全部文章 左侧 导航名字
    },
    mutations: {
        setArticlesNmae(state, articlesNmae) { // 设置全部文章 左侧 导航名字 or 文章列表
            state.articlesNmae = articlesNmae
        }
    },
    getters: {
        // 获取全部文章 左侧 导航名字 or 文章列表
        getArticlesNmae:state => state.articlesNmae
    }
});

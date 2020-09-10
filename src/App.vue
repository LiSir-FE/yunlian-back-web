<template>
    <div id="app">
        <keep-alive>
            <transition name="fade">
                <router-view v-if="$route.meta.keepalive" :style="styleObject"></router-view>
            </transition>
        </keep-alive>


        <transition name="fade" class="asdsad">
            <router-view v-if="!$route.meta.keepalive" :style="styleObject"></router-view>  // 不需要缓存的页面'
        </transition>
    </div>
</template>

<script>
    import vueBg from './assets/img/logo/vueBackGlound.jpg'

    export default {
        data () {
            return {
                styleObject: {
                    background: 'url('+ vueBg +') center center no-repeat',
                    backgroundSize: 'cover'
                }
            }
        }
    }
</script>

<style lang="scss">
    @import './assets/style/rules.scss';
    body {
        margin: 0;
        padding: 0;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
        overflow: scroll;
        overflow-y: hidden;
    }

    #app {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
    }

    .el-submenu [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .el-menu-item [class^=fa] {
        vertical-align: baseline;
        margin-right: 10px;
    }

    .toolbar {
        background: #f2f2f2;
        padding: 10px;
        margin: 10px 0;

        .el-form-item {
            margin-bottom: 10px;
        }

    }

    /*.fade-enter{*/
        /*opacity: 0;*/
    /*}*/
    /*.fade-leave {*/
        /*opacity: 1;*/
    /*}*/
    /*.fade-leave-active {*/
        /*opacity: 0;*/
        /*transition: opacity 1s;*/
    /*}*/
    /*.fade-leave-active {*/
        /*opacity: 0;*/
        /*transition: opacity 1s;*/
    /*}*/
</style>

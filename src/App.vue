<template>
    <div id="app">
        <router-view></router-view>
    </div>

<!--    <div id="app">-->
<!--        <div class="content">-->
<!--            <transition name="move" mode="out-in">-->
<!--                <keep-alive>-->
<!--                    <router-view v-if="$route.meta.keepalive" :style="styleObject"></router-view>-->
<!--                </keep-alive>-->
<!--            </transition>-->
<!--            <transition name="move" mode="out-in">-->
<!--                <keep-alive>-->
<!--                    <router-view v-if="!$route.meta.keepalive" :style="styleObject"></router-view>  // 不需要缓存的页面'-->
<!--                </keep-alive>-->
<!--            </transition>-->
<!--            <el-backtop target=".content"></el-backtop>-->
<!--        </div>-->
<!--    </div>-->
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
        },
        created() {
            window.onload = function () {
                history.pushState(null, null, document.URL);
                window.addEventListener('popstate', function () {
                    history.pushState(null, null, document.URL)
                });
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

    .content{
        width: auto;
        height: 100%;
        padding: 10px;
        overflow-y: scroll;
        box-sizing: border-box;
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
</style>

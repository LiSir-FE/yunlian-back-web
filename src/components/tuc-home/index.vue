<template>
    <el-row class="container">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
<!--        <div class="nav-footer">版权所有: 李亮个人</div>-->
    </el-row>


</template>

<script>
import vHead from '../tuc-header/index.vue'
import vSidebar from '../tuc-sidebar/index.vue'
import vTags from '../tuc-tags/index.vue'
import {common} from '../../assets/js/common/common'
import bus from '../../common/bus.js'
export default {
    data () {
        return {
            collapse: false,
            tagsList: [],
            adminList: [],
        }
    },
    components: {
        vTags,
        vHead,
        vSidebar
    },
    created() {
        bus.$on('collapse-content', msg => {
            this.collapse = msg;
        });

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    },
    methods: {
        admin (value) {
            let that = this
            if (that.adminList.indexOf(value) > -1) {
                that.$router.options.routes.forEach(item => {
                    if (item.roles) {
                        if (item.roles === value) {
                            item.hidden = false
                        }
                    }
                    if (item.children) {
                        item.children.forEach(items => {
                            if (items.roles === value) {
                                items.hidden = false
                            }
                        })
                    }
                })
            }
        }
    },
    mounted () {
        let that = this
        let r = that.$route.name
        let token = window.localStorage.getItem('token')
        if (token == null) {
            that.$router.replace({name: 'login'})
        } else {
            let JWT = token.split('.')
            let info = JWT[1]
            let tokenData = common.packageUserInfo(info)
            that.adminList = tokenData.permissions
            window.localStorage.setItem('jurisdiction', JSON.stringify(that.adminList))
        }
        let adminListArr = []
        that.$router.options.routes.forEach(item => {
            if (item.children) {
                item.children.forEach(items => {
                    if (items.roles) {
                        adminListArr.push(item.roles, items.roles)
                    }
                })
            }
        })
        adminListArr.forEach(item => {
            that.admin(item)
        })
    }
}
</script>

<style scoped lang="scss">
.el-tab-pane .todo-box-div-check{
    display: inline-block;
    padding: 10px 20px 10px 10px;
    background: #ebebeb;
    border-radius: 4px;
    margin: 10px 0;
    /*color: #fff;*/
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}

.todo-box-div-check i {
    cursor: pointer;
}


.el-tab-pane .todo-box-div{
    width: 100%;
    display: inline-block;
}

.el-checkbox__input.is-checked+.el-checkbox__label{
    color: #fff !important;
}
.myChart{
    width: 33%;
    height: 300px;
    float: left;
}
.transition-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px;
}
.container {
    position: absolute;
    background: #fff;
    /*background-color: rgba(0,0,0,0.5);*/
    background:rgba(255, 255, 255, 0.85);
    filter:alpha(Opacity=85);
    -moz-opacity:0.85;
    //opacity: 0.85;
    top: 0;
    bottom: 0;
    width: 100%;
    .main {
        display: flex;
        position: absolute;
        top: 60px;
        bottom: 0;
        overflow: hidden;

        aside {
            flex: 0 0 230px;
            width: 230px;

            .el-menu {
                height: 100%;
                background-color: #f1f2f3;
            }

            .collapse {
                width: 100%;

                .item {
                    position: relative;
                }

                .submenu {
                    position: absolute;
                    top: 0;
                    left: 60px;
                    z-index: 99999;
                    height: auto;
                    display: none;
                }
            }
        }

        .menu-collapse {
            flex: 0 0 60px;
            width: 60px;
        }

        .menu-expanded {
            flex: 0 0 180px;
            width: 180px;
            background-color: #f1f2f3;
        }

        .content-container {
            flex: 1;
            overflow-y: scroll;
            padding: 20px;

            .breadcrumb-container {
                .title {
                    width: 200px;
                    float: left;
                    color: #475669;
                }

                .breadcrumb-inner {
                    float: left;
                    cursor: pointer;
                }
            }

            .content-wrapper {
                box-sizing: border-box;
            }
        }
    }
}

</style>

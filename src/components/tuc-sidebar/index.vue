<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" text-color="#000" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in routersList">
                <template v-if="item.children && item.index >= 1">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.iconCls"></i>
                            <span slot="title">{{item.name}}</span>
                        </template>
                        <template v-for="child in item.children">
                            <el-menu-item v-if="!child.hidden" :index="child.path" :key="child.path">
                                <template slot="title">{{child.name}}</template>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../../common/bus'

export default {
    data() {
        return {
            collapse: false,
            adminList: [],
            routersList: this.$router.options.routes
        }
    },
    computed: {
        onRoutes() {
            return this.$route.path;
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
    },
    methods: {

    },
    mounted() {

    }
}
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 61px;
        bottom: 0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar {
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 160px;
        background-color: rgba(255, 255, 255, .5);
    }
    .sidebar > ul {
        height: 100%;
        background-color: rgba(255, 255, 255, .5) !important;
    }
    .el-submenu .el-menu{
        background-color: rgba(255, 255, 255, .5) !important;
    }
    .el-menu{
        background-color: rgba(255, 255, 255, .5) !important;
    }
</style>

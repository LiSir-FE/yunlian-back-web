<template>
    <div class="tuc-data-display">
        <el-row :span="24">
            <el-col v-for="(item,index) in data" :key="index" :span="span">
                <div class="item" :style="{color:color}">
                    <h5 class="count">
                        <tuc-count-up :start="14" :end="item.count"/>
                    </h5>
                    <span class="splitLine"/>
                    <p class="title">{{item.title}}</p>
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    import tucCountUp from '../../components/tuc-count-up/index.vue'

    export default {
        name: 'tuc-data-display',
        components: {
            tucCountUp
        },
        data () {
            return {
                span: this.option.span || 8,
                data: this.option.data,
                color: this.option.color || 'rgb(63, 161, 255)'
            }
        },
        props: {
            option: {
                type: Object,
                default: () => {
                }
            }
        },
        created () {
        },
        methods: {}
    }
</script>
<style scoped lang="scss">


    .tuc-data-display {
        .item {
            display: flex;
            align-items: center;
            flex-direction: column;
            margin: 5px 0;
            text-align: center;
        }

        .count {
            margin: 8px 0;
            font-weight: bold;
            font-size: 32px;
            color: #15A0FF;
        }

        .title {
            color: #999;
        }

        .splitLine {
            display: block;
            margin: 0 auto;
            width: 24px;
            height: 1px;
            background: #9B9B9B;
        }
    }

</style>

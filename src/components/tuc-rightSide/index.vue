<template>
    <div>
        <!--添加备注 v-model=""-->
        <div class="rightSideMode" @click="closeRightSide"></div>
        <div class="rightSide">
            <p class="rightSideTit" @click="closeRightSide"><i class="iconfont icon-jiantou"></i>备注</p>
            <div class="rightScrollBar">
                <el-collapse v-model="activeNames">
                    <el-collapse-item title="活动报名信息(用户端显示)" class="flexItem" name="1">
                        <div class="rightSideItem" v-for="(val, key) in remarkData.applyInfo" :key="key"><span
                            class="tit">{{ key }}:</span><span class="cont">{{ val }}</span></div>
                    </el-collapse-item>
                    <el-collapse-item title="票信息" class="flexItem" name="2">
                        <div class="rightSideItem"><span class="tit">票号：</span><span
                            class="cont">{{ remarkData.ticketNo }}</span></div>
                        <div class="rightSideItem"><span class="tit">票券类型：</span><span
                            class="cont">{{ remarkData.ticket.name }}</span></div>
                        <div class="rightSideItem"><span class="tit">单价：</span><span
                            class="cont">￥{{ remarkData.ticket.price | moneyFormate }}</span></div>
                        <div class="rightSideItem">
                            <span class="tit">票状态：</span>
                            <span v-if="remarkData.ticket.status == 1" class="cont">未签到</span>
                            <span v-if="remarkData.ticket.status == 2" class="cont">已签到</span>
                        </div>
                        <div class="rightSideItem"><span class="tit">签到员：</span><span
                            class="cont">{{ remarkData.checkNickname }}</span></div>
                        <div class="rightSideItem"><span class="tit">发送类型：</span>
                            <span v-if="!remarkData.notice" class="cont">未发送</span>
                            <span v-if="remarkData.notice" class="cont">已发送</span>
                        </div>
                    </el-collapse-item>
                    <el-collapse-item name="3">
                        <template slot="title">
                            备注信息(仅后台显示)
                            <el-button class="collapseBtn" type="primary" size="mini" icon="el-icon-edit"
                                       v-if="!remarkEdit" @click="editRemarkStatus">编 辑
                            </el-button>
                            <el-button class="collapseBtn" type="primary" size="mini" icon="el-icon-edit" v-if="remarkEdit"
                                       @click="saveRemarkStatus">保存
                            </el-button>
                        </template>
                        <!--只是显示内容-->
                        <div v-if="!remarkEdit" class="flexItem">
                            <div v-if="remarkData.adminInfo==null" class="el-collapse-item__content">
                                <div v-for="(item, index) in remarkData.adminInfoEdit" :key="index"
                                     class="rightSideItem">{{ item.key }}
                                </div>
                            </div>
                            <div v-else class="el-collapse-item__content">
                                <div v-for="(val, key) in remarkData.adminInfo" :key="key" class="rightSideItem"><span
                                    class="tit">{{ key }}:</span><span class="cont">{{ val }}</span></div>
                            </div>
                        </div>
                        <!--只是编辑内容-->
                        <div v-if="remarkEdit">
                            <div v-for="(item, index) in remarkData.adminInfoEdit" :key="index"
                                 class="rightSideItemForm">
                                <span class="tit">{{ item.key }}</span>：
                                <span class="cont" v-if="item.type=='danh'">
                                  <el-input size="mini" v-model="item.realValue"></el-input>
                              </span>
                                <span class="cont" v-if="item.type=='duoh'">
                                  <el-input type="textarea" :rows="2" v-model="item.realValue"></el-input>
                              </span>
                                <span class="cont" v-if="item.type=='danx'">
                                  <el-radio v-for="(it,idx) in item.value" :key="idx" :label="it"
                                            v-model="radioGroup[index]"></el-radio>
                              </span>
                                <span class="cont" v-if="item.type=='duox'">
                                  <el-checkbox-group v-model="ckGroup[index]">
                                    <el-checkbox v-for="(it,idx) in item.value" :key="idx" :label="it"></el-checkbox>
                                  </el-checkbox-group>
                              </span>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import {loginService} from "../../service/loginService";

export default {
    props: {
        rightSide: {
            type: Object
        },
        id: {
            type: String
        }
    },
    data() {
        return {
            // 备注修改
            committing: true,
            ticketNo: this.rightSide.ticketNo,
            remarkData: {
                ticketNo: '',
                ticket: {
                    name: '',
                    price: ''
                },
                checkNickname: ''
            },
            radioGroup: [], // 单选每一个循环项目的单选值
            ckGroup: [],// 多选每一个循环项目的多选值
            activeNames: ['1', '2', '3'],
            remarkEdit: false, //
        }
    },
    components: {},
    computed: {},
    mounted() {
        let that = this;
        that.getTicketDetail(that.ticketNo);
    },
    methods: {
        handleChange(val) {
        },
        editRemarkStatus(event) {
            this.remarkEdit = true;
            let e = event;
            e.stopPropagation();
        },
        saveRemarkStatus(event) {
            let that = this;
            let e = event;
            e.stopPropagation();
            let arr = that.remarkData.adminInfoEdit;
            let applyInfo = {};
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].type == 'duox') {
                    let tempArr = that.ckGroup[i], newArr = [];
                    for (let i = 0; i < tempArr.length; i++) {
                        if (tempArr[i] != '') {
                            newArr.push(tempArr[i]);
                        }
                    }
                    setTimeout(function () {
                        applyInfo[arr[i].key] = newArr.join(',');
                    }, 10);
                }
                if (arr[i].type == 'danx') {
                    applyInfo[arr[i].key] = that.radioGroup[i].toString();
                } else {
                    applyInfo[arr[i].key] = arr[i].realValue;
                }
            }

            setTimeout(function () {
                //console.log(JSON.stringify(applyInfo),111);
                that.editActPeople(that.remarkData.ticketNo, JSON.stringify(applyInfo));
            }, 1000);
            // 提交方法

        },
        // 编辑备注信息
        editActPeople(ticketNo, applyInfo) {
            let that = this;
            if (that.committing) {
                that.committing = false;
                loginService.editActPeople({ticketNo: ticketNo, applyInfo: applyInfo, actType: 1}).then(function (res) {
                    if (res.data.success) {
                        that.getTicketDetail(ticketNo);
                        that.$message.success('编辑成功');
                        that.committing = true;
                        that.remarkEdit = false;
                    } else {
                        that.$message.error(res.data.message);
                        that.committing = true;
                    }
                }).catch(function (err) {
                    //that.$router.push({name: 'error'});
                    that.committing = true;
                });
            }
        },
        getTicketDetail(ticketNo) {
            let that = this;
            that.radioGroup = [];
            that.ckGroup = [];
            let actId = that.id;
            loginService.getTicketDetail({ticketNo: ticketNo}).then(function (res) {
                if (res.data.success) {
                    let obj = res.data.datas;
                    //that.remarkData = res.data.datas;
                    //that.remarkData.adminInfoEdit = [];
                    obj.adminInfoEdit = [];
                    loginService.getActivityDetail({id: actId}).then(function (res) {
                        if (res.data.success) {
                            let arr = res.data.datas.adminSign;
                            for (let i = 0; i < arr.length; i++) {
                                if (obj.adminInfo == null) {
                                    if (arr[i].type == 'duox') {
                                        arr[i].realValue = "";
                                        that.ckGroup[i] = [""];
                                    } else if (arr[i].type == 'danx') {
                                        that.radioGroup[i] = arr[i].realValue;
                                    } else {
                                        arr[i].realValue = '';
                                    }
                                } else {
                                    if (arr[i].type == 'duox') {
                                        let temAr = obj.adminInfo[arr[i].key];
                                        if (temAr.length >= 1) {
                                            arr[i].realValue = temAr.split(',');
                                            that.ckGroup[i] = arr[i].realValue;
                                        } else {
                                            arr[i].realValue = temAr == "" ? "" : temAr;
                                            that.ckGroup[i] = [""];
                                        }

                                    } else if (arr[i].type == 'danx') {
                                        arr[i].realValue = obj.adminInfo[arr[i].key];
                                        that.radioGroup[i] = arr[i].realValue;
                                    } else {
                                        arr[i].realValue = obj.adminInfo[arr[i].key];
                                    }
                                }
                                obj.adminInfoEdit.push(arr[i]);
                            }
                            setTimeout(function () {
                                that.remarkData = obj;
                            }, 200);
                            //console.log('重组数组',that.remarkData.adminInfoEdit,'radioGroup', that.radioGroup, 'ckGroup', that.ckGroup );
                        } else {
                            that.$message.error(res.data.message);
                        }
                    }).catch(function (err) {
                        //that.$router.push({name: 'error'});
                    });
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                //that.$router.push({name: 'error'});
            });
        },
        closeRightSide() {
            this.remarkEdit = false;
            this.$emit('closeMyself', false);
        },
    }
}
</script>
<style lang="less">
.rightScrollBar {
    position: absolute;
    width: 100%;
    top: 46px;
    right: 0;
    bottom: 0;
    overflow: auto;
}
</style>

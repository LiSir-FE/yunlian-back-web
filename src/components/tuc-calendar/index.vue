<template>
    <div class="page-container">
        <div class="fullCalendar">
            <FullCalendar ref="fullCalendar" :options="calendarOptions" />
        </div>
        <transition name="fade">
            <div class="rightB" v-if="rightFLag">
                <p v-for="item in conTxt" class="rightP" @click="ObjectKeys(item)"> {{ item.title }} </p>
            </div>
        </transition>
        <transition name="fade">
            <div class="bottom" v-if="objectValus">
                <div class="bottomDid">创建人: {{ hostName }}</div>
                <div class="bottomDid">创建时间: {{ createTime | stampFormate }}</div>
                <p style="padding: 5px 0;font-size: 14px;">执行人: <span v-for="item in hostNames" v-if="hostNames.length>=1">{{ item+',' }}</span><span v-if="hostNames.length == 0">全员</span></p>
                <div class="bottomP" v-html="objectValus"> </div>
            </div>
        </transition>
    </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
import {loginService} from '../../service/loginService'

export default {
    components: {
        FullCalendar
    },
    name: 'full-calendar',
    data () {
        return {
            timestamp: new Date().getTime(),
            type: '0',
            color: '#d61518',
            rightFLag: false,
            objectValus: '',
            conTxt: {},
            hostNames: '',
            hostName: '',
            createTime: '',
            calendarOptions: {
                plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin // needed for dateClick
                ],
                initialDate: new Date(),
                isRTL: true,
                locale: "zh-cn",
                aspectRatio: 1.65,
                displayEventTime: true, // 是否显示时间
                allDaySlot: false, // 周，日视图时，all-day 不显示
                headerToolbar: {
                    // 日历头部按钮位置
                    left: "myWholeButton, myWeChatButton, myActivityButton, myInsideButton",
                    center: "",
                    right: "prev title next",
                },
                eventStartEditable: false,

                customButtons: {  //给按钮添加事件
                    myWholeButton: {
                        text: '全部',
                        click: this.myWholeButtonClick
                    },
                    myWeChatButton: {
                        text: '内容',
                        click: this.myWeChatButtonClick
                    },
                    myActivityButton: {
                        text: '活动',
                        click: this.myActivityButtonClick
                    },
                    myInsideButton: {
                        text: '内部', click: this.myInsideButtonClick
                    },
                    prev: {
                        text: "PREV",
                        click: this.handlePreBtnClick,
                    },
                    next: { // this overrides the next button
                        text: "PREV",
                        click: this.handleNextBtnClick,
                    },

                },
                titleFormat: { // will produce something like "Tuesday, September 18, 2018"
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    // weekday: 'long'
                },
                events: [],
                hour12: false,
                initialView: 'dayGridMonth',
                editable: true,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                weekends: true,
                slotLabelFormat: {
                    hour: "numeric",
                    minute: "2-digit",
                    meridiem: false
                },
                eventClick: this.handleEventClick,
                eventsSet: false,

            },
            info:{
                event:{
                    _def: {
                        extendedProps: {
                            time: ''
                        }
                    }
                }
            },
            datasData: [{
                title: '今天无事项!',
                clickFN: true
            }]
        }
    },
    props: {
        option: {
            type: Object,
            default: () => {
            }
        }
    },
    mounted() {
        this.getCalendarList(this.type, this.timestamp, this.color);
    },

    methods: {
        // 获取当前时间戳并匹配右侧显示
        getTimestamp() {
            let that = this;
            if(that.calendarOptions.events.length > 1) {
                that.calendarOptions.events.forEach(item => {
                    if(that.$moment(Number(new Date().getTime())).format('YYYY-MM-DD') == that.$moment(Number(item.time)).format('YYYY-MM-DD')) {
                        that.info.event._def.extendedProps.time = item.time;
                    }
                });
            } else {
                that.info.event._def.extendedProps.time = Number(new Date().getTime());
            }
            that.handleEventClick(that.info);
        },
        // 获取数据
        getCalendarList(type, timestamp, color) {
            let that = this;
            loginService.getCalendarsChart({
                type: type,
                time: timestamp
            }).then(res => {
                if(res.data.success) {
                    that.calendarOptions.events = [];
                    res.data.datas.forEach(item => {
                        that.calendarOptions.events.push({
                            color: color,
                            time: item.time,
                            start: that.$moment(Number(item.time)).format('YYYY-MM-DD')
                        })
                    })
                    this.getTimestamp();
                }
            }).catch(err => {
                console.log(err);
            })
        },

        handleEventClick(info) {
            this.rightFLag = true;
            this.objectValus = false;
            loginService.getCalendarsDetails({
                time: info.event._def.extendedProps.time ? info.event._def.extendedProps.time : Number(new Date().getTime())
            }).then(res => {
                if(res.data.success) {
                    this.conTxt = res.data.datas.length != '0' ? res.data.datas : this.datasData;
                }
            }).catch(err => {
                console.log(err);
            })
        },
        //下月
        handleNextBtnClick(info){
            let calendarApi = this.$refs.fullCalendar.getApi();   //一旦你有ref，你可以通过getApi方法得到底层的日历对象:
            calendarApi.next();   // 调用next方法
            let test = calendarApi.getCurrentData().viewTitle;
            let testTime = test.substring(test.indexOf('–')+1, test.length)
            let testTimes = new Date(testTime).getTime();
            this.getCalendarList(this.type, testTimes, this.color);
        },
        //上月
        handlePreBtnClick(info){
            let calendarApi = this.$refs.fullCalendar.getApi();
            calendarApi.prev();
            let test = calendarApi.getCurrentData().viewTitle;
            let testTime = test.substring(test.indexOf('–')+1, test.length)
            let testTimes = new Date(testTime).getTime();
            this.getCalendarList(this.type, testTimes, this.color);
        },

        ObjectKeys(item) {
            console.log(item);
            let that = this;
            if(item.clickFN) {
                that.objectValus = false;
            } else {
                loginService.getCalendarEditList(item.id).then(res => {
                    if(res.data.success) {
                        that.$nextTick(() => {
                            that.objectValus = res.data.datas.content;
                            that.hostName = res.data.datas.hostName;
                            that.hostNames = res.data.datas.hostNames;
                            that.createTime = res.data.datas.createTime;
                        })
                    }
                });
            }
        },


        myWholeButtonClick() {
            this.color = '#d61518'
            this.type = '0';
            this.getCalendarList(this.type, this.timestamp, this.color);
        },
        myWeChatButtonClick() {
            this.color = '#0c5ba2'
            this.type = '1';
            this.getCalendarList(this.type, this.timestamp, this.color);
        },
        myActivityButtonClick() {
            this.color = '#0b9043'
            this.type = '2';
            this.getCalendarList(this.type, this.timestamp, this.color);
        },
        myInsideButtonClick() {
            this.color = '#edb218'
            this.type = '3';
            this.getCalendarList(this.type, this.timestamp, this.color);
        },
    }
}
</script>

<style lang="scss">

.el-tabs__content{
    overflow: auto !important;
}
.page-container {
    font-size: 12px;
    text-align: center;
    height: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.fullCalendar{
    width: 50%;
    height: 490px;
    float: left;
}
//.fc-header-toolbar{
//    width: 110% !important;
//}
.fc, .fc-view-harness, .fc-daygrid-body{
    height: 100% !important;
}
.rightB{
    width: 49%;
    float: right;
    background: #cfe1f7;
    height: 442px;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    margin-top: 48px;
    box-sizing: border-box;
    overflow-y: scroll;
}
.rightP{
    line-height: 30px;
    text-align: left;
    box-sizing: border-box;
    font-size: 12px;
    border-radius: 3px;
    margin: 10px;
    padding: 5px 10px;
    color: #2c3e50;
    background: #dae6f4;
}

.bottom{
    display: inline-block;
    width: 100%;
    //height: 15%;
    margin-top: 1%;
    background: #3c6fc2;
    font-size: 12px;
    text-align: left;
    padding: 10px 0 10px 10px;
    box-sizing: border-box;
    color: #fff;
}

.bottomDid{
    font-size: 14px;
    display: inline-block;
}
.bottomDid:nth-child(2) {
    margin-left: 20px;
}
.bottomP{
    line-height: 20px;
    width: 100%;
}

.fc--button{
    display: none !important;
}

.fc-toolbar-title{
    font-size: 14px !important;
    display: inline-block !important;
}

.fc-event-title-container{
    height: 35px !important;
    cursor: pointer;
}

.fc-button-group:nth-child(1) .fc-myWholeButton-button{
    background: #d61518 !important;
    border: #d61518 !important;
}
.fc-button-group:nth-child(2) .fc-myWeChatButton-button{
    background: #0c5ba2 !important;
    border: #0c5ba2 !important;
}
.fc-button-group:nth-child(3) .fc-myActivityButton-button{
    background: #0b9043 !important;
    border: #0b9043 !important;
}
.fc-myInsideButton-button{
    background: #edb218 !important;
    border: #edb218 !important;
}


.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>

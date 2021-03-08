<template>
    <div class="page-container">
        <div class="fullCalendar">
            <FullCalendar ref="fullCalendar" :options="calendarOptions" />
        </div>
        <transition name="fade">
            <div class="right" v-if="rightFLag">
                <p v-for="item in conTxt" class="rightP" @click="ObjectKeys(Object.values(item))"> {{ Object.keys(item).toString() }} </p>
            </div>
        </transition>
        <transition name="fade">
            <div class="bottom" v-if="objectValus"> {{ objectValus }} </div>
        </transition>
    </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction';
export default {
    components: {
        FullCalendar
    },
    data() {
        return {
            rightFLag: false,
            objectValus: '',
            conTxt: {},
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
                        text: '全部', click: function () {
                            alert('点击了全部按钮!');
                        }
                    },
                    myWeChatButton: {
                        text: '内容', click: function () {
                            alert('点击了内容按钮!');
                        }
                    },
                    myActivityButton: {
                        text: '活动', click: function () {
                            alert('点击了活动按钮!');
                        }
                    },
                    myInsideButton: {
                        text: '内部', click: function () {
                            alert('点击了内部按钮!');
                        }
                    },
                    prev: {
                        text: "PREV",
                        click: this.handlePreBtnClick,
                    },
                    next: { // this overrides the next button
                        text: "PREV",
                        click: this.handleNextBtnClick,
                    },
                    // prevYear: {
                    //     text: "prevYear",
                    //     click: this.handlePreYearBtnClick,
                    // },
                    // nextYear: {
                    //     text: "nextYear",
                    //     click: this.handleNextYearBtnClick,
                    // }
                },


                titleFormat: { // will produce something like "Tuesday, September 18, 2018"
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    // weekday: 'long'
                },
                events: [{
                    data:[{biaoti: '详情内容'},{xiaochengx1: '123123213123213213'},{xiaochengx2: '萨达十大数据库的哈实打实大123123213123213213'}],
                    color: '#2196F3',
                    start: '2021-03-04',
                    end: '2021-03-04'
                },{
                    data:[{neibu1: 'asdasdasdaszczxcx'},{neibu2: 'xczxvvvcxwq12自行车自行车自行车'},{neibu3: '爱仕达大所大所123123'}],
                    color: '#E6A23C',
                    start: '2021-03-05',
                    end: '2021-03-05'
                },{
                    color: '#F56C6C',
                    start: '',
                    end: ''
                }],
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
                eventsSet: false

            },
        }
    },
    mounted() {

    },
    created() {

    },
    methods : {
        handleEventClick(info) {
            console.log('123', info)
            this.rightFLag = true;
            this.conTxt = info.event._def.extendedProps.data;
        },
        // handleEvents() {
        //   console.log(123)
        // },
        //下周
        handleNextBtnClick(){
            let calendarApi = this.$refs.fullCalendar.getApi();   //一旦你有ref，你可以通过getApi方法得到底层的日历对象:
            calendarApi.next();   // 调用next方法
            let test = calendarApi.getCurrentData().viewTitle;
            console.log(test);
        },
        //上周
        handlePreBtnClick(){
            let calendarApi = this.$refs.fullCalendar.getApi();
            calendarApi.prev();
            let test = calendarApi.getCurrentData().viewTitle;
            console.log(test);
        },
        // //上一年
        // handlePreYearBtnClick(){
        //     let calendarApi = this.$refs.fullCalendar.getApi();
        //     calendarApi.prevYear();
        //     let test = calendarApi.getCurrentData().viewTitle;
        //     console.log(test);
        // },
        // //下一年
        // handleNextYearBtnClick(){
        //     let calendarApi = this.$refs.fullCalendar.getApi();
        //     calendarApi.nextYear();
        //     let test = calendarApi.getCurrentData().viewTitle;
        //     console.log(test);
        // },
        ObjectKeys(item) {
            console.log(item);
            this.objectValus = item.toString()
        }
    },
}
</script>

<style lang="scss">

.page-container {
    font-size: 12px;
    text-align: center;
    height: 100%;
}
.fullCalendar{
    width: 40%;
    height: 70%;
    float: left;
}
.fc, .fc-view-harness, .fc-daygrid-body{
    height: 100% !important;
}
.right{
    width: 59%;
    float: right;
    background: #cfe1f7;
    height: 63%;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    margin-top: 48px;
    box-sizing: border-box;
}
.rightP{
    line-height: 30px;
    text-align: left;
    box-sizing: border-box;
    font-size: 16px;
    border-radius: 3px;
    margin: 10px;
    padding: 5px 10px;
    color: #2c3e50;
    background: #dae6f4;
}

.bottom{
    display: inline-block;
    width: 98%;
    height: 15%;
    margin-top: 3%;
    background: #3c6fc2;
    font-size: 14px;
    text-align: left;
    padding: 10px;
    color: #fff;
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

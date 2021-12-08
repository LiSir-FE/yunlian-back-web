<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/activityListManagement' }">活动管理</el-breadcrumb-item>
                <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="活动人员" name="a">
                <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="10px" @submit.native.prevent>
                    <el-form-item label=" ">
                        <el-input v-model="pageInfo.search" placeholder="搜索账号/名称" class="wetuc-input3-col3"
                                  @keyup.enter.native="queryData">
                            <i slot="suffix" class="el-input__icon el-icon-search"
                               @click="queryData" style="cursor: pointer"></i>
                        </el-input>
                        <el-select v-model="pageInfo.ticketType" placeholder="请选择票券类型" class="wetuc-input3-col3" @change="queryData()">
                            <el-option
                                v-for="item in ticketType"
                                :key="item.id"
                                :label="item.name"
                                :value="item.name">
                            </el-option>
                        </el-select>
                        <el-select v-model="pageInfo.isNotice" placeholder="请选择电子票" class="wetuc-input3-col3" @change="queryData()">
                            <el-option
                                v-for="item in isNotice"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-select v-model="pageInfo.status" placeholder="请选择签到状态" class="wetuc-input3-col3" @change="queryData()">
                            <el-option
                                v-for="item in status"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select v-model="pageInfo.signInClerk" placeholder="请选择签到员" class="wetuc-input3-col3" @change="queryData()">
                            <el-option
                                v-for="item in signInClerk"
                                :key="item.openid"
                                :label="item.nickName"
                                :value="item.openid">
                            </el-option>
                        </el-select>
                        <el-select v-model="pageInfo.grouping" placeholder="请选择分组" class="wetuc-input3-col3" @change="queryData()" value-key="id">
                            <el-option
                                v-for="item in grouping"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                <span style="float: left">{{ item.name }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px" @click="moveGroups(item.id)">移动到分组</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-select v-model="pageInfo.importExport" placeholder="导入/导出用户" class="wetuc-input3-col3" @change="importExportFn" :clearable="true">
                            <el-option
                                v-for="item in importExport"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>

                        <el-select v-model="pageInfo.shortMass" placeholder="短信群发" class="wetuc-input3-col3" @change="massChange" :clearable="true">
                            <el-option
                                v-for="item in shortMassList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>

                        <el-select v-model="pageInfo.ticketMass" placeholder="电子票群发" class="wetuc-input3-col3" @change="massChange" :clearable="true">
                            <el-option
                                v-for="item in ticketMassList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <div class="wetuc-block">
                        <el-form-item label=" ">
                            <el-button type="primary" @click.prevent="addGroups()">添加分组</el-button>
                            <el-button type="primary" @click.prevent="editGroups()">编辑分组</el-button>
                            <el-button type="primary" @click.prevent="batchCheck('batch')">批量签到</el-button>
                        </el-form-item>
                    </div>
                </el-form>


                <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column :key="Math.random()" label="报名时间" prop="buyTime" min-width="100" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.buyTime | stampFormate}}
                        </template>
                    </el-table-column>
                    <el-table-column :key="Math.random()" label="姓名" prop="applyInfo.姓名" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column :key="Math.random()" label="公司" prop="applyInfo.公司" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column :key="Math.random()" label="职位" prop="applyInfo.职位" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column :key="Math.random()" label="手机号" prop="applyInfo.手机" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column :key="Math.random()" label="票号" prop="ticketNo" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column :key="Math.random()" label="票券类型" prop="ticket.name" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column :key="Math.random()" label="电子票状态" prop="notice" min-width="80" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.notice">已发送</span>
                            <span v-else>未发送</span>
                        </template>
                    </el-table-column>
                    <el-table-column :key="Math.random()" label="签到状态" prop="status" min-width="80" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.status | checkStatus}}
                        </template>
                    </el-table-column>
                    <el-table-column :key="Math.random()" label="签到员" prop="checkNickname" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" min-width="350" align="right" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit" size="small" v-if="scope.row.status === 1" @click.prevent="signIn(scope.row)">签到</el-button>
                            <el-button type="text" icon="el-icon-edit" size="small" v-if="scope.row.status === 2" @click.prevent="signTicket(false, 3, scope.row.ticketNo)">取消签到</el-button>
                            <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="sendMessage(scope.row.orderNo, 1, '是否确定')">发送电子票</el-button>
                            <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="oprRow(scope.row.applyPhone, 7, scope.row.applyName, 1)">发送短信</el-button>
                            <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="addNotes(scope.row)">添加备注</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="wetuc-pagination-panel">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="page.pageNum"
                        :page-sizes="[5, 10, 20, 50]"
                        :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.total">
                    </el-pagination>
                </div>


                <!--添加/修改分组-->
                <el-dialog :title="dialogTitle" :visible.sync="groupsVisible" :width="groupsInfo.groupsStatus === 4 ? '40% ': '26%'" :destroy-on-close="true" :close-on-click-modal="false">
                    <el-form ref="groupsInfo" :model="groupsInfo" label-width="70px">
                        <el-form-item label="分组名称" v-if="groupsInfo.groupsStatus === 1">
                            <el-input class="wetuc-input-col2" placeholder="请输入分组名称" v-model="groupsInfo.name"></el-input>
                        </el-form-item>
                        <el-form-item label="分组顺序" v-if="groupsInfo.groupsStatus === 1">
                            <el-input-number class="wetuc-input-col2" placeholder="请输入分组顺序" v-model="groupsInfo.index" :min="0"></el-input-number>
                        </el-form-item>
                        <template v-for="(item,index) in grouping" v-if="groupsInfo.groupsStatus === 2">
                            <el-form-item label="分组名称">
                                <el-input class="wetuc-input-col2" placeholder="请输入分组名称" v-model="item.name"></el-input>
                            </el-form-item>
                            <el-form-item label="分组顺序">
                                <el-input-number class="wetuc-input-col2" placeholder="请输入分组顺序" v-model="item.order" :min="0"></el-input-number>
                            </el-form-item>
                            <div class="wetuc-block" style="display: flex;align-items: center;align-content: center;justify-content: center">
                                <i class="el-icon-edit" @click.prevent="" style="margin: 0 10px;cursor: pointer" @click.passive="groupsHold(item, index)">保存</i>
                                <i class="el-icon-delete red" @click.prevent="" style="cursor: pointer" @click.passive="groupsDetele(item, index)">删除</i>
                            </div>
                        </template>
                        <template v-if="groupsInfo.groupsStatus === 3">
                            <el-form-item label="票券类型" prop="ticketType" :rules="{required: true, message: '请选择票券类型', trigger: 'change'}">
                                <el-select v-model="groupsInfo.ticketType" placeholder="请选择票券类型" class="wetuc-input-col2">
                                    <el-option
                                        v-for="item in ticketType"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                        <span style="float: left">{{ item.name }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">剩余{{item.leftNum}}张</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item v-for="(item, index) in groupsInfo.staffSign" :key="index" :label="item.key" :prop="'staffSign.' +index+ '.tempVal'" :rules="item.key === '手机' ? [{required: true, message: '手机号码不能为空', trigger: 'blur'}, {min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur'}, {pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur'}] : item.must === 1 ? {required: true, message: item.key + '不能为空', trigger: ['blur', 'change']} : ''">
                                <el-input v-if="item.type === 'danh'" v-model="item.tempVal"
                                          placeholder="" class="wetuc-input-col2"></el-input>
                                <el-input v-if="item.type === 'duoh'" v-model="item.tempVal" type="textarea"
                                          placeholder="" class="wetuc-input-col2"></el-input>
                                <div v-if="item.type === 'danx'">
                                    <el-radio-group v-model="item.tempVal">
                                        <el-radio v-for="(val, idx) in item.value" :key="idx"
                                                  :label="item.value[idx]"></el-radio>
                                    </el-radio-group>
                                </div>
                                <div v-if="item.type === 'duox'">
                                    <el-checkbox-group v-model="item.tempVal">
                                        <el-checkbox v-for="(val, idx) in item.value" :key="idx"
                                                     :label="item.value[idx]"></el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            </el-form-item>
                            <el-form-item label="短信通知">
                                <el-checkbox v-model="groupsInfo.singleNotice"></el-checkbox>
                            </el-form-item>
                        </template>
                        <template v-if="groupsInfo.groupsStatus === 4">
                            <el-steps :active="stepAct" align-center style="margin-bottom: 10px;width: 100%">
                                <el-step title="上传文件"></el-step>
                                <el-step title="导入预览"></el-step>
                                <el-step title="上传完成"></el-step>
                            </el-steps>

                            <template v-if="stepAct === 1">
                                <el-form-item label="票券类型" prop="ticketType" :rules="{required: true, message: '请选择票券类型', trigger: 'change'}">
                                    <el-select v-model="groupsInfo.ticketType" placeholder="请选择票券类型" class="wetuc-input-col2">
                                        <el-option
                                            v-for="item in ticketType"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                            <span style="float: left">{{ item.name }}</span>
                                            <span style="float: right; color: #8492a6; font-size: 13px">剩余{{item.leftNum}}张</span>
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="下载模板">
                                    <p><span class="wetuc-router-link spanHover" @click="downloadTemplate">下载模板</span>    为保证上传成功，请保持列头不变</p>
                                </el-form-item>
                                <el-form-item label="上传名单">
                                    <div class="upload-btn">
                                        <el-button type="primary" size="small " icon="el-icon-upload" style="position: relative;cursor:pointer;">上传文件</el-button>
                                        <input type="file" id="uploads" @change="uploadImg" class="file" style="opacity: 0;position: absolute;left: 0;top: 0;width: 38%;height: 100%">
                                    </div>
                                    <p>{{groupsInfo.fileName}}</p>
                                </el-form-item>
                            </template>
                            <template v-if="stepAct === 2">
                                <table style="width: 100%">
                                    <thead>
                                    <tr class="com-table-header">
                                        <th v-for="(item, index) in importData[0]" :key="index">{{item}}</th>
                                    </tr>
                                    </thead>
                                    <tbody class="com-table-body" v-if="importData.length > 1">
                                    <tr v-if="index > 0" v-for="(item, index) in importData" :key="index">
                                        <td v-for="(val, idx) in item" :key="idx">{{val}}</td>
                                    </tr>
                                    </tbody>
                                    <tbody class="com-table-body" v-if="importData.length <= 0">
                                    <tr class="empty-text">
                                        <td colspan="100">{{importEmptyText}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <p style="margin: 10px 0">
                                    <el-checkbox v-model="groupsInfo.singleNotices">导入成功后立即发送电子票短信通知</el-checkbox>
                                </p>
                            </template>
                            <template v-if="stepAct === 3">
                                <div class="stepThird">
                                    <div class="left">输出日志</div>
                                    <div class="right" style="margin: 10px 0">
                                        <p v-for="(item, index) in msgArray" :key="index">{{item}}</p>
                                    </div>
                                </div>
                            </template>
                        </template>
                        <template v-if="groupsInfo.groupsStatus === 5">
                            <el-form-item label="发送对象">
                                <span>{{groupsInfo.smsInfo}}</span>
                            </el-form-item>

                            <el-form-item label="短信模板">
                                <el-select v-model="groupsInfo.smsTemplateModel" placeholder="请选择模板" class="wetuc-input-col2">
                                    <el-option
                                        v-for="item in smsTemplate"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>


                            <el-form-item label="定时发送">
                                <el-date-picker
                                    class="wetuc-input-col2"
                                    v-model="groupsInfo.sendTime"
                                    type="datetime"
                                    :picker-options="pickerOptions"
                                    format="yyyy-MM-dd HH:mm"
                                    value-format="timestamp"
                                    placeholder="请选择发送日期">
                                </el-date-picker>
                            </el-form-item>
                        </template>

                        <template v-if="groupsInfo.groupsStatus === 6">
                            <el-form-item label="票号">
                                <el-input class="wetuc-input-col2" v-model="groupsInfo.ticketNo" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="联系人">
                                <el-input class="wetuc-input-col2" v-model="groupsInfo.names" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="手机号">
                                <el-input class="wetuc-input-col2" v-model="groupsInfo.data" readonly></el-input>
                            </el-form-item>
                        </template>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="previousStep(stepAct)" v-if="stepAct === 2">上一步</el-button>
                        <el-button type="primary" @click="nextStepFn(stepAct)" v-if="groupsInfo.groupsStatus === 4 && stepAct === 1">下一步</el-button>
                        <el-button type="primary" @click="confirmImport(stepAct)" v-if="groupsInfo.groupsStatus === 4 && stepAct === 2">确认导入</el-button>
                        <el-button type="primary" @click="handleOK('groupsInfo')" v-if="groupsInfo.groupsStatus === 4 && stepAct === 3">确 定</el-button>
                        <el-button type="primary" @click="groupsFn('groupsInfo')" v-if="groupsInfo.groupsStatus !== 4">确 定</el-button>
                    </div>
                </el-dialog>

                <tuc-right-side v-if="rightVisible" :rightSide="rightOptions" :id="id" @closeMyself="closeMyself"></tuc-right-side>
            </el-tab-pane>
            <el-tab-pane label="订单管理 " name="b">
                <tucOrderList :id="id"></tucOrderList>
            </el-tab-pane>
            <el-tab-pane label="活动详情 " name="c">
                <tucEditActivit :id="id" :btnFlag="false"></tucEditActivit>
            </el-tab-pane>
            <el-tab-pane label="扩展内容" name="d">
                <tucExtended :id="id"></tucExtended>
            </el-tab-pane>
            <el-tab-pane label="取票设置" name="e">
                <tucTicketQrCode :id="id"></tucTicketQrCode>
            </el-tab-pane>
            <el-tab-pane label="人员归档" name="f">
                <tucPeopleFile :id="id"></tucPeopleFile>
            </el-tab-pane>
        </el-tabs>


    </div>
</template>

<script>
import {loginService} from "../../service/loginService";
import {checkStatus} from '../../filter/companyList'
import tucRightSide from '../../components/tuc-rightSide/index.vue'
import tucOrderList from '../../components/tuc-order-list/index.vue'
import tucEditActivit from '../../components/tuc-editActivity/index'
import tucTicketQrCode from '../../components/tuc-TicketQrCode/index.vue'
import tucPeopleFile from '../../components/tuc-peopleFile/index.vue'
import tucExtended from '../../components/tuc-extended/index.vue'
export default {
    data() {
        return {
            activeName: this.$route.query.activeName ? this.$route.query.activeName : 'a',
            id: this.$route.query.id,
            stepAct: 1,
            msgArray: [],
            rightVisible: false,
            rightOptions: [],
            pageInfo: {
                search: '',
                ticketType: '',
                signInClerk: '',
                isNotice: '',
                status: '',
                grouping: '1',
                importExport: '',
                shortMass: '',
                ticketMass: '',
            },
            pickerOptions: { // 定时时间
                disabledDate: (time) => {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            shortMassList: [{
                value: '3',
                label: '勾选人员'
            },{
                value: '4',
                label: '全部人员'
            }],
            ticketMassList: [{
                value: '1',
                label: '勾选人员'
            },{
                value: '2',
                label: '全部人员'
            }],
            groupsInfo: {
                name: '',
                index: '',
                groupsStatus: null,
                ticketType: '',
                singleNotice: false,
                singleNotices: false,
                staffSign: [],
                filePathUrl: '',
                fileName: '',
                smsInfo: '',
                smsTemplateModel: '',
                sendTime: '',
                data: null,
                flag: null,
                ticketNo: null,
                names: null
            },
            smsTemplate: '',
            importExport: [{
                label: '全部导出',
                value: '1'
            },{
                label: '单个导入',
                value: '2'
            },{
                label: '批量导入',
                value: '3'
            }],
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            importData: [],
            importEmptyText: '',

            dialogTitle: '',
            groupsVisible: false,
            ticketType: [],

            signInClerk: [],
            isNotice: [{
                label: '发送',
                value: true
            },{
                label: '未发送',
                value: false
            }],
            status: [{
                label: '已签到',
                value: '2'
            },{
                label: '未签到',
                value: '1'
            },{
                label: '已过期',
                value: '3'
            }],
            multipleSelection: [],
            grouping: [],
            tableData: [],
            tableLoading: false,
        }
    },
    components:{
        tucRightSide,
        tucOrderList,
        tucEditActivit,
        tucTicketQrCode,
        tucPeopleFile,
        tucExtended,
    },
    computed: {
        apis() {
            return process.env.API_ROOT
        },
        picHead() {
            return process.env.IMG_URL
        }
    },
    filters: {
        checkStatus
    },
    mounted() {
        this.$nextTick(() => {
            this.getSmsTemplate()
            this.getTicketType()
            this.getCheckWorker()
            this.getGroups()
            this.queryData()
        })
    },
    methods: {
        // 获取-活动人员
        queryData() {
            let that = this;
            loginService.getListActivityPeople({
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize,
                query: that.pageInfo.search,
                actId: that.id,
                groupId: that.pageInfo.grouping,

                signOpenId: that.pageInfo.signInClerk,
                isNotice: that.pageInfo.isNotice,
                ticketName: that.pageInfo.ticketType,
                status: that.pageInfo.status
            }).then(res =>{
                if (res.data.success) {
                    let result = res.data.datas
                    that.tableData = result.datas
                    that.page.total = Number(result.totalCount);
                    setTimeout(function () {
                        that.tableLoading = false
                    }, 300)
                }
            }).catch(err =>{
                console.log(err);
            })
        },
        // 添加备注
        addNotes(row) {
            this.rightVisible = true;
            this.rightOptions = {
                ticketNo: row.ticketNo
            }
        },
        // 关闭右侧
        closeMyself(val) {
            this.rightVisible = val;
        },
        addGroups() {
            this.groupsInfo.dialogTitle = '添加分组'
            this.groupsInfo.groupsStatus = 1
            this.groupsVisible = true
        },
        editGroups() {
            this.groupsInfo.dialogTitle = '编辑分组'
            this.groupsInfo.groupsStatus = 2
            this.groupsVisible = true
        },
        // 批量签到
        batchCheck(type) {
            let that = this;
            let data = []
            that.multipleSelection.forEach(item => {
                data.push(item.ticketNo)
            })
            let params = {
                ticketNo: data.toString(),
                sign: type === 'batch' ? true : false
            }
            if(type === 'batch') {
                if(that.multipleSelection.length > 0) {
                    loginService.signTicket(params).then(function (res) {
                        if (res.data.success) {
                            that.queryData();
                        } else {
                            that.$message.error(res.data.message);
                        }
                    }).catch(function (err) {
                        that.$router.push({name: 'error'});
                    });
                } else {
                    that.$message.error('没有选中用户');
                }
            }
        },
        // 群发电子票or短信
        massChange(val) {
            let that = this;
            let arr = []
            let arr1 = []
            console.log(val);
            if(val === '1' || val === '3') {
                if(that.multipleSelection.length > 0) {
                    that.multipleSelection.forEach(item => {
                        arr.push(item.orderNo)
                        arr1.push(item.applyPhone)
                    })
                } else {
                    that.$message({
                        type: 'warning',
                        message: '请先选择用户'
                    })
                    return false
                }
            }
            if(val === '1') {
                let data = arr.toString()
                that.sendMessage(data, 1, '已选择'+that.multipleSelection.length + '人，是否确认');
            } else if(val === '2') {
                that.sendMessage('mm', 2, '是否确认为全部人员');
            } else if(val === '3') {
                let data = arr1.toString()
                that.oprRow(data, 7, '已选择' + that.multipleSelection.length + '人，是否确认发送短信', 1);
            } else if(val === '4') {
                that.oprRow('mm', 7, '是否确认为全部人员发送短信', 2);
            }
        },
        // sendMessage
        sendMessage(data, typ, mess) {
            let that = this, params = '';
            that.$confirm(mess + '发送电子票', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                //成功
                // type:1,全部用户发(activityId必传);2,分组发送(activityId,groupId必传);3,勾选发送(orderIds必传)
                if (typ == 1) { // 勾选
                    params = {orderIds: data, type: 3};
                } else if (typ == 2) { // 全部
                    params = {activityId: that.id, type: 1};
                } else if (typ == 3) { // 分组
                    params = {activityId: that.id, groupId: 1, type: 2};
                }
                loginService.sendMessage(params).then(function (res) {
                    if (res.data.success) {
                        that.queryData();
                    } else {
                        that.$message.error(res.data.message);
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }).catch(() => {
                // 取消
            });
        },
        // oprRow
        oprRow(data, typ, mess, flag) {
            this.groupsInfo.dialogTitle = '短信模板'
            this.groupsInfo.groupsStatus = 5
            this.groupsVisible = true
            this.groupsInfo.smsInfo = mess
            this.groupsInfo.data = data
            this.groupsInfo.flag = flag
        },
        // 取消签到
        signTicket(isSign, typ, id) {
            let that = this
            let params = ''
            if(typ === 2) {
                params = {ticketNo: id, sign: isSign};
            } else if(typ === 3) {
                params = {ticketNo: id, sign: isSign};
            }
            loginService.signTicket(params).then(function (res) {
                if (res.data.success) {
                    that.groupsVisible = false
                    that.queryData();
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                console.log(err);
            });
        },
        // 签到
        signIn(row) {
            console.log(row);
            this.groupsInfo.dialogTitle = '签到'
            this.groupsInfo.groupsStatus = 6
            this.groupsVisible = true
            this.groupsInfo.data = row.applyPhone
            this.groupsInfo.ticketNo = row.ticketNo
            this.groupsInfo.names = row.applyInfo.姓名
        },
        // 上一步
        previousStep(stepAct) {
            this.stepAct = --stepAct
        },
        // 下一步
        nextStepFn(stepAct) {
            let that = this;
            let filePath = that.groupsInfo.filePathUrl;
            // 导入预览
            if(filePath) {
                that.stepAct = ++stepAct
                if(stepAct === 2) {
                    loginService.importPreview({filePath: filePath}).then(function (res) {
                        if (res.data.success) {
                            let table = res.data.datas;
                            if (parseInt(table.length) > 0) {
                                that.importData = table;
                                that.importEmptyText = '加载中...';
                            } else {
                                that.importEmptyText = '暂无数据';
                            }
                        } else {
                            that.$message.error(res.data.message);
                        }
                    }).catch(function (err) {
                        that.$router.push({name: 'error'});
                    });
                }
            } else {
                that.$message({
                    type: 'warning',
                    message: '请上传文件'
                })
            }
        },
        // 确定
        handleOK() {
            this.groupsVisible = false
            this.queryData()
        },
        // 确认导入
        confirmImport(stepAct) {
            let that = this, filePath = that.groupsInfo.filePathUrl;
            that.stepAct = ++stepAct
            loginService.importMultiple({
                actId: that.id,
                ticketId: that.groupsInfo.ticketType,
                filePath: filePath,
                isNotice: that.groupsInfo.singleNotices
            }).then(function (res) {
                if (res.data.success) {
                    let data = res.data.datas, arr = [];
                    arr = res.data.datas.msgArray;// 日志
                    if (arr.length <= 0) {
                        arr[0] = '总计：' + data.totalCount + '条';
                        arr[1] = '成功：' + data.successCount + '条';
                        arr[2] = '失败：' + data.errorCount + '条';
                    }
                    that.msgArray = arr;
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                console.log(err);
            });
        },
        groupsFn(formName) {
            let that = this;
            if(that.groupsInfo.groupsStatus === 1) {
                loginService.addActivityGroup({
                    typeId: that.id,
                    name: that.groupsInfo.name,
                    order: that.groupsInfo.index,
                }).then(res =>{
                    if(res.data.success) {
                        that.$message('添加成功!');
                        setTimeout(() => {
                            that.groupsVisible = false
                            that.queryData()
                        }, 300)
                    }
                }).catch(err =>{
                    console.log(err);
                })
            } else if (that.groupsInfo.groupsStatus === 2) {
                that.groupsVisible = false
            } else if (that.groupsInfo.groupsStatus === 3) {
                that.$refs[formName].validate((valid) => {
                    if (valid) {
                        let infos = new Object()
                        let arr = that.groupsInfo.staffSign
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].type == 'duox') {
                                infos[arr[i].key] = arr[i].tempVal.join(',');
                            } else {
                                infos[arr[i].key] = arr[i].tempVal;
                            }
                        }
                        loginService.importSingle({
                            actId: that.id,
                            ticketId: that.groupsInfo.ticketType,
                            isNotice: that.groupsInfo.singleNotice,
                            infos: JSON.stringify(infos),
                            adminInfos: JSON.stringify(infos),
                            num: 1,
                            phone: infos['手机']
                        }).then(res =>{
                            if(res.data.success) {
                                that.groupsVisible = false
                                that.queryData()
                            }
                        }).catch(err =>{
                            console.log(err);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            } else if(that.groupsInfo.groupsStatus === 5) {
                let param = ''
                if(that.groupsInfo.flag === 1) {
                    param = {
                        activityId: that.id,
                        applyPhone: that.groupsInfo.data,
                        templateId: that.groupsInfo.smsTemplateModel,
                        sendTime: that.groupsInfo.sendTime,
                        type: 3
                    };
                } else if(that.groupsInfo.flag === 2) {
                    param = {activityId: that.id, templateId: that.groupsInfo.smsTemplateModel, sendTime: that.groupsInfo.sendTime, type: 1};
                }
                loginService.sendSms(param).then(function (res) {
                    if (res.data.success) {
                        that.dialogVisible = false;
                        that.queryData();
                    } else {
                        that.$message.error(res.data.message);
                    }
                }).catch(function (err) {
                    that.$router.push({name: 'error'});
                });
            } else if (that.groupsInfo.groupsStatus === 6) {
                that.signTicket(true, 2, that.groupsInfo.ticketNo)
            }
        },
        // 短信模板
        getSmsTemplate() {
            let that = this;
            loginService.getSmsTemplate({pageNo: 1, pageSize: 100}).then(function (res) {
                if (res.data.success) {
                    that.smsTemplate = res.data.datas.datas;
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                console.log(err);
            });
        },
        groupsHold(item, index) {
            let that = this;
            console.log(item.order);
            loginService.editActivityGroup({
                id: item.id,
                name: item.name,
                order: item.order,
            }).then(function (res) {
                if (res.data.success) {
                    setTimeout(() => {
                        that.getGroups()
                    }, 300)
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                console.log(err);
            });
        },
        groupsDetele(item, index) {
            let that = this;
            that.$confirm('确认删除吗?', '严重警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                loginService.deleteActivityGroup({groupId: item.id}).then(function (res) {
                    if (res.data.success) {
                        setTimeout(() => {
                            that.getGroups()
                        }, 300)
                    } else {
                        that.$message.error(res.data.message);
                    }
                }).catch(function (err) {
                    console.log(err);
                });
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        // 移动到分组
        moveGroups(id) {
            let that = this;
            if(that.multipleSelection.length > 0) {
                let arr = []
                that.multipleSelection.forEach(item =>{
                    arr.push(item.ticketNo)
                })
                loginService.moveAnotherGroup({
                    groupId: id,
                    ticketNo: arr.toString()
                }).then(res => {
                    if(res.data.success) {
                        setTimeout(() => {
                            that.queryData()
                        }, 300)
                    }
                }).catch(err =>{
                    console.log(err);
                })
            } else {
                that.$message({
                    type: 'warning',
                    message: '请先选择用户'
                })
            }
        },
        // 导入/导出用户
        importExportFn(val) {
            let that = this;
            if(val === '1') {
                loginService.exportInfo('export/ticket', {actId: that.id});
            } else if (val === '2') {
                this.groupsInfo.dialogTitle = '单个导入'
                this.groupsInfo.groupsStatus = 3
                this.groupsVisible = true
            } else if (val === '3') {
                this.groupsInfo.dialogTitle = '批量导入'
                this.groupsInfo.groupsStatus = 4
                this.groupsVisible = true
            }
        },
        // 下载模板
        downloadTemplate() {
            loginService.exportInfo('activities/order_model_excel', {actId: this.id});
        },
        // 上传文件
        uploadImg(event) {
            let that = this;
            let e = event || window.event;
            let file = e.target.files[0];
            let formData = new FormData();
            formData.append('myFile', file);
            loginService.uploadFile(formData).then(function (res) {
                if (res.data.success) {
                    that.groupsInfo.filePathUrl = res.data.datas.filePath;
                    that.groupsInfo.fileName = file.name;
                }
            });
        },
        // table选择
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },

        // 票券类型
        getTicketType() {
            let that = this;
            that.groupsInfo.staffSign = []
            loginService.getActivityDetail({id: that.id}).then(function (res) {
                if (res.data.success) {
                    that.ticketType = res.data.datas.tickets;
                    let arr = res.data.datas.staffSign;
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].type === 'duox') {
                            arr[i].tempVal = [];
                        } else {
                            arr[i].tempVal = '';
                        }
                    }
                    that.groupsInfo.staffSign = that.groupsInfo.staffSign.concat(arr)
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                that.$router.push({name: 'error'});
            });
        },
        // 签到员
        getCheckWorker() {
            let that = this;
            loginService.getCheckWorker({pageNo: 1, pageSize: 1000, query: ''}).then(function (res) {
                if (res.data.success) {
                    that.signInClerk = res.data.datas.datas;
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                that.$router.push({name: 'error'});
            });
        },
        // 分组
        getGroups() {
            let that = this;
            that.grouping = [];
            loginService.getActivityGroup({actId: that.id}).then(function (res) {
                if (res.data.success) {
                    that.grouping = res.data.datas;
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                that.$router.push({name: 'error'});
            });
        },
        // 分页
        handleSizeChange (val) {
            this.page.pageSize = val
            this.queryData()
        },
        handleCurrentChange (val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.queryData()
            }
        }
    },
}
</script>

<style lang="less">

</style>

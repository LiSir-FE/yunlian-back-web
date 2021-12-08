<template>
    <div class="wetuc-page-content">
        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="80px" :rules="rules">
            <div class="wetuc-block">
                <el-form-item label="活动海报" prop="imageUrl">
                    <el-upload
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="uploadCoverFile"
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="pageInfo.imageUrl" :src="pageInfo.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>

            <el-form-item label="活动名称" prop="name">
                <el-input v-model="pageInfo.name" class="wetuc-input-col2" placeholder="请输入活动名称"></el-input>
            </el-form-item>

            <el-form-item label="活动时间" prop="timeRange">
                <el-date-picker
                    class="wetuc-input-col2"
                    v-model="pageInfo.timeRange"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm"
                    value-format="timestamp"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    placeholder="请选择活动时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="报名时间" prop="timeRegis">
                <el-date-picker
                    class="wetuc-input-col2"
                    v-model="pageInfo.timeRegis"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm"
                    value-format="timestamp"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    placeholder="请选择活动时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="活动主题" prop="classId">
                <el-select v-model="pageInfo.classId" placeholder="请选择活动主题" class="wetuc-input-col2 relation"
                           value-key="value">
                    <el-option
                        v-for="item in classify"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value + '/' + item.text">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="活动标签" prop="label">
                <el-select v-model="pageInfo.label" multiple :multiple-limit="3" @change="labelChange"
                           placeholder="请选择活动标签" class="wetuc-input-col2 relation" value-key="value">
                    <el-option
                        v-for="item in labelList"
                        :key="item.value"
                        :label="item.text"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="活动地点" prop="options">
                <el-cascader
                    v-if="flag"
                    class="wetuc-input-col2"
                    :props="props"
                    v-model="pageInfo.options">
                </el-cascader>
            </el-form-item>

            <div class="wetuc-block">
                <el-form-item label="详细地址" prop="detailAddress">
                    <el-input v-model="pageInfo.detailAddress" class="wetuc-input-col943">
                    </el-input>
                </el-form-item>
            </div>


            <div class="wetuc-block">
                <el-form-item label="活动详情" prop="content">
                    <quill-editor ref="myQuillEditor" v-model="pageInfo.content" :options="dialogOption"
                                  class="wetuc-input-col943"></quill-editor>
                </el-form-item>

                <el-upload
                    class="avatar-uploader dialogOption"
                    accept="image/jpeg,image/gif,image/png,image/bmp"
                    :action="actionUrl"
                    :http-request="reverseCardFile"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="pageInfo.contentImg" :src="pageInfo.contentImg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>

            <el-form-item label="报名用户" prop="showSignUpUser">
                <el-select v-model="pageInfo.showSignUpUser" class="wetuc-input-col2 relation">
                    <el-option
                        v-for="item in showSignUpUserList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="报名人数">
                <el-input-number v-model="pageInfo.showNum" :min="0" placeholder="0为不限制"
                                 class="wetuc-input-col2"></el-input-number>
            </el-form-item>


            <el-form-item label=" " prop="ticketingData" class="wetuc-block">
                <el-table :data="pageInfo.ticketingData" class="wetuc-input-col943">
                    <el-table-column label="票种名" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.name" placeholder="10字以内" :maxlength="10"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="价格（元）" show-overflow-tooltip align="center" :min-width="180">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.price" :min="0" placeholder="0为免费"
                                             class="wetuc-input-col1"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="总发售" show-overflow-tooltip align="center" :min-width="180">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.totalNum" :min="0" placeholder="总张数"
                                             class="wetuc-input-col1"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="票种说明" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.detail" placeholder="50字以内" :maxlength="50"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="每人限购" show-overflow-tooltip align="center" :min-width="180">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.limitNum" :min="0" :max="10" placeholder="最多10张"
                                             class="wetuc-input-col1"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否审核" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <el-switch v-if="scope.row.price == 0 || scope.row.price == ''"
                                       v-model="scope.row.needCheck"></el-switch>
                            <el-switch v-else v-model="scope.row.needCheck" disabled></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否显示" show-overflow-tooltip align="center">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.show"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="right">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-delete" class="red" size="small"
                                       @click.prevent="delTicketingItem(scope.$index)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 20px" class="wetuc-input-col943">
                    <el-button style="margin: 0 auto;display: block" @click.prevent="addTicketing">添加票务</el-button>
                </div>
            </el-form-item>


            <el-form-item v-for="(item, index) in tableData2" :key="index" :label="index === 0 ? ' ' : null">
                <el-input class="wetuc-input-col234" :placeholder="item.key" disabled v-model="item.key"
                          v-if="index >= 0 && index <= 1"></el-input>
                <div style="display: inline-block;position: relative" v-if="index === 2">
                    <el-input class="wetuc-input-col234" :placeholder="item.key" disabled v-model="item.key"></el-input>
                    <el-checkbox v-model="item.must" style="position: absolute;right: 0">必填</el-checkbox>
                </div>
                <div style="display: inline-block;position: relative" v-if="index === 3">
                    <el-input class="wetuc-input-col234" :placeholder="item.key" disabled v-model="item.key"></el-input>
                    <el-checkbox v-model="item.must" style="position: absolute;right: 0">必填</el-checkbox>
                </div>
            </el-form-item>

            <div class="wetuc-page-header">
                报名收集信息 用于收集活动人员的个人信息，展示在报名页 + 默认收集参与者姓名及手机号码，如需收集更多信息，请点击自定义项
            </div>

            <el-form-item label=" ">
                <div v-for="(item, index) in userNewsData">
                    <div style="display: inline-block;position: relative;" v-if="item.type === 'danh'">
                        <el-form-item>
                            <el-input class="wetuc-input-col943" placeholder="单行文本" v-model="item.key"></el-input>
                            <el-checkbox v-model="item.must" style="position: absolute;right: 0">必填</el-checkbox>
                            <i class="el-icon-delete red"
                               style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                               @click.prevent="deteleOptions(1,index)">删除</i>
                        </el-form-item>
                    </div>
                    <div style="display: inline-block;position: relative" v-if="item.type === 'duoh'">
                        <el-form-item>
                            <el-input type="textarea" rows="4" class="wetuc-input-col943" placeholder="多行文本"
                                      v-model="item.key"></el-input>
                            <el-checkbox v-model="item.must" style="position: absolute;right: 0">必填</el-checkbox>
                            <i class="el-icon-delete red"
                               style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                               @click.prevent="deteleOptions(1,index)">删除</i>
                        </el-form-item>
                    </div>
                    <div style="display: inline-block;position: relative" v-if="item.type === 'danx'">
                        <el-input type="textarea" rows="4" class="wetuc-input-col943" placeholder="单选问题"
                                  v-model="item.key"></el-input>
                        <el-checkbox v-model="item.must" style="position: absolute;right: 0">必填</el-checkbox>
                        <div v-for="(val, idx) in item.value" :key="idx" style="margin: 5px 0;position: relative">
                            <el-input v-model="item.value[idx]" placeholder="单选项" class="wetuc-input-col943"></el-input>
                            <i class="el-icon-edit" style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                               @click.prevent="addOptions(item.value)" v-if="idx === 0">添加选项</i>
                            <i class="el-icon-delete red"
                               style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                               @click.prevent="deteleOptions(2,idx)" v-else>删除</i>
                        </div>
                        <i class="el-icon-delete red" style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                           @click.prevent="deteleOptions(1,index)">删除</i>
                    </div>
                    <div style="display: inline-block;position: relative" v-if="item.type === 'duox'">
                        <el-input type="textarea" rows="4" class="wetuc-input-col943" placeholder="多选问题"
                                  v-model="item.key"></el-input>
                        <el-checkbox v-model="item.must" style="position: absolute;right: 0">必填</el-checkbox>
                        <div v-for="(val, idx) in item.value" :key="idx" style="margin: 5px 0;position: relative">
                            <el-input v-model="item.value[idx]" placeholder="多选项" class="wetuc-input-col943"></el-input>
                            <i class="el-icon-edit" style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                               @click.prevent="addOptions(item.value)" v-if="idx === 0">添加选项</i>
                            <i class="el-icon-delete red"
                               style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                               @click.prevent="deteleOptions(2,idx)" v-else>删除</i>
                        </div>
                        <i class="el-icon-delete red" style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                           @click.prevent="deteleOptions(1,index)">删除</i>
                    </div>
                </div>
            </el-form-item>

            <div class="wetuc-block">
                <el-form-item label=" ">
                    <div class="wetuc-input-col943"
                         style="display: flex;justify-content: center;align-content: center;align-items: center">
                        <el-button @click.prevent="lineTextClick(1)">添加单行文本</el-button>
                        <el-button @click.prevent="lineTextClick(2)">添加多行文本</el-button>
                        <el-button @click.prevent="lineTextClick(3)">添加单选问题</el-button>
                        <el-button @click.prevent="lineTextClick(4)">添加多选问题</el-button>
                    </div>
                </el-form-item>
            </div>


            <div class="wetuc-page-header">
                主办方管理信息如果要为用户添加备注信息，请添加单行文本或多行文本
            </div>

            <el-form-item label=" ">
                <div v-for="(item, index) in hostAntiData">
                    <div style="display: inline-block;position: relative;" v-if="item.type === 'danh'">
                        <el-form-item>
                            <el-input class="wetuc-input-col943" placeholder="单行文本" v-model="item.key"></el-input>
                            <el-checkbox v-model="item.must" style="position: absolute;right: 0">必填</el-checkbox>
                            <i class="el-icon-delete red"
                               style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                               @click.prevent="enterpriseDeteleOptions(1,index)">删除</i>
                        </el-form-item>

                    </div>
                    <div style="display: inline-block;position: relative" v-if="item.type === 'duoh'">
                        <el-form-item>
                            <el-input type="textarea" rows="4" class="wetuc-input-col943" placeholder="多行文本"
                                      v-model="item.key"></el-input>
                            <el-checkbox v-model="item.must" style="position: absolute;right: 0">必填</el-checkbox>
                            <i class="el-icon-delete red"
                               style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                               @click.prevent="enterpriseDeteleOptions(1,index)">删除</i>
                        </el-form-item>
                    </div>
                    <div style="display: inline-block;position: relative" v-if="item.type === 'danx'">
                        <el-input type="textarea" rows="4" class="wetuc-input-col943" placeholder="单选问题"
                                  v-model="item.key"></el-input>
                        <el-checkbox v-model="item.must" style="position: absolute;right: 0">必填</el-checkbox>
                        <div v-for="(val, idx) in item.value" :key="idx" style="margin: 5px 0;position: relative">
                            <el-input v-model="item.value[idx]" placeholder="单选项" class="wetuc-input-col943"></el-input>
                            <i class="el-icon-edit" style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                               @click.prevent="enterpriseAddOptions(item.value)" v-if="idx === 0">添加选项</i>
                            <i class="el-icon-delete red"
                               style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                               @click.prevent="enterpriseDeteleOptions(2,idx)" v-else>删除</i>
                        </div>
                        <i class="el-icon-delete red" style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                           @click.prevent="enterpriseDeteleOptions(1,index)">删除</i>
                    </div>
                    <div style="display: inline-block;position: relative" v-if="item.type === 'duox'">
                        <el-input type="textarea" rows="4" class="wetuc-input-col943" placeholder="多选问题"
                                  v-model="item.key"></el-input>
                        <el-checkbox v-model="item.must" style="position: absolute;right: 0">必填</el-checkbox>
                        <div v-for="(val, idx) in item.value" :key="idx" style="margin: 5px 0;position: relative">
                            <el-input v-model="item.value[idx]" placeholder="多选项" class="wetuc-input-col943"></el-input>
                            <i class="el-icon-edit" style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                               @click.prevent="enterpriseAddOptions(item.value)" v-if="idx === 0">添加选项</i>
                            <i class="el-icon-delete red"
                               style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                               @click.prevent="enterpriseDeteleOptions(2,idx)" v-else>删除</i>
                        </div>
                        <i class="el-icon-delete red" style="position: absolute;right: -70px;top: 15px;cursor:pointer;"
                           @click.prevent="enterpriseDeteleOptions(1,index)">删除</i>
                    </div>
                </div>
            </el-form-item>

            <div class="wetuc-block">
                <el-form-item label=" ">
                    <div class="wetuc-input-col943"
                         style="display: flex;justify-content: center;align-content: center;align-items: center">
                        <el-button @click.prevent="enterpriseClick(1)">添加单行文本</el-button>
                        <el-button @click.prevent="enterpriseClick(2)">添加多行文本</el-button>
                        <el-button @click.prevent="enterpriseClick(3)">添加单选问题</el-button>
                        <el-button @click.prevent="enterpriseClick(4)">添加多选问题</el-button>
                    </div>
                </el-form-item>
            </div>

            <div class="wetuc-block">
                <el-form-item label=" ">
                    <el-button type="primary" @click.prevent="submitForm('pageInfo', 1)">保 存</el-button>
                    <el-button type="primary" @click.prevent="submitForm('pageInfo', 3)" v-if="flag">保存到草稿</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import {loginService} from "../../service/loginService";
import {quillEditor, Quill} from 'vue-quill-editor'
import Clipboard from 'clipboard'
import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
import axios from "axios";

Quill.register('modules/ImageExtend', ImageExtend)
export default {
    props: {
        id: {
            type: String
        },
        btnFlag: {
            type: Boolean
        }
    },
    data() {
        let validatorTicketingData = (rule, value, callback) => {
            console.log(rule, value);
            if (value.length <= 0) {
                return callback(new Error('请完善票种信息!'))
            } else {
                value.forEach((item, index) => {
                    if (item.detail && item.limitNum && item.name && item.price && item.totalNum) {
                        callback()
                    } else {
                        return callback(new Error('请完善票种信息!'))
                    }
                })
            }
        }
        return {
            flag: true,
            actionUrl: process.env.API_ROOT + `oss/policy`,
            imgUrl: process.env.IMG_URL,
            positionFlag: true,
            companyFlag: true,
            pageInfo: {
                name: '',
                timeRange: [],
                timeRegis: [],
                imageUrl: '',
                content: '',
                contentImg: '',
                classId: '',
                label: [],
                options: '',
                detailAddress: '',
                showSignUpUser: 2,
                showNum: '',
                ticketingData: [],
            },
            tableData2: [
                {key: '姓名', must: true, type: 'danh'},
                {key: '手机', must: true, type: 'danh'},
                {key: '公司', must: true, type: 'danh'},
                {key: '职位', must: true, type: 'danh'}
            ],
            userNewsData: [],
            hostAntiData: [],
            classify: [],
            labelList: [],
            labelArray: [],
            props: {
                lazy: true,
                lazyLoad: (node, resolve) => this.loadNode(node, resolve)
            },
            showSignUpUserList: [{
                value: 2,
                label: '不显示已报名用户信息'
            }, {
                value: 1,
                label: '显示已报名用户信息'
            }],
            dialogOption: {
                modules: {
                    toolbar: {
                        container: container,
                        handlers: {
                            'image': function (val) {
                                if (val) {
                                    document.querySelector('.dialogOption input').click()
                                } else {
                                    this.quill.format('image', false);
                                }
                            }
                        }
                    }
                }
            },
            rules: {
                imageUrl: [{required: true, message: '请上传活动海报!', trigger: 'change'}],
                name: [{required: true, message: '请输入活动名称!', trigger: 'blur'}],
                timeRange: [{required: true, message: '请选择活动时间!', trigger: 'change'}],
                classId: [{required: true, message: '请选择活动主题!', trigger: 'change'}],
                options: [{required: true, message: '请选择活动地点!', trigger: 'change'}],
                detailAddress: [{required: true, message: '请输入活动详细地址!', trigger: 'blur'}],
                content: [{required: true, message: '请输入活动详情!', trigger: 'blur'}],
                ticketingData: [{required: true, validator: validatorTicketingData, trigger: ['change', 'blur']}],
            }
        }
    },
    computed: {
        apis() {
            return process.env.API_ROOT
        },
        picHead() {
            return process.env.IMG_URL
        },
        pcUrl() {
            return process.env.PC_URL
        }
    },
    components: {quillEditor},
    mounted() {
        this.$nextTick(() => {
            this.classify = this.getTypeList(4, ''); // 活动主题
            this.labelList = this.getTypeList(5, ''); // 活动标签
            setTimeout(() => {
                this.getDetail()
            }, 300)
        })
    },
    methods: {
        // 详情
        getDetail() {
            let that = this;
            that.flag = false;
            loginService.getActivityDetail({
                id: that.id
            }).then(res => {
                if (res.data.success) {
                    this.$nextTick(() => {
                        let result = res.data.datas
                        that.pageInfo.name = result.activityTitle
                        that.pageInfo.content = result.activityDetails
                        that.pageInfo.imageUrl = that.picHead + result.activityPoster
                        that.pageInfo.timeRange = [result.actStartTime, result.actEndTime]
                        that.pageInfo.timeRegis = [result.signupStartTime, result.signupEndTime]
                        that.pageInfo.classId = result.actTheme + '/' + result.actThemeId

                        const arr = []
                        if (result.actTagId && result.actTag) {
                            for (let i = 0; i < result.actTagId.length; i++) {
                                arr.push({
                                    value: result.actTagId[i],
                                    text: result.actTag[i]
                                })
                            }
                        }
                        that.pageInfo.label = arr
                        // 这里是赋值
                        const {prov, provCode, city, cityCode, dist, distCode} = result;
                        that.pageInfo.options = [`${prov}/${provCode}`, `${city}/${cityCode}`, `${dist}/${distCode}`];
                        that.flag = true;

                        that.pageInfo.detailAddress = result.activityAddress
                        that.pageInfo.showSignUpUser = Number(result.showUsers)
                        that.pageInfo.showNum = result.showNum


                        if (result.tickets) result.tickets.forEach(item => {
                            item.price = parseFloat(item.price / 100).toFixed(2)
                            item.needCheck = item.needCheck === 1 ? true : false
                        })
                        that.pageInfo.ticketingData = result.tickets
                        if (result.staffSign) result.staffSign.forEach(item => {
                            item.must = item.must === 1 ? true : false
                        })
                        let array = result.staffSign.slice(4, result.staffSign.length) // 切割数组
                        that.userNewsData = array
                        that.hostAntiData = result.adminSign ? result.adminSign : []
                        if (result.adminSign) result.adminSign.forEach(item => {
                            item.must = item.must === 1 ? true : false
                        })

                    })

                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 发布
        submitForm(formName, status) {
            let that = this;
            let hostLogo = '';
            if (that.pageInfo.imageUrl.indexOf(that.imgUrl) === -1) {
                hostLogo = that.pageInfo.imageUrl.substring(0, that.pageInfo.imageUrl.length)
            } else if (that.imgUrl == '/picHead/') {
                hostLogo = 'd' + that.pageInfo.imageUrl.split('d')[2];
            } else {
                hostLogo = that.pageInfo.imageUrl.substring(27, that.pageInfo.imageUrl.length)
            }
            that.$refs[formName].validate((valid) => {
                if (valid) {
                    let stime = new Date()
                    for (let i = 0; i < that.pageInfo.ticketingData.length; i++) {
                        that.pageInfo.ticketingData[i].price = parseInt(parseFloat(that.pageInfo.ticketingData[i].price) * 100)
                        that.pageInfo.ticketingData[i].needCheck = that.pageInfo.ticketingData[i].needCheck == true ? 1 : 0
                    }
                    for (let i = 0; i < that.tableData2.length; i++) {
                        that.tableData2[i].must = that.tableData2[i].must == true ? 1 : 0;
                    }
                    for (let i = 0; i < that.userNewsData.length; i++) {
                        that.userNewsData[i].must = that.userNewsData[i].must == true ? 1 : 0;
                    }
                    for (let i = 0; i < that.hostAntiData.length; i++) {
                        that.hostAntiData[i].must = that.hostAntiData[i].must == true ? 1 : 0;
                    }
                    let tagId = []
                    let tagName = []
                    that.pageInfo.label.forEach(item => {
                        tagId.push(item.value)
                        tagName.push(item.text)
                    })
                    loginService.editActivity({
                        id: that.id,
                        activityTitle: that.pageInfo.name,
                        activityPoster: hostLogo,

                        actThemeId: that.pageInfo.classId ? that.pageInfo.classId.split('/')[0] : '',
                        actTheme: that.pageInfo.classId ? that.pageInfo.classId.split('/')[1] : '',

                        prov: that.pageInfo.options ? that.pageInfo.options[0].split('/')[0] : '',
                        provCode: that.pageInfo.options ? that.pageInfo.options[0].split('/')[1] : '',
                        city: that.pageInfo.options ? that.pageInfo.options[1].split('/')[0] : '',
                        cityCode: that.pageInfo.options ? that.pageInfo.options[1].split('/')[1] : '',

                        dist: that.pageInfo.options ? that.pageInfo.options[2].split('/')[0] : '',
                        distCode: that.pageInfo.options ? that.pageInfo.options[2].split('/')[1] : '',

                        activityAddress: that.pageInfo.detailAddress,
                        activityDetails: that.pageInfo.content,
                        actTag: tagName,
                        actTagId: tagId,
                        showNum: that.pageInfo.showNum,
                        showUsers: that.pageInfo.showSignUpUser,

                        actStartTime: that.pageInfo.timeRange ? that.pageInfo.timeRange[0] : '',
                        actEndTime: that.pageInfo.timeRange ? that.pageInfo.timeRange[1] : '',

                        signupStartTime: that.pageInfo.timeRegis ? that.pageInfo.timeRegis[0] : stime.getTime(),
                        signupEndTime: that.pageInfo.timeRegis ? that.pageInfo.timeRegis[1] : that.pageInfo.timeRange[1],

                        activityStatus: status,

                        tickets: that.pageInfo.ticketingData,

                        staffSign: that.tableData2.concat(that.userNewsData),
                        adminSign: that.hostAntiData,


                    }).then(res => {
                        if (res.data.success) {
                            that.$message({
                                message: "修改成功",
                                type: "success"
                            });
                            setTimeout(() => {
                                that.$router.push({path: 'activityListManagement'})
                            }, 300)
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        loadNode(node, resolve) {
            const {level} = node
            let code = 0
            if (level != 0) {
                code = node.data.value.split('/')[1]
            }
            let apis = process.env.API_ROOT
            let url = apis + 'citys'
            if (level > 0) {
                url = apis + `citys/${code}`
            }
            axios.get(url).then(res => {
                let nodes = res.data.datas.map(({name, cityId}) => {
                    return {
                        label: name,
                        value: `${name}/${cityId}`,
                        leaf: level >= 2
                    }
                });
                resolve(nodes)
            })
        },
        labelChange(val) {
            this.labelArray = val;
        },
        // 添加票务
        addTicketing() {
            this.pageInfo.ticketingData.push({
                name: '',
                price: 0,
                totalNum: 0,
                detail: '',
                limitNum: '',
                needCheck: false,
                show: false,
                status: 1
            })
        },
        // 删除票务
        delTicketingItem(index) {
            this.pageInfo.ticketingData.splice(index, 1);
        },
        // 个人-添加文本
        lineTextClick(type) {
            let that = this;
            if (type === 1) { // 单行value: '',
                that.userNewsData.push({key: '', type: 'danh', must: 0});
            } else if (type === 2) { // 多行value: '',
                that.userNewsData.push({key: '', type: 'duoh', must: 0});
            } else if (type === 3) { // 单选
                that.userNewsData.push({value: ['', ''], key: '', type: 'danx', must: 0});
            } else if (type === 4) { // 多选
                that.userNewsData.push({value: ['', ''], key: '', type: 'duox', must: 0});
            }
        },
        // 个人-添加行
        addOptions(val) {
            val.push('')
        },
        // 个人-删除
        deteleOptions(type, index) {
            if (type === 1) {
                this.userNewsData.splice(index, 1)
            } else if (type === 2) {
                this.userNewsData.forEach(item => {
                    item.value.splice(index, 1)
                })
            }
        },
        // 企业-添加文本
        enterpriseClick(type) {
            let that = this;
            if (type === 1) { // 单行value: '',
                that.hostAntiData.push({key: '', type: 'danh', must: 0});
            } else if (type === 2) { // 多行value: '',
                that.hostAntiData.push({key: '', type: 'duoh', must: 0});
            } else if (type === 3) { // 单选
                that.hostAntiData.push({value: ['', ''], key: '', type: 'danx', must: 0});
            } else if (type === 4) { // 多选
                that.hostAntiData.push({value: ['', ''], key: '', type: 'duox', must: 0});
            }
        },
        // 企业-添加行
        enterpriseAddOptions(val) {
            val.push('')
        },
        // 企业-删除
        enterpriseDeteleOptions(type, index) {
            if (type === 1) {
                this.hostAntiData.splice(index, 1)
            } else if (type === 2) {
                this.hostAntiData.forEach(item => {
                    item.value.splice(index, 1)
                })
            }
        },
        getTypeList(typ, query) {
            let that = this, array = [];
            loginService.getArticlesType({type: typ, tagName: query}).then(function (res) {
                if (res.data.success) {
                    let newArr = res.data.datas;
                    for (let i = 0; i < newArr.length; i++) {
                        array.push({text: newArr[i].tagName, value: newArr[i].id});
                    }
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                that.$router.push({name: 'error'});
            });
            return array;
        },
        uploadCoverFile(param) {
            this.uploadSectionFile(param, 1)
        },
        reverseCardFile(param) {
            this.uploadSectionFile(param, 2)
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isPNG = file.type === 'image/png'
            const isGIF = file.type === 'image/gif'
            const isBMP = file.type === 'image/bmp'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG && !isGIF && !isPNG && !isBMP) {
                this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return (isJPG || isBMP || isGIF || isPNG) && isLt2M
        },
        uploadSectionFile(param, type) {
            loginService.getPolicy({}).then(res => {
                let that = this
                let quill = that.$refs.myQuillEditor.quill;
                const randomName = new Date().getTime() + '.' + param.file.name.split('.').pop()
                const fd = new FormData()
                const {accessid, host, policy, signature, dir, expire} = res.data.datas
                fd.append('name', randomName)
                fd.append('OSSAccessKeyId', accessid)
                fd.append('policy', policy)
                fd.append('signature', signature)
                fd.append('key', dir + randomName)
                fd.append('expire', expire)
                fd.append('success_action_status', 200)
                fd.append('file', param.file)
                if (!param.file.type.match('image.*')) {
                    that.$message.error('请上传图片格式的文件!')
                    return
                }
                const xhr = new XMLHttpRequest()
                xhr.open('post', host, true)
                xhr.upload.addEventListener('progress', (evt) => {
                    that.progress = Math.round((evt.loaded) * 100 / evt.total)
                }, false)
                xhr.addEventListener('load', (e) => {
                    if (e.target.status !== 200) {
                        that.$message.error('上传失败!')
                        return
                    }
                    if (e.target.status === 200) {
                        that.$nextTick(() => {
                            if (type === 1) {
                                that.pageInfo.imageUrl = process.env.IMG_URL + dir + randomName
                            } else if (type === 2) {
                                that.pageInfo.contentImg = process.env.IMG_URL + dir + randomName
                                // 获取光标所在位置
                                let length = quill.getSelection().index;
                                // 插入图片  res.info为服务器返回的图片地址
                                quill.insertEmbed(length, 'image', that.pageInfo.contentImg)
                                // 调整光标到最后
                            }
                        })

                    }
                }, false)
                xhr.send(fd)
            }).catch(err => {
                console.log(err)
            })
        },
        // 取消
        cancel() {
            this.$router.push({path: 'activityListManagement'})
        },
    },
}
</script>

<style scoped>
.dialogOption {
    display: none;
}

/deep/ .dialog-input-col1 .el-input-number__decrease {
    width: 25px !important;
}

/deep/ .dialog-input-col1 .el-input-number__increase {
    width: 25px !important;
}

</style>

<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/accountSettings' }">账号设置</el-breadcrumb-item>
                <el-breadcrumb-item>账号</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-tabs v-model="accountName" @tab-click="handleClick" v-loading="fullscreenLoading">
                <el-tab-pane label="账号设置" name="settings">
                    <el-form ref="setPageInfo" :model="setPageInfo" :inline="true" label-width="100px" :rules="rules">
                        <div class="wetuc-container">
                            <el-form-item label="头像" prop="imageUrl">
                                <el-upload
                                    class="avatar-uploader"
                                    accept="image/jpeg,image/gif,image/png,image/bmp"
                                    :action="actionUrl"
                                    :http-request="imageUrlFile"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload">
                                    <img v-if="setPageInfo.imageUrl" :src="setPageInfo.imageUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                            <el-form-item label="微信绑定" prop="qrCodeUrl">
                                <div id="qrCodeCanvas" class="qrCodeCanvas" v-show="qrCodeFlag"></div>
                                <el-input v-model="setPageInfo.qrCodeInput" :disabled="true" v-show="!qrCodeFlag"
                                          class="wetuc-input-col2"></el-input>
                            </el-form-item>
                        </div>
                        <div class="wetuc-container">
                            <el-form-item label="账号" prop="accountNum">
                                <el-input type="text" v-model="setPageInfo.accountNum" class="wetuc-input-col2"
                                          :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="名称" prop="name">
                                <el-input type="text" v-model="setPageInfo.name" class="wetuc-input-col2"></el-input>
                            </el-form-item>
                            <el-form-item label="联系人" prop="contacts">
                                <el-input type="text" v-model="setPageInfo.contacts" class="wetuc-input-col2"></el-input>
                            </el-form-item>
                        </div>
                        <div class="wetuc-container">
                            <el-form-item label="联系手机" prop="phone">
                                <el-input type="text" v-model="setPageInfo.phone" class="wetuc-input-col2"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="mailbox">
                                <el-input type="text" v-model="setPageInfo.mailbox" class="wetuc-input-col2"></el-input>
                            </el-form-item>
                        </div>
                        <div class="wetuc-container">
                            <el-form-item label="简介" prop="briefIntroduction">
                                <el-input type="textarea" v-model="setPageInfo.briefIntroduction" rows="4" class="wetuc-textarea-col1"></el-input>
                            </el-form-item>
                        </div>
                        <el-form-item label=" ">
                            <el-button type="primary" @click="submitForm('setPageInfo', 1)">提 交</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="企业认证" name="enterprise" v-if="!authType || authType === 2">
                     <span slot="label" v-if="accountName !== 'settings' && authType && !pageInfo.state">
                        <el-tooltip class="item" effect="dark" :content="pageInfo.reason" placement="top-start">
                            <span>企业认证</span>
                         </el-tooltip>
                    </span>
                </el-tab-pane>
                <el-tab-pane label="个人认证" name="personal" v-if="!authType || authType === 1">
                    <span slot="label" v-if="accountName !== 'settings' && authType && !pageInfo.state">
                        <el-tooltip class="item" effect="dark" :content="pageInfo.reason" placement="top-start">
                            <span>个人认证</span>
                         </el-tooltip>
                    </span>
                </el-tab-pane>
            </el-tabs>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="130px" :rules="enterpriseRules">
            <div class="wetuc-container" v-if="accountName === 'enterprise'">
                <el-form-item label="营业执照" prop="businessLicense">
                    <el-upload
                        :disabled="pageInfo.state"
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="businessLicenseFile"
                        :show-file-list="false"
                        :on-success="businessLicenseSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="pageInfo.businessLicense" :src="pageInfo.businessLicense" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>
            <div class="wetuc-container" v-if="accountName === 'personal'">
                <el-form-item label="身份证正面照" prop="frontCard">
                    <el-upload
                        :disabled="pageInfo.state"
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="frontCardFile"
                        :show-file-list="false"
                        :on-success="frontCardSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="pageInfo.frontCard" :src="pageInfo.frontCard" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="身份证背面照" prop="reverseCard">
                    <el-upload
                        :disabled="pageInfo.state"
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="reverseCardFile"
                        :show-file-list="false"
                        :on-success="reverseCardSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="pageInfo.reverseCard" :src="pageInfo.reverseCard" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>
            <div class="wetuc-container" v-if="accountName === 'personal'">
                <el-form-item label="真实姓名" prop="accountNum">
                    <el-input type="text" v-model="pageInfo.accountNum" class="wetuc-input-col2" placeholder="请输入真实姓名" :disabled="pageInfo.state"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="numId">
                    <el-input type="text" v-model="pageInfo.numId" class="wetuc-input-col2" placeholder="请输入身份证号" :disabled="pageInfo.state"></el-input>
                </el-form-item>
                <el-form-item label="联系手机" prop="phone" label-width="80px" v-if="accountName !== 'settings' && pageInfo.state">
                    <el-input type="text" v-model="pageInfo.phone" class="wetuc-input-col2" placeholder="请输入联系手机" :disabled="pageInfo.state"></el-input>
                </el-form-item>
            </div>
            <div class="wetuc-container" v-if="accountName === 'enterprise'">
                <el-form-item label="组织/企业全称" prop="organization">
                    <el-input type="text" v-model="pageInfo.organization" class="wetuc-input-col2" placeholder="请输入组织/企业全称"></el-input>
                </el-form-item>
                <el-form-item label="机构/社会信用代码" prop="mechanism">
                    <el-input type="text" v-model="pageInfo.mechanism" class="wetuc-input-col2" placeholder="请输入机构/社会信用代码"></el-input>
                </el-form-item>
            </div>
            <div class="wetuc-container" v-if="accountName !== 'settings' && !pageInfo.state">
                <el-form-item label="联系手机" prop="phone">
                    <el-input type="text" v-model="pageInfo.phone" class="wetuc-input-col2" placeholder="请输入联系手机"></el-input>
                </el-form-item>
                <el-form-item label="短信验证码" prop="code" style="position: relative">
                    <el-input type="text" v-model="pageInfo.code" class="wetuc-input-col2" placeholder="请输入4位短信验证码"></el-input>
                    <div id="captcha-box"></div>
                </el-form-item>

                <el-form-item label=" " label-width="5px" v-if="!pageInfo.state">
                    <el-button type="primary" :loading="pageInfo.getCodeBtn" @click="getCodeBtnFn('pageInfo')">{{ pageInfo.getCode }}</el-button>
                </el-form-item>
            </div>

            <div class="wetuc-container" v-if="accountName !== 'settings'">
                <el-form-item label="提现方式" prop="withdrawalMethod">
                    <el-input type="text" v-model="pageInfo.withdrawalMethod" class="wetuc-input-col2" :disabled="true">
                        <i class="el-icon-edit el-input__icon" slot="suffix">
                            <span class="el-input__span">1、6~8工作日到账，适合较大金额提现,<br/>2、手续费0.6%，微信商户收取，平台不收取任何费用</span>
                        </i>
                    </el-input>
                </el-form-item>

                <el-form-item label="选择银行" prop="selectBank">
                    <el-select v-model="pageInfo.selectBank" placeholder="请选择银行" class="wetuc-input-col2" :disabled="pageInfo.state">
                        <el-option
                            v-for="(item, index) in selectBankList"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>

            <div class="wetuc-container" v-if="accountName !== 'settings'">
                <el-form-item label="开户银行所在城市" prop="options" v-if="!pageInfo.state">
                    <el-cascader
                        :disabled="pageInfo.state"
                        class="wetuc-input-col2"
                        :props="props"
                        placeholder="请选择开户银行所在城市"
                        v-model="pageInfo.options">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="开户银行所在城市" prop="cityName" v-if="pageInfo.state">
                    <el-input type="text" v-model="pageInfo.cityName" class="wetuc-input-col2" placeholder="请选择开户银行所在城市" :disabled="pageInfo.state"></el-input>
                </el-form-item>
                <el-form-item label="开户银行支行名称" prop="nameBank">
                    <el-input type="text" v-model="pageInfo.nameBank" class="wetuc-input-col2" placeholder="请输入开户银行支行名称" :disabled="pageInfo.state"></el-input>
                </el-form-item>
                <el-form-item label="银行卡号" prop="noBank" label-width="80px">
                    <el-input type="text" v-model="pageInfo.noBank" class="wetuc-input-col2" placeholder="请输入银行卡号" :disabled="pageInfo.state"></el-input>
                </el-form-item>
            </div>



            <el-form-item label=" " v-if="accountName !== 'settings' && !pageInfo.state">
                <el-button type="primary" @click="submitForm('pageInfo', 2)">保 存</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
    import {loginService} from '../../service/loginService'
    import QRCode from 'qrcodejs2'
    import axios from "axios";

    export default {
        data () {
            let validatePhone = (rule, value, callback) => {
                let mobile = /^(1+\d{10})$/
                if (!value) {
                    return callback(new Error('请输入手机号码!'))
                } else if (!mobile.test(value)) {
                    return callback(new Error('请输入正确的手机号码!'))
                } else {
                    callback()
                }
            }
            let validateEmail = (rule, value, callback) => {
                let email = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
                if (value === '') {
                    callback(new Error('请输入联系人邮箱'))
                } else if (!email.test(value)) {
                    callback(new Error('请输入正确的邮箱'))
                } else {
                    callback()
                }
            }
            let valIP = (rule, value, callback) => {
                let Code = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                if (value === '') {
                    callback(new Error('请输入身份证号'));
                } else if(!Code.test(value)) {
                    callback(new Error('请输入正确的身份证号'));
                }else {
                    callback();
                }
            };
            let validateBankNo = (rule, value, callback) => {
                let num = /^([1-9]{1})(\d{14}|\d{18})$/
                if (value === '') {
                    callback(new Error('请输入银行卡号'));
                } else if(!num.test(value)) {
                    callback(new Error('请输入正确的银行卡号'));
                }else {
                    callback();
                }
            };
            return {
                flag: true,
                fullscreenLoading: false,
                accountName: 'settings',
                actionUrl: process.env.API_ROOT + `oss/policy`,
                imgUrl: process.env.IMG_URL,
                qCodeIdx: 1,
                authType: null, //1 个人 2 企业
                setPageInfo: {
                    accountNum: '',
                    qrCodeInput: '已认证',
                    qrCodeUrl: '',
                    imageUrl: '',
                    name: '',
                    contacts: '',
                    phone: '',
                    mailbox: '',
                    briefIntroduction: ''
                },
                pageInfo: {
                    state: false,
                    businessLicense: '',
                    frontCard: '',
                    reverseCard: '',
                    accountNum: '',
                    numId: '',
                    organization: '',
                    mechanism: '',
                    options: undefined,
                    phone: '',
                    code: '',
                    withdrawalMethod: '银行卡',
                    selectBank: '',
                    noBank: '',
                    nameBank: '',
                    cityName: '',
                    getCodeBtn: false,
                    reason: null,
                    getCode: '获取验证码'
                },

                geetestInfo: {},
                captchaObj: {},
                geetesst: false,


                props: {
                    lazy: true,
                    lazyLoad: (node, resolve) => this.loadNode(node, resolve)
                },
                selectBankList: ['工商银行','农业银行','中国银行','建设银行','交通银行','上海浦东发展银行','兴业银行','光大银行','深圳发展银行','民生银行','中信银行','招商银行','广东发展银行','华夏银行','平安银行','邮政储蓄'],
                qrCodeFlag: false,
                rules: {
                    imageUrl: [{required: true, message: '请上传头像!', trigger: 'change'}],
                    name: [{required: true, message: '请输入名称!', trigger: 'blur'},
                        {min: 2, max: 5, message: '长度在 2 到 5 个字符!', trigger: 'blur'}],
                    contacts: [{required: true, message: '请输入联系人!', trigger: 'blur'},
                        {min: 2, max: 5, message: '长度在 2 到 5 个字符!', trigger: 'blur'}],
                    phone: [{required: true, validator: validatePhone, trigger: 'blur'}],
                    mailbox: [{required: true, validator: validateEmail, trigger: 'blur'}],
                    briefIntroduction: [{required: true, message: '请输入简介!', trigger: 'blur'}]
                },
                enterpriseRules: {
                    businessLicense: [
                        { required: true, message: '请上传营业执照', trigger: 'change' },
                    ],
                    frontCard: [
                        { required: true, message: '请上传身份证正面照', trigger: 'change' },
                    ],
                    reverseCard: [
                        { required: true, message: '请上传身份证反面照', trigger: 'change' },
                    ],
                    accountNum: [
                        { required: true, message: '请输入名称', trigger: 'blur' },
                    ],

                    organization: [
                        { required: true, message: '请输入组织/企业全称', trigger: 'blur' },
                    ],

                    mechanism: [
                        { required: true, message: '请输入机构/社会信用代码', trigger: 'blur' },
                    ],

                    numId: [
                        { required: true, validator: valIP, trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, validator: validatePhone, trigger: 'blur' },
                    ],
                    code: [
                        { required: true, message: '请输入短信验证码', trigger: 'blur' },
                    ],
                    selectBank: [
                        { required: true, message: '请选择银行', trigger: 'blur' },
                    ],
                    noBank: [
                        { required: true, validator: validateBankNo, trigger: 'blur' },
                    ],
                    nameBank: [
                        { required: true, message: '请输入开户银行支行名称', trigger: 'blur' },
                    ],
                    options: [
                        { required: true, message: '请选择开户银行所在城市', trigger: 'change' },
                    ]
                }
            }
        },
        computed: {
            apis() {
                return process.env.API_ROOT
            },
            picHead() {
                return process.env.IMG_URL
            }
        },
        // 方法
        methods: {
            getsettPageInfo () {
                let that = this
                that.fullscreenLoading = true;
                that.pageInfo.state = false;
                loginService.getAdminInfo({}).then(res => {
                    if(res.data.success) {
                        if (res.data.datas.wechatBind) {
                            that.qrCodeFlag = false
                        } else {
                            that.qrCodeFlag = true
                        }
                        that.setPageInfo.imageUrl = process.env.IMG_URL + res.data.datas.hostLogo
                        that.setPageInfo.accountNum = res.data.datas.account
                        that.setPageInfo.name = res.data.datas.hostCompany
                        that.setPageInfo.contacts = res.data.datas.hostName
                        that.setPageInfo.phone = res.data.datas.hostPhone
                        that.setPageInfo.mailbox = res.data.datas.hostEmail
                        that.setPageInfo.briefIntroduction = res.data.datas.hostDesc
                        if (that.qrCodeFlag && that.qCodeIdx <= 1) {
                            that.getWechaturl()
                            ++that.qCodeIdx //阻止每次保存数据后页面多出来的new QCode 二维码
                        }
                        setTimeout(() => {
                            that.fullscreenLoading = false;
                        }, 200);
                        that.authType = res.data.datas.authHis ? res.data.datas.authHis[0].authType : false
                        if(that.authType) {
                            let id = res.data.datas.authHis[0].id;
                            let authStatus = res.data.datas.authHis[0].authStatus
                            let adminId = res.data.datas.id;
                            // 获取详情
                            loginService.getCertification(id, adminId, {}).then(res => {
                                if(res.data.success) {
                                    let result = res.data.datas;
                                    that.pageInfo.frontCard = that.picHead + result.cardFrontPic
                                    that.pageInfo.reverseCard = that.picHead + result.cardOppositePic
                                    that.pageInfo.accountNum = result.realName
                                    that.pageInfo.numId = result.cardNo ? result.cardNo.replace(/^(\d{4})\d+(\d{4})$/,"$1****$2") : ''
                                    that.pageInfo.phone = result.phone

                                    // 这里是赋值
                                    const { bankProvince, bankCity } = result;
                                    that.pageInfo.cityName = bankProvince + '/' + bankCity;
                                    that.pageInfo.selectBank = result.bankName
                                    that.pageInfo.nameBank = result.subbranchName
                                    that.pageInfo.noBank = result.bankCardNo

                                    switch (authStatus) {
                                        case 1: {
                                            that.pageInfo.reason = '账号认证已提交，请等待审核。'
                                            that.pageInfo.state = true;
                                            break
                                        }
                                        case 2: {
                                            that.pageInfo.reason = '您的账号认证已经通过审核，如需修改请再次提交申请。'
                                            that.pageInfo.state = false;
                                            break
                                        }
                                        case 3: {
                                            that.pageInfo.reason = '您的账号认证被拒绝，原因：' + result.failReason
                                            that.pageInfo.state = false;
                                            break
                                        }
                                    }

                                }
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                    } else {
                        that.$message.error(res.data.message)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 二维码
            getWechaturl () {
                loginService.getWechaturl({}).then(res => {
                    if (res.data.success) {
                        this.setPageInfo.qrCodeUrl = res.data.datas
                        this.getQRCode(res.data.datas)
                    }
                }).catch(err => {
                    console.log(err)
                })

            },
            getQRCode (url) {
                let qrCodeCanvas = new QRCode('qrCodeCanvas', url, (error) => {
                    width: 100
                    height: 100
                    if (error) {
                    } else {
                    }
                })
            },
            loadNode(node, resolve) {
                const { level } = node
                let code = 0
                if(level != 0) {
                    code = node.data.value.split('/')[1]
                }
                let apis = process.env.API_ROOT
                let url = apis + 'citys'
                if(level > 0) {
                    url = apis + `citys/${code}`
                }
                axios.get(url).then(res => {
                    let nodes = res.data.datas.map(({ name, cityId }) => {
                        return {
                            label: name,
                            value: `${name}/${cityId}`,
                            leaf: level >= 2
                        }
                    });
                    resolve(nodes)
                })
            },
            // 上传
            handleAvatarSuccess (res, file) {
                this.setPageInfo.imageUrl = URL.createObjectURL(file.raw)
            },
            businessLicenseSuccess (res, file) {
                this.pageInfo.businessLicense = URL.createObjectURL(file.raw)
            },
            frontCardSuccess (res, file) {
                this.pageInfo.frontCard = URL.createObjectURL(file.raw)
            },
            reverseCardSuccess (res, file) {
                this.pageInfo.reverseCard = URL.createObjectURL(file.raw)
            },
            getCodeBtnFn(formName) {
                let that = this;
                that.$refs[formName].validateField('phone', (err)=> {
                    if (!err) {
                        that.getgaptchas(that.pageInfo.phone)
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            getgaptchas(phone) {
                let that = this
                let captchaBox = document.getElementById('captcha-box')
                captchaBox.style.display = 'none'
                loginService.getGaptchas({}).then(res => {
                    captchaBox.style.display = 'block'
                    initGeetest({
                        // 以下配置参数来自服务端 SDK
                        gt: res.data.gt,
                        challenge: res.data.challenge,
                        product: 'float', // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                        offline: res.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
                        width: '100%',
                    }, function (captchaObj) {
                        // 这里可以调用验证实例 captchaObj 的实例方法
                        captchaObj.appendTo(captchaBox)
                        captchaObj.onSuccess(function () {
                            let result = captchaObj.getValidate()
                            that.geetestInfo = result
                            that.captchaObj = captchaObj
                            let seccode = result.geetest_seccode
                            seccode = seccode.split('|')
                            seccode = seccode.join(',')
                            that.geetesst = true
                            loginService.getValidateMess({
                                phone: phone,
                                type: 2,
                                challenge:  that.geetestInfo.geetest_challenge,
                                validate: that.geetestInfo.geetest_validate,
                                seccode: seccode
                            }).then(res => {
                                if(res.data.success) {
                                    captchaBox.style.display = 'none'
                                    let endTime = 60;
                                    that.pageInfo.getCodeBtn = true;
                                    that.pageInfo.getCode = endTime + 's后重新获取'
                                    that.timer = setInterval(() => {
                                        if(endTime > 0 && endTime <= 60) {
                                            endTime--
                                            that.pageInfo.getCode = endTime + 's后重新获取'
                                            that.pageInfo.getCodeBtn = true;
                                        } else {
                                            that.pageInfo.getCodeBtn = false;
                                            that.pageInfo.getCode = '获取验证码'
                                            clearInterval(that.timer)
                                            that.timer = null
                                        }
                                    }, 1000)
                                } else {
                                    let errorMessage = '';
                                    errorMessage = res.data.message;
                                    that.$message.error(errorMessage)
                                    captchaBox.style.display = 'none'
                                    // let removeObj = document.getElementsByClassName('geetest_holder')[0];
                                    // removeObj.parentNode.removeChild(removeObj);
                                    // that.getgaptchas()
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                        })
                    })
                }).catch(err => {
                    console.log(err);
                })
            },
            beforeAvatarUpload (file) {
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
            imageUrlFile(param) {
                this.uploadSectionFile(param, 0)
            },
            businessLicenseFile(param) {
                this.uploadSectionFile(param, 1)
            },
            frontCardFile(param) {
                this.uploadSectionFile(param, 2)
            },
            reverseCardFile(param) {
                this.uploadSectionFile(param, 3)
            },
            uploadSectionFile (param, type) {
                loginService.getPolicy({}).then(res => {
                    let that = this
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
                                if(type === 0) {
                                    that.setPageInfo.imageUrl = process.env.IMG_URL + dir + randomName
                                } else if (type === 1) {
                                    that.pageInfo.businessLicense = process.env.IMG_URL + dir + randomName
                                } else if (type === 2) {
                                    that.pageInfo.frontCard = process.env.IMG_URL + dir + randomName
                                } else if (type === 3) {
                                    that.pageInfo.reverseCard = process.env.IMG_URL + dir + randomName
                                }
                            })
                            return
                        }
                    }, false)
                    xhr.send(fd)
                }).catch(err => {
                    console.log(err)
                })
            },
            // 提交
            submitForm (formName) {
                let that = this
                if(type === 1) {
                    let hostLogo = ''
                    if (that.setPageInfo.imageUrl.indexOf(that.imgUrl) === -1) {
                        hostLogo = that.setPageInfo.imageUrl.substring(0, that.setPageInfo.imageUrl.length)
                    } else if (that.imgUrl == '/picHead/') {
                        hostLogo = that.setPageInfo.imageUrl.substring(8, that.setPageInfo.imageUrl.length)
                    } else {
                        hostLogo = that.setPageInfo.imageUrl.substring(27, that.setPageInfo.imageUrl.length)
                    }
                    that.$refs[formName].validate((valid) => {
                        if (valid) {
                            loginService.postAdminInfo({
                                hostCompany: that.setPageInfo.contacts,
                                hostLogo: hostLogo,
                                hostPhone: that.setPageInfo.phone,
                                hostName: that.setPageInfo.name,
                                hostEmail: that.setPageInfo.mailbox,
                                hostDesc: that.setPageInfo.briefIntroduction,
                            }).then(res => {
                                if (res.data.success) {
                                    that.$message({
                                        type: 'success',
                                        message: '保存成功'
                                    })
                                    that.getsettPageInfo()
                                } else {
                                    that.$message.error(res.data.message)
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        } else {
                            console.log('error submit!!')
                            return false
                        }
                    })
                } else if (type === 2) {
                    if(that.accountName === 'personal') {
                        let frontCard = ''
                        let reverseCard = ''
                        if (that.pageInfo.imageUrl.indexOf(that.imgUrl) === -1) {
                            frontCard = that.pageInfo.frontCard.substring(0, that.pageInfo.frontCard.length)
                            reverseCard = that.pageInfo.reverseCard.substring(0, that.pageInfo.reverseCard.length)
                        } else if (that.imgUrl == '/picHead/') {
                            frontCard = that.pageInfo.frontCard.substring(8, that.pageInfo.frontCard.length)
                            reverseCard = that.pageInfo.reverseCard.substring(8, that.pageInfo.reverseCard.length)
                        } else {
                            frontCard = that.pageInfo.frontCard.substring(27, that.pageInfo.frontCard.length)
                            reverseCard = that.pageInfo.reverseCard.substring(27, that.pageInfo.reverseCard.length)
                        }
                        that.$refs[formName].validate((valid) => {
                            if (valid) {
                                loginService.applyCertification({
                                    authType: 1,
                                    realName: that.pageInfo.accountName,
                                    cardNo: that.pageInfo.numId,
                                    cardFrontPic: frontCard,
                                    cardOppositePic: reverseCard,
                                    bankProvince: that.pageInfo.cityName.split('/')[0],
                                    bankCity: that.pageInfo.cityName.split('/')[1],
                                    bankName: that.pageInfo.selectBank,
                                    subbranchName: that.pageInfo.nameBank,
                                    bankCardNo: that.pageInfo.noBank,
                                    phone: that.pageInfo.phone,
                                    smsCode: that.pageInfo.code,
                                    radio: 1,
                                    bankCitys: ['1'],
                                    geetesst: false,
                                    type: 2,
                                }).then(res => {
                                    if (res.data.success) {
                                        that.$message({
                                            type: 'success',
                                            message: '保存成功'
                                        })
                                        that.getsettPageInfo()
                                    } else {
                                        that.$message.error(res.data.message)
                                    }
                                }).catch(err => {
                                    console.log(err)
                                })
                            } else {
                                console.log('error submit!!')
                                return false
                            }
                        })
                    } else {
                        // 企业认证。
                        // 地址回显
                        console.log('qiyerenzheng')
                    }
                }

            },
            handleClick (tab, event) {
                // console.log(tab, event)
            }
        },
        // 页面初始化
        mounted () {
            this.getsettPageInfo()
        }
    }
</script>

<style scoped>

#captcha-box {
    width: 100%;
    height: 44px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #C0C4CC;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    display: none;
}
</style>

<template>
    <div class="wetuc-page-content">
        <el-form ref="pageInfo" :model="pageInfo" label-width="100px" :inline="true" :rules="rules">
            <div class="wetuc-block">
                <el-form-item label="邀请函封面图" prop="imageUrl">
                    <el-upload
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="imageUrlFile"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="pageInfo.imageUrl" :src="pageInfo.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

            </div>

            <el-form-item label="互动设置">
                <el-select v-model="pageInfo.state" placeholder="请选择互动设置" class="wetuc-input-col2">
                    <el-option
                        v-for="item in stateList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="背景颜色" prop="color">
                <el-color-picker v-model="pageInfo.color"></el-color-picker>
            </el-form-item>

            <div class="wetuc-block">
                <el-form-item label="介绍" prop="content">
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

            <el-form-item label=" ">
                <el-button type="primary" @click="preserExpandContent('pageInfo')">保 存</el-button>
            </el-form-item>
        </el-form>




        <template v-for="itemText in activityDescTypes">
            <div class="wetuc-block">
                <div class="wetuc-page-header">
                    <el-input v-model="itemText.title" placeholder="placeholder" class="wetuc-input3-col3" :readonly="true">
                        <i class="el-icon-edit el-input__icon" slot="suffix" style="cursor: pointer" @click="handleIconClick(itemText, 1)"></i>
                    </el-input>
                </div>
                <div v-for="(item, programIndex) in programOutline" v-if="itemText.type === 1">
                    <el-form :model="item" :inline="true" label-width="100px">
                        <el-form-item label=" " style="width: 100%" class="programOutline">
                            <el-input v-model="item.time" placeholder="时间" :disabled="item.disabledFlag" class="wetuc-input-col2"></el-input>
                            <el-input v-model="item.textContent" placeholder="摘要" :disabled="item.disabledFlag" class="wetuc-input-col2"></el-input>
                            <span class="spans" v-if="item.presrAndedit" @click="preser('programOutline', item)">保存</span>
                            <span class="spans" v-if="!item.presrAndedit" @click="editClick('programOutline', item)">编辑</span>
                            <span class="spans" @click="deleteClick('programOutline', programIndex, item)">删除</span>
                            <span class="spans" @click="moveUpward('programOutline', programIndex, item)">上移</span>
                            <span class="spans" @click="moveDown('programOutline', programIndex, item)">下移</span>
                            <span class="spans" @click="addFunction('programOutline')" v-if="programIndex === 0">添加</span>
                            <!--v-if="programIndex !== programOutline.length - 1"-->
                        </el-form-item>
                    </el-form>
                </div>

                <div v-for="(item, index) in guestIntroduction" :key="'guestIntroduction' + index" v-if="itemText.type === 2">
                    <el-form :model="item" label-width="100px" :inline="true">
                        <el-form-item label=" " style="width: 100%" class="guestIntroduction">
                            <div style="display: flex;align-items: center">
                                <tucUpOss v-model="item.url" :imageUrl="item.url" v-on:getFileUrl="backUrl1" :ref="'myCropper' + index" :str='index' :clearFlag="!item.presrAndedit"></tucUpOss>
                                <el-input :disabled="item.disabledFlag" v-model="item.name" placeholder="姓名" class="wetuc-input-col2" style="margin: 0 5px"></el-input>
                                <el-input :disabled="item.disabledFlag" v-model="item.textContent" placeholder="简介" class="wetuc-input-col2"></el-input>
                                <span class="spans" v-if="item.presrAndedit" @click="preser('guestIntroduction', item)">保存</span>
                                <span class="spans" v-if="!item.presrAndedit" @click="editClick('guestIntroduction', item)">编辑</span>
                                <span class="spans" @click="deleteClick('guestIntroduction', index, item)">删除</span>
                                <span class="spans" @click="moveUpward('guestIntroduction', index, item)">上移</span>
                                <span class="spans" @click="moveDown('guestIntroduction', index, item)">下移</span>
                                <span class="spans" @click="addFunction('guestIntroduction')" v-if="index === 0">添加</span>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>

                <div v-for="(item, index) in pastReview" :key="'pastReview' + index" v-if="itemText.type == 3">
                    <el-form ref="item" :model="item" label-width="100px">
                        <el-form-item label=" " style="width: 100%" class="guestIntroduction">
                            <div style="display: flex;align-items: center">
                                <tucUpOss v-model="item.url" :imageUrl="item.url" v-on:getFileUrl="backUrl2" :ref="'myCropperPastReview' + index" :str='index' :clearFlag="!item.presrAndedit"></tucUpOss>
                                <el-input :disabled="item.disabledFlag" v-model="item.title" placeholder="标题" class="wetuc-input-col2" style="margin: 0 5px"></el-input>
                                <el-input :disabled="item.disabledFlag" v-model="item.linkSrc" placeholder="链接" class="wetuc-input-col2"></el-input>
                                <span class="spans" v-if="item.presrAndedit" @click="preser('pastReview', item)">保存</span>
                                <span class="spans" v-if="!item.presrAndedit" @click="editClick('pastReview', item)">编辑</span>
                                <span class="spans" @click="deleteClick('pastReview', index, item)">删除</span>
                                <span class="spans" @click="moveUpward('pastReview', index, item)">上移</span>
                                <span class="spans" @click="moveDown('pastReview', index, item)">下移</span>
                                <span class="spans" @click="addFunction('pastReview')" v-if="index === 0">添加</span>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>

                <div v-for="(item, index) in contactUs" :key="'contactUs' + index" v-if="itemText.type == 4">
                    <el-form ref="item" :model="item" label-width="100px">
                        <el-form-item label=" " style="width: 100%" class="guestIntroduction">
                            <div style="display: flex;align-items: center">
                                <tucUpOss v-model="item.url" :imageUrl="item.url" v-on:getFileUrl="backUrl3" :ref="'myCropperContactUs' + index" :str='index' :clearFlag="!item.presrAndedit"></tucUpOss>

                                <el-input :disabled="item.disabledFlag" v-model="item.intelligence" placeholder="职能" class="wetuc-input-col1" style="margin: 0 5px"></el-input>
                                <el-input :disabled="item.disabledFlag" v-model="item.name" placeholder="姓名" class="wetuc-input-col1" style="margin: 0 5px"></el-input>
                                <el-input :disabled="item.disabledFlag" v-model="item.phoneNo" placeholder="手机号" class="wetuc-input-col1" style="margin: 0 5px"></el-input>
                                <el-input :disabled="item.disabledFlag" v-model="item.wxNo" placeholder="微信号" class="wetuc-input-col1" style="margin: 0 5px"></el-input>
                                <el-input :disabled="item.disabledFlag" v-model="item.mailNo" placeholder="邮箱" class="wetuc-input-col1"></el-input>
                                <span class="spans" v-if="item.presrAndedit" @click="preser('contactUs', item)">保存</span>
                                <span class="spans" v-if="!item.presrAndedit" @click="editClick('contactUs', item)">编辑</span>
                                <span class="spans" @click="deleteClick('contactUs', index, item)">删除</span>
                                <span class="spans" @click="moveUpward('contactUs', index, item)">上移</span>
                                <span class="spans" @click="moveDown('contactUs', index, item)">下移</span>
                                <span class="spans" @click="addFunction('contactUs')" v-if="index === 0">添加</span>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </template>

        <el-dialog title="编辑标题" :visible.sync="dialogTextFormVisible" width="20%" :close-on-click-modal="false">
            <el-form :model="dialogTextForm">
                <el-form-item label="标题名称" label-width="100px">
                    <el-input v-model="dialogTextForm.dialogTextInput" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="前台是否显示" label-width="100px">
                    <el-radio v-model="dialogTextForm.show" :label="true">显示</el-radio>
                    <el-radio v-model="dialogTextForm.show" :label="false">隐藏</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTextFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogTextFormVisibleFun(dialogTextForm)">确 定</el-button>
            </div>
        </el-dialog>
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
import tucUpOss from '../tuc-up-oss/index.vue'
import imgItem from '../../assets/img/logo/header.png'

Quill.register('modules/ImageExtend', ImageExtend)
export default {
    props: {
        id: {
            type: String
        }
    },
    data() {
        return {
            actionUrl: process.env.API_ROOT + `oss/policy`,
            imgUrl: process.env.IMG_URL,
            pageInfo: {
                imageUrl: '',
                state: '0',
                color: '',
                content: '',
                contentImg: '',
            },
            activityDescTypes: [],
            programOutlineText: '活动议程',
            programOutlineFlag: true,
            programOutline: [{
                id: '',
                time: '',
                textContent: '',
                presrAndedit: true,
                disabledFlag: false
            }],
            guestIntroductionText: '嘉宾介绍',
            guestIntroductionFlag: true,
            guestIntroduction: [{
                id: '',
                url: '',
                name: '',
                textContent: '',
                presrAndedit: true,
                disabledFlag: false
            }],
            recentReviewText: '往期回顾',
            recentReviewFlag: true,
            pastReview: [{
                id: '',
                url: '',
                title: '',
                linkSrc: '',
                presrAndedit: true,
                disabledFlag: false
            }],
            contactUsText: '联系我们',
            contactUsFlag: true,
            contactUs: [{
                id: '',
                url: '',
                intelligence: '',
                name: '',
                phoneNo: '',
                wxNo: '',
                mailNo: '',
                presrAndedit: true,
                disabledFlag: false
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
            stateList: [{
               value: 0,
               label: '无'
            },{
                value: 1,
                label: '生成海报'
            }],
            dialogTextFormVisible: false,
            dialogTextForm: {
                dialogTextInput: '',
                show: true,
                index: ''
            },
            rules: {
                imageUrl: [{required: true, message: '请上传图片', trigger: ['blur', 'change']}],
                color: [{required: true, message: '请选择颜色', trigger: ['blur', 'change']}]
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
    components: {
        quillEditor,
        tucUpOss
    },
    mounted() {
        this.$nextTick(() =>{
            this.getActivityDetail()
        })
    },
    methods: {
        // 获取内容
        getActivityDetail() {
            let that = this;
            loginService.getActivityDetails(that.id, {}).then(res => {
                if (res.data.success) {
                    that.pageInfo.state = res.data.datas.game;
                    that.pageInfo.content = res.data.datas.descContent;
                    that.pageInfo.color = res.data.datas.templateColor;
                    that.pageInfo.imageUrl = that.picHead + res.data.datas.templatePoster;
                    that.activityDescTypes = res.data.datas.activityDescTypes;
                    that.getExpandContent(1);
                    that.getExpandContent(2);
                    that.getExpandContent(3);
                    that.getExpandContent(4);
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 单项保存
        preserExpandContent(formName) {
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
                    loginService.preserExpandContent(that.id, {
                        templateColor: that.pageInfo.color,
                        templatePoster: hostLogo,
                        game: that.pageInfo.state,
                        descContent: that.pageInfo.content,
                    }).then(res => {
                        if (res.data.success) {
                            that.$message({
                                type: 'success',
                                message: '保存成功!'
                            });
                        }
                        setTimeout(() => {
                            that.$router.push({path: 'activityListManagement'})
                        }, 200);
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 嘉宾介绍 图片地址
        backUrl1(newVal, index) {
            if (typeof index === 'number') {
                this.$nextTick(() => {
                    this.guestIntroduction[index].url = this.picHead + newVal;
                    this.$refs['myCropper' + index].imageUrl = this.picHead + newVal;
                })
            } else {
                this.guestIntroduction[index].url = '';
                this.$refs['myCropper' + index].imageUrl = '';
            }
        },
        backUrl2(newVal, index) {
            if (typeof index === 'number') {
                this.$nextTick(() => {
                    this.pastReview[index].url = this.picHead + newVal;
                    this.$refs['myCropperPastReview' + index].imageUrl = this.picHead + newVal;
                })
            } else {
                this.pastReview[index].url = '';
                this.$refs['myCropperPastReview' + index].imageUrl = '';
            }
        },
        backUrl3(newVal, index) {
            if (typeof index === 'number') {
                this.$nextTick(() => {
                    this.contactUs[index].url = this.picHead + newVal;
                    this.$refs['myCropperContactUs' + index].imageUrl = this.picHead + newVal;
                })
            } else {
                this.contactUs[index].url = '';
                this.$refs['myCropperContactUs' + index].imageUrl = '';
            }
        },
        // 添加
        addFunction(type) {
            let that = this;
            if (type === 'programOutline') {
                that.programOutline.push({
                    time: '',
                    textContent: '',
                    presrAndedit: true,
                    disabledFlag: false
                })
            } else if (type === 'guestIntroduction') {
                that.guestIntroduction.push({
                    url: '',
                    name: '',
                    textContent: '',
                    presrAndedit: true,
                    disabledFlag: false
                })
            } else if (type === 'pastReview') {
                that.pastReview.push({
                    url: '',
                    title: '',
                    linkSrc: '',
                    presrAndedit: true,
                    disabledFlag: false
                })
            } else if (type === 'contactUs') {
                that.contactUs.push({
                    url: '',
                    intelligence: '',
                    name: '',
                    phoneNo: '',
                    wxNo: '',
                    mailNo: '',
                    presrAndedit: true,
                    disabledFlag: false
                })
            }
        },
        // 修改内容
        handleIconClick(item, index) {
            let that = this;
            that.dialogTextFormVisible = true;
            that.dialogTextForm.dialogTextInput = item.title;
            that.dialogTextForm.show = item.show;
            that.dialogTextForm.index = index;
        },
        dialogTextFormVisibleFun(item) {
            let that = this;
            loginService.editTitleDescType(that.id, {
                type: item.index,
                title: item.dialogTextInput,
                show: item.show
            }).then(res => {
                if(res.data.success) {
                    that.dialogTextFormVisible = false;
                    that.reload()
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 上传
        handleAvatarSuccess (res, file) {
            this.pageInfo.imageUrl = URL.createObjectURL(file.raw)
        },
        imageUrlFile(param) {
            this.uploadSectionFile(param, 1)
        },
        reverseCardFile(param) {
            this.uploadSectionFile(param, 2)
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
                this.$message.error('上传图片大小不能超过 2MB!')
            }
            return (isJPG || isBMP || isGIF || isPNG) && isLt2M
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
                            if(type === 1) {
                                that.pageInfo.imageUrl = process.env.IMG_URL + dir + randomName
                            } else if(type === 2) {
                                that.pageInfo.contentImg = process.env.IMG_URL + dir + randomName
                                // 获取光标所在位置
                                let length = quill.getSelection().index;
                                // 插入图片  res.info为服务器返回的图片地址
                                quill.insertEmbed(length, 'image', that.pageInfo.contentImg)
                                // 调整光标到最后
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
        // 保存
        preser(info, item) {
            let that = this;
            if (info === 'programOutline') {
                item.presrAndedit = false;
                item.disabledFlag = true;
                if (item.id !== '' && item.id !== undefined && item.id !== null) {
                    that.editExpandContent(item.id, 1, '', [item.time, item.textContent])
                } else {
                    that.addExpandContent(1, '', [item.time, item.textContent])
                }
            } else if (info === 'guestIntroduction') {
                item.presrAndedit = false;
                item.disabledFlag = true;
                if (item.id !== '' && item.id !== undefined && item.id !== null) {
                    that.editExpandContent(item.id, 2, item.url, [item.name, item.textContent])
                } else {
                    that.addExpandContent(2, item.url, [item.name, item.textContent])
                }
            } else if (info === 'pastReview') {
                item.presrAndedit = false;
                item.disabledFlag = true;
                if (item.id !== '' && item.id !== undefined && item.id !== null) {
                    that.editExpandContent(item.id, 3, item.url, [item.title, item.linkSrc])
                } else {
                    that.addExpandContent(3, item.url, [item.title, item.linkSrc])
                }
            } else if (info === 'contactUs') {
                item.presrAndedit = false;
                item.disabledFlag = true;
                if (item.id !== '' && item.id !== undefined && item.id !== null) {
                    that.editExpandContent(item.id, 4, item.url, [item.intelligence, item.name, item.phoneNo, item.wxNo, item.mailNo])
                } else {
                    that.addExpandContent(4, item.url, [item.intelligence, item.name, item.phoneNo, item.wxNo, item.mailNo])
                }
            } else if (info === 'activityIntroduction') {
                that.addExpandContent()
            }
        },
        // 保存公共方法
        addExpandContent(type, url, contents) {
            let that = this;
            if (url.indexOf(that.imgUrl) === -1) {
                url = url.substring(0, url.length);
            } else if (that.imgUrl == '/picHead/') {
                url = 'd' + url.split('d')[2];
            } else {
                url = url.substring(27, that.pageInfo.imageUrl.length)
            }
            loginService.addExpandContent(that.id, {
                type: type ? type : '',
                url: url ? url : '',
                contents: contents
            }).then(res => {
                if (res.data.success) {
                    that.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                }
                setTimeout(() => {
                    that.getExpandContent(type);
                    // that.$router.go(0);
                }, 200);
            }).catch(err => {
                console.log(err);
            });
        },
        // 上移
        moveUpward(info, index, item) {
            let that = this;
            if (info === 'programOutline') {
                that.sortExpandContent(item, 1, 1);
            } else if (info === 'guestIntroduction') {
                that.sortExpandContent(item, 1, 2);
            } else if (info === 'pastReview') {
                that.sortExpandContent(item, 1, 3);
            } else if (info === 'contactUs') {
                that.sortExpandContent(item, 1, 4);
            }
        },
        // 下移
        moveDown(info, index, item) {
            let that = this;
            if (info === 'programOutline') {
                that.sortExpandContent(item, 2, 1);
            } else if (info === 'guestIntroduction') {
                that.sortExpandContent(item, 2, 2);
            } else if (info === 'pastReview') {
                that.sortExpandContent(item, 2, 3);
            } else if (info === 'contactUs') {
                that.sortExpandContent(item, 2, 4);
            }
        },
        // 公共排序方法
        sortExpandContent(item, upDown, type) {
            let that = this;
            loginService.sortExpandContent(that.id, item.id, {
                operate: upDown
            }).then(res => {
                if (res.data.success) {
                    that.$message({
                        type: 'success',
                        message: '移动成功'
                    });
                    setTimeout(function () {
                        that.getExpandContent(type);
                        // that.$router.go(0);
                    }, 200);
                } else {
                    that.$message({
                        type: 'info',
                        message: res.data.message
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 删除
        deleteClick(info, index, item) {
            let that = this;
            if (info === 'programOutline') {
                if (index !== -1) {
                    that.delateExpandContent(item, 1);
                }
            } else if (info === 'guestIntroduction') {
                if (index !== -1) {
                    that.delateExpandContent(item, 2);
                }
            } else if (info === 'pastReview') {
                if (index !== -1) {
                    that.delateExpandContent(item, 3);
                }
            } else if (info === 'contactUs') {
                if (index !== -1) {
                    that.delateExpandContent(item, 4);
                }
            }
        },
        //公共删除方法
        delateExpandContent(item, type) {
            let that = this;
            loginService.delateExpandContent(that.id, item.id, {}).then(res => {
                if (res.data.success) {
                    that.$message({
                        type: 'info',
                        message: '删除成功'
                    });
                    setTimeout(() => {
                        that.getExpandContent(type);
                        // that.$router.go(0);
                    }, 200);
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 编辑
        editClick(info, item) {
            if (info === 'programOutline') {
                item.presrAndedit = true;
                item.disabledFlag = false;
            } else if (info === 'guestIntroduction') {
                item.presrAndedit = true;
                item.disabledFlag = false;
            } else if (info === 'pastReview') {
                item.presrAndedit = true;
                item.disabledFlag = false;
            } else if (info === 'contactUs') {
                item.presrAndedit = true;
                item.disabledFlag = false;
            }
        },

        // 公共编辑方法
        editExpandContent(id, type, url, contents) {
            let that = this;
            if (url.indexOf(that.$store.state.picHead) === -1) {
                url = url.substring(0, url.length);
            } else {
                url = url.substring(26, url.length);
            }
            loginService.editExpandContent(that.id, {
                id: id,
                type: type ? type : '',
                url: url ? url : '',
                contents: contents
            }).then(res => {
                if (res.data.success) {
                    that.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    setTimeout(function () {
                        that.getExpandContent(type);
                        // that.$router.go(0);
                    }, 200);
                }
            }).catch(err => {
                console.log(err);
            });
        },
        getExpandContent(type) {
            let that = this;
            let picHead = that.picHead;
            loginService.getExpandContent(that.id, {
                type: type
            }).then(res => {
                if (res.data.success) {
                    let result = res.data.datas;
                    type === 1 && result.length >= 1 ? that.programOutline = [] : that.programOutline;
                    type === 2 && result.length >= 1 ? that.guestIntroduction = [] : that.guestIntroduction;
                    type === 3 && result.length >= 1 ? that.pastReview = [] : that.pastReview;
                    type === 4 && result.length >= 1 ? that.contactUs = [] : that.contactUs;
                    result.forEach((item) => {
                        if (item.type === 1) {
                            that.programOutline.unshift({
                                id: item.id,
                                time: item.contents['0'],
                                textContent: item.contents['1'],
                                disabledFlag: item.available
                            });
                        } else if (item.type === 2) {
                            that.guestIntroduction.unshift({
                                id: item.id,
                                url: item.url ? picHead + item.url : imgItem,
                                name: item.contents['0'],
                                textContent: item.contents['1'],
                                disabledFlag: item.available
                            });
                            console.log(that.guestIntroduction);
                        } else if (item.type === 3) {
                            that.pastReview.unshift({
                                id: item.id,
                                url: item.url ? picHead + item.url : imgItem,
                                title: item.contents['0'],
                                linkSrc: item.contents['1'],
                                disabledFlag: item.available
                            });
                        } else if (item.type === 4) {
                            that.contactUs.unshift({
                                id: item.id,
                                url: item.url ? picHead + item.url : imgItem,
                                intelligence: item.contents['0'],
                                name: item.contents['1'],
                                phoneNo: item.contents['2'],
                                wxNo: item.contents['3'],
                                mailNo: item.contents['4'],
                                disabledFlag: item.available
                            });
                        }
                    });
                    that.guestIntroduction.forEach((item, index) => {
                        if (item.disabledFlag) {
                            that.$nextTick(() => {
                                that.$refs['myCropper' + index][0].imgUrl = item.url;
                            })
                        }
                    });
                    that.pastReview.forEach((item, index) => {
                        if (item.disabledFlag) {
                            that.$nextTick(() => {
                                that.$refs['myCropperPastReview' + index][0].imgUrl = item.url;
                            });
                        }
                    });
                    that.contactUs.forEach((item, index) => {
                        if (item.disabledFlag) {
                            that.$nextTick(() => {
                                that.$refs['myCropperContactUs' + index][0].imgUrl = item.url;
                            });
                        }
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        },
    },
}
</script>

<style scoped>
.dialogOption{
    display: none;
}
.spans{
    cursor: pointer;
    color: #1ba1e2;
    padding: 0 5px;
    box-sizing: border-box;
}
</style>

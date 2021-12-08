<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/articleManagement' }">文章列表</el-breadcrumb-item>
                <el-breadcrumb-item>发布文章</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="80px" :rules="rules">
            <div class="wetuc-block">
                <el-form-item label="文章封面" prop="imageUrl">
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
            <el-form-item label="文章标题" prop="title">
                <el-input v-model="pageInfo.title" placeholder="请输入文章标题"
                          class="wetuc-input-col2"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="class">
                <el-select v-model="pageInfo.class" placeholder="请选择文章分类" class="wetuc-input-col2 relation"
                           value-key="value" multiple :multiple-limit="3" @change="classChange">
                    <el-option
                        v-for="item in classIdList"
                        :key="item.value"
                        :label="item.text"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="外部链接" prop="input">
                <el-input v-model="pageInfo.input" placeholder="请输入外部链接地址" class="wetuc-input-col2"></el-input>
            </el-form-item>


            <div class="wetuc-block">
                <el-form-item label="文章摘要" prop="summary">
                    <el-input type="textarea" :rows="2" v-model="pageInfo.summary" placeholder="请输入文章摘要"
                              class="wetuc-input-col943"></el-input>
                </el-form-item>
            </div>
            <div class="wetuc-block">
                <el-form-item label="文章详情" prop="content">
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

            <el-form-item label=" " >
                <el-button type="primary" @click="submitForm('pageInfo', 3)">保 存</el-button>
                <el-button type="primary" @click="submitForm('pageInfo', 2)">保存到草稿</el-button>
                <el-button @click="cancel('pageInfo', 2)">取 消</el-button>
            </el-form-item>
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

Quill.register('modules/ImageExtend', ImageExtend)
export default {
    data() {
        let validateInput = (rule, value, callback) => {
            if (value) {
                this.$message({
                    type: 'warning',
                    message: '填写后文章跳转到指定外部地址，文章详情内容失效!'
                })
                callback()
            } else {
                callback()
            }
        }
        return {
            actionUrl: process.env.API_ROOT + `oss/policy`,
            imgUrl: process.env.IMG_URL,
            pageInfo: {
                imageUrl: '',
                title: '',
                class: [],
                input: '',
                summary: '',
                content: '',
                contentImg: '',
            },
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
            classIdList:[],
            rules: {
                imageUrl: [{required: true, message: '请上传文章封面!', trigger: 'change'}],
                title: [{required: true, message: '请输入文章标题!', trigger: 'blur'}],
                class: [{required: true, message: '至少选择一个文章分类!', trigger: ['change', 'blur']}],
                input: [{ validator: validateInput, trigger: 'blur'}],
            }
        }
    },
    components: {quillEditor},
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
    mounted() {
        this.$nextTick(() =>{
            this.classIdList = this.getTypeList(2, '')
        })
    },
    methods: {
        // 保存
        submitForm(formName, state) {
            let that = this;
            let hostLogo = '';
            if (that.pageInfo.imageUrl.indexOf(that.imgUrl) === -1) {
                hostLogo = that.pageInfo.imageUrl.substring(0, that.pageInfo.imageUrl.length)
            } else if (that.imgUrl == '/picHead/') {
                hostLogo = 'd' + that.pageInfo.imageUrl.split('d')[2];
            } else {
                hostLogo = that.pageInfo.imageUrl.substring(27, that.pageInfo.imageUrl.length)
            }
            let classIds = []
            let classifications = []
            that.pageInfo.class.forEach(item =>{
                classIds.push(item.value)
                classifications.push(item.text)
            })
            that.$refs[formName].validate((valid) => {
                if(valid) {
                    loginService.addArticle({
                        title: that.pageInfo.title,
                        external: that.pageInfo.input ? 1 : 0,
                        externalUrl: that.pageInfo.input,

                        classIds: classIds,
                        classifications: classifications,

                        poster: hostLogo,
                        editor: that.pageInfo.content,
                        summary: that.pageInfo.summary,
                        status: state
                    }).then(res => {
                        if(res.data.success) {
                            if(state === 3) {
                                that.$message({
                                    message: "保存成功",
                                    type: "success"
                                });
                            } else {
                                that.$message({
                                    message: "保存到草稿成功",
                                    type: "success"
                                });
                            }
                            setTimeout(() =>{
                                that.$router.push({path: 'articleManagement'})
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
        classChange(val) {
            this.pageInfo.class = val
        },
        // 文章分类
        getTypeList(typ, query) {
            let vm = this, array = [];
            loginService.getArticlesType({type: typ, tagName: query}).then(function (res) {
                if (res.data.success) {
                    let newArr = res.data.datas;
                    for (let i = 0; i < newArr.length; i++) {
                        array.push({text: newArr[i].tagName, value: newArr[i].id});
                    }
                } else {
                    vm.$message.error(res.data.message);
                }
            }).catch(function (err) {
                vm.$router.push({name: 'error'});
            });
            return array;
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
        uploadCoverFile(param) {
            this.uploadSectionFile(param, 1)
        },
        reverseCardFile(param) {
            this.uploadSectionFile(param, 2)
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
                            if(type === 1) {
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
            this.$router.push({path: 'articleManagement'})
        },
    },
}
</script>

<style scoped>
.dialogOption {
    display: none;
}
</style>

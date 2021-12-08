<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: `${beforeUrl}`, query: {id: this.id} }">{{ beforeName }}</el-breadcrumb-item>
                <el-breadcrumb-item>编辑文章</el-breadcrumb-item>
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
                <el-select v-model="pageInfo.class" placeholder="请选择关联活动" class="wetuc-input-col2 relation"
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


            <el-form-item label="作者" prop="author" v-if="flag">
                <el-input v-model="pageInfo.author" placeholder="请输入作者名称" class="wetuc-input-col2"></el-input>
            </el-form-item>
            <el-form-item label="编辑" prop="editor" v-if="flag">
                <el-input v-model="pageInfo.editor" placeholder="请输入编辑名称" class="wetuc-input-col2"></el-input>
            </el-form-item>
            <el-form-item label="来源" prop="source" v-if="flag">
                <el-input v-model="pageInfo.source" placeholder="请输入来源" class="wetuc-input-col2"></el-input>
            </el-form-item>
            <el-form-item label="来源地址" prop="sourceUrl" v-if="flag">
                <el-input v-model="pageInfo.sourceUrl" placeholder="请输入来源地址" class="wetuc-input-col2"></el-input>
            </el-form-item>









            <el-form-item label="文章摘要" prop="summary" v-if="flag">
                <el-input type="textarea" :rows="2" v-model="pageInfo.summary" placeholder="请输入文章摘要"
                          class="wetuc-input-col598"></el-input>
            </el-form-item>

            <div class="wetuc-block" v-if="!flag">
                <el-form-item label="文章摘要" prop="summary">
                    <el-input type="textarea" :rows="2" v-model="pageInfo.summary" placeholder="请输入文章摘要"
                              class="wetuc-input-col943"></el-input>
                </el-form-item>
            </div>


            <div class="wetuc-block" v-if="flag">
                <el-form-item label="关键词" prop="keyWord">
                    <el-select v-model="pageInfo.keyWord" placeholder="请选择关键词" class="wetuc-input-col2 relation"
                               value-key="value" multiple :multiple-limit="3" @change="keyWordChange">
                        <el-option
                            v-for="item in keyWordList"
                            :key="item.value"
                            :label="item.text"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="标签" prop="label">
                    <el-select v-model="pageInfo.label" placeholder="请选择标签" class="wetuc-input-col2 relation" value-key="value">
                        <el-option
                            v-for="item in labelList"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value + '/' + item.text">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="关联公司" prop="companies">
                    <el-select
                        class="wetuc-input-col2"
                        v-model="pageInfo.companies"
                        value-key="name"
                        filterable
                        remote
                        multiple
                        :multiple-limit="3"
                        placeholder="请选择关联公司"
                        @change="relationChangeKeyWord"
                        :remote-method="relationRemoteMethod"
                        :loading="relationLoading">
                        <el-option
                            v-for="item in getRelationArr"
                            :key="item.id"
                            :label="item.name"
                            :value="item">
                        </el-option>
                    </el-select>
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
                <el-button type="primary" @click="submitForm('pageInfo', flag ? 1 : 3)">再次发布</el-button>
                <el-button type="primary" @click="adopt()" v-if="flag">通过</el-button>
                <el-button type="primary" @click="reject()" v-if="flag">驳回</el-button>
                <el-button type="primary" @click="submitForm('pageInfo', 2)" v-if="!flag">保存到草稿</el-button>
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
            id: JSON.parse(decodeURIComponent(this.$route.query.param)).id,
            flag: JSON.parse(decodeURIComponent(this.$route.query.param)).flag,
            beforeUrl: sessionStorage.getItem('addCompanyUrl') || this.$store.getters.getAddCpmpanyUrl,
            beforeName: sessionStorage.getItem('addCompanyName') || this.$store.getters.getAddCpmpanyName,
            actionUrl: process.env.API_ROOT + `oss/policy`,
            imgUrl: process.env.IMG_URL,
            pageInfo: {
                imageUrl: '',
                title: '',
                class: [],
                keyWord: [],
                input: '',
                summary: '',
                content: '',
                contentImg: '',
                author: '',
                editor: '',
                source: '',
                sourceUrl: '',
                label: '',
                companies: '',
            },
            companiesArray: [],
            getRelationArr: [],
            relationLoading: false,
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
            keyWordList:[],
            labelList:[],
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
            this.classIdList = this.getTypeList(2, '');
            this.keyWordList = this.getTypeList(3, '');
            this.labelList = this.getTypeList(6, '');
            this.getRelationArr = this.getRelationList('');
            setTimeout(() => {
                this.getDetail()
            }, 300)
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
            let tagId = []
            let tagName = []
            that.pageInfo.keyWord.forEach(item =>{
                tagId.push(item.value)
                tagName.push(item.text)
            })
            that.$refs[formName].validate((valid) => {
                if(valid) {
                    loginService.editArticle({
                        id: that.id,
                        title: that.pageInfo.title,
                        external: that.pageInfo.input ? 1 : 0,
                        externalUrl: that.pageInfo.input,

                        classIds: classIds,
                        classifications: classifications,

                        poster: hostLogo,
                        content: that.pageInfo.content,
                        summary: that.pageInfo.summary,
                        status: state,



                        tag: tagName,
                        tagId: tagId,

                        lable: that.pageInfo.label ? that.pageInfo.label.split('/')[1] : '',
                        lableId: that.pageInfo.label ? that.pageInfo.label.split('/')[0] : '',

                        author: that.pageInfo.author,
                        source: that.pageInfo.source,
                        editor: that.pageInfo.editor,
                        sourceUrl: that.pageInfo.sourceUrl,
                    }).then(res => {
                        if(res.data.success) {
                            if(state === 1) {
                                loginService.editTwoActivity({
                                    operate: 1,
                                    type: 2,
                                    typeId: that.id,
                                    companyIds: that.companiesArray.toString(),
                                }).then(res => {
                                    if(res.data.success) {
                                        that.$message({
                                            message: "修改成功",
                                            type: "success"
                                        });
                                        setTimeout(() =>{
                                            that.$router.push({path: 'allArticles'})
                                        }, 300)
                                    }
                                }).catch(err => {
                                    console.log(err);
                                })
                            } else if (state === 2) {
                                that.$message({
                                    message: "修改到草稿成功",
                                    type: "success"
                                });
                                setTimeout(() =>{
                                    that.$router.push({path: 'articleManagement'})
                                }, 300)
                            } else if (state === 3) {
                                that.$message({
                                    message: "修改成功",
                                    type: "success"
                                });
                                setTimeout(() =>{
                                    that.$router.push({path: 'articleManagement'})
                                }, 300)
                            }
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
        // 通过
        adopt() {
            let that = this;
            that.$confirm('确认通过' + that.pageInfo.title + '吗？通过后会立即发布', '通过', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                loginService.agree({varifyId: that.id}).then(function (res) {
                    if (res.data.success) {
                        setTimeout(() =>{
                           that.$message({
                               type: 'warning',
                               message: '通过!'
                           })
                        }, 300)
                    } else {
                        that.$message.error(res.data.message);
                    }
                }).catch(function (err) {
                    that.$router.push({path: 'error'});
                });
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消通过'
                })
            })
        },
        // 驳回
        reject() {
            let that = this
            that.$prompt('请输入驳回原因', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPlaceholder: '理由会发送给作者',
                inputPattern: /\S/,
                inputErrorMessage: '驳回原因不能为空'
            }).then(({ value }) => {
                loginService.refuse({
                    varifyId: that.id,
                    reason: value
                }).then(function (res) {
                    if(res.data.success){
                        setTimeout(() =>{
                            that.$message({
                                type: 'warning',
                                message: '驳回成功!'
                            })
                        }, 300)
                    }else{
                        that.$message.error(res.data.message);
                    }
                }).catch(function (err) {
                    that.$router.push({name: 'error'});
                });
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        // 获取详情
        getDetail() {
            let that = this;
            loginService.getArticle({
                id: that.id
            }).then(function (res) {
                if(res.data.success) {
                    that.$nextTick(() => {
                        let result = res.data.datas
                        that.pageInfo.title = result.title
                        that.pageInfo.input = result.externalUrl
                        that.pageInfo.content = result.content
                        that.pageInfo.summary = result.summary
                        that.pageInfo.imageUrl= that.picHead + result.poster
                        that.pageInfo.author = result.author
                        that.pageInfo.source = result.source
                        that.pageInfo.sourceUrl = result.sourceUrl
                        that.pageInfo.editor = result.editor

                        that.pageInfo.label = result.lableId + '/' + result.lable


                        const arr = []
                        if(result.classIds && result.classifications) {
                            for (let i = 0; i < result.classIds.length; i++ ) {
                                arr.push({
                                    value: result.classIds[i],
                                    text: result.classifications[i]
                                })
                            }
                        }
                        that.pageInfo.class = arr
                        const arr1 = []
                        if(result.tagId && result.tag) {
                            for (let i = 0; i < result.tagId.length; i++ ) {
                                arr1.push({
                                    value: result.tagId[i],
                                    text: result.tag[i]
                                })
                            }
                        }
                        that.pageInfo.keyWord = arr1
                        if(that.flag) that.getTwoCompanys(that.id);
                    })
                }
            }).catch(function (err) { // 捕获异常
                that.$router.push({path: 'error'});
            });
        },
        getTwoCompanys(id) {
            let that = this;
            loginService.getTwoCompanys({
                type: 2,
                typeId: id
            }).then(res =>{
                if(res.data.success) {
                    let com = res.data.datas
                    if (com) {
                        com.forEach(item => {
                            that.pageInfo.companies.push({
                                id: item.id,
                                name: item.name
                            });
                            if (JSON.stringify(that.getRelationArr).indexOf(item.id) == -1) {
                                that.getRelationArr.unshift({
                                    id: item.id,
                                    name: item.name
                                })
                            }
                            that.companiesArray.push(item.id);
                        });
                    }
                }
            }).catch(err =>{
                console.log(err);
            })
        },
        classChange(val) {
            this.pageInfo.class = val
        },
        keyWordChange(val) {
            this.pageInfo.keyWord = val
        },
        // 文章分类
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
        relationChangeKeyWord(val) {
            this.companiesArray = []
            if (val !== null) {
                val.forEach(item => {
                    this.companiesArray.push(item.id);
                })
            } else {
                this.companiesArray = [];
            }
        },
        relationRemoteMethod(query) {
            let that = this;
            if (query !== '') {
                that.relationLoading = true;
                setTimeout(() => {
                    that.relationLoading = false;
                    that.getRelationArr = that.getRelationList(query); // 文章关键词
                }, 200);
            } else {
                that.getRelationArr = [];
            }
        },
        getRelationList(query) {
            let that = this
            let relationArray = [];
            loginService.getCompaniesAll({
                param: query,
                pageNo: 1,
                pageSize: 10
            }).then(function (res) {
                if (res.data.success) {
                    let newArr = res.data.datas.datas;
                    for (let i = 0; i < newArr.length; i++) {
                        relationArray.push({id: newArr[i].id, name: newArr[i].name});
                    }
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                console.log(err);
            });
            return relationArray;
        },
        // 取消
        cancel() {
            this.$router.push({path: this.beforeUrl})
        },
    },
}
</script>

<style scoped>
.dialogOption {
    display: none;
}
</style>

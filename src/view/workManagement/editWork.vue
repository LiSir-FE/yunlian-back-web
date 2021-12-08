<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/workList' }">工作列表</el-breadcrumb-item>
                <el-breadcrumb-item>编辑工作</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="70px" :rules="rules">
            <el-form-item label="用户姓名" prop="userName">
                <el-select
                    :disabled="true"
                    class="wetuc-input3-col3"
                    v-model="pageInfo.userName"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入用户姓名"
                    @change="changeKeyWord"
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                        v-for="item in userNameArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="场景" prop="moscenedel">
                <el-select v-model="pageInfo.moscenedel" placeholder="请选择场景" class="wetuc-input3-col3" :disabled="true">
                    <el-option
                        v-for="item in sceneOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="沟通方式" prop="mode">
                <el-select v-model="pageInfo.mode" placeholder="请选择沟通方式" class="wetuc-input3-col3" :disabled="true">
                    <el-option
                        v-for="item in modeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="时间" prop="deadline" disabled="true">
                <el-date-picker
                    :disabled="true"
                    class="wetuc-input3-col3"
                    v-model="pageInfo.deadline"
                    :picker-options="pickerOptions"
                    type="date"
                    format="yyyy-MM-dd HH:mm"
                    value-format="timestamp"
                    placeholder="请选择时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="标题" prop="title">
                <el-input v-model="pageInfo.title" placeholder="请输入标题" class="wetuc-input3-col3"></el-input>
            </el-form-item>


            <el-form-item label="分类" prop="classification">
                <el-select v-model="pageInfo.classification" class="wetuc-input3-col3">
                    <el-option
                        v-for="item in classificationOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="关联公司" prop="companies">
                <el-select
                    class="wetuc-input3-col3"
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

            <el-form-item label="碎片分类" prop="fragment">
                <el-select v-model="pageInfo.fragment" class="wetuc-input3-col3">
                    <el-option
                        v-for="item in fragmentOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="内容" prop="content">
                <el-input type="textarea" :rows="6" v-model="pageInfo.content" class="wetuc-input-col523" maxlength="500"></el-input>
            </el-form-item>

            <el-form-item label="碎片内容" prop="fragmentContent">
                <el-input type="textarea" :rows="6" v-model="pageInfo.fragmentContent" class="wetuc-input-col523" maxlength="500"></el-input>
            </el-form-item>



            <el-form-item label="上传资料" v-for="(item, index) in votingOptions" :key="index">
                <i class="el-icon-circle-plus wetuc-ortion" v-if="index === 0" @click="addVotiong"></i>
                <i class="el-icon-delete wetuc-ortion" v-if="index !== 0" @click="removeVotiong(index)"></i>
                <el-upload
                    :ref="'myCropper' + index"
                    class="avatar-uploader"
                    accept="image/jpeg,image/gif,image/png,image/bmp"
                    :action="actionUrl"
                    :http-request="reverseCardFile.bind(null, {'index': index})"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="item.url" :src="item.url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>

                </el-upload>

            </el-form-item>


            <div class="wetuc-block">
                <el-form-item label=" ">
                    <el-button type="primary" @click="submitForm('pageInfo', 1)">提 交</el-button>
                    <el-button type="primary" @click="submitForm('pageInfo', 2)">修改并完善商机</el-button>
                    <el-button type="primary" @click="returnFn">取 消</el-button>
                </el-form-item>
            </div>

        </el-form>


    </div>
</template>

<script>
import {loginService} from "../../service/loginService";

export default {
    data() {
        let userName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('姓名不能为空'));
            } else {
                callback();
            }
        };
        return {
            id: this.$route.query.id,
            actionUrl: process.env.API_ROOT + `oss/policy`,
            imgUrl: process.env.IMG_URL,
            votingOptions: [{
                url: '',
                value: ''
            }],
            pageInfo: {
                userName: '',
                userId: '',
                moscenedel: '',
                mode: '',
                deadline: '',
                imageUrl: '',

                title: '',
                classification: '',
                companies: '',
                content: '',


                fragment: '',
                fragmentContent: ''
            },
            userNameArr: [],
            sceneOptions: [{
                value: 1,
                label: '一对一'
            }, {
                value: 2,
                label: '一对多'
            }, {
                value: 3,
                label: '其他'
            }],
            modeOptions: [{
                value: 1,
                label: '电话'
            }, {
                value: 2,
                label: '微信'
            }, {
                value: 3,
                label: '邮件'
            }, {
                value: 4,
                label: '见面'
            }, {
                value: 5,
                label: '视频会议'
            }],
            fragmentOptions: [{
                value: 1,
                label: '商机'
            }, {
                value: 2,
                label: '重要信息'
            }, {
                value: 3,
                label: '其他信息'
            }],
            companiesArray: [],
            getRelationArr: [],
            relationLoading: false,
            classificationOptions: [{
                value: 1,
                label: '信息沟通'
            }, {
                value: 2,
                label: '商务合作'
            }, {
                value: 3,
                label: '资源对接'
            }, {
                value: 4,
                label: '采访报道'
            }, {
                value: 5,
                label: '培训咨询'
            }],
            loading: false,
            pickerOptions: { // 时间
                disabledDate(time) {
                    return time.getTime() > Date.now();
                }
            },
            rules: {
                userName: [
                    {required: true, validator: userName, trigger: 'change'}
                ],
                moscenedel: [
                    {required: true, message: '请选择场景', trigger: 'change'}
                ],
                mode: [
                    {required: true, message: '请选择沟通方式', trigger: 'change'}
                ],
                deadline: [
                    {required: true, message: '请选择时间', trigger: 'change'}
                ],
                title: [
                    {required: true, message: '请输入标题', trigger: 'blur'}
                ],
                classification: [
                    {required: true, message: '请选择分类', trigger: 'change'}
                ],
                content: [
                    {required: true, message: '请输入内容', trigger: 'blur'}
                ]
            }
        }
    },
    computed: {
        picHead() {
            return process.env.IMG_URL
        }
    },
    mounted() {
        this.getRelationArr = this.getRelationList('');
        setTimeout(() =>{
            this.getEditWork()
        }, 300)
    },
    methods: {
        submitForm(formName, type) {
            let that = this;
            let imgArray = [];
            that.votingOptions.forEach(item => {
                if (item.url.indexOf(that.imgUrl) === -1) {
                    item.url = item.url.substring(0, item.url.length);
                } else if (that.imgUrl === '/picHead/') {
                    item.url = 'd' + item.url.split('d')[2];
                } else {
                    item.url = item.url.substring(27, item.url.length);
                }
                imgArray.push(item.url);
            });
            that.$refs[formName].validate((valid) => {
                if(valid) {
                    if (type === 1) {
                        loginService.editWork({
                            id: that.id,
                            userId: that.pageInfo.userId,
                            companies: that.companiesArray.toString(),
                            scene: that.pageInfo.moscenedel,
                            communicateMethod: that.pageInfo.mode,
                            title: that.pageInfo.title,
                            type: that.pageInfo.classification,
                            content: that.pageInfo.content,
                            infoType: that.pageInfo.fragment,
                            visitTime: that.pageInfo.deadline,
                            infoContent: that.pageInfo.fragmentContent,
                            operate: type,
                            files: imgArray
                        }).then(res => {
                            if(res.data.success) {
                                that.$message({
                                    message: '修改成功！',
                                    type: 'success'
                                });
                                setTimeout(() => {
                                    if(type === 1) {
                                        that.$router.push({path: 'workList'})
                                    } else if(type === 2) {
                                        that.$router.push({path: 'editInformation', query: {id: res.data.datas.id}})
                                    }
                                }, 300)
                                setTimeout(() => {
                                    that.$router.push({path: 'workList'})
                                }, 300)
                            }
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        // 获取信息
        getEditWork() {
            let that = this;
            that.votingOptions = [];
            loginService.detailsWork(that.id).then(res => {
                if (res.data.success) {
                    that.$nextTick(() => {
                        let com = res.data.datas.companies;
                        let obj = res.data.datas.job;
                        that.pageInfo.title = obj.title;
                        that.pageInfo.moscenedel = obj.scene;
                        that.pageInfo.mode = obj.communicateMethod;
                        that.pageInfo.userName = obj.user.name;
                        that.pageInfo.userId = obj.user._id;
                        if(com) {
                            com.forEach(item => {
                                that.pageInfo.companies.push({
                                    id: item.id,
                                    name: item.name
                                });
                                if(JSON.stringify(that.getRelationArr).indexOf(item.id) === -1) {
                                    that.getRelationArr.unshift({
                                        id: item.id,
                                        name: item.name
                                    });
                                }
                                that.companiesArray.push(item.id)
                            });
                        }
                        if(obj.type) {
                            that.pageInfo.classification = obj.type;
                        }
                        if(obj.visitTime) {
                            that.pageInfo.deadline = obj.visitTime;
                        }
                        that.pageInfo.content = obj.content;
                        that.pageInfo.fragment = obj.infoType;
                        that.pageInfo.fragmentContent = obj. infoContent;

                        if(obj.files) {
                            obj.files.forEach((item, index) =>{
                                let object = {};
                                object.url = that.picHead + item;
                                that.votingOptions.push(object);
                                that.$nextTick(() => {
                                    that.$refs['myCropper' + index][0].url = that.picHead + item;
                                });
                            });
                        } else {
                            that.votingOptions.push({
                                value: '',
                                url: ''
                            });
                        }
                    });
                }
            }).catch(err => {
                console.log(err);
            })
        },
        reverseCardFile(index, param) {
            this.uploadSectionFile(param, index.index)
        },
        uploadSectionFile (param, key) {
            loginService.getPolicy({}).then(res => {
                let that = this
                let index = 0
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
                            that.votingOptions[key].url =  process.env.IMG_URL + dir + randomName;
                        })
                        return
                    }
                }, false)
                xhr.send(fd)
            }).catch(err => {
                console.log(err)
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
                this.$message.error('上传资料大小不能超过 2MB!')
            }
            return (isJPG || isBMP || isGIF || isPNG) && isLt2M
        },
        changeKeyWord(val) {
            this.pageInfo.userName = val;
            this.pageInfo.userId = val;
        },
        // 查询用户名
        remoteMethod(query) {
            let that = this;
            if (query !== '') {
                that.loading = true;
                setTimeout(() => {
                    that.loading = false;
                    that.userNameArr = that.getUserNameList(query); // 文章关键词
                }, 200);
            } else {
                that.userNameArr = [];
            }
        },
        getUserNameList(query) {
            let that = this, array = [];
            loginService.serceUserName({
                groupId: 1,
                pageNo: 1,
                pageSize: 10,
                search: query
            }).then(function (res) {
                if (res.data.success) {
                    let newArr = res.data.datas.datas;
                    for (let i = 0; i < newArr.length; i++) {
                        array.push({id: newArr[i].id, name: newArr[i].name});
                    }
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                console.log(err);
            });
            return array;
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
        addVotiong() {
            let that = this;
            if (that.votingOptions.length >= 9) {
                that.$message.error('最多可以添加九个, 温馨提示');
            } else {
                let flag = false;
                for (let i = 0; i < that.votingOptions.length; i++) {
                    if (that.votingOptions[i].url) {
                        flag = true;
                    } else {
                        that.$message.error('请先上传图片, 温馨提示');
                        flag = false;
                        return
                    }
                }
                if (flag) {
                    that.votingOptions.push({
                        value: '',
                        url: ''
                    });
                }
            }
        },
        removeVotiong(index) {
            if (index !== -1) {
                this.votingOptions.splice(index, 1);
            }
        },
        addUser() {
            this.$router.push({path: 'userAdd'})
        },
        returnFn() {
            this.$router.push({path: 'workList'})
        }
    },
}
</script>

<style scoped>
/deep/.el-icon-info, .el-icon-s-order{
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 15px;
}
/deep/.el-collapse{
    border-top: 0 !important;
    border-bottom: 0 !important;
    margin-bottom: 11px;
}
/deep/.wetuc-ortion{
    right: 5px;
    z-index: 2;
    top: 5px;
    cursor: pointer;
}
</style>

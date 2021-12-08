<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: `${beforeUrl}` }">{{ beforeName }}</el-breadcrumb-item>
                <el-breadcrumb-item>工作详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="70px" :rules="rules">
            <el-form-item label="用户姓名">
                <el-select
                    :disabled="true"
                    class="wetuc-input3-col3"
                    v-model="pageInfo.user.name"
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

            <el-form-item label="记录人" prop="title">
                <el-input v-model="hostName" placeholder="请输入记录人" class="wetuc-input3-col3" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="一级行业">
                <el-select v-model="pageInfo.company.field" placeholder="请选择一级行业" class="wetuc-input3-col3" :disabled="true">
                    <el-option
                        v-for="item in industryOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="二级行业">
                <el-select v-model="pageInfo.company.subField" placeholder="请选择二级行业" class="wetuc-input3-col3" :disabled="true">
                    <el-option
                        v-for="item in industry2Options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="公司">
                <el-input v-model="pageInfo.company.name" class="wetuc-input3-col3" :disabled="true"></el-input>
            </el-form-item>


            <el-form-item label="场景" prop="scene">
                <el-select v-model="pageInfo.scene" placeholder="请选择场景" class="wetuc-input3-col3" :disabled="true">
                    <el-option
                        v-for="item in sceneOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>


            <el-form-item label="职位">
                <el-select v-model="pageInfo.user.intJob" placeholder="请选择职位" class="wetuc-input3-col3" :disabled="true">
                    <el-option
                        v-for="item in positionList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职能">
                <el-select v-model="pageInfo.user.functions" multiple :multiple-limit="3" placeholder="请选择职能"
                           class="wetuc-input3-col3" :disabled="true">
                    <el-option
                        v-for="item in intJobList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>



            <el-form-item label="沟通方式">
                <el-select v-model="pageInfo.communicateMethod" placeholder="请选择沟通方式" class="wetuc-input3-col3" :disabled="true">
                    <el-option
                        v-for="item in modeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="时间" :disabled="true">
                <el-date-picker
                    :disabled="true"
                    class="wetuc-input3-col3"
                    v-model="pageInfo.visitTime"
                    :picker-options="pickerOptions"
                    type="date"
                    format="yyyy-MM-dd HH:mm"
                    value-format="timestamp"
                    placeholder="请选择时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="标题" prop="title">
                <el-input v-model="pageInfo.title" placeholder="请输入标题" class="wetuc-input3-col3" :disabled="true"></el-input>
            </el-form-item>


            <el-form-item label="分类" prop="type">
                <el-select v-model="pageInfo.type" class="wetuc-input3-col3" :disabled="true">
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
                    :disabled="true"
                    class="wetuc-input3-col3"
                    v-model="pageInfo.companies"
                    value-key="name"
                    filterable
                    remote
                    multiple
                    :multiple-limit="3"
                    placeholder="请选择竞品公司"
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

            <el-form-item label="碎片分类" prop="infoType">
                <el-select v-model="pageInfo.infoType" class="wetuc-input3-col3" :disabled="true">
                    <el-option
                        v-for="item in fragmentOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <div class="wetuc-block">
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" :rows="6" v-model="pageInfo.content" class="wetuc-input-col523" maxlength="500" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="碎片内容" prop="infoContent">
                    <el-input type="textarea" :rows="6" v-model="pageInfo.infoContent" class="wetuc-input-col523" maxlength="500" :disabled="true"></el-input>
                </el-form-item>
            </div>


            <el-form-item label="原始资料" v-for="(item, index) in votingOptions" :key="index">
                <el-upload
                    :disabled="true"
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
            beforeUrl: sessionStorage.getItem('addCompanyUrl') || this.$store.getters.getAddCpmpanyUrl,
            beforeName: sessionStorage.getItem('addCompanyName') || this.$store.getters.getAddCpmpanyName,
            hostName: '',
            votingOptions: [{
                url: '',
                value: ''
            }],
            pageInfo: {
                company: {},
                user: {}
            },
            industryOptions: [{
                value: 1,
                label: '货主'
            },{
                value: 2,
                label: '专业物流'
            },{
                value: 3,
                label: '基础服务'
            },{
                value: 4,
                label: '信息系统'
            },{
                value: 5,
                label: '生态服务'
            },{
                value: 6,
                label: '基础设施'
            }],
            industry2Options: [{
                value: 1,
                label: '制造商'
            },{
                value: 2,
                label: '分销商'
            },{
                value: 3,
                label: '零售商'
            },{
                value: 4,
                label: '电子商务'
            },{
                value: 5,
                label: '海淘和跨境电商'
            },{
                value: 6,
                label: 'O2O本地生活'
            },{
                value: 7,
                label: '货代和报关'
            },{
                value: 8,
                label: '货运中介'
            },{
                value: 9,
                label: '港口物流'
            },{
                value: 10,
                label: '工程物流'
            },{
                value: 11,
                label: '第三方物流'
            },{
                value: 12,
                label: '4PL'
            },{
                value: 13,
                label: '医药物流'
            },{
                value: 14,
                label: '化工物流'
            },{
                value: 15,
                label: '冷链物流'
            },{
                value: 16,
                label: '代运营商'
            },{
                value: 17,
                label: '逆向物流'
            },{
                value: 18,
                label: '水运'
            },{
                value: 19,
                label: '航空'
            },{
                value: 20,
                label: '铁路'
            },{
                value: 21,
                label: '多式联运'
            },{
                value: 22,
                label: '仓储服务'
            },{
                value: 23,
                label: '整车合约物流'
            },{
                value: 24,
                label: '快递和包裹'
            },{
                value: 25,
                label: '零担物流'
            },{
                value: 26,
                label: '落地配'
            },{
                value: 27,
                label: '专线物流'
            },{
                value: 28,
                label: '同城配送'
            },{
                value: 29,
                label: '报关平台'
            },{
                value: 30,
                label: 'WMS'
            },{
                value: 31,
                label: 'YMS'
            },{
                value: 32,
                label: 'TMS'
            },{
                value: 33,
                label: 'WCS'
            },{
                value: 34,
                label: 'SCM&Modeling'
            },{
                value: 35,
                label: '专线ERP'
            },{
                value: 36,
                label: 'GPS管车平台'
            },{
                value: 37,
                label: '车货匹配'
            },{
                value: 38,
                label: '电商物流平台'
            },{
                value: 39,
                label: '协同平台'
            },{
                value: 40,
                label: '物流媒体'
            },{
                value: 41,
                label: '教育培训'
            },{
                value: 42,
                label: '金融服务'
            },{
                value: 43,
                label: '经营租赁'
            },{
                value: 44,
                label: 'PE/VC'
            },{
                value: 45,
                label: 'HR服务'
            },{
                value: 46,
                label: '物流咨询'
            },{
                value: 47,
                label: '系统集成'
            },{
                value: 48,
                label: '港口堆场'
            },{
                value: 49,
                label: '铁路枢纽'
            },{
                value: 50,
                label: '航空枢纽'
            },{
                value: 51,
                label: '多式联运枢纽'
            },{
                value: 52,
                label: '公路港'
            },{
                value: 53,
                label: '物流仓储园区'
            },{
                value: 54,
                label: '物流仓储设备'
            },{
                value: 55,
                label: '物料搬运设备'
            },{
                value: 56,
                label: '物流容器'
            },{
                value: 57,
                label: '物流信息化设备'
            },{
                value: 58,
                label: '物流信息化装置'
            },{
                value: 59,
                label: '卡车整车'
            },{
                value: 60,
                label: '卡车零配件及汽修'
            },{
                value: 61,
                label: '行业协会/政府机构'
            },{
                value: 62,
                label: '跨境物流'
            },{
                value: 63,
                label: '综合物流'
            }],
            positionList: [{
                value: 1,
                label: '董事长/总经理'
            }, {
                value: 2,
                label: '副总裁/副总经理'
            }, {
                value: 3,
                label: '事业部总经理'
            }, {
                value: 4,
                label: '总监'
            }, {
                value: 5,
                label: '高级经理/经理'
            }, {
                value: 6,
                label: '主管/车队长'
            }, {
                value: 7,
                label: '专员/司机'
            }, {
                value: 8,
                label: '总裁秘书/助理'
            }, {
                value: 9,
                label: '创始人/联合创始人/合伙人'
            }],
            intJobList: [{
                value: 1,
                label: '运营'
            }, {
                value: 2,
                label: '采购'
            }, {
                value: 3,
                label: '销售'
            }, {
                value: 4,
                label: '人力'
            }, {
                value: 5,
                label: '市场/公关'
            }, {
                value: 6,
                label: '财务'
            }, {
                value: 7,
                label: '战略/投资'
            }],
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
        // 获取信息
        getEditWork() {
            let that = this;
            that.votingOptions = [];
            loginService.detailsWork(that.id).then(res => {
                if (res.data.success) {
                    that.$nextTick(() => {
                        let obj = res.data.datas.job;
                        let com = res.data.datas.companies;
                        that.pageInfo = Object.assign(that.pageInfo, obj);
                        if(com) {
                            that.pageInfo.companies = [];
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
                        that.hostName = obj.admin.hostName;
                        that.pageInfo.user.functions = obj.user.functions ? obj.user.functions : [];
                        if(obj.files) {
                            that.$nextTick(() => {
                                obj.files.forEach((item, index) =>{
                                    let object = {};
                                    object.url = that.$store.state.picHead + item;
                                    that.votingOptions.push(object);
                                    that.$nextTick(() => {
                                        that.votingOptions[index].url =  that.picHead + item;
                                    });
                                });
                            });
                        } else {
                            that.votingOptions.push({
                                url: '',
                                value: ''
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

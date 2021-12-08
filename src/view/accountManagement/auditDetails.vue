<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/accountSettings' }">账号设置</el-breadcrumb-item>
                <el-breadcrumb-item>审核详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="100px" v-if="type">
            <div class="wetuc-container">
                <el-form-item label="LOGO" prop="imageUrl">
                    <el-upload
                        :disabled="true"
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="uploadSectionFile"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="pageInfo.adminLogo" :src=" imgUrl + pageInfo.adminLogo" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>
            <div class="wetuc-container">
                <el-form-item label="账号" prop="account">
                    <el-input type="text" v-model="pageInfo.account" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="账号类型">
                    <el-select v-model="pageInfo.type" class="wetuc-input-col2" :disabled="true">
                        <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="adminCompany">
                    <el-input type="text" v-model="pageInfo.adminCompany" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
            </div>
            <div class="wetuc-container">
                <el-form-item label="联系人" prop="adminName">
                    <el-input type="text" v-model="pageInfo.adminName" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系手机" prop="adminPhone">
                    <el-input type="text" v-model="pageInfo.adminPhone" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系邮箱" prop="adminEmail">
                    <el-input type="text" v-model="pageInfo.adminEmail" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
            </div>
            <div class="wetuc-container">

                <el-form-item label="申请时间" prop="mailbox">
                    <el-date-picker
                        :disabled="true"
                        class="wetuc-input-col2"
                        v-model="pageInfo.applyTime"
                        type="date"
                        value-format="timestamp"
                        format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="审核结果">
                    <el-select v-model="pageInfo.varifyResult" class="wetuc-input-col2" :disabled="true">
                        <el-option
                            v-for="item in varifyResultList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="审核时间" prop="mailbox">
                    <el-date-picker
                        :disabled="true"
                        class="wetuc-input-col2"
                        v-model="pageInfo.varifyTime"
                        type="date"
                        value-format="timestamp"
                        format="yyyy-MM-dd HH:mm"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </div>
            <el-form-item label=" ">
                <el-button type="primary" @click="buttonClick(pageInfo.varifyResult, true)" v-if="pageInfo.varifyResult === '0'">通 过</el-button>
                <el-button type="primary" @click="buttonClick(pageInfo.varifyResult, false)" v-if="pageInfo.varifyResult === '0'">拒 绝</el-button>
                <el-button type="primary" @click="buttonClick(pageInfo.varifyResult, false)" v-if="pageInfo.varifyResult === '1'">撤 销</el-button>
                <el-button type="primary" @click="buttonClick(pageInfo.varifyResult, false)" v-if="pageInfo.varifyResult === '2'">删 除</el-button>
            </el-form-item>
        </el-form>

        <el-form ref="pageInfo" :model="personalPageInfo" :inline="true" label-width="120px">
            <div class="wetuc-container" v-if="personalPageInfo.authType === 1">
                <el-form-item label="身份证正面照" prop="imageUrl">
                    <el-upload
                        :disabled="true"
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="uploadSectionFile"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="personalPageInfo.cardFrontPic" :src=" imgUrl + personalPageInfo.cardFrontPic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="身份证背面照" prop="imageUrl">
                    <el-upload
                        :disabled="true"
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="uploadSectionFile"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="personalPageInfo.cardOppositePic" :src=" imgUrl + personalPageInfo.cardOppositePic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>
            <div class="wetuc-container" v-if="personalPageInfo.authType === 2">
                <el-form-item label="营业执照" prop="imageUrl">
                    <el-upload
                        :disabled="true"
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="uploadSectionFile"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="personalPageInfo.licensePic" :src=" imgUrl + personalPageInfo.licensePic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>
            <div class="wetuc-container" v-if="!type">
                <el-form-item label="申请账号" prop="account">
                    <el-input type="text" v-model="personalPageInfo.account" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="账号类型">
                    <el-select v-model="personalPageInfo.authType" class="wetuc-input-col2" :disabled="true">
                        <el-option
                            v-for="item in authTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请时间">
                    <el-date-picker
                        :disabled="true"
                        class="wetuc-input-col2"
                        v-model="personalPageInfo.createTime"
                        type="date"
                        value-format="timestamp"
                        format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                </el-form-item>
            </div>

            <div class="wetuc-container" v-if="!type && personalPageInfo.authType === 2">
                <el-form-item label="企业/组织名称" prop="adminName">
                    <el-input type="text" v-model="personalPageInfo.companyName" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="机构/社会信用代码" prop="adminName">
                    <el-input type="text" v-model="personalPageInfo.companyCode" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系人手机号" prop="adminEmail">
                    <el-input type="text" v-model="personalPageInfo.phone" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
            </div>


            <div class="wetuc-container" v-if="!type && personalPageInfo.authType === 1">
                <el-form-item label="真实姓名" prop="adminName">
                    <el-input type="text" v-model="personalPageInfo.realName" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="adminPhone">
                    <el-input type="text" v-model="personalPageInfo.cardNo" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="联系人手机号" prop="adminEmail">
                    <el-input type="text" v-model="personalPageInfo.phone" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
            </div>
            <div class="wetuc-container" v-if="!type">
                <el-form-item label="提现方式" prop="adminEmail">
                    <el-input type="text" v-model="personalPageInfo.method" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="银行" prop="adminEmail">
                    <el-input type="text" v-model="personalPageInfo.bankName" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="开户行城市" prop="adminEmail">
                    <el-input type="text" v-model="personalPageInfo.city" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="开户支行名称" prop="adminEmail">
                    <el-input type="text" v-model="personalPageInfo.subbranchName" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="银行卡号" prop="adminEmail">
                    <el-input type="text" v-model="personalPageInfo.bankCardNo" class="wetuc-input-col2" :disabled="true"></el-input>
                </el-form-item>
            </div>
            <el-form-item label=" " v-if="!type">
                <el-button type="primary" @click="adopt">通 过</el-button>
                <el-button type="primary" @click="refuse">拒 绝</el-button>
            </el-form-item>
        </el-form>

    </div>
</template>

<script>
import {loginService} from "../../service/loginService";

export default {
   data() {
       return {
           id: this.$route.query.id,
           type: this.$route.query.type,
           adminId: this.$route.query.adminId,
           actionUrl: process.env.API_ROOT + `oss/policy`,
           imgUrl: process.env.IMG_URL,
           pageInfo: {
           },
           personalPageInfo: {
               method: '银行卡',
               city: ''
           },
           typeList: [{
               value: '0',
               label: '作者'
           },{
               value: '4',
               label: '主办方'
           }],
           authTypeList: [{
               value: 1,
               label: '个人认证'
           },{
               value: 2,
               label: '企业认证'
           }],
           varifyResultList: [{
               value: '0',
               label: '待审核'
           },{
               value: '1',
               label: '已通过'
           },{
               value: '2',
               label: '已拒绝'
           }]
       }
   },
    mounted() {
       this.getDataQuery();
    },
    methods:{
       // 获取详情
       getDataQuery() {
           let that = this;
           if(that.type) {
               loginService.getVarifysid(that.id, {}).then(res => {
                   if(res.data.success) {
                       that.$nextTick(() => {
                           that.pageInfo = res.data.datas
                       })
                   }
               }).catch(err => {
                   console.log(err);
               })
           } else {
               loginService.getAdminsIdadminId(that.id, that.adminId, {}).then(res => {
                   if(res.data.success) {
                       that.$nextTick(() => {
                           that.personalPageInfo.city = res.data.datas.bankProvince + res.data.datas.bankCity
                           that.personalPageInfo = Object.assign(that.personalPageInfo, res.data.datas)
                       })
                       console.log(that.personalPageInfo);
                   }
               }).catch(err => {
                   console.log(err);
               })
           }
       },

        buttonClick(row, type) {
           let that = this;
            if(row === '0' && type) {
                // 通过
                that.$prompt('请输入同意内容', '同意', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\S/,
                    inputErrorMessage: '请输入同意内容'
                }).then(({ value }) => {
                    that.putVarifysaggree(value)
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            } else if (row === '0' && !type) {
                // 拒绝
                that.$prompt('请输入拒绝理由', '拒绝', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\S/,
                    inputErrorMessage: '请输入拒绝理由'
                }).then(({ value }) => {
                    that.putVarifysrefuse(value)
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            } else if (row === '1' && !type) {
                // 撤销
                that.$prompt('请输入撤销理由', '撤销', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\S/,
                    inputErrorMessage: '请输入撤销理由'
                }).then(({ value }) => {
                    that.putVarifysrevoke(value)
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            } else if (row === '2' && !type) {
                // 删除
                that.$confirm('是否确定删除？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(({ value }) => {
                    that.deleteVarifys(value)
                }).catch(() => {
                    that.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        // 删除
        deleteVarifys:function(){
            let that = this
            loginService.deleteVarifys({varifyId: that.pageInfo.id}).then(function (res) {
                if(res.data.success){
                    that.$message({type: 'success',message: '删除成功!'});
                    setTimeout(() =>{
                        that.$router.push({path:'/system/accountaudit'})
                    }, 200)
                } else {
                    that.$message.error(res.data.message);
                }
            });
        },
        // 拒绝
        putVarifysrefuse:function(value){
            let that = this
            loginService.putVarifysrefuse({varifyId: that.pageInfo.id, reason: value}).then(function (res) {
                if(res.data.success){
                    that.$message({type: 'success',message: '删除成功!'});
                    setTimeout(() =>{
                        that.getDataQuery()
                    }, 200)
                } else {
                    that.$message.error(res.data.message);
                }

            });
        },
        // 同意
        putVarifysaggree:function(value){
            let that = this
            loginService.putVarifysaggree({varifyId: that.data.id, content: value}).then(function (res) {
                if(res.data.success){
                    that.$message({type: 'success',message: '同意成功!'});
                    setTimeout(() =>{
                        that.getDataQuery()
                    }, 200)
                } else {
                    that.$message.error(res.data.message);
                }

            });
        },
        // 撤销
        putVarifysrevoke:function(value){
            let that = this
            loginService.putVarifysrevoke({varifyId: that.data.id, reason: value}).then(function (res) {
                if(res.data.success){
                    that.$message({type: 'success',message: '撤销成功!'});
                    setTimeout(() =>{
                        that.getDataQuery()
                    }, 200)
                } else {
                    that.$message.error(res.data.message);
                }

            });
        },


        // 通过
        adopt() {
            this.$confirm('确认通过吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.putAdminsPass()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        putAdminsPass() {
            let that = this;
            let id = that.$route.query.id
            let adminId = that.$route.query.adminId
            loginService.putAdminsPass({id: id, adminId: adminId, bankCardNo: that.personalPageInfo.bankCardNo}).then(res => {
                if(res.data.success) {
                    that.$message({type: 'success',message: '通过成功'});
                    that.getDataQuery()
                } else {
                    that.$message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 拒绝
        refuse() {
            this.$prompt('请输入拒绝理由', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^\S/,
                inputErrorMessage: '请输入拒绝理由'
            }).then(({ value }) => {
                this.putAdminsnoPass(value)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });
        },
        putAdminsnoPass(value) {
            let that = this;
            let id = that.$route.query.id
            let adminId = that.$route.query.adminId
            loginService.putAdminsnoPass({id: id, adminId: adminId, failReason: value}).then(function (res) {
                if(res.data.success){
                    that.$message({type: 'success',message: '拒绝成功'});
                    that.getDataQuery()
                } else {
                    that.$message.error(res.data.message)
                }
            });
        },
        // 上传
        handleAvatarSuccess (res, file) {
            this.pageInfo.imageUrl = URL.createObjectURL(file.raw)
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
        uploadSectionFile (param) {
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
                            that.pageInfo.imageUrl = process.env.IMG_URL + dir + randomName
                        })
                        return
                    }
                }, false)
                xhr.send(fd)
            }).catch(err => {
                console.log(err)
            })
        }
    },

}
</script>

<style scoped>

</style>

<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/roleManagement' }">系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>焦点图管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-button type="primary" icon="el-icon-tickets" class="wetuc-return" style="float: right;" @click="addContent">
            新增内容
        </el-button>

        <el-table :data="tableData" empty-text="暂无数据" v-loading="tableLoading"
                  element-loading-text="拼命加载中">
            <el-table-column label="图片（查看大图）" min-width="100">
                <template slot-scope="scope">
                    <div class="tableImg">
                        <el-image class="table-td-thumb" :src="imgUrl + scope.row.picUrl"
                                  :preview-src-list="[imgUrl + scope.row.picUrl]"></el-image>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="标题" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="spanHover">{{ scope.row.picTitle }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="sortNum" label="排序号" min-width="50"></el-table-column>
            <el-table-column label="创建时间" min-width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.createDate | stampFormate4 }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="100" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" @click="editFn(scope.row.id)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" size="small"
                               @click="deleteFn(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--        <div class="wetuc-pagination-panel">-->
        <!--            <el-pagination-->
        <!--                @size-change="handleSizeChange"-->
        <!--                @current-change="handleCurrentChange"-->
        <!--                :current-page="page.pageNum"-->
        <!--                :page-sizes="[5, 10, 20, 50]"-->
        <!--                :page-size="page.pageSize"-->
        <!--                layout="total, sizes, prev, pager, next, jumper"-->
        <!--                :total="page.total">-->
        <!--            </el-pagination>-->
        <!--        </div>-->


        <el-dialog title="新增内容" :visible.sync="addContentDiaload" width="33%" min-width="33%"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   @close="closeContentFn">
            <el-form ref="addContentInfo" :model="addContentInfo" label-width="80px" :rules="addContentlogRules">
                <el-form-item label="头像" prop="imageUrl">
                    <el-upload
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="uploadSectionFile"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="addContentInfo.imageUrl" :src="addContentInfo.imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="标题" prop="title">
                    <el-input type="text" v-model="addContentInfo.title" placeholder="请输入标题"
                              class="wetuc-input-col3"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接" prop="jumpLink">
                    <el-input type="text" v-model="addContentInfo.jumpLink" placeholder="http://"
                              class="wetuc-input-col3"></el-input>
                </el-form-item>
                <el-form-item label="排序号" prop="sortNum">
                    <el-input type="number" min="1" step="1" v-model="addContentInfo.sortNum" placeholder="请输入排序号"
                              class="wetuc-input-col3"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addContentDiaload = false">取 消</el-button>
                <el-button type="primary"
                           @click="addContentDialogFn('addContentInfo', addContentInfoId)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {loginService} from '../../service/loginService'
import {stampFormate} from '../../filter/index'

export default {
    data() {
        return {
            tableData: [],
            actionUrl: process.env.API_ROOT + `oss/policy`,
            imgUrl: process.env.IMG_URL,
            tableLoading: false,
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            addContentDiaload: false,
            addContentInfoId: '',
            addContentInfo: {
                imageUrl: '',
                jumpLink: '',
                title: '',
                sortNum: ''
            },
            addContentlogRules: {
                imageUrl: [{required: true, message: '请上传头像!', trigger: 'blur'}],
                jumpLink: [{required: true, message: '请输入地址!', trigger: 'blur'}],
                sortNum: [{required: true, message: '请输入排序号!', trigger: 'blur'}],
            }
        }
    },
    mounted() {
        this.queryData()
    },
    methods: {
        queryData() {
            let that = this
            that.tableLoading = true
            loginService.getBannerslist({
                type: 0,
                // pageNo: that.page.pageNum,
                // pageSize: that.page.pageSize
            }).then(res => {
                if (res.data.success) {
                    let result = res.data
                    that.tableData = result.datas
                    that.page.total = Number(result.totalCount)
                } else {
                    that.$message.error(res.data.message)
                }
                that.tableLoading = false
            }).catch(err => {
                console.log(err)
            })
        },
        // 新增
        addContent() {
            let that = this
            if (that.tableData.length >= 10) {
                that.$message.error('焦点图添加已达上限!')
                return false
            }
            that.addContentDiaload = true
            that.addContentInfo = {
                imageUrl: '',
                jumpLink: '',
                title: '',
                sortNum: ''
            }
        },
        addContentDialogFn(formName, addContentInfoId) {
            let that = this
            let picUrl = ''
            if (that.addContentInfo.imageUrl.indexOf(process.env.IMG_URL) === -1) {
                picUrl = that.addContentInfo.imageUrl.substring(0, that.addContentInfo.imageUrl.length)
            } else {
                picUrl = that.addContentInfo.imageUrl.substring(8, that.addContentInfo.imageUrl.length)
            }
            that.$refs[formName].validate((valid) => {
                if (valid) {
                    if (addContentInfoId) {
                        loginService.postBanners({
                            id: addContentInfoId,
                            picUrl: picUrl,
                            picTitle: that.addContentInfo.title,
                            picLink: that.addContentInfo.jumpLink,
                            type: 0,
                            sortNum: that.addContentInfo.sortNum
                        }).then(res => {
                            if (res.data.success) {
                                that.addContentDiaload = false
                                that.queryData()
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {
                        loginService.postBanners({
                            picUrl: picUrl,
                            picTitle: that.addContentInfo.title,
                            picLink: that.addContentInfo.jumpLink,
                            type: 0,
                            sortNum: that.addContentInfo.sortNum
                        }).then(res => {
                            if (res.data.success) {
                                that.addContentDiaload = false
                                that.queryData()
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }

                } else {
                    return false
                }
            })
        },
        // 编辑
        editFn(id) {
            let that = this
            that.addContentDiaload = true
            that.addContentInfoId = id
            loginService.getBannersid(id).then(res => {
                if (res.data.success) {
                    let rulest = res.data.datas
                    that.addContentInfo.imageUrl = process.env.IMG_URL + rulest.picUrl
                    that.addContentInfo.title = rulest.picTitle
                    that.addContentInfo.jumpLink = rulest.picLink
                    that.addContentInfo.sortNum = Number(rulest.sortNum)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 删除
        deleteFn(id) {
            let that = this
            that.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                loginService.putBannersstatus({id: id, status: -1}).then(function (res) {
                    if (res.data.success) {
                        that.$message({type: 'success', message: '删除成功!'})
                        that.queryData()
                    }
                })
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })

        },
        closeContentFn() {
            this.addContentInfoId = ''
        },
        // 上传
        handleAvatarSuccess(res, file) {
            this.addContentInfo.imageUrl = URL.createObjectURL(file.raw)
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
        uploadSectionFile(param) {
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
                            that.addContentInfo.imageUrl = process.env.IMG_URL + dir + randomName
                        })
                        return
                    }
                }, false)
                xhr.send(fd)
            }).catch(err => {
                console.log(err)
            })
        },
        // // 分页
        // handleSizeChange (val) {
        //     this.page.pageSize = val
        //     this.queryData()
        // },
        // handleCurrentChange (val) {
        //     if (val !== 0) {
        //         this.page.pageNum = val
        //         this.queryData()
        //     }
        // }
    }
}
</script>

<style lang="scss">
.tableImg {
    width: 160px;
    height: 80px;

    img {
        width: 100%;
    }
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}

</style>

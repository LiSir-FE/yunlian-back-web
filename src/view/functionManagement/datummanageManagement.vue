<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/articleManagement' }">功能</el-breadcrumb-item>
                <el-breadcrumb-item>资料管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-tabs v-model="dataName" @tab-click="handleClick">
            <el-tab-pane label="开放资料" name="openData"></el-tab-pane>
            <el-tab-pane label="会员资料" name="vipData"></el-tab-pane>
        </el-tabs>

        <el-form ref="pageInfo" :model="pageInfo" label-width="80px">
            <el-input v-model="pageInfo.query" placeholder="搜索" class="wetuc-input3-col3"
                      @keyup.enter.native="queryData">
                <i slot="suffix" class="el-input__icon el-icon-search"
                   @click="queryData" style="cursor: pointer"></i>
            </el-input>
            <el-button type="primary" @click.prevent="addContentDiaload = true">上传资料</el-button>
        </el-form>


        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading"
                  element-loading-text="拼命加载中">
            <el-table-column label="文件名" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="spanHover">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="描述" min-width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="spanHover">{{ scope.row.desc }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="form" label="分类" min-width="60"></el-table-column>
            <el-table-column prop="size" label="大小" min-width="60"></el-table-column>
            <el-table-column prop="right" label="下载量" min-width="60">
                <template slot-scope="scope">
                    <span>{{ scope.row.downloadCount === null ? '0' : scope.row.downloadCount }}</span>
                </template>
            </el-table-column>
            <el-table-column label="时间" min-width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime | stampFormate }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small"
                               @click="editText(scope.row.name,scope.row.url)">下载
                    </el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click="editFn(scope.row.id)">编辑</el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" size="small"
                               @click="deteleFn(scope.row.id)">删除
                    </el-button>
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

        <el-dialog title="上传资料" :visible.sync="addContentDiaload" width="33%">
            <el-form ref="addContentInfo" :model="addContentInfo" label-width="80px">
                <el-form-item label="资料名称" prop="title">
                    <el-input type="text" v-model="addContentInfo.name" placeholder="请输入资料名称"
                              class="wetuc-input-col3"></el-input>
                </el-form-item>
                <el-form-item label="资料分类" prop="classification">
                    <el-select v-model="addContentInfo.classification" placeholder="请选择资料分类" class="wetuc-input-col3">
                        <el-option
                            v-for="item in classificationOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资料描述" prop="desc">
                    <el-input type="textarea" :rows="2" v-model="addContentInfo.desc" class="wetuc-input-col3"
                              placeholder="请输入资料描述"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接" prop="link">
                    <el-upload
                        class="avatar-uploader"
                        :action="actionUrl"
                        :limit="1"
                        :file-list="fileList"
                        :on-success="handleSuccess"
                        :before-remove='removeFn'
                        :before-upload="beforeAvatarUpload">
                        <el-button size="small" type="primary" v-if="show">点击上传</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addContentDiaload = false">取 消</el-button>
                <el-button type="primary" @click="addContentDialogFn(bjid)">确 定</el-button>
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
            dataName: 'openData',
            show: true,
            pageInfo: {
                query: ''
            },
            bjid: null,
            actionUrl: process.env.API_ROOT + `files`,
            addContentDiaload: false,
            addContentInfo: {
                name: '',
                desc: '',
                classification: '',
                formtype: '',
                formsize: '',
                formurl: '',
            },
            fileList: [],
            classificationOptions: [{
                value: 1,
                label: '开放'
            }, {
                value: 2,
                label: '会员'
            }],
            type: 1,
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            tableData: [],
            tableLoading: false
        }
    },
    mounted() {
        this.queryData(this.type);
    },
    methods: {
        queryData(type) {
            let that = this;
            that.tableLoading = true;
            loginService.getDocumentslist({
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize,
                name: that.pageInfo.query,
                type: type,
                order: 'Long_max',
                all: false
            }).then(res => {
                if (res.data.code == 200) {
                    let result = res.data.datas;
                    that.tableData = result.datas;
                    that.page.total = Number(result.totalCount);
                    setTimeout(function () {
                        that.tableLoading = false
                    }, 300)
                } else {
                    that.$message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        addContentDialogFn(bjid) {
            let that = this;
            if(!bjid) {
                loginService.postDocuments({
                    form: that.addContentInfo.formtype,
                    type: that.addContentInfo.classification,
                    name: that.addContentInfo.name,
                    desc: that.addContentInfo.desc,
                    size: that.addContentInfo.formsize,
                    url: that.addContentInfo.formurl
                }).then(res => {
                    if (res.data.success) {
                        that.$message({type: 'success', message: '上传成功!'});
                        that.addContentDiaload = false
                        setTimeout(() => {
                            that.queryData(this.type);
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else {
                loginService.postDocuments({
                    form: that.addContentInfo.formtype,
                    type: that.addContentInfo.classification,
                    name: that.addContentInfo.name,
                    desc: that.addContentInfo.desc,
                    size: that.addContentInfo.formsize,
                    url: that.addContentInfo.formurl,
                    id: bjid
                }).then(res => {
                    if (res.data.success) {
                        that.$message({type: 'success', message: '编辑成功!'});
                        that.addContentDiaload = false
                        setTimeout(() => {
                            that.queryData(this.type);
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        // 下载
        editText(name, url) {
            let su = url.substring(url.lastIndexOf('.') + 1)
            location.href = process.env.API_ROOT + '/downloads/url?urlStr=' + url + '&fileName=' + name + '&form=' + su
        },
        // 编辑
        editFn(id) {
            let that = this;
            that.addContentDiaload = true
            that.fileList = []
            loginService.getDocumentsid(id).then(function (res) {
                if (res.data.success) {
                    document.querySelector('.avatar-uploader .el-upload--text').style = 'display: none'
                    let obj = res.data.datas
                    that.addContentInfo.name = obj.name
                    that.addContentInfo.desc = obj.desc
                    that.addContentInfo.formtype = obj.form
                    that.addContentInfo.classification = Number(obj.type)
                    that.addContentInfo.formsize = obj.size
                    that.addContentInfo.formurl = obj.url
                    that.bjid = obj.id
                    let arr = {}
                    arr.name = obj.name
                    arr.url = obj.url
                    that.showtype = 2
                    that.show = false
                    that.fileList.push(arr)
                }
            });
        },
        deteleFn(id) {
            let that = this;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                loginService.deleteDocuments(id).then(function (res) {
                    if (res.data.success) {
                        that.$message({type: 'success', message: '删除成功!'});
                        setTimeout(() => {
                            that.queryData(that.type);
                        }, 300)
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        removeFn() {
            document.querySelector('.avatar-uploader .el-upload--text').style = 'display: inline-block'
            this.show = true;
        },
        beforeAvatarUpload(file) {
            const isSize = file.size / 1024 / 1024 < 40;
            if (!isSize) {
                this.$message.error('上传文件大小不能超过 40MB!');
            }
            return isSize;
        },
        //上传成功要处理的事
        handleSuccess(file, fileList) {
            let that = this
            that.show = false
            document.querySelector('.avatar-uploader .el-upload--text').style = 'display: none'
            let name = fileList.name.substring(fileList.name.lastIndexOf('.') + 1)
            if (name == 'jpg' || name == 'jpeg' || name == 'gif' || name == 'png' || name == 'tif' || name == 'bmp' || name == 'tiff' || name == 'psd' || name == 'svg' || name == 'pcx') {
                that.addContentInfo.formtype = 'image'
            } else if (name == 'mp1' || name == 'mp2' || name == 'mp3' || name == 'mp4' || name == 'wma' || name == 'wmv' || name == 'rm' || name == 'rmvb' || name == 'aac' || name == 'mid' || name == 'wav' || name == 'vqf' || name == 'avi' || name == 'mpg' || name == 'mpeg' || name == 'cda') {
                that.addContentInfo.formtype = 'music'
            } else if (name == 'doc' || name == 'docx') {
                that.addContentInfo.formtype = 'word'
            } else if (name == 'ppt') {
                that.addContentInfo.formtype = 'ppt'
            } else if (name == 'pdf') {
                that.addContentInfo.formtype = 'pdf'
            } else if (name == 'xls' || name == 'xlsx' || name == 'pptx') {
                that.addContentInfo.formtype = 'excel'
            } else {
                that.addContentInfo.formtype = 'other'
            }
            that.addContentInfo.formsize = fileList.size / 1024 / 1024 > 1 ? (fileList.size / 1024 / 1024).toFixed(2) + 'M' : (fileList.size / 1024).toFixed(2) + 'K'
            that.addContentInfo.formurl = fileList.response.datas.resourceUrl + fileList.response.datas.file
        },
        // 分页
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.queryData(this.type);
        },
        handleCurrentChange(val) {
            if (val !== 0) {
                this.page.pageNum = val;
                this.queryData(this.type)
            }
        },
        handleClick(tab) {
            this.type = null;
            if (tab.name === 'vipData') {
                this.type = 2;
            } else {
                this.type = 1;
            }
            this.queryData(this.type)
        }
    }
}
</script>

<style scoped>
/deep/ .avatar-uploader .el-upload--text {
    border: 0 !important;
}
</style>

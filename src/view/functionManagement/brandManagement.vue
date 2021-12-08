<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/articleManagement' }">功能</el-breadcrumb-item>
                <el-breadcrumb-item>微站管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-tabs v-model="name" @tab-click="handleClick">
            <el-tab-pane label="基本设置" name="a"></el-tab-pane>
            <el-tab-pane label="首页设置" name="b"></el-tab-pane>
            <el-tab-pane label="焦点图管理" name="c"></el-tab-pane>
            <el-tab-pane label="内容管理" name="d"></el-tab-pane>
            <el-tab-pane label="新闻管理" name="e"></el-tab-pane>
            <el-tab-pane label="资料管理" name="f"></el-tab-pane>
            <el-tab-pane label="图片管理" name="g"></el-tab-pane>
        </el-tabs>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="80px" v-if="name === 'a'">
            <div class="wetuc-container">
                <el-form-item label="LOGO设置" prop="logoImageUrl">
                    <el-upload
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="logoImageUrlFile"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="pageInfo.logoImageUrl" :src="pageInfo.logoImageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="分享配图" prop="shareImageUrl">
                    <el-upload
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="shareImageUrlFile"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="pageInfo.shareImageUrl" :src="pageInfo.shareImageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item label="背景图" prop="backImageUrl">
                    <el-upload
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="backImageUrlFile"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="pageInfo.backImageUrl" :src="pageInfo.backImageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </div>

            <div class="wetuc-container">
                <el-form-item label="首页名称" prop="title">
                    <el-input v-model="pageInfo.title" placeholder="请输入名称" maxlength="30"
                              class="wetuc-input-col2"></el-input>
                </el-form-item>
                <el-form-item label="网站色调" prop="title">
                    <el-color-picker v-model="pageInfo.color"></el-color-picker>
                </el-form-item>

            </div>
            <div class="wetuc-container">
                <el-form-item label="分享前缀" prop="prefix">
                    <el-input v-model="pageInfo.prefix" placeholder="请输入名称" maxlength="30"
                              class="wetuc-input-col2"></el-input>
                </el-form-item>
                <el-form-item label="分享描述" prop="describe">
                    <el-input v-model="pageInfo.describe" placeholder="请输入名称" maxlength="30"
                              class="wetuc-input-col2"></el-input>
                </el-form-item>
            </div>

            <div class="wetuc-container">
                <el-form-item label="主办" prop="title">
                    <div v-for="(item, index) in pageInfo.host" :key="index" class="wetuc-block">
                        <el-input v-model="item.title" placeholder="请输入名称" maxlength="30"
                                  class="wetuc-input-col2"></el-input>
                        <i class="el-icon-circle-plus wetuc-ortion" v-if="index === 0"
                           @click.prevent="addForm(1,index)"></i>
                        <i class="el-icon-delete wetuc-ortion" v-else @click.prevent="delForm(1,index)"></i>
                    </div>
                </el-form-item>
                <el-form-item label="承办" prop="title">
                    <div v-for="(item, index) in pageInfo.undertake" :key="index" class="wetuc-block">
                        <el-input v-model="item.title" placeholder="请输入名称" maxlength="30"
                                  class="wetuc-input-col2"></el-input>
                        <i class="el-icon-circle-plus wetuc-ortion" v-if="index === 0"
                           @click.prevent="addForm(2,index)"></i>
                        <i class="el-icon-delete wetuc-ortion" v-else @click.prevent="delForm(2,index)"></i>
                    </div>
                </el-form-item>
                <el-form-item label="联合承办" prop="title">
                    <div v-for="(item, index) in pageInfo.joint" :key="index" class="wetuc-block">
                        <el-input v-model="item.title" placeholder="请输入名称" maxlength="30"
                                  class="wetuc-input-col2"></el-input>
                        <i class="el-icon-circle-plus wetuc-ortion" v-if="index === 0"
                           @click.prevent="addForm(3,index)"></i>
                        <i class="el-icon-delete wetuc-ortion" v-else @click.prevent="delForm(3,index)"></i>
                    </div>
                </el-form-item>
                <el-form-item label="活动支持" prop="title">
                    <div v-for="(item, index) in pageInfo.activity" :key="index" class="wetuc-block">
                        <el-input v-model="item.title" placeholder="请输入名称" maxlength="30"
                                  class="wetuc-input-col2"></el-input>
                        <i class="el-icon-circle-plus wetuc-ortion" v-if="index === 0"
                           @click.prevent="addForm(4,index)"></i>
                        <i class="el-icon-delete wetuc-ortion" v-else @click.prevent="delForm(4,index)"></i>
                    </div>
                </el-form-item>
                <el-form-item label="媒体支持" prop="title">
                    <div v-for="(item, index) in pageInfo.media" :key="index" class="wetuc-block">
                        <el-input v-model="item.title" placeholder="请输入名称" maxlength="30"
                                  class="wetuc-input-col2"></el-input>
                        <i class="el-icon-circle-plus wetuc-ortion" v-if="index === 0"
                           @click.prevent="addForm(5,index)"></i>
                        <i class="el-icon-delete wetuc-ortion" v-else @click.prevent="delForm(5,index)"></i>
                    </div>
                </el-form-item>

            </div>
            <el-form-item label=" ">
                <el-button type="primary" @click="submit()">保 存</el-button>
            </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-circle-plus-outline" class="wetuc-return" style="float: right;"
                   v-if="name === 'b'" @click.prevent="addDiaload(name)">
            新增栏目
        </el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="wetuc-return" style="float: right;"
                   v-if="name === 'c'" @click.prevent="addDiaload(name)">
            新增焦点图
        </el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="wetuc-return" style="float: right;"
                   v-if="name === 'd'" @click.prevent="addDiaload(name)">
            新增内容
        </el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="wetuc-return" style="float: right;"
                   v-if="name === 'e'" @click.prevent="addDiaload(name)">
            新增新闻
        </el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="wetuc-return" style="float: right;"
                   v-if="name === 'f'" @click.prevent="addDiaload(name)">
            新增资料
        </el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" class="wetuc-return" style="float: right;"
                   v-if="name === 'g'" @click.prevent="addDiaload(name)">
            新增图片
        </el-button>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中"
                  v-if="name !== 'a'">
            <el-table-column label="图片（查看大图）" :key="Math.random()" min-width="100"
                             v-if="name === 'b' || name === 'c' || name === 'g'">
                <template slot-scope="scope">
                    <div class="tableImg">
                        <el-image class="table-td-thumb" :src="imgUrl + scope.row.img"
                                  :preview-src-list="[imgUrl + scope.row.img]"></el-image>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="栏目名称" :key="Math.random()" min-width="60" show-overflow-tooltip
                             v-if="name === 'b'"></el-table-column>
            <el-table-column prop="url" label="跳转链接" :key="Math.random()" min-width="200"
                             v-if="name === 'b'"></el-table-column>
            <el-table-column prop="brandContentTitle" :key="Math.random()" label="关联内容" min-width="60"
                             show-overflow-tooltip v-if="name === 'b'"></el-table-column>
            <el-table-column prop="link" :key="Math.random()" label="链接" min-width="60" show-overflow-tooltip
                             v-if="name === 'c'"></el-table-column>
            <el-table-column :key="Math.random()" label="更新时间" min-width="60" show-overflow-tooltip v-if="name === 'c'">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime | stampFormate2 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="title" :key="Math.random()" label="标题" min-width="150" show-overflow-tooltip
                             v-if="name === 'd'"></el-table-column>
            <el-table-column :key="Math.random()" label="更新时间" min-width="60" show-overflow-tooltip v-if="name === 'd'">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime | stampFormate2 }}</span>
                </template>
            </el-table-column>

            <el-table-column :key="Math.random()" label="发布时间" min-width="60" show-overflow-tooltip v-if="name === 'e'">
                <template slot-scope="scope">
                    <span>{{ scope.row.publicTime | stampFormate }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="title" :key="Math.random()" label="标题" min-width="150" show-overflow-tooltip
                             v-if="name === 'e'"></el-table-column>
            <el-table-column :key="Math.random()" label="更新时间" min-width="60" show-overflow-tooltip v-if="name === 'e'">
                <template slot-scope="scope">
                    <span>{{ scope.row.updateTime | stampFormate2 }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="from" :key="Math.random()" label="来源" min-width="50" show-overflow-tooltip
                             v-if="name === 'e'"></el-table-column>

            <el-table-column prop="name" :key="Math.random()" label="资料名称" min-width="120" show-overflow-tooltip
                             v-if="name === 'f'"></el-table-column>
            <el-table-column prop="desc" :key="Math.random()" label="资料简介" min-width="80" show-overflow-tooltip
                             v-if="name === 'f'"></el-table-column>
            <el-table-column prop="size" :key="Math.random()" label="资料大小" min-width="80" show-overflow-tooltip
                             v-if="name === 'f'"></el-table-column>
            <el-table-column :key="Math.random()" label="创建时间" min-width="50" show-overflow-tooltip v-if="name === 'f'">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime | stampFormate2 }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="description" :key="Math.random()" label="图片简介" min-width="120" show-overflow-tooltip
                             v-if="name === 'g'"></el-table-column>
            <el-table-column :key="Math.random()" label="创建时间" min-width="50" show-overflow-tooltip v-if="name === 'g'">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime | stampFormate2 }}</span>
                </template>
            </el-table-column>

            <el-table-column fixed="right" min-width="60" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-edit" size="small" class="phoneLink"
                               :data-clipboard-text="scope.row.url" @click.prevent="copyLink(scope.row)"
                               v-if="name === 'd'">拷贝链接
                    </el-button>
                    <el-button type="text" icon="el-icon-edit" size="small" @click.prevent="editFn(name, scope.row)">
                        编辑
                    </el-button>
                    <el-button type="text" icon="el-icon-delete" class="red" size="small"
                               @click.prevent="deleteFn(name, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="wetuc-pagination-panel" v-if="name !== 'a' && name !== 'b'">
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


        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="33%">
            <el-form ref="dialogInfo" :model="dialogInfo" label-width="80px">
                <el-form-item :label="dialogLabel" prop="backImageUrl"
                              v-if="name === 'b' || name === 'c' || name === 'g'">
                    <el-upload
                        class="avatar-uploader"
                        accept="image/jpeg,image/gif,image/png,image/bmp"
                        :action="actionUrl"
                        :http-request="columnThumbnailImageUrlFile"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="dialogInfo.columnThumbnail" :src="dialogInfo.columnThumbnail" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="栏目名称" v-if="name === 'b'">
                    <el-input v-model="dialogInfo.name" placeholder="请输入栏目名称" class="wetuc-input-col3"></el-input>
                </el-form-item>
                <el-form-item label="跳转页面" prop="jumpPage" v-if="name === 'b'">
                    <el-select v-model="dialogInfo.jumpPage" class="wetuc-input-col3">
                        <el-option
                            v-for="item in jumpPageList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="页面内容" v-if="dialogInfo.jumpPage === '1' && name === 'b'">
                    <el-select v-model="dialogInfo.pageContent" value-key="value" placeholder="请选择页面内容" class="wetuc-input-col3" @change="pageContentChange">
                        <el-option
                            v-for="item in pageContentList"
                            :key="item.value"
                            :label="item.name"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="跳转链接" v-if="dialogInfo.jumpPage === '2' && name === 'b'">
                    <el-input v-model="dialogInfo.jumpLink" placeholder="请输入跳转链接" class="wetuc-input-col3"></el-input>
                </el-form-item>

                <el-form-item label="焦点图标题" v-if="name === 'c'">
                    <el-input v-model="dialogInfo.title" placeholder="请输入焦点图标题" class="wetuc-input-col3"></el-input>
                </el-form-item>

                <el-form-item label="链接" v-if="name === 'c'">
                    <el-input v-model="dialogInfo.link" placeholder="请输入跳转链接" class="wetuc-input-col3"></el-input>
                </el-form-item>

                <el-form-item label="内容标题" v-if="name === 'd'">
                    <el-input v-model="dialogInfo.contentTitle" placeholder="请输入内容标题"
                              class="wetuc-input-col3"></el-input>
                </el-form-item>

                <el-form-item label="内容详情" prop="content" v-if="name === 'd'">
                    <quill-editor ref="myQuillEditor" v-model="dialogInfo.content" :options="dialogOption"
                                  class="wetuc-input-col3"></quill-editor>
                </el-form-item>

                <el-upload
                    class="avatar-uploader dialogOption"
                    accept="image/jpeg,image/gif,image/png,image/bmp"
                    :action="actionUrl"
                    :http-request="reverseCardFile"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="dialogInfo.contentImg" :src="dialogInfo.contentImg" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>

                <el-form-item label="关联活动" prop="relation" v-if="name === 'd'">
                    <el-select v-model="dialogInfo.relation" placeholder="请选择关联活动" class="wetuc-input-col3 relation"
                               :popper-append-to-body="false">
                        <el-option
                            v-for="item in relationList"
                            :key="item.id"
                            :label="item.activityTitle"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="新闻标题" v-if="name === 'e'">
                    <el-input v-model="dialogInfo.newsHeadlines" placeholder="请输入新闻标题"
                              class="wetuc-input-col3"></el-input>
                </el-form-item>

                <el-form-item label="新闻简介" v-if="name === 'e'">
                    <el-input type="textarea" :rows="2" v-model="dialogInfo.newsIntroduction" placeholder="请输入新闻简介"
                              class="wetuc-input-col3"></el-input>
                </el-form-item>
                <el-form-item label="新闻链接" v-if="name === 'e'">
                    <el-input v-model="dialogInfo.newsLink" placeholder="请输入新闻链接" class="wetuc-input-col3"></el-input>
                </el-form-item>
                <el-form-item label="新闻来源" v-if="name === 'e'">
                    <el-input v-model="dialogInfo.newsSources" placeholder="请输入新闻来源"
                              class="wetuc-input-col3"></el-input>
                </el-form-item>
                <el-form-item label="发布日期" prop="publicTime" v-if="name === 'e'">
                    <el-date-picker
                        class="wetuc-input-col3"
                        v-model="dialogInfo.publicTime"
                        type="date"
                        value-format="timestamp"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>


                <el-form-item label="资料源" prop="relation" v-if="name === 'f'">
                    <el-select v-model="dialogInfo.docId" placeholder="请选择关联活动" class="wetuc-input-col3 relation"
                               :popper-append-to-body="false">
                        <el-option
                            v-for="item in docIdList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                    <el-tooltip class="item" effect="dark" content="提示：需要在内容管理-资料管理中添加资料，自动获取标题和简介"
                                placement="top-start">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>


                <el-form-item label="图片简介" v-if="name === 'g'">
                    <el-input type="textarea" :rows="2" v-model="dialogInfo.picdeco" placeholder="请输入图片简介"
                              class="wetuc-input-col3"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogSubmit(name)">确 定</el-button>
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

Quill.register('modules/ImageExtend', ImageExtend)

export default {
    data() {
        return {
            name: 'a',
            id: null,
            actionUrl: process.env.API_ROOT + `oss/policy`,
            imgUrl: process.env.IMG_URL,
            pageInfo: {
                logoImageUrl: '',
                shareImageUrl: '',
                backImageUrl: '',
                prefix: '',
                describe: '',
                title: '',
                color: '',
                background: '',
                host: [],
                undertake: [],
                joint: [],
                activity: [],
                media: [],
            },
            dialogTitle: '',
            dialogLabel: '',
            dialogInfo: {
                id: '',
                columnThumbnail: '',
                name: '',
                jumpPage: '1',
                pageContent: '1',
                jumpLink: '',
                title: '',
                link: '',
                contentTitle: '',
                relation: '',
                content: '',
                contentImg: '',
                newsHeadlines: '',
                newsIntroduction: '',
                newsLink: '',
                newsSources: '',
                publicTime: '',
                docId: '',
                picdeco: '',
            },
            jumpPageList: [{
                value: '1',
                label: '页面内容'
            }, {
                value: '2',
                label: '跳转链接'
            }],
            pageContentList: [{
                name: '文章列表',
                value: '1'
            },
            {
                name: '新闻列表',
                value: '2'
            },
            {
                name: '资料列表',
                value: '3'
            },
            {
                name: '图片列表',
                value: '4'
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
            docIdList: [],
            relationList: [],
            dialogVisible: false,
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            tableData: [],
            tableLoading: false,
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
        this.queryData(this.name);
    },
    methods: {
        //新增
        addDiaload(name) {
            let that = this;
            that.dialogVisible = true;
            if (name === 'b') {
                that.dialogTitle = '新增栏目';
                that.dialogLabel = '栏目缩略图'
            } else if (name === 'c') {
                that.dialogTitle = '新增焦点图';
                that.dialogLabel = '上传主显图'
            } else if (name === 'd') {
                that.dialogTitle = '新增内容';
                that.getRelatedActivities()
            } else if (name === 'e') {
                that.dialogTitle = '新增新闻';
            } else if (name === 'f') {
                that.dialogTitle = '新增资料';
                that.getDocumentList()
            } else if (name === 'g') {
                that.dialogTitle = '新增图片';
                that.dialogLabel = '上传图片'
            }
        },
        getDocumentList() {
            loginService.getDocumentList({}).then(res => {
                if (res.data.success) {
                    this.docIdList = res.data.datas;
                }
            }).catch(err => {
                console.log(err);
            })
        },
        getRelatedActivities() {
            loginService.getRelatedActivities({
                pageNo: 1,
                pageSize: 50
            }).then(res => {
                if (res.data.success) {
                    this.relationList = res.data.datas.datas;
                }
            }).catch(err => {
                console.log(err);
            })
        },
        // 提交
        submit() {
            let that = this;
            let hostLogo = ''
            let hostShare = ''
            let hostBack = ''
            if (that.pageInfo.logoImageUrl.indexOf(that.imgUrl) === -1) {
                hostLogo = that.pageInfo.logoImageUrl.substring(0, that.pageInfo.logoImageUrl.length)
            } else if (that.imgUrl == '/picHead/') {
                hostLogo = that.pageInfo.logoImageUrl.substring(9, that.pageInfo.logoImageUrl.length)
            } else {
                hostLogo = that.pageInfo.logoImageUrl.substring(27, that.pageInfo.logoImageUrl.length)
            }
            if (that.pageInfo.shareImageUrl.indexOf(that.imgUrl) === -1) {
                hostShare = that.pageInfo.shareImageUrl.substring(0, that.pageInfo.shareImageUrl.length)
            } else if (that.imgUrl == '/picHead/') {
                hostShare = that.pageInfo.shareImageUrl.substring(9, that.pageInfo.shareImageUrl.length)
            } else {
                hostShare = that.pageInfo.shareImageUrl.substring(27, that.pageInfo.shareImageUrl.length)
            }
            if (that.pageInfo.backImageUrl.indexOf(that.imgUrl) === -1) {
                hostBack = that.pageInfo.backImageUrl.substring(0, that.pageInfo.backImageUrl.length)
            } else if (that.imgUrl == '/picHead/') {
                hostBack = that.pageInfo.backImageUrl.substring(9, that.pageInfo.backImageUrl.length)
            } else {
                hostBack = that.pageInfo.backImageUrl.substring(27, that.pageInfo.backImageUrl.length)
            }
            let bottom_zhuban = [];
            for (let i = 0; that.pageInfo.host.length > i; i++) {
                bottom_zhuban.push(that.pageInfo.host[i].title)
            }
            let bottom_lianhezhuban = [];
            for (let i = 0; that.pageInfo.joint.length > i; i++) {
                bottom_lianhezhuban.push(that.pageInfo.joint[i].title)
            }
            let bottom_chengban = [];
            for (let i = 0; that.pageInfo.undertake.length > i; i++) {
                bottom_chengban.push(that.pageInfo.undertake[i].title)
            }
            let bottom_huodongzhichi = [];
            for (let i = 0; that.pageInfo.activity.length > i; i++) {
                bottom_huodongzhichi.push(that.pageInfo.activity[i].title)
            }
            let bottom_jishuzhichi = [];
            for (let i = 0; that.pageInfo.media.length > i; i++) {
                bottom_jishuzhichi.push(that.pageInfo.media[i].title)
            }
            loginService.postBrandsHome({
                id: that.id,
                logo: hostLogo,
                background: hostBack,
                title: that.pageInfo.title,
                bottom_zhuban: bottom_zhuban,
                bottom_lianhezhuban: bottom_lianhezhuban,
                bottom_chengban: bottom_chengban,
                bottom_huodongzhichi: bottom_huodongzhichi,
                bottom_jishuzhichi: bottom_jishuzhichi,
                sharePre: that.pageInfo.prefix,
                shareDescribe: that.pageInfo.describe,
                shareImg: hostShare,
                color: that.pageInfo.color
            }).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        },
        dialogSubmit(name) {
            let that = this;
            let hostLogo = '';
            if (that.dialogInfo.columnThumbnail.indexOf(that.imgUrl) === -1) {
                hostLogo = that.dialogInfo.columnThumbnail.substring(0, that.dialogInfo.columnThumbnail.length)
            } else if (that.imgUrl == '/picHead/') {
                hostLogo = that.dialogInfo.columnThumbnail.substring(9, that.dialogInfo.columnThumbnail.length)
            } else {
                hostLogo = that.dialogInfo.columnThumbnail.substring(27, that.dialogInfo.columnThumbnail.length)
            }
            if (name === 'b') {
                loginService.putBrandsWeb({
                    id: that.dialogInfo.id,
                    img: hostLogo,
                    title: that.dialogInfo.name,
                    brandContentTitle: that.dialogInfo.jumpPage === '1' ? that.dialogInfo.pageContent.name : '',
                    brandContentId: that.dialogInfo.jumpPage === '1' ? that.dialogInfo.pageContent.value : '',
                    url: that.dialogInfo.jumpLink,
                }).then(res => {
                    if(res.data.success) {
                        that.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                        setTimeout(() => {
                            that.dialogVisible = false
                        }, 100)
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else if (name === 'c') {
                loginService.putBrandsBanner({
                    id: that.dialogInfo.id,
                    img: hostLogo,
                    name: that.dialogInfo.title,
                    link: that.dialogInfo.link,
                }).then(res => {
                    if(res.data.success) {
                        that.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                        setTimeout(() => {
                            that.dialogVisible = false
                        }, 100)
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else if (name === 'd') {
                loginService.putBrandsContent({
                    id: that.dialogInfo.id,
                    title: that.dialogInfo.contentTitle,
                    content: that.dialogInfo.content,
                    activityId: that.dialogInfo.relation
                }).then(res => {
                    if(res.data.success) {
                        that.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                        setTimeout(() => {
                            that.dialogVisible = false
                        }, 100)
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else if (name === 'e') {
                loginService.putBrandsNews({
                    id: that.dialogInfo.id,
                    title: that.dialogInfo.newsHeadlines,
                    desc: that.dialogInfo.newsIntroduction,
                    link: that.dialogInfo.newsLink,
                    publicTime: that.dialogInfo.publicTime,
                    from: that.dialogInfo.newsSources
                }).then(res => {
                    if(res.data.success) {
                        that.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                        setTimeout(() => {
                            that.dialogVisible = false
                        }, 100)
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else if (name === 'f') {
                loginService.putBrandsDocument({
                    id: that.dialogInfo.id,
                    docId: that.dialogInfo.docId
                }).then(res => {
                    if(res.data.success) {
                        that.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                        setTimeout(() => {
                            that.dialogVisible = false
                        }, 100)
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else if (name === 'g') {
                loginService.putBrandsImg({
                    id: that.dialogInfo.id,
                    img: hostLogo,
                    description: that.dialogInfo.picdeco
                }).then(res => {
                    if(res.data.success) {
                        that.$message({
                            type: 'success',
                            message: '修改成功'
                        })
                        setTimeout(() => {
                            that.dialogVisible = false
                        }, 100)
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
            setTimeout(() => {
                that.queryData(name)
            }, 300)
        },
        pageContentChange(val) {
            this.dialogInfo.pageContent = val
        },
        // 获取数据--首页设置
        queryData(name) {
            let that = this;
            that.tableLoading = true;
            if (name === 'a') {
                loginService.getBrandsHome({}).then(function (res) {
                    if (res.data.success) {
                        let result = res.data.datas;
                        that.id = result.id
                        that.pageInfo.title = result.title
                        that.pageInfo.prefix = result.sharePre
                        that.pageInfo.describe = result.shareDescribe
                        that.pageInfo.color = result.color
                        that.pageInfo.logoImageUrl = that.picHead + result.logo
                        that.pageInfo.shareImageUrl = that.picHead + result.shareImg
                        that.pageInfo.backImageUrl = that.picHead + result.background
                        if (result.bottom_zhuban) {
                            result.bottom_zhuban.forEach(item => {
                                that.pageInfo.host.push({
                                    title: item
                                })
                            })
                        } else {
                            that.pageInfo.host.push({
                                title: ''
                            })
                        }
                        if (result.bottom_chengban) {
                            result.bottom_chengban.forEach(item => {
                                that.pageInfo.undertake.push({
                                    title: item
                                })
                            })
                        } else {
                            that.pageInfo.undertake.push({
                                title: ''
                            })
                        }
                        if (result.bottom_lianhezhuban) {
                            result.bottom_lianhezhuban.forEach(item => {
                                that.pageInfo.joint.push({
                                    title: item
                                })
                            })
                        } else {
                            that.pageInfo.joint.push({
                                title: ''
                            })
                        }
                        if (result.bottom_huodongzhichi) {
                            result.bottom_huodongzhichi.forEach(item => {
                                that.pageInfo.activity.push({
                                    title: item
                                })
                            })
                        } else {
                            that.pageInfo.activity.push({
                                title: ''
                            })
                        }
                        if (result.bottom_jishuzhichi) {
                            result.bottom_jishuzhichi.forEach(item => {
                                that.pageInfo.media.push({
                                    title: item
                                })
                            })
                        } else {
                            that.pageInfo.media.push({
                                title: ''
                            })
                        }
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else if (name === 'b') {
                loginService.getBrandsWeb({}).then(function (res) {
                    if (res.data.success) {
                        let result = res.data.datas;
                        that.tableData = result
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else if (name === 'c') {
                loginService.getBrandsBanner({
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize
                }).then(function (res) {
                    if (res.data.success) {
                        let result = res.data.datas
                        that.tableData = result.datas
                        that.page.total = Number(result.totalCount);
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else if (name === 'd') {
                loginService.getBrandsContent({
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize
                }).then(function (res) {
                    if (res.data.success) {
                        let result = res.data.datas
                        result.datas.forEach(item => {
                            item.url = that.pcUrl + `brandwebDetail/${item.id}`;
                        });
                        that.tableData = result.datas
                        that.page.total = Number(result.totalCount);
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else if (name === 'e') {
                loginService.getBrandsNews({
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize
                }).then(function (res) {
                    if (res.data.success) {
                        let result = res.data.datas
                        that.tableData = result.datas
                        that.page.total = Number(result.totalCount);
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else if (name === 'f') {
                loginService.getBrandsDocument({
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize
                }).then(function (res) {
                    if (res.data.success) {
                        let result = res.data.datas
                        that.tableData = result.datas
                        that.page.total = Number(result.totalCount);
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else if (name === 'g') {
                loginService.getBrandsImg({
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize
                }).then(function (res) {
                    if (res.data.success) {
                        let result = res.data.datas
                        that.tableData = result.datas
                        that.page.total = Number(result.totalCount);
                        setTimeout(function () {
                            that.tableLoading = false
                        }, 300)
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        addForm(type, index) {
            if (type === 1) {
                this.pageInfo.host.push({
                    title: ''
                })
            } else if (type === 2) {
                this.pageInfo.undertake.push({
                    title: ''
                })
            } else if (type === 3) {
                this.pageInfo.joint.push({
                    title: ''
                })
            } else if (type === 4) {
                this.pageInfo.activity.push({
                    title: ''
                })
            } else if (type === 5) {
                this.pageInfo.media.push({
                    title: ''
                })
            }

        },
        delForm(type, index) {
            if (type === 1) {
                this.pageInfo.host.splice(index, 1)
            } else if (type === 2) {
                this.pageInfo.undertake.splice(index, 1)
            } else if (type === 3) {
                this.pageInfo.joint.splice(index, 1)
            } else if (type === 4) {
                this.pageInfo.activity.splice(index, 1)
            } else if (type === 5) {
                this.pageInfo.media.splice(index, 1)
            }
        },
        editFn(name, row) {
            let that = this;
            that.dialogVisible = true
            if (name === 'b') {
                loginService.getWebOne({
                    id: row.id
                }, row.id).then(function (res) {
                    if (res.data.success) {
                        that.dialogInfo.columnThumbnail = that.picHead + res.data.datas.img
                        that.dialogInfo.name = res.data.datas.title
                        that.dialogInfo.id = res.data.datas.id
                        that.dialogTitle = '编辑栏目';
                        that.dialogLabel = '栏目缩略图';
                        if (res.data.datas.brandContentTitle && res.data.datas.brandContentTitle !== '') {
                            that.dialogInfo.jumpPage = '1';
                            that.dialogInfo.pageContent = []
                            let obj = {}
                            obj.name = res.data.datas.brandContentTitle
                            obj.value = res.data.datas.brandContentId
                            that.dialogInfo.pageContent = obj
                        } else {
                            that.dialogInfo.jumpPage = '2'
                            that.dialogInfo.jumpLink = res.data.datas.url
                        }
                    }
                })
            } else if (name === 'c') {
                loginService.getBannerOne({
                    id: row.id
                }, row.id).then(function (res) {
                    if (res.data.success) {
                        that.dialogTitle = '编辑焦点图';
                        that.dialogLabel = '上传主显图';
                        that.dialogInfo.columnThumbnail = that.picHead + res.data.datas.img
                        that.dialogInfo.title = res.data.datas.name
                        that.dialogInfo.link = res.data.datas.link
                        that.dialogInfo.id = res.data.datas.id
                    }
                })
            } else if (name === 'd') {
                that.getRelatedActivities()
                loginService.getContentOne({
                    id: row.id
                }, row.id).then(function (res) {
                    if (res.data.success) {
                        that.dialogTitle = '编辑内容';
                        that.dialogInfo.contentTitle = res.data.datas.title
                        that.dialogInfo.content = res.data.datas.content
                        that.dialogInfo.relation = res.data.datas.activityId
                        that.dialogInfo.id = res.data.datas.id
                    }
                })
            } else if (name === 'e') {
                loginService.getNewsOne({
                    id: row.id
                }, row.id).then(function (res) {
                    if (res.status === 200) {
                        that.dialogTitle = '编辑新闻';
                        that.dialogInfo.newsHeadlines = res.data.title
                        that.dialogInfo.newsIntroduction = res.data.desc
                        that.dialogInfo.newsLink = res.data.link
                        that.dialogInfo.newsSources = res.data.from
                        that.dialogInfo.publicTime = res.data.publicTime
                        that.dialogInfo.id = res.data.datas.id
                    }
                })
            } else if (name === 'f') {
                that.getDocumentList()
                loginService.getDocumentOne({
                    id: row.id
                }, row.id).then(function (res) {
                    if (res.data.success) {
                        that.dialogTitle = '编辑资料';
                        that.dialogInfo.docId = res.data.datas.docId
                        that.dialogInfo.id = res.data.datas.id
                    }
                })
            } else if (name === 'g') {
                loginService.getBrandsOne({
                    id: row.id
                }, row.id).then(function (res) {
                    if (res.status === 200) {
                        that.dialogTitle = '编辑图片';
                        that.dialogLabel = '上传图片';
                        that.dialogInfo.columnThumbnail = that.picHead + res.data.img
                        that.dialogInfo.picdeco = res.data.description
                        that.dialogInfo.id = res.data.datas.id
                    }
                })
            }
        },
        deleteFn(name, row) {
            let that = this;
            that.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (name === 'b') {
                    loginService.delWebOne({
                        id: row.id
                    }, row.id).then(function (res) {
                        if (res.data.success) {
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            that.queryData(name);
                        }
                    })
                } else if (name === 'c') {
                    loginService.delBrandsBanner({
                        id: row.id
                    }, row.id).then(function (res) {
                        if (res.data.success) {
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            that.queryData(name);
                        }
                    })
                } else if (name === 'd') {
                    loginService.delBrandsContent({
                        id: row.id
                    }, row.id).then(function (res) {
                        if (res.data.success) {
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            that.queryData(name);
                        }
                    })
                } else if (name === 'e') {
                    loginService.delBrandsNews({
                        id: row.id
                    }, row.id).then(function (res) {
                        if (res.data.success) {
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            that.queryData(name);
                        }
                    })
                } else if (name === 'f') {
                    loginService.delBrandsDocument({
                        id: row.id
                    }, row.id).then(function (res) {
                        if (res.data.success) {
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            that.queryData(name);
                        }
                    })
                } else if (name === 'g') {
                    loginService.delBrandsImg({
                        id: row.id
                    }, row.id).then(function (res) {
                        if (res.data.success) {
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            that.queryData(name);
                        }
                    })
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        copyLink(row) {
            let that = this;
            if (!row.url) {
                that.$message({
                    type: 'error',
                    message: '当前没有url'
                });
            } else {
                let clipboard = new Clipboard('.phoneLink');
                clipboard.on('success', e => {
                    that.$message({
                        type: 'success',
                        message: '拷贝成功!'
                    });
                    // 释放内存
                    clipboard.destroy();
                });
                clipboard.on('error', e => {
                    // 不支持复制
                    that.$message({
                        type: 'error',
                        message: '由于您浏览器版本问题，请手动复制当前路径' + row.url
                    });
                    // 释放内存
                    clipboard.destroy()
                })
            }

        },
        // 分页
        handleSizeChange(val) {
            this.page.pageSize = val
            this.queryData(this.name)
        },
        handleCurrentChange(val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.queryData(this.name)
            }
        },
        // 上传
        handleAvatarSuccess(res, file) {
            this.pageInfo.imageUrl = URL.createObjectURL(file.raw)
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
        logoImageUrlFile(param) {
            this.uploadSectionFile(param, 0)
        },
        shareImageUrlFile(param) {
            this.uploadSectionFile(param, 1)
        },
        backImageUrlFile(param) {
            this.uploadSectionFile(param, 2)
        },
        columnThumbnailImageUrlFile(param) {
            this.uploadSectionFile(param, 3)
        },
        reverseCardFile(param) {
            this.uploadSectionFile(param, 4)
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
                            if (type === 0) {
                                that.pageInfo.logoImageUrl = process.env.IMG_URL + dir + randomName
                            } else if (type === 1) {
                                that.pageInfo.shareImageUrl = process.env.IMG_URL + dir + randomName
                            } else if (type === 2) {
                                that.pageInfo.backImageUrl = process.env.IMG_URL + dir + randomName
                            } else if (type === 3) {
                                if (that.name === 'b') {
                                    that.dialogInfo.columnThumbnail = process.env.IMG_URL + dir + randomName
                                } else if (that.name === 'g') {
                                    that.dialogInfo.columnThumbnail = process.env.IMG_URL + dir + randomName
                                }
                            } else if (type === 4) {
                                if (that.name === 'd') {
                                    that.dialogInfo.contentImg = process.env.IMG_URL + dir + randomName
                                    // 获取光标所在位置
                                    let length = quill.getSelection().index;
                                    // 插入图片  res.info为服务器返回的图片地址
                                    quill.insertEmbed(length, 'image', that.dialogInfo.contentImg)
                                    // 调整光标到最后
                                }
                            }
                        })

                    }
                }, false)
                xhr.send(fd)
            }).catch(err => {
                console.log(err)
            })
        },
        handleClick(tab) {
            this.queryData(this.name);
        }
    }
}
</script>

<style scoped>
/deep/ .relation .el-select-dropdown {
    width: 300px !important;
}

.dialogOption {
    display: none;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
    display: inline-block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

/deep/ .el-icon-info {
    cursor: pointer;
    position: absolute;
    right: 15px;
    top: 15px;
}
</style>

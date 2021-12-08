<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/articleManagement' }">功能</el-breadcrumb-item>
                <el-breadcrumb-item>评论管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-tabs v-model="name" @tab-click="handleClick">
            <el-tab-pane label="文章" name="article"></el-tab-pane>
            <el-tab-pane label="活动" name="activity"></el-tab-pane>
        </el-tabs>


        <el-table :data="arrayData" ref="table" style="width: 100%;margin-left: 1px" v-loading="tableLoading"
                  element-loading-text="拼命加载中" :expand-row-keys="exports" :row-key="getRowKeys">
            <div style="overflow: hidden">

                <el-table-column type="expand" width="1">
                    <template slot-scope="scope">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label=" ">
                                <el-input type="textarea" :rows="2" v-model="scope.row.textarea"
                                          class="wetuc-input-col3"
                                          :placeholder="'@'+ scope.row.userName + '：'" maxlength="600" show-word-limit></el-input>
                            </el-form-item>
                            <el-button type="text" size="small"
                                       @click.prevent="postComments(scope.row.id,scope.row.typeTitle,scope.row.userId,scope.row.userName,scope.row.textarea)">
                                保存
                            </el-button>
                        </el-form>

                        <div v-for="(item, index) in scope.row.comments"
                             style="padding: 10px 30px;box-sizing: border-box" v-if="item.show">
                            <span class="font-wight">{{ item.userName }}<span class="sponsor"
                                                                              v-if="item.admin && name==='article'">作者</span><span
                                class="sponsor" v-if="item.admin && name==='activity'">主办方</span></span> 回复 <span
                            class="font-wight">{{ item.originalUserName }}：</span>
                            <span class="content">{{ item.content }}</span>
                            <div style="float: right">
                                <span class="time">{{ item.commentTime | stampFormate }}</span>
                                <el-button type="text" icon="el-icon-position" size="small"
                                           @click="replyBtn(scope.$index, index)">回复
                                </el-button>
                                <el-button type="text" icon="el-icon-delete" class="red" size="small"
                                           @click.prevent="removeFn(item)">删除
                                </el-button>
                            </div>

                            <el-form label-position="left" inline class="demo-table-expand" v-if="item.reply">
                                <el-form-item label=" ">
                                    <el-input type="textarea" :rows="2" v-model="item.textarea" class="wetuc-input-col3"
                                              :placeholder="'@'+ item.userName + '：'" maxlength="600" show-word-limit></el-input>
                                </el-form-item>
                                <el-button type="text" size="small"
                                           @click.prevent="postComments(scope.row.id,item.typeTitle,item.userId,item.userName,item.textarea)">
                                    保存
                                </el-button>
                            </el-form>
                        </div>

                    </template>

                </el-table-column>
                <el-table-column min-width="60">
                    <template slot-scope="scope">
                        <el-image style="width: 50px; height: 50px;border-radius: 100%;overflow: hidden"
                                  :src="imgUrl + scope.row.userHeadImg"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="userName" min-width="60" show-overflow-tooltip></el-table-column>
                <el-table-column prop="content" min-width="60" show-overflow-tooltip></el-table-column>
                <el-table-column min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span> {{ scope.row.commentTime | stampFormate2 }}</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="small">{{ scope.row.typeTitle }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column min-width="60" align="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-position" size="small"
                                   @click.prevent="toogleExpand(scope.row)">回复
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" size="small"
                                   @click.prevent="removeFn(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </div>

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
    </div>
</template>

<script>
import {loginService} from '../../service/loginService'
import {stampFormate} from '../../filter/index'

export default {
    data() {
        return {
            tableLoading: false,
            imgUrl: process.env.IMG_URL,
            name: 'article',
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            exports: [],
            commentList: [],
            type: 1,
            arrayData: []
        }
    },
    mounted() {
        this.getComments(this.type);
    },
    methods: {
        getComments(type) {
            let that = this;
            that.tableLoading = true;
            loginService.getComments({
                level: 1,
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize,
                type: type,
                all: false
            }).then(res => {
                if (res.data.code == 200) {
                    let result = res.data.datas;
                    that.arrayData = result.datas;
                    that.page.total = Number(result.totalCount)
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
        toogleExpand(row) {
            let that = this;
            let $table = that.$refs.table
            if (row) $table.toggleRowExpansion(row)
        },
        getRowKeys(row) {
            return row.id
        },
        //发布评论
        postComments(userId, typeTitle, originalUserId, originalUserName, textarea) {
            let that = this;
            if (textarea.length == 0 || textarea == '') {
                that.$message.error('评论内容不能为空');
                return false;
            }
            loginService.postComments({
                parentId: userId,
                type: that.type,
                typeTitle: typeTitle,
                originalUserId: originalUserId,
                originalUserName: originalUserName,
                content: textarea
            }).then(function (res) {
                if (res.data.success) {
                    that.$message({
                        message: '评论成功！',
                        type: 'success'
                    });
                    that.getComments(that.type);
                }
            })
        },
        removeFn(row) {
            console.log(row);
            let that = this;
            this.$confirm('是否确认删除该评论?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                that.fullscreenLoading = true;
                loginService.delComments({
                    id: row.id,
                    parentId: row.parentId,
                    type: that.type
                }).then(function (res) {
                    if (res.data.success) {
                        that.fullscreenLoading = false;
                        that.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        setTimeout(() => {
                            that.getComments(that.type);
                        }, 300)
                    } else {
                        that.$notify.error({
                            title: '错误',
                            message: res.data.message
                        });
                    }
                })
            })
        },
        replyBtn(idx, index) {
            this.$set(this.arrayData[idx].comments[index], 'reply', true)
        },
        // 分页
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.getComments(this.type);
        },
        handleCurrentChange(val) {
            if (val !== 0) {
                this.page.pageNum = val;
                this.getComments(this.type);
            }
        },
        handleClick(tab) {
            this.page.pageSize = 5;
            this.page.pageNum = 1;
            if (tab.name === 'article') {
                this.type = 1;
                this.getComments(this.type);
            } else {
                this.type = 2;
                this.getComments(this.type);
            }
        }
    }
}
</script>

<style lang="scss">
/*.container{*/
/*width: 100%;*/
/*height: auto;*/
/*display: flex;*/
/*padding: 10px 0;*/
/*border-bottom: 1px solid #e8e8e8;*/
/*box-sizing: border-box;*/
/*}*/
</style>

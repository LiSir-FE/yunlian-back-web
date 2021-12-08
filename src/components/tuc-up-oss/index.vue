<template>
    <el-upload
        :disabled="clearFlag"
        class="avatar-uploader"
        accept="image/jpeg,image/gif,image/png,image/bmp"
        :action="actionUrl"
        :http-request="uploadSectionFile"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script>
import {loginService} from "../../service/loginService";

export default {
    props: {
        str: Number,
        clearFlag: Boolean,
        imageUrl: String
    },
    name: 'tucUpOss',
    data() {
        return {
            actionUrl: process.env.API_ROOT + `oss/policy`,
            imgUrl: process.env.IMG_URL,
        }
    },
    mounted() {
    },
    methods: {
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
                            // that.imageUrl = process.env.IMG_URL + dir + randomName
                            that.$emit('getFileUrl', dir + randomName, that.str === 0 || that.str ? that.str : false); // 不然0为false
                        })
                        return
                    }
                }, false)
                xhr.send(fd)
            }).catch(err => {
                console.log(err)
            })
        },
    },
}
</script>

<style scoped>
.avatar-uploader{
    display: inline-flex;
}
</style>

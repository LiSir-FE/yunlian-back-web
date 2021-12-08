<template>
    <div class="wetuc-page-content">
        <div class="container">
            <p class="cav-tit">将二维码展现给用户，用户扫描后可直达本活动电子票取票页面</p>
            <div id="qrCodeCanvas" class="qrCodeCanvas" v-show="qrCodeFlag"></div>
            <p class="cav-tit">点击以下尺寸下载活动二维码</p>
            <p class="btnGroup">
                <span class="sizeBtn" @click="downloadImage(150, 150)">150*150</span>
                <span class="sizeBtn" @click="downloadImage(256, 256)">256*256</span>
                <span class="sizeBtn" @click="downloadImage(512, 512)">512*512</span>
                <span class="sizeBtn" @click="downloadImage(1024, 1024)">1024*1024</span>
            </p>
        </div>
    </div>
</template>

<script>
import {loginService} from "../../service/loginService";
import QRCode from "qrcodejs2";

export default {
    props: {
        id: {
            type: String
        }
    },
    data() {
        return {
            qrCodeFlag: false
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
    mounted() {
        this.$nextTick(() => {
            let url = this.pcUrl + `activitiy/${this.id}/mytickets`;
            this.getQRCode(url);
        })
    },
    methods: {
        getQRCode(url) {
            this.qrCodeFlag = true
            let qrCodeCanvas = new QRCode('qrCodeCanvas', url, (error) => {
                300
                300
                if (error) {
                } else {
                }
            })
        },
        // 下载
        downloadImage(wid, hei) {
            let that = this;
            // 下载二维码
            loginService.downloadQRCode({width: wid, height: hei, actId: that.id});
        }
    },
}
</script>

<style scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
}

.cav-tit {
    display: block;
    width: 100%;
    text-align: center;
}

.qrCodeCanvas {
    width: 300px !important;
    height: 300px !important;
    margin: 20px 0;
}

/deep/ .qrCodeCanvas img {
    width: 290px !important;
    height: 290px !important;
}

.sizeBtn {
    font-size: 12px;
    color: #303030;
    background-color: #f2f4f8;
    display: inline-block;
    padding: 2px 8px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    cursor: pointer;
    margin: 20px 5px 0 5px;
}
</style>

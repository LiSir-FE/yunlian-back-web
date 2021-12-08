"use strict";
import {stsToken} from './upLoadOss.js'

var OSS = require("ali-oss");
let url='';
let uid = 'x';
export default {
    /**
     * 创建oss客户端对象
     * @returns {*}
     */

    createOssClient() {
        return new Promise((resolve, reject) => {
            stsToken().then(res => {
                let creds= res.data.datas;
                const client = new OSS({
                    region: "oss-cn-shanghai", // 请设置成你的
                    accessKeyId: creds.accesskeyid,
                    accessKeySecret: creds.accesskeysecret,
                    stsToken: creds.securitytoken,
                    bucket: "wetuc", // 请设置成你的
                    secure: true // 上传链接返回支持https
                });
                resolve(client);
            })
        });
    },
    /**
     * 文件上传
     * @param option 参考csdn: https://blog.csdn.net/qq_27626333/article/details/81463139
     */
    ossUploadFile(option, type) {

        let optionFile = option.file.name || '';
        let ext = optionFile.split('.')[optionFile.split('.').length - 1];
        const isMp4 = ext === 'mp4';
        const isPDF = ext === 'word' || ext === 'pdf' || ext === 'doc';
        const file = option.file;
        const self = this;
        // var url = '';
        return new Promise((resolve, reject) => {

            if(type == 'vadio' && isMp4) {

                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate;



                // const aData = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());
                const timestamp = new Date().getTime();
                const extensionName = file.name.substr(file.name.indexOf(".")); // 文件扩展名
                // const key = 'data/' + aData + '/' + timestamp + '.mp4';
                const fileName = "data/" + currentdate + "/" + timestamp + extensionName; // 文件名字（相对于根目录的路径 + 文件名）
                // 执行上传
                self.createOssClient().then(client => {
                    // 异步上传,返回数据
                    // resolve({
                    //     fileName: file.name,
                    //     fileUrl: fileName
                    // });
                    // 上传处理
                    // 分片上传文件
                    client.multipartUpload(fileName, file, {
                        progress: function(p) {
                            const e = {};

                            e.percent = Math.floor(p * 100);
                            // console.log('Progress: ' + p)
                            option.onProgress(e);
                        }
                    }).then(val => {
                            let fileName = file.name || '';
                            let ext = fileName.split('.')[fileName.split('.').length - 1];
                            if (ext == 'mp4') { // 获取视频时长
                                let url = URL.createObjectURL(file);
                                let audioElement = new Audio(url);
                                let duration;
                                audioElement.addEventListener("loadedmetadata", function (_event) {
                                    duration = parseInt(audioElement.duration); //时长为秒，小数，182.36
                                    val.res.timing = duration;
                                    window.url = val;
                                    // console.info('woc',val);
                                    if (val.res.statusCode === 200) {
                                        option.onSuccess(val);
                                        return val;
                                    } else {
                                        option.onError("上传失败");
                                    }
                                });
                            }

                        },err => {
                            option.onError("上传失败");
                            reject(err);
                        }
                    );

                });
            } else if(type == 'pdf' && isPDF) {


                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate;



                // const aData = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate());
                const timestamp = new Date().getTime();
                const extensionName = file.name.substr(file.name.indexOf(".")); // 文件扩展名
                // const key = 'data/' + aData + '/' + timestamp + '.mp4';
                const fileName = "data/" + currentdate + "/" + timestamp + extensionName; // 文件名字（相对于根目录的路径 + 文件名）
                // 执行上传
                self.createOssClient().then(client => {
                    // 异步上传,返回数据
                    // resolve({
                    //     fileName: file.name,
                    //     fileUrl: fileName
                    // });
                    // 上传处理
                    // 分片上传文件
                    client.multipartUpload(fileName, file, {
                        progress: function(p) {
                            const e = {};

                            e.percent = Math.floor(p * 100);
                            // console.log('Progress: ' + p)
                            option.onProgress(e);
                        }
                    }).then(val => {
                        window.url = val;
                        // console.info('woc',val);
                        if (val.res.statusCode === 200) {
                            option.onSuccess(val);
                            return val;
                        } else {
                            option.onError("上传失败");
                        }
                        },err => {
                            option.onError("上传失败");
                            reject(err);
                        }
                    );

                });
            } else {
                option.onError("上传失败");
            }

        });
    }
};

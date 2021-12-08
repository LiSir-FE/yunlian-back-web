<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: `${beforeUrl}` }">{{ beforeName }}</el-breadcrumb-item>
                <el-breadcrumb-item>车队详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" label-width="100px" :inline="true" :rules="rules" :disabled="true">
            <el-form-item label="车队名称" prop="carName">
                <el-input v-model="pageInfo.carName" class="wetuc-input3-col3" placeholder="请输入车队名称"></el-input>
            </el-form-item>

            <el-form-item label="对接人" prop="docker">
                <el-input v-model="pageInfo.docker" class="wetuc-input3-col3" placeholder="请输入对接人姓名"></el-input>
            </el-form-item>

            <el-form-item label="服务公司" prop="companies">
                <el-select
                    class="wetuc-input3-col3"
                    v-model="pageInfo.companies"
                    value-key="name"
                    filterable
                    remote
                    multiple
                    :multiple-limit="3"
                    placeholder="请选择服务公司"
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
                <el-tooltip class="item" effect="dark" content="查看记录" placement="top-start">
                    <i class="el-icon-info" @click="recordFn(1)"></i>
                </el-tooltip>
            </el-form-item>

            <el-form-item label="车队年收入" prop="fleetNum">
                <el-select v-model="pageInfo.fleetNum" class="wetuc-input3-col3">
                    <el-option
                        v-for="item in fleetNumList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="车辆总数" prop="vehiclesNum">
                <el-input v-model.number="pageInfo.vehiclesNum" class="wetuc-input3-col3" placeholder="请输入车辆总数"></el-input>
            </el-form-item>
            <el-form-item label="自有司机" prop="ownedDriver">
                <el-input v-model="pageInfo.ownedDriver" class="wetuc-input3-col3" placeholder="请输入自有司机数量"></el-input>
            </el-form-item>
            <el-form-item label="外协司机" prop="externalDriver">
                <el-input v-model="pageInfo.externalDriver" class="wetuc-input3-col3" placeholder="请输入外协司机数量"></el-input>
            </el-form-item>
            <div class="wetuc-block">
                <el-form-item label="车队备注" prop="fleetRemarks">
                    <el-input type="textarea" :rows="6" v-model="pageInfo.fleetRemarks" class="wetuc-input-col890" maxlength="500" placeholder="请输入车队备注"></el-input>
                </el-form-item>
            </div>

            <el-timeline class="commentDiv">
                <el-timeline-item :timestamp="item.createTime | stampFormate4" placement="top" v-for="(item, index) in memorandum" :key="index">
                    <el-card>
                        <h4>{{ item.hostName }}</h4>
                        <p>{{item.content}}</p>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
            <el-form-item label=" ">
                <el-button type="primary" @click="memorandumAll" :disabled="false">查看全部备忘录</el-button>
                <el-button type="primary" @click="recordFn(2)" :disabled="false">查看更新记录</el-button>
            </el-form-item>




            <el-collapse v-model="activeNames" accordion @change="handleChange">
                <el-collapse-item name="a">
                    <el-card class="box-card" v-for="(ver,index) in version" :key="index">
                        <div slot="header" class="clearfix">
                            <span>{{ver.name}}</span>
                        </div>
                        <div v-for="(item,key) in ver.children" :key="key" class="text item">
                            <el-checkbox :label="item.no" :key="item.no" v-model="item.check" @change="selectVersion">{{item.name}}</el-checkbox>
                        </div>
                    </el-card>

                    <el-card class="box-card-table">
                        <div slot="header" class="clearfix">
                            <span>版本属性</span>
                        </div>
                        <el-table :data="versionList" :span-method="objectSpanMethod">
                            <el-table-column v-for="(list,index) in versioncount" :key="index" :label="list.name">
                                <template slot-scope="scope">
                                    {{scope.row.name.split(';')[index] || scope.row.name}}
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" min-width="100px" label="数量">
                                <template slot-scope="scope">
                                    <el-input-number :min="0" :max="9999999" v-model="scope.row.num"></el-input-number>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>

                    <div v-for="(items, index) in carTeamLines" style="display: block;margin: 10px 0">
                        <el-form-item label="始发地" label-width="70">
                            <el-cascader
                                v-if="items.flag"
                                :disabled="items.disAbled"
                                class="wetuc-input-col2"
                                :props="props"
                                v-model="items.start">
                            </el-cascader>
                        </el-form-item>


                        <el-form-item label="目的地">
                            <el-cascader
                                v-if="items.flag"
                                :disabled="items.disAbled"
                                class="wetuc-input-col2"
                                :props="props"
                                v-model="items.end">
                            </el-cascader>
                        </el-form-item>
                    </div>
                </el-collapse-item>
            </el-collapse>



        </el-form>

        <!--查看记录-->
        <el-dialog :title="viewRecords" :visible.sync="recordsDialogTableVisible">
            <el-table :data="recordTableDate" v-loading="recordLoading" element-loading-text="拼命加载中" max-height="300px">
                <el-table-column :key="Math.random()" property="name" label="名称" min-width="150" show-overflow-tooltip v-if="recordsType === 1"></el-table-column>

                <el-table-column :key="Math.random()" property="name" label="品牌" min-width="150" show-overflow-tooltip v-if="recordsType === 2"></el-table-column>

                <el-table-column :key="Math.random()" property="type" label="操作" min-width="80" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === 1">新增</span>
                        <span v-if="scope.row.type === 2">删除</span>
                    </template>
                </el-table-column>

                <el-table-column :key="Math.random()" property="num" label="数量" min-width="100" show-overflow-tooltip v-if="recordsType === 2"></el-table-column>

                <el-table-column :key="Math.random()" label="时间" min-width="150" show-overflow-tooltip v-if="recordsType === 1">
                    <template slot-scope="scope">
                        {{scope.row.serviceTime | stampFormate}}
                    </template>
                </el-table-column>

                <el-table-column :key="Math.random()" label="时间" min-width="150" show-overflow-tooltip v-if="recordsType === 2">
                    <template slot-scope="scope">
                        {{scope.row.changeTime | stampFormate}}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>


        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column prop="name" label="姓名" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="intJob" label="职位" min-width="80" show-overflow-tooltip>
                <template slot-scope="scope">
                    {{scope.row.intJob | intJob}}
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="联系方式" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" min-width="120" fixed="right" align="right">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-view" size="small" @click.prevent="detailsFn(scope.row)">详情</el-button>
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


    </div>
</template>

<script>
import {loginService} from "../../service/loginService";
import axios from "axios";
import {intJob} from '../../filter/companyList'
export default {
    data() {
        return {
            activeNames: 'a',
            id: this.$route.query.id,
            beforeUrl: sessionStorage.getItem('addCompanyUrl') || this.$store.getters.getAddCpmpanyUrl,
            beforeName: sessionStorage.getItem('addCompanyName') || this.$store.getters.getAddCpmpanyName,
            pageInfo: {
                carName: '',
                companies: '',
                docker: '',
                vehiclesNum: '',
                ownedDriver: '',
                externalDriver: '',
                fleetRemarks: '',
                fleetNum: ''
            },
            version: [],
            versioncount: [],
            selectList: [],
            curVersion: {fversion: {}, sversions: []},
            versionList: [],
            versionPrice: [],
            memorandum: [],


            carTeamLines: [{
                start: [],
                end: [],
                flag: false,
                disAbled: true
            }],

            recordsType: null,
            recordLoading: false,
            recordsDialogTableVisible: false,
            recordTableDate: [],

            updataRecordsData: [],
            recordsData: [],
            viewRecords: '',


            tableLoading: false,
            tableData: [],
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            props: {
                lazy: true,
                lazyLoad: (node, resolve) => this.loadNode(node, resolve)
            },
            companiesArray: [],
            getRelationArr: [],
            relationLoading: false,
            fleetNumList: [{
                label: '小于500万',
                value: 1
            },{
                label: '500万~2000万',
                value: 2
            },{
                label: '2000万~5000万',
                value: 3
            },{
                label: '5000万~1亿',
                value: 4
            },{
                label: '1亿以上',
                value: 5
            }],
            rules: {
                carName: [{
                    required: true, message: '请填写车队名称', trigger: 'blur'
                }],
                fleetNum: [{
                    required: true, message: '请选择收入', trigger: 'change'
                }],
                vehiclesNum: [{
                    required: true, message: '请填写车辆总数', trigger: 'blur'
                },{
                    type: 'number', message: '车辆总数必须为数字值'
                }],
                ownedDriver: [{
                    required: true, message: '请填写自有司机', trigger: 'blur'
                }],
                externalDriver: [{
                    required: true, message: '请填写外协司机', trigger: 'blur'
                }],
            }
        }
    },
    filters: {
        intJob
    },
    mounted() {
        this.$nextTick(() => {
            this.getversionList()
            setTimeout(() => {
                this.detailsfleet()
                this.queryData()
            }, 500)
        })
    },
    methods: {
        // 获取详情
        detailsfleet() {
            let that = this;
            loginService.detailsfleet(that.id, {}).then(res => {
                if (res.data.success) {
                    let carTeam = res.data.datas.carTeam;
                    let versionLogs = res.data.datas.versionLogs;
                    let serviceLogs = res.data.datas.serviceLogs;
                    let carTeamComments = res.data.datas.carTeamComments;
                    let obj = res.data.datas;
                    let cnos = carTeam.cnos;
                    let detailVersions = res.data.datas.detailVersions;
                    let carTeamLinesData = res.data.datas.carTeamLines;
                    let com = res.data.datas.companies;
                    that.pageInfo.carName = carTeam.name;
                    that.pageInfo.fleetNum = carTeam.size;
                    that.pageInfo.vehiclesNum = carTeam.carNum;
                    that.pageInfo.ownedDriver = carTeam.inDriverNum;
                    that.pageInfo.externalDriver = carTeam.outDriverNum;
                    that.pageInfo.fleetRemarks = carTeam.content;
                    that.pageInfo.docker = carTeam.chargeName;
                    if (com) {
                        com.forEach(item => {
                            that.pageInfo.companies.push({
                                id: item.id,
                                name: item.name
                            });
                            if (JSON.stringify(that.getRelationArr).indexOf(item.id) === -1) {
                                that.getRelationArr.unshift({
                                    id: item.id,
                                    name: item.name
                                });
                            }
                            that.companiesArray.push(item.id)
                        });
                    }
                    if (carTeamLinesData) {
                        carTeamLinesData.forEach((item) => {
                            item.flag = false
                            item.start = [`${item.startProvinceName}/${item.startProvinceId}`, `${item.startCityName}/${item.startCityId}`]
                            item.end = [`${item.endProvinceName}/${item.endProvinceId}`, `${item.endCityName}/${item.endCityId}`]
                            item.disAbled = true
                            item.flag = true
                        });
                    }
                    that.carTeamLines = carTeamLinesData;
                    that.memorandum = res.data.datas.carTeamComments;
                    that.updataRecordsData = versionLogs;
                    that.recordsData = serviceLogs;
                    // 父子版本
                    let min, max;
                    if (obj.detailVersions) {
                        for (let i in that.version) {
                            let ver = that.version[i];
                            for (let j in ver.children) {
                                let c = ver.children[j].no;
                                if (cnos.indexOf(c) > -1) {
                                    ver.children[j].check = true;
                                }
                            }
                            that.version.splice(i, 1, ver)
                        }
                        for (let v in obj.detailVersions) {
                            if (!min) {
                                min = obj.detailVersions[v].num
                            } else {
                                if (obj.detailVersions[v].num > min) {
                                    max = obj.detailVersions[v].num
                                } else {
                                    max = min;
                                    min = obj.detailVersions[v].num
                                }
                            }
                            let ver = {
                                num: obj.detailVersions[v].num,
                            };
                            that.versionPrice[obj.detailVersions[v].key] = ver
                        }
                        that.versionList = obj.detailVersions;
                        that.selectVersion()
                    }
                }
            }).catch(err => {
                console.log(err);
            })
        },
        recordFn(type) {
            this.recordsDialogTableVisible = true;
            this.recordTableDate = [];
            this.recordsType = type;
            if(type === 1) {
                this.viewRecords = '查看记录'
                this.recordTableDate = this.recordsData
            } else {
                this.viewRecords = '查看更新记录'
                this.recordTableDate = this.updataRecordsData
            }
        },
        memorandumAll() {
            let that = this;

            that.$router.push({
                path: `/fleetMemorandum`,
                query: { id: that.id }
            });
        },
        queryData() {
            let that = this;
            that.tableLoading = true
            loginService.getVehicleData(that.id, {
                type: 1,
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize
            }).then(res => {
                if (res.data.success) {
                    let result = res.data.datas;
                    that.tableData = result.datas;
                    that.page.total = Number(result.totalCount);
                    setTimeout(() =>{
                        that.tableLoading = false
                    }, 300)
                }
            }).catch(err => {
                console.log(err);
            })
        },
        detailsFn(row) {
            this.$store.commit('setAddCompanyUrl', '/detailsFleet');
            this.$store.commit('setAddCompanyName', '车队详情');
            this.$router.push({
                path: `/userDetails`,
                query: { id: row._id }
            });
        },
        preservation(formName) {
            let that = this;
            that.$refs[formName].validate((valid) => {
                if(valid) {
                    loginService.editfleet({
                        id: that.id,
                        name: that.pageInfo.carName,
                        companies: that.companiesArray.toString(),
                        size: that.pageInfo.fleetNum,
                        chargeName: that.pageInfo.docker,
                        carNum: that.pageInfo.vehiclesNum,
                        inDriverNum: that.pageInfo.ownedDriver,
                        outDriverNum: that.pageInfo.externalDriver,
                        content: that.pageInfo.fleetRemarks,
                    }).then(res => {
                        if (res.data.success) {
                            that.$message({
                                message: '修改成功！',
                                type: 'success'
                            });
                            setTimeout(() => {
                                that.$router.push({path: 'fleetList'})
                            }, 300)
                        } else {
                            that.$message.error(res.data.message)
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        selectVersion() {
            let that = this;
            let ver = that.version;
            let versionList = [];
            let newList = [];
            that.versioncount = [];
            that.selectList = [];
            for (let i in ver) {
                let v = ver[i].children;
                let clist = [];
                for (let item in v) {
                    if (v[item].check) {
                        clist.push(v[item]);
                        that.selectList.push(v[item].no)
                    }
                }
                if (clist.length > 0) {
                    versionList.push(clist);
                    that.versioncount.push({
                        no: ver[i].no,
                        name: ver[i].name,
                        count: clist.length,
                        num: clist[clist.length - 1].num
                    })
                }
            }
            let n = 0;
            if (versionList[n] && versionList[n].length > 0) {
                for (let m in versionList[n]) {
                    let obj1 = {
                        no: versionList[n][m].no,
                        name: versionList[n][m].name,
                    };
                    newList.push(obj1)
                }
                if (versionList[n + 1]) check(n + 1)
            }

            function check(i) {
                let list = newList;
                newList = [];
                for (let l in list) {
                    for (let k in versionList[i]) {
                        let obj = {
                            no: list[l].no + ';' + versionList[i][k].no,
                            name: list[l].name + ';' + versionList[i][k].name,
                        };
                        newList.push(obj)
                    }
                }
                if (versionList[i + 1] && versionList[i + 1].length > 0) {
                    check(i + 1)
                }
            }

            newList.forEach((item, index) => {
                item.num = that.versionPrice[newList[index].no] ? that.versionPrice[newList[index].no].num : 0
            });
            that.versionList = newList;
        },
        objectSpanMethod({row, column, rowIndex, columnIndex}) {
            let that = this;
            if (columnIndex < that.versioncount.length) {
                let ver = that.versioncount;
                let l = ver.length;
                let span = 1;
                for (let i in ver) {
                    if (i < l - columnIndex - 1) span *= ver[l - i - 1].count;
                }
                if (rowIndex % span === 0) {
                    return {
                        rowspan: span,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            } else {
                if (columnIndex - that.versioncount.length === 2) {
                    return [1, 2];
                } else if (columnIndex - that.versioncount.length === 3) {
                    return [0, 0];
                }
                if (columnIndex - that.versioncount.length === 4) {
                    return [1, 2];
                } else if (columnIndex - that.versioncount.length === 5) {
                    return [0, 0];
                }
            }
        },
        twoSubmit(arr) {
            let newArr = [];
            arr.forEach(item => {
                newArr.push({
                    key: item.no,
                    name: item.name,
                    num: item.num
                })
            });
            let encoded = encodeURI(JSON.stringify(newArr));
            loginService.addversionList(this.id, {
                versions: encoded
            }).then(res => {
                if (res.data.success) {
                    this.$message({
                        message: '保存成功！',
                        type: 'success'
                    });
                    this.detailsfleet();
                } else {
                    this.$message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err);
            })
        },
        lineSubmit(item) {
            let that = this;
            if(item.start && item.end) {
                loginService.addcarTeamLines(that.id, {
                    startProvinceName: item.start[0].split('/')[0],
                    startProvinceId: item.start[0].split('/')[1],
                    startCityName: item.start[1].split('/')[0],
                    startCityId: item.start[1].split('/')[1],
                    endProvinceName: item.end[0].split('/')[0],
                    endProvinceId: item.end[0].split('/')[1],
                    endCityName: item.end[1].split('/')[0],
                    endCityId: item.end[1].split('/')[1]
                }).then(res => {
                    if (res.data.success) {
                        item.disAbled = true;
                        item.flag = true;
                        that.$message({
                            message: '保存成功！',
                            type: 'success'
                        });
                    } else {
                        that.$message.error(res.data.message)
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else {
                that.$message.error('请选择始发和目的地！')
            }
        },
        // 获取父子版本
        getversionList() {
            loginService.getversionList({}).then(res => {
                if (res.data.success) {
                    let rulest = res.data.datas;
                    rulest.forEach(item => {
                        item.children.forEach(items => {
                            items.num = 1;
                        })
                    });
                    this.version = rulest;
                }
            }).catch(err => {
                console.log(err);
            })
        },
        addCustomer() {
            if (this.carTeamLines[this.carTeamLines.length - 1].start === '') {
                this.$message({
                    message: '请先选择省!',
                    type: 'warning'
                });
                return
            } else {
                this.carTeamLines.push({
                    start: '',
                    endt: '',
                    flag: true,
                    disAbled: false
                });
            }
        },
        removeCustomer(items, index) {
            let that = this;
            that.$confirm('是否确定删除线路吗？', '严重警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                loginService.deletecarTeamLines(items.id, {}).then(res => {
                    if (res.data.success) {
                        that.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        if (index !== -1) {
                            that.carTeamLines.splice(index, 1);
                        }
                    }
                }).catch(err => {
                    console.log(err);
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消'
                });
            });

        },
        loadNode(node, resolve) {
            const { level } = node
            let code = 0
            if(level != 0) {
                code = node.data.value.split('/')[1]
            }
            let apis = process.env.API_ROOT
            let url = apis + 'citys'
            if(level > 0) {
                url = apis + `citys/${code}`
            }
            axios.get(url).then(res => {
                let nodes = res.data.datas.map(({ name, cityId }) => {
                    return {
                        label: name,
                        value: `${name}/${cityId}`,
                        leaf: level >= 1
                    }
                });
                resolve(nodes)
            })
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
        handleChange(val) {
            console.log(val);
        },
        // 分页
        handleSizeChange (val) {
            this.page.pageSize = val
            this.queryData()
        },
        handleCurrentChange (val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.queryData()
            }
        },
        returnFn() {
            this.$router.push({path: 'fleetList'})
        }
    },
}
</script>

<style scoped>
/deep/.el-collapse{
    border-top: 0 !important;
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

.box-card {
    width: 30%;
    margin: 0 1%;
    display: inline-block;
}

.box-card:nth-child(4) {
    width: 95%;
    margin: 0 1%;
    display: inline-block;
}


.box-card-table{
    display: inline-block;
    width: 95%;
    margin: 0 1%;
    clear: both;
}

.commentDiv{
    padding: 0 310px 0 70px;
    box-sizing: border-box;
}

/deep/.el-icon-info{
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 15px;
}
</style>

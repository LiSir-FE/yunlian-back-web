<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: `${beforeUrl}`, query: {id: this.id} }">{{ beforeName }}</el-breadcrumb-item>
                <el-breadcrumb-item>用户详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="100px">
            <el-form-item label="用户姓名" prop="name">
                <el-input v-model="pageInfo.name" placeholder="请输入用户姓名" class="wetuc-input-col2" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
                <el-input v-model="pageInfo.phone" placeholder="请输入联系方式" class="wetuc-input-col2"
                          :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="称谓" prop="sex">
                <el-select v-model="pageInfo.sex" placeholder="请选择称谓" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in sexList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="公司" prop="companies">
                <el-select
                    :disabled="true"
                    class="wetuc-input-col2"
                    v-model="pageInfo.companies"
                    value-key="subFieldName"
                    filterable
                    remote
                    placeholder="请选择其他公司"
                    @change="relationChangeKeyWord"
                    :remote-method="relationRemoteMethod"
                    :loading="relationLoading">
                    <el-option
                        v-for="item in getRelationArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车队" prop="fleet">
                <el-select
                    :disabled="true"
                    class="wetuc-input-col2"
                    v-model="pageInfo.fleet"
                    value-key="bandName"
                    filterable
                    remote
                    placeholder="请选择车队"
                    @change="fleetChangeKeyWord"
                    :remote-method="fleetRemoteMethod"
                    :loading="fleetLoading">
                    <el-option
                        v-for="item in getFleetArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职位" prop="position">
                <el-select v-model="pageInfo.position" placeholder="请选择职位" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in positionList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职能" prop="intJob">
                <el-select v-model="pageInfo.intJob" multiple :multiple-limit="3" placeholder="请选择职能"
                           class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in intJobList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所在地区" prop="options">
                <el-cascader
                    :disabled="true"
                    v-if="flag"
                    class="wetuc-input-col2"
                    :props="props"
                    v-model="pageInfo.options">
                </el-cascader>
            </el-form-item>

            <el-form-item label="详细地址" prop="detailAddress">
                <el-input v-model="pageInfo.detailAddress" class="wetuc-input-col2" :disabled="true">
                </el-input>
            </el-form-item>


            <el-form-item label="邮箱" prop="email">
                <el-input v-model="pageInfo.email" class="wetuc-input-col2" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="简介" prop="descripthion">
                <el-input v-model="pageInfo.descripthion" class="wetuc-input-col615" :disabled="true"></el-input>
            </el-form-item>
        </el-form>


        <div>
            <el-tabs v-model="userName" @tab-click="handleClick">
                <el-tab-pane label="用户轨迹" name="a"></el-tab-pane>
                <el-tab-pane label="消费轨迹" name="b"></el-tab-pane>
                <el-tab-pane label="商机信息" name="c"></el-tab-pane>
                <el-tab-pane label="浏览轨迹" name="d"></el-tab-pane>
            </el-tabs>
        </div>

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column :key="Math.random()" label="沟通方式" min-width="80" show-overflow-tooltip
                             v-if="userName === 'a'">
                <template slot-scope="scope">
                    {{ scope.row.communicateMethod | communicateMethod }}
                </template>
            </el-table-column>

            <el-table-column :key="Math.random()" label="场景" min-width="100" show-overflow-tooltip
                             v-if="userName === 'a'">
                <template slot-scope="scope">
                    {{ scope.row.scene | scene }}
                </template>
            </el-table-column>
            <el-table-column prop="title" :key="Math.random()" label="标题" min-width="100" show-overflow-tooltip
                             v-if="userName === 'a'"></el-table-column>
            <el-table-column prop="hostName" :key="Math.random()" label="拜访用户" min-width="100" show-overflow-tooltip
                             v-if="userName === 'a'"></el-table-column>
            <el-table-column :key="Math.random()" label="时间" min-width="100" show-overflow-tooltip
                             v-if="userName === 'a'">
                <template slot-scope="scope">
                    {{ scope.row.updateTime | stampFormate }}
                </template>
            </el-table-column>

            <el-table-column :key="Math.random()" label="类型" min-width="80" show-overflow-tooltip
                             v-if="userName === 'b'">门票
            </el-table-column>
            <el-table-column :key="Math.random()" label="内容" min-width="100" show-overflow-tooltip
                             v-if="userName === 'b'">
                <template slot-scope="scope">
                    <!--   不加三目运算 报错                 -->
                    <span v-if="scope.row.orderType === 2">
                        {{scope.row.orderDetails ? scope.row.orderDetails[0].actName : '' }}</span>
                    <span v-else>{{ scope.row.orderDetails ? scope.row.orderDetails[0].name : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" label="消费金额（元）" min-width="100" show-overflow-tooltip
                             v-if="userName === 'b'">
                <template slot-scope="scope">
                    <span v-if="scope.row.isFree">免费票</span>
                    <span>{{ scope.row.price | amount }}</span>
                </template>
            </el-table-column>
            <!--            <el-table-column prop="hostName" :key="Math.random()" label="业务员" min-width="100" show-overflow-tooltip v-if="userName === 'b'"></el-table-column>-->
            <el-table-column prop="phone" :key="Math.random()" label="时间" min-width="100" show-overflow-tooltip
                             v-if="userName === 'b'">
                <template slot-scope="scope">
                    {{ scope.row.createTime | stampFormate }}
                </template>
            </el-table-column>

            <el-table-column prop="name" :key="Math.random()" label="碎片类型" min-width="80" show-overflow-tooltip
                             v-if="userName === 'c'">
                <template slot-scope="scope">
                    {{ scope.row.infoType | infoType }}
                </template>
            </el-table-column>
            <el-table-column prop="infoTitle" :key="Math.random()" label="标题" min-width="100" show-overflow-tooltip
                             v-if="userName === 'c'"></el-table-column>
            <el-table-column prop="hostName" :key="Math.random()" label="发现人" min-width="100" show-overflow-tooltip
                             v-if="userName === 'c'"></el-table-column>
            <el-table-column prop="phone" :key="Math.random()" label="时间" min-width="100" show-overflow-tooltip
                             v-if="userName === 'c'">
                <template slot-scope="scope">
                    {{ scope.row.updateTime | stampFormate }}
                </template>
            </el-table-column>
        </el-table>

        <el-timeline v-if="userName === 'd'">
            <el-timeline-item
                v-for="(item, index) in tableData"
                :key="index"
                :timestamp="item.time | stampFormate">
                {{ item.content }}
            </el-timeline-item>
        </el-timeline>


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
import {communicateMethod, scene, infoType, amount} from '../../filter/companyList'
import axios from "axios";

export default {
    data() {
        return {
            id: this.$route.query.id,
            flag: false,
            pageInfo: {
                name: '',
                phone: '',
                sex: '',
                companies: '',
                fleet: '',
                position: '',
                intJob: '',
                email: '',
                options: undefined,
                descripthion: '',
                detailAddress: ''
            },
            beforeUrl: sessionStorage.getItem('addCompanyUrl') || this.$store.getters.getAddCpmpanyUrl,
            beforeName: sessionStorage.getItem('addCompanyName') || this.$store.getters.getAddCpmpanyName,
            props: {
                lazy: true,
                lazyLoad: (node, resolve) => this.loadNode(node, resolve)
            },
            getRelationArr: [],
            getFleetArr: [],
            companiesArray: [],
            fleetArray: [],
            relationLoading: false,
            fleetLoading: false,
            sexList: [{
                value: 1,
                label: '男士'
            }, {
                value: 2,
                label: '女士'
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
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            tableData: [],
            tableLoading: false,
            userName: 'a'
        }
    },
    filters: {
        communicateMethod,
        scene,
        infoType,
        amount
    },
    mounted() {
        this.queryData(this.userName)
    },
    methods: {
        queryData(type) {
            let that = this;
            that.tableLoading = true;
            if (type === 'a') {
                loginService.detailUsersTable(that.id, {
                    type: 4,
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                }).then(res => {
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
            } else if (type === 'b') {
                loginService.getFootprintActusers(that.id, {
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                }).then(res => {
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
            } else if (type === 'c') {
                loginService.detailUsersTable(that.id, {
                    type: 5,
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                }).then(res => {
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
            } else if (type === 'd') {
                loginService.getFootprint({
                    userId: that.id,
                    pageNo: that.page.pageNum,
                    pageSize: that.page.pageSize,
                }).then(res => {
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
            loginService.detailUsers(that.id, {}).then(res => {
                if (res.data.success) {
                    that.$nextTick(() => {
                        let obj = res.data.datas.user;
                        let carTeam = res.data.datas.carTeam;
                        let com = res.data.datas.company;
                        that.pageInfo.intJob = obj.functions ? obj.functions : '';
                        that.pageInfo.position = obj.intJob ? obj.intJob : '';
                        that.pageInfo.email = obj.email;
                        that.pageInfo.descripthion = obj.descripthion;
                        that.pageInfo.name = obj.name;
                        that.pageInfo.phone = obj.phone;
                        that.pageInfo.sex = obj.sex;
                        that.pageInfo.detailAddress = obj.address.detailAdress ? obj.address.detailAdress : '';
                        if (com) {
                            if (JSON.stringify(that.getRelationArr).indexOf(com.id) === -1) {
                                that.getRelationArr.unshift({
                                    id: com.id,
                                    name: com.name
                                })
                            }
                            that.pageInfo.companies = com.id;
                        }
                        if (carTeam) {
                            if (JSON.stringify(that.getFleetArr).indexOf(carTeam.id) === -1) {
                                that.getFleetArr.unshift({
                                    id: carTeam.id,
                                    name: carTeam.name
                                })
                            }
                            that.pageInfo.fleet = carTeam.id;
                        }
                        // 这里是赋值
                        const { provinceName, provinceId, cityName, cityId, districtName, districtId } = obj.address;
                        that.pageInfo.options = [`${provinceName}/${provinceId}`, `${cityName}/${cityId}`, `${districtName}/${districtId}`];
                        that.flag = true;
                    })
                }
            }).catch(err => {
                console.log(err);
            })
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
                        leaf: level >= 2
                    }
                });
                resolve(nodes)
            })
        },
        handleClick(item) {
            this.queryData(this.userName)
        },
        relationChangeKeyWord(val) {
            this.companiesArray = [];
            if (val !== null) {
                this.companiesArray.push(val.id);
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
        fleetChangeKeyWord(val) {
            this.fleetArray = []
            if (val !== null) {
                this.fleetArray.push(val);
            } else {
                this.fleetArray = [];
            }
        },
        getfleetList(query) {
            let that = this, relationArrayX = [];
            loginService.getfleetList({
                param: query,
                type: 1,
                pageNo: 1,
                pageSize: 20
            }).then(function (res) {
                if (res.data.success) {
                    let newArr = res.data.datas.datas;
                    for (let i = 0; i < newArr.length; i++) {
                        relationArrayX.push({id: newArr[i].id, name: newArr[i].name});
                    }
                } else {
                    that.$message.error(res.data.message);
                }
            }).catch(function (err) {
                console.log(err);
            });
            return relationArrayX;
        },
        fleetRemoteMethod(query) {
            let that = this;
            if (query !== '') {
                that.fleetLoading = true;
                setTimeout(() => {
                    that.fleetLoading = false;
                    that.getFleetArr = that.getfleetList(query); // 文章关键词
                }, 200);
            } else {
                that.getFleetArr = [];
            }
        },
        // 分页
        handleSizeChange(val) {
            this.page.pageSize = val
            this.queryData(this.userName)
        },
        handleCurrentChange(val) {
            if (val !== 0) {
                this.page.pageNum = val
                this.queryData(this.userName)
            }
        }
    },
}
</script>

<style scoped>

</style>

<template>
    <div class="wetuc-page-content">
        <div class="breadcrumb-con">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: `${beforeUrl}` }">{{ beforeName }}</el-breadcrumb-item>
                <el-breadcrumb-item>公司详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="pageInfo" :model="pageInfo" :inline="true" label-width="100px" :rules="rules">
            <el-form-item label="公司" prop="company">
                <el-input v-model="pageInfo.company" placeholder="例如：运联" class="wetuc-input-col2" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="公司全称" prop="companyName">
                <el-input v-model="pageInfo.companyName" placeholder="例如：运联慧科技有限公司" class="wetuc-input-col2" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="网址" prop="website">
                <el-input v-model="pageInfo.website" placeholder="请输入公司网址" class="wetuc-input-col2" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="企业会员" prop="vip">
                <el-select v-model="pageInfo.vip" placeholder="请选择企业规模" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in vipList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="企业规模" prop="scale">
                <el-select v-model="pageInfo.scale" placeholder="请选择企业规模" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in scaleList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="投融阶段" prop="financing">
                <el-select v-model="pageInfo.financing" placeholder="请选择企业规模" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in financingList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="一级行业" prop="industry">
                <el-select v-model="pageInfo.industry" placeholder="请选择一级行业" class="wetuc-input-col2" :disabled="true" @change="industryChange(pageInfo.industry, true)">
                    <el-option
                        v-for="item in industryList"
                        :key="item.field"
                        :label="item.name"
                        :value="item.field">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级行业" prop="subField">
                <el-select v-model="pageInfo.subField" placeholder="请选择二级行业" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in subFieldList"
                        :key="item.field"
                        :label="item.name"
                        :value="item.field">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="员工" prop="staff">
                <el-select v-model="pageInfo.staff" placeholder="请选择员工" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in staffList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="营销顾问" prop="marketing">
                <el-select v-model="pageInfo.marketing" value-key="id" placeholder="请选择员工" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in marketingList"
                        :key="item.id"
                        :label="item.hostCompany"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="媒体顾问" prop="media">
                <el-select v-model="pageInfo.media" value-key="id" placeholder="请选择员工" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in mediaList"
                        :key="item.id"
                        :label="item.hostCompany"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="行业顾问" prop="industryConsultant">
                <el-select v-model="pageInfo.industryConsultant" value-key="id" placeholder="请选择员工" class="wetuc-input-col2" :disabled="true">
                    <el-option
                        v-for="item in industryConsultantList"
                        :key="item.id"
                        :label="item.hostCompany"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="竞品公司" prop="companies">
                <el-select
                    :disabled="true"
                    class="wetuc-input-col2"
                    v-model="pageInfo.companies"
                    value-key="name"
                    filterable
                    remote
                    multiple
                    :multiple-limit="3"
                    placeholder="请选择竞品公司"
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
            </el-form-item>
            <el-form-item label="地区" prop="options">
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

            <div class="wetuc-block">
                <el-form-item label="是否公开" prop="publicShow">
                    <el-select v-model="pageInfo.publicShow" placeholder="请选择员工" class="wetuc-input-col2" :disabled="true">
                        <el-option
                            v-for="item in publicShowList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>

        </el-form>


        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="核心成员" name="a"></el-tab-pane>
            <el-tab-pane label="企业动态" name="b"></el-tab-pane>
            <el-tab-pane label="企业活动" name="c"></el-tab-pane>
            <el-tab-pane label="企业轨迹" name="d"></el-tab-pane>
            <el-tab-pane label="商机信息" name="e"></el-tab-pane>
            <el-tab-pane label="合同信息" name="f"></el-tab-pane>
            <el-tab-pane label="运力信息" name="g"></el-tab-pane>
        </el-tabs>

<!--        <el-button type="primary" @click="insertTable(activeName)" style="float: right" v-if="activeName === 'b' || activeName === 'c'">编辑</el-button>-->

        <el-table :data="tableData" style="width: 100%" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column :key="Math.random()" label="序号" min-width="50" show-overflow-tooltip v-if="activeName === 'a' || activeName === 'b' || activeName === 'c'">
                <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="name" label="姓名" min-width="80" show-overflow-tooltip v-if="activeName === 'a'"></el-table-column>
            <el-table-column :key="Math.random()" prop="intJob" label="职位" min-width="80" show-overflow-tooltip v-if="activeName === 'a'">
                <template slot-scope="scope">
                    {{scope.row.intJob | intJob}}
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="functions" label="职能" min-width="100" show-overflow-tooltip v-if="activeName === 'a'">
                <template slot-scope="scope">
                    <p class="functionsP" v-for="(domain) in scope.row.functions">{{domain | functions}},</p>
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="phone" label="联系方式" min-width="100" show-overflow-tooltip v-if="activeName === 'a'">
                <template slot-scope="scope">
                    <span v-if="!scope.row.phone">{{scope.row.phone}}</span>
                    <span v-else>{{(scope.row.phone).substr(0, 3) + '****' + (scope.row.phone).substr(7)}}</span>
                </template>
            </el-table-column>

            <el-table-column :key="Math.random()" prop="varefyTime" label="时间" min-width="120" show-overflow-tooltip v-if="activeName === 'b'">
                <template slot-scope="scope">
                    {{scope.row.varefyTime | stampFormate4}}
                </template>
            </el-table-column>

            <el-table-column :key="Math.random()" prop="publishTime" label="时间" min-width="120" show-overflow-tooltip v-if="activeName === 'c'">
                <template slot-scope="scope">
                    {{scope.row.publishTime | stampFormate4}}
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="title" label="标题" min-width="150" show-overflow-tooltip v-if="activeName === 'b'"></el-table-column>
            <el-table-column :key="Math.random()" prop="activityTitle" label="标题" min-width="150" show-overflow-tooltip v-if="activeName === 'c'"></el-table-column>
            <el-table-column :key="Math.random()" prop="summary" label="摘要" min-width="150" show-overflow-tooltip v-if="activeName === 'b'"></el-table-column>

            <el-table-column :key="Math.random()" prop="createDate" label="时间" min-width="120" show-overflow-tooltip v-if="activeName === 'd'">
                <template slot-scope="scope">
                    {{scope.row.visitTime | stampFormate}}
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="name" label="用户姓名" min-width="80" show-overflow-tooltip v-if="activeName === 'd'"></el-table-column>
            <el-table-column :key="Math.random()" prop="title" label="内容摘要" min-width="80" show-overflow-tooltip v-if="activeName === 'd'"></el-table-column>
            <el-table-column :key="Math.random()" prop="type" label="信息类型" min-width="80" show-overflow-tooltip v-if="activeName === 'd'">
                <template slot-scope="scope">
                    {{scope.row.type | type}}
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="hostName" label="记录人" min-width="70" show-overflow-tooltip v-if="activeName === 'd'"></el-table-column>
            <el-table-column :key="Math.random()" prop="value" label="信息价值" min-width="80" show-overflow-tooltip v-if="activeName === 'd'">
                <template slot-scope="scope">
                    {{scope.row.value | value}}
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="scene" label="场景" min-width="80" show-overflow-tooltip v-if="activeName === 'd'">
                <template slot-scope="scope">
                    {{scope.row.scene | scene}}
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="communicateMethod" label="沟通方式" min-width="80" show-overflow-tooltip v-if="activeName === 'd'">
                <template slot-scope="scope">
                    {{scope.row.communicateMethod | communicateMethod}}
                </template>
            </el-table-column>


            <el-table-column :key="Math.random()" prop="name" label="碎片类型" min-width="80" show-overflow-tooltip v-if="activeName === 'e'">
                <template slot-scope="scope">
                    {{scope.row.infoType | infoType}}
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="infoTitle" label="碎片标题" min-width="150" show-overflow-tooltip v-if="activeName === 'e'"></el-table-column>
            <el-table-column :key="Math.random()" prop="hostName" label="碎片发现人" min-width="80" show-overflow-tooltip v-if="activeName === 'e'"></el-table-column>
            <el-table-column :key="Math.random()" prop="createTime" label="碎片时间" min-width="120" show-overflow-tooltip v-if="activeName === 'e'">
                <template slot-scope="scope">
                    {{scope.row.createTime | stampFormate}}
                </template>
            </el-table-column>

            <el-table-column :key="Math.random()" prop="name" label="合同名称" min-width="80" show-overflow-tooltip v-if="activeName === 'f'"></el-table-column>
            <el-table-column :key="Math.random()" prop="totalAmount" label="合同金额(元)" min-width="80" show-overflow-tooltip v-if="activeName === 'f'">
                <template slot-scope="scope">
                    {{Number(scope.row.totalAmount) | moneyFormate}}
                </template>
            </el-table-column>
            <el-table-column :key="Math.random()" prop="hostName" label="业务员" min-width="80" show-overflow-tooltip v-if="activeName === 'f'"></el-table-column>
            <el-table-column :key="Math.random()" prop="createTime" label="签约时间" min-width="80" show-overflow-tooltip v-if="activeName === 'f'">
                <template slot-scope="scope">
                    {{scope.row.createTime | stampFormate}}
                </template>
            </el-table-column>


            <el-table-column :key="Math.random()" prop="name" label="车队名称" min-width="80" show-overflow-tooltip v-if="activeName === 'f'"></el-table-column>
            <el-table-column :key="Math.random()" prop="companyName" label="服务公司" min-width="80" show-overflow-tooltip v-if="activeName === 'f'"></el-table-column>
            <el-table-column :key="Math.random()" prop="bandName" label="品牌" min-width="80" show-overflow-tooltip v-if="activeName === 'f'"></el-table-column>
            <el-table-column :key="Math.random()" prop="driverNum" label="车辆总数" min-width="80" show-overflow-tooltip v-if="activeName === 'f'"></el-table-column>
            <el-table-column :key="Math.random()" prop="carNum" label="司机总数" min-width="80" show-overflow-tooltip v-if="activeName === 'f'"></el-table-column>



            <el-table-column label="操作" min-width="320" fixed="right" align="right" v-if="activeName !== 'd'">
                <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-view" size="small" @click="detailsFn(activeName, scope.row)">详情</el-button>
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



        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
            <el-form :inline="true" ref="dialogInfo" :model="dialogInfo">
                <el-form-item label="名字" prop="name">
                    <el-input v-model="dialogInfo.name" placeholder="请输入名字搜索" class="wetuc-input-col2"
                              @keyup.enter.native="queryData(dialogInfo.name)">
                        <i slot="suffix" class="el-input__icon el-icon-search"
                           @click="queryData(dialogInfo.name)" style="cursor: pointer"></i>
                    </el-input>
                </el-form-item>
            </el-form>


            <el-table ref="dialogtableData" :data="dialogtableData" style="width: 100%" @selection-change="dialogSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID" min-width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="activityTitle" label="标题" min-width="100" show-overflow-tooltip v-if="activeName === 'c'"></el-table-column>
                <el-table-column prop="summary" label="摘要内容" min-width="100" show-overflow-tooltip v-if="activeName === 'b'"></el-table-column>
                <el-table-column prop="createDate" label="时间" min-width="100" show-overflow-tooltip v-if="activeName === 'b'">
                    <template slot-scope="scope">
                        {{scope.row.createDate | stampFormate4}}
                    </template>
                </el-table-column>
                <el-table-column prop="publishTime" label="时间" min-width="100" show-overflow-tooltip v-if="activeName === 'c'">
                    <template slot-scope="scope">
                        {{scope.row.publishTime | stampFormate4}}
                    </template>
                </el-table-column>
                <el-table-column min-width="80" label="操作" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="wetuc-pagination-panel">
                <el-pagination @size-change="dialogPageSizeChange"
                               @current-change="dialogPageCurrentChange"
                               :current-page="dialogPage.pageNum"
                               :page-sizes="[5, 10, 20, 50]"
                               :page-size="dialogPage.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="dialogPage.total">
                </el-pagination>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="diaInsert">插 入</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {loginService} from "../../service/loginService";
import axios from "axios";
import {intJob, type, value, infoType, scene, communicateMethod, functions} from '../../filter/companyList'

export default {
    data() {
        return {
            beforeUrl: sessionStorage.getItem('addCompanyUrl') || this.$store.getters.getAddCpmpanyUrl,
            beforeName: sessionStorage.getItem('addCompanyName') || this.$store.getters.getAddCpmpanyName,
            flag: true,
            dialogTitle: '',
            id: this.$route.query.id,
            activeName: 'a',
            dialogInfo: {
                name: ''
            },
            dialogtableData: [],
            dialogVisible: false,
            pageInfo: {
                company: '',
                companyName: '',
                website: '',
                scale: '',
                vip: '',
                financing: '',
                industry: '',
                subField: '',
                staff: '',
                industryConsultant: '',
                media: '',
                marketing: '',
                companies: '',
                options: '',
                detailAddress: '',
                publicShow: 1
            },
            props: {
                lazy: true,
                lazyLoad: (node, resolve) => this.loadNode(node, resolve)
            },
            page: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            dialogPage: {
                pageNum: 1,
                pageSize: 5,
                total: 0,
            },
            tableData: [],
            tableLoading: false,
            companiesArray: [],
            getRelationArr: [],
            relationLoading: false,
            marketingList: [],
            mediaList: [],
            industryConsultantList: [],
            scaleList: [{
                value: 1,
                label: '1000万以下'
            }, {
                value: 2,
                label: '1000万-1亿'
            }, {
                value: 3,
                label: '1亿-10亿'
            }, {
                value: 4,
                label: '10亿以上'
            }],
            vipList: [{
                value: 1,
                label: '会员'
            }, {
                value: 2,
                label: '潜在会员'
            }, {
                value: 3,
                label: '非会员'
            }],
            financingList: [{
                value: 1,
                label: 'IPO'
            }, {
                value: 2,
                label: 'pre-IPO'
            }, {
                value: 3,
                label: 'F轮'
            }, {
                value: 4,
                label: 'E轮'
            }, {
                value: 5,
                label: 'D轮'
            }, {
                value: 6,
                label: 'C轮'
            }, {
                value: 7,
                label: 'B轮'
            }, {
                value: 8,
                label: 'A轮'
            }, {
                value: 9,
                label: 'pre-A轮'
            }, {
                value: 10,
                label: '天使轮'
            }, {
                value: 11,
                label: '未融资'
            }, {
                value: 12,
                label: '战略投资'
            }, {
                value: 13,
                label: '被收购'
            }],
            industryList: [],
            subFieldList: [],
            staffList: [{
                value: 1,
                label: '100人以下'
            }, {
                value: 2,
                label: '100-1000人'
            }, {
                value: 3,
                label: '1000-10000人'
            }, {
                value: 4,
                label: '10000人以上'
            }],
            publicShowList: [{
                value: 0,
                label: '是'
            }, {
                value: 1,
                label: '否'
            }],
            diaSelectData: [],
            rules: {
                company: [
                    {required: true, message: '请输入公司名称', trigger: 'blur'}
                ],
                companyName: [
                    {required: true, message: '请输入公司全称', trigger: 'blur'}
                ],
            }
        }
    },
    filters: {
        intJob,
        type,
        infoType,
        value,
        scene,
        communicateMethod,
        functions,
    },
    mounted() {
        this.getindustryOptions()
        this.getStaff()
        this.getRelationArr = this.getRelationList('');
        setTimeout(() => {
            if(this.getRelationArr) {
                this.getDetails()
                this.queryData(this.activeName)
            }
        }, 500)
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
    methods: {
        getDetails() {
            let that = this;
            that.flag = false;
            loginService.detailsCompanies(that.id, {}).then(res => {
                if (res.data.success) {
                    let result = res.data.datas.company;
                    that.pageInfo.industry = result.field;
                    that.pageInfo.subField = result.subField;
                    that.pageInfo.companyName = result.fullName;
                    that.pageInfo.company = result.name;
                    that.pageInfo.staff = result.staffNum;
                    that.pageInfo.website = result.url;
                    that.pageInfo.scale = result.size;
                    that.pageInfo.financing = result.stage;
                    that.pageInfo.vip = result.companyVip;

                    let obj1 = {
                        hostCompany: result.sellChargeName,
                        id: result.sellChargeId
                    }

                    let obj2 = {
                        hostCompany: result.pressChargeName,
                        id: result.pressChargeId
                    }

                    let obj3 = {
                        hostCompany: result.fieldChargeName,
                        id: result.fieldChargeId
                    }
                    that.pageInfo.marketing = obj1;
                    that.pageInfo.media = obj2;
                    that.pageInfo.industryConsultant = obj3;

                    that.pageInfo.companies = [];

                    // 这里是赋值
                    const { prov, provCode, city, cityCode, dist, distCode } = result;
                    that.pageInfo.options = [`${prov}/${provCode}`, `${city}/${cityCode}`, `${dist}/${distCode}`];
                    that.flag = true;

                    that.pageInfo.detailAddress = result.address ? result.address : '';
                    let com = res.data.datas.competitors;
                    if (com) {
                        com.forEach(item => {
                            that.pageInfo.companies.push({
                                id: item.id,
                                name: item.name
                            });
                            if (JSON.stringify(that.getRelationArr).indexOf(item.id) == -1) {
                                that.getRelationArr.unshift({
                                    id: item.id,
                                    name: item.name
                                })
                            }
                            that.companiesArray.push(item.id);
                        });
                    }
                    that.industryChange(res.data.datas.company.field, false);
                }
            }).catch(err => {
                console.log(err);
            })
        },
        submitForm(formName) {
            let that = this;
            that.$refs[formName].validate((valid) => {
                if (valid) {
                    loginService.editCompanies({
                        id: that.id,
                        name: that.pageInfo.company,
                        field: that.pageInfo.industry,
                        subField: that.pageInfo.subField,
                        fullName: that.pageInfo.companyName,
                        size: that.pageInfo.scale,
                        staffNum: that.pageInfo.staff,
                        url: that.pageInfo.website,
                        stage: that.pageInfo.financing,
                        companyVip: that.pageInfo.vip,
                        competitors: that.companiesArray.toString(),
                        publicShow: that.pageInfo.publicShow === 0 ? true : false,

                        pressChargeId: that.pageInfo.media.id,
                        pressChargeName: that.pageInfo.media.hostCompany,
                        fieldChargeId: that.pageInfo.industryConsultant.id,
                        fieldChargeName: that.pageInfo.industryConsultant.hostCompany,

                        sellChargeId: that.pageInfo.marketing.id,
                        sellChargeName: that.pageInfo.marketing.hostCompany,


                        prov: that.pageInfo.options[0].split('/')[0],
                        provCode: that.pageInfo.options[0].split('/')[1],
                        city: that.pageInfo.options[1].split('/')[0],
                        cityCode: that.pageInfo.options[1].split('/')[1],
                        dist: that.pageInfo.options[2].split('/')[0],
                        distCode: that.pageInfo.options[2].split('/')[1],
                        address: that.pageInfo.detailAddress,

                    }).then(res => {
                        if (res.data.success) {
                            that.$message({
                                type: 'success',
                                message: '修改成功'
                            })
                            setTimeout(() => {
                                this.$router.push({path: `${that.beforeUrl}`})
                            }, 300)
                        } else {
                            that.$message.error(res.data.message)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 获取一级行业
        getindustryOptions() {
            loginService.getindustryOptions({
                level: 1
            }).then(res => {
                this.industryList = res.data.datas;
            }).catch(err => {
                console.log(err);
            })
        },
        // 获取二级
        industryChange(value, type) {
            if(type) {
                this.pageInfo.subField = '';
            }
            this.subFieldList = [];
            loginService.getindustryOptions({
                level: 2,
                fField: value
            }).then(res => {
                this.subFieldList = res.data.datas;
            }).catch(err => {
                console.log(err);
            })
        },
        detailsFn(name, row) {
            let that = this
            if(name === 'a') {
                that.$router.push({
                    path: `/userDetails`,
                    query: { id: row._id }
                });
            } else if(name === 'b') {
                let href = this.pcUrl + `article/${row._id}`;
                setTimeout(function () {
                    window.open(href, '_blank');
                }, 200);
            } else if(name === 'c') {
                let href = this.pcUrl + `activity/${row._id}`;
                setTimeout(function () {
                    window.open(href, '_blank');
                }, 200);
            } else if(name === 'e') {
                that.$router.push({
                    path: `/detailsInformation`,
                    query: { id: row.id }
                });
            } else if(name === 'f') {
                const {href} = this.$router.resolve({
                    path: '/contractDetails',
                    query: {
                        id: row.id
                    }
                })
                setTimeout(function () {
                    window.open(href, '_blank')
                }, 200);
            } else if(name === 'g') {
                that.$router.push({
                    path: `/fleetDetails`,
                    query: { id: row.id }
                });
            }
        },
        // 获取顾问
        getStaff() {
            for (let i = 1; i < 4; i++) {
                loginService.getStaff({
                    staffFunction: i
                }).then(res => {
                    if (res.data.success) {
                        let result = res.data.datas;
                        if(i === 1) {
                            result.forEach(item => {
                                this.marketingList.push({
                                    hostCompany: item.hostName,
                                    id: item.id
                                })
                            })
                        }
                        if(i === 2) {
                            result.forEach(item => {
                                this.mediaList.push({
                                    hostCompany: item.hostName,
                                    id: item.id
                                })
                            })
                        }
                        if(i === 3) {
                            result.forEach(item => {
                                this.industryConsultantList.push({
                                    hostCompany: item.hostName,
                                    id: item.id
                                })
                            })
                        }
                    }
                }).catch(err => {
                    console.log(err);
                })
            }
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
        handleClick(tab, event) {
            this.queryData(tab.name)
        },
        queryData(name) {
            let that = this;
            that.tableLoading = true
            const type = name === 'a' ? 1 : name === 'b' ? 2 : name === 'c' ? 3 : name === 'd' ? 4 : name === 'e' ? 5 : name === 'f' ? 7 : name === 'g' ? 6 : ''
            loginService.getCompanyItem(that.id, {
                type: type,
                pageNo: that.page.pageNum,
                pageSize: that.page.pageSize
            }).then(res => {
                if(res.data.success) {
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
                console.log(err);
            })
        },
        // 插入表格
        insertTable(name) {
            let that = this;
            that.dialogVisible = true
            if(name === 'b') {
                loginService.getList({
                    pageNo: that.dialogPage.pageNum,
                    pageSize: that.dialogPage.pageSize,
                    query: that.dialogInfo.name,
                    all: true,
                    status: 1
                }).then(res => {
                    if(res.data.success) {
                        let result = res.data.datas;
                        that.dialogtableData = result.datas;
                        that.dialogPage.total = Number(result.totalCount);
                    }
                }).catch(err =>{
                    console.log(err);
                })
            } else {
                loginService.getActivities({
                    pageNo: that.dialogPage.pageNum,
                    pageSize: that.dialogPage.pageSize,
                    query: that.dialogInfo.name,
                    all: true
                }).then(res => {
                    if(res.data.success) {
                        let result = res.data.datas;
                        that.dialogtableData = result.datas;
                        that.dialogPage.total = Number(result.totalCount);
                    }
                }).catch(err =>{
                    console.log(err);
                })
            }
        },
        dialogSelectionChange(val) {
            this.diaSelectData = [];
            val.forEach(item =>{
                this.diaSelectData.push(item.id);
            })
        },
        diaInsert() {
            let that = this;
            loginService.insertCompanyItem(that.id,{
                operate: 1,
                type: that.activeName === 'b' ? 2 : 3,
                typeIds: this.diaSelectData
            }).then(res => {
                if(res.data.success) {
                    this.queryData(this.activeName);
                }
                setTimeout(function () {
                    that.dialogVisible = false
                }, 300)
            }).catch(err => {
                console.log(err);
            })
        },
        // 分页
        handleSizeChange(val) {
            this.page.pageSize = val;
            this.queryData(this.activeName);
        },
        handleCurrentChange(val) {
            this.page.pageNo = val;
            this.queryData(this.activeName);
        },
        // 分页
        dialogPageSizeChange(val) {
            this.dialogPage.pageSize = val;
            this.insertTable(this.activeName);
        },
        dialogPageCurrentChange(val) {
            this.dialogPage.pageNo = val;
            this.insertTable(this.activeName);
        },
        returnFn() {
            this.$router.push({path: `${this.beforeUrl}`})
        },
    },
}
</script>

<style scoped>

</style>

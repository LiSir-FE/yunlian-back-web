/**
 * Created by liliang  on 2019/05/04.
 */
// 行业
export function field(val) {
    let field = '';
    switch (val) {
        case 1: {
            field = '建筑业';
            break;
        }
        case 2: {
            field = '批发和零售业';
            break;
        }
        case 3: {
            field = '交通运输、仓储和邮政业';
            break;
        }
        case 4: {
            field = '制造业';
            break;
        }
        case 5: {
            field = '租赁和商务服务业';
            break;
        }
        case 6: {
            field = '科学研究和技术服务业';
            break;
        }
        case 7: {
            field = '居民服务、修理和其他服务业';
            break;
        }
        case 8: {
            field = '住宿和餐饮业';
            break;
        }
        case 9: {
            field = '信息传输、软件和信息技术服务业';
            break;
        }
        case 10: {
            field = '金融业';
            break;
        }
        case 11: {
            field = '房地产业';
            break;
        }
        case 12: {
            field = '国际组织';
            break;
        }
        case 13: {
            field = '卫生和社会工作';
            break;
        }
        case 14: {
            field = '教育';
            break;
        }
        case 15: {
            field = '公共管理、社会保障和社会组织';
            break;
        }
        case 16: {
            field = '文化、体育和娱乐业';
            break;
        }
    }
    return field;
}

// 重新写一个行业, 省的那些傻逼最后又乱套
// 行业1
export function againField(val) {
    let againField = '';
    switch (val) {
        case 1: {
            againField = '货主';
            break;
        }
        case 2: {
            againField = '专业物流';
            break;
        }
        case 3: {
            againField = '普货服务';
            break;
        }
        case 4: {
            againField = '信息系统';
            break;
        }
        case 5: {
            againField = '生态服务';
            break;
        }
        case 6: {
            againField = '基础设施';
            break;
        }
    }
    return againField;
}

// 行业2
export function againTwoField(val) {
    let againTwoField = '';
    switch (val) {
        case 1: {
            againTwoField = '制造商';
            break;
        }
        case 2: {
            againTwoField = '分销商';
            break;
        }
        case 3: {
            againTwoField = '零售商';
            break;
        }
        case 4: {
            againTwoField = '电子商务';
            break;
        }
        case 5: {
            againTwoField = '海淘和跨境电商';
            break;
        }
        case 6: {
            againTwoField = 'O2O本地生活';
            break;
        }
        case 7: {
            againTwoField = '货代和报关';
            break;
        }
        case 8: {
            againTwoField = '货运中介';
            break;
        }
        case 9: {
            againTwoField = '港口物流';
            break;
        }
        case 10: {
            againTwoField = '工程物流';
            break;
        }
        case 11: {
            againTwoField = '第三方物流';
            break;
        }
        case 12: {
            againTwoField = '4PL';
            break;
        }
        case 13: {
            againTwoField = '医药物流';
            break;
        }
        case 14: {
            againTwoField = '化工物流';
            break;
        }
        case 15: {
            againTwoField = '冷链物流';
            break;
        }
        case 16: {
            againTwoField = '代运营商';
            break;
        }
        case 17: {
            againTwoField = '逆向物流';
            break;
        }
        case 18: {
            againTwoField = '水运';
            break;
        }
        case 19: {
            againTwoField = '航空';
            break;
        }
        case 20: {
            againTwoField = '铁路';
            break;
        }
        case 21: {
            againTwoField = '多式联运';
            break;
        }
        case 22: {
            againTwoField = '仓储服务';
            break;
        }
        case 23: {
            againTwoField = '整车合约物流';
            break;
        }
        case 24: {
            againTwoField = '快递和包裹';
            break;
        }
        case 25: {
            againTwoField = '零担物流';
            break;
        }
        case 26: {
            againTwoField = '落地配';
            break;
        }
        case 27: {
            againTwoField = '专线物流';
            break;
        }
        case 28: {
            againTwoField = '同城配送';
            break;
        }
        case 29: {
            againTwoField = '报关平台';
            break;
        }
        case 30: {
            againTwoField = 'WMS';
            break;
        }
        case 31: {
            againTwoField = 'YMS';
            break;
        }
        case 32: {
            againTwoField = 'TMS';
            break;
        }
        case 33: {
            againTwoField = 'WCS';
            break;
        }
        case 34: {
            againTwoField = 'SCM&Modeling';
            break;
        }
        case 35: {
            againTwoField = '专线ERP';
            break;
        }
        case 36: {
            againTwoField = 'GPS管车平台';
            break;
        }
        case 37: {
            againTwoField = '车货匹配';
            break;
        }
        case 38: {
            againTwoField = '电商物流平台';
            break;
        }
        case 39: {
            againTwoField = '协同平台';
            break;
        }
        case 40: {
            againTwoField = '物流媒体';
            break;
        }
        case 41: {
            againTwoField = '教育培训';
            break;
        }
        case 42: {
            againTwoField = '金融服务';
            break;
        }
        case 43: {
            againTwoField = '经营租赁';
            break;
        }
        case 44: {
            againTwoField = 'PE/VC';
            break;
        }
        case 45: {
            againTwoField = 'HR服务';
            break;
        }
        case 46: {
            againTwoField = '物流咨询';
            break;
        }
        case 47: {
            againTwoField = '系统集成';
            break;
        }
        case 48: {
            againTwoField = '港口堆场';
            break;
        }
        case 49: {
            againTwoField = '铁路枢纽';
            break;
        }
        case 50: {
            againTwoField = '航空枢纽';
            break;
        }
        case 51: {
            againTwoField = '多式联运枢纽';
            break;
        }
        case 52: {
            againTwoField = '公路港';
            break;
        }
        case 53: {
            againTwoField = '物流仓储园区';
            break;
        }
        case 54: {
            againTwoField = '物流仓储设备';
            break;
        }
        case 55: {
            againTwoField = '物料搬运设备';
            break;
        }
        case 56: {
            againTwoField = '物流容器';
            break;
        }
        case 57: {
            againTwoField = '物流信息化设备';
            break;
        }
        case 58: {
            againTwoField = '物流信息化装置';
            break;
        }
        case 59: {
            againTwoField = '卡车整车';
            break;
        }
        case 60: {
            againTwoField = '卡车零配件及汽修';
            break;
        }
        case 61: {
            againTwoField = '行业协会/政府机构';
            break;
        }
        case 62: {
            againTwoField = '跨境物流';
            break;
        }
        case 63: {
            againTwoField = '综合物流';
            break;
        }
    }
    return againTwoField;
}

export function staffNum(val) {
    let staffNum = '';
    switch (val) {
        case 1: {
            staffNum = '100以下';
            break;
        }
        case 2: {
            staffNum = '100-1000人';
            break;
        }
        case 3: {
            staffNum = '1000-10000人';
            break;
        }
        case 4: {
            staffNum = '10000人以上';
            break;
        }
    }
    return staffNum
}

export function type(val) {
    let type = '';
    switch (val) {
        case 1: {
            type = '信息沟通';
            break;
        }
        case 2: {
            type = '商务合作';
            break;
        }
        case 3: {
            type = '资源对接';
            break;
        }
        case 4: {
            type = '采访报道';
            break;
        }
        case 5: {
            type = '培训咨询';
            break;
        }
    }
    return type
}

export function communicateMethod(val) {
    let communicateMethod = '';
    switch (val) {
        case 1: {
            communicateMethod = '电话';
            break;
        }
        case 2: {
            communicateMethod = '微信';
            break;
        }
        case 3: {
            communicateMethod = '邮件';
            break;
        }
        case 4: {
            communicateMethod = '面谈';
            break;
        }
        case 5: {
            communicateMethod = '视频会议';
            break;
        }
    }
    return communicateMethod
}

export function scene(val) {
    let scene = '';
    switch (val) {
        case 1: {
            scene = '1对1';
            break;
        }
        case 2: {
            scene = '1对多';
            break;
        }
        case 3: {
            scene = '其他';
            break;
        }
    }
    return scene
}

export function value(val) {
    let value = '';
    switch (val) {
        case 1: {
            value = '精华';
            break;
        }
        case 2: {
            value = '高';
            break;
        }
        case 3: {
            value = '中';
            break;
        }
        case 4: {
            value = '低';
            break;
        }
    }
    return value
}

export function intJob(val) {
    let intJob = '';
    switch (val) {
        case 1: {
            intJob = '董事长/总经理';
            break;
        }
        case 2: {
            intJob = '副总裁/副总经理';
            break;
        }
        case 3: {
            intJob = '事业部总经理';
            break;
        }
        case 4: {
            intJob = '总监';
            break;
        }
        case 5: {
            intJob = '高级经理/经理';
            break;
        }
        case 6: {
            intJob = '主管';
            break;
        }
        case 7: {
            intJob = '专员';
            break;
        }
        case 8: {
            intJob = '总裁秘书/助理';
            break;
        }
        case 9: {
            intJob = '创始人/联合创始人/合伙人';
            break;
        }
    }
    return intJob
}

export function infoType(val) {
    let infoType = '';
    switch (val) {
        case 1: {
            infoType = '商机';
            break;
        }
        case 2: {
            infoType = '重要信息';
            break;
        }
        case 3: {
            infoType = '其他信息';
            break;
        }
    }
    return infoType
}

export function functions(val) {
    let functions = '';
    switch (val) {
        case 1: {
            functions = '运营';
            break;
        }
        case 2: {
            functions = '采购';
            break;
        }
        case 3: {
            functions = '销售';
            break;
        }
        case 4: {
            functions = '人力';
            break;
        }
        case 5: {
            functions = '市场/公关';
            break;
        }
        case 6: {
            functions = '财务';
            break;
        }
        case 7:{
            functions = '战略/投资';
            break;
        }
    }
    return functions
}

// 消费类型
export function orderType(val) {
    let orderType = '';
    switch (val) {
        case 2: {
            orderType = '门票';
            break;
        }
        case 5: {
            orderType = '会员';
            break;
        }
    }
    return orderType
}

export function amount(val) {
    return isNaN(val) ? 0.00 : parseFloat((val / 100).toFixed(2));
}

export function orderStatus(val) {
    let orderStatus = '';
    switch (val) {
        case 1: {
            orderStatus = '待支付';
            break;
        }
        case 2: {
            orderStatus = '待审核';
            break;
        }
        case 3: {
            orderStatus = '已付款';
            break;
        }
        case 4: {
            orderStatus = '已取消';
            break;
        }
        case 5: {
            orderStatus = '已关闭';
            break;
        }
        case 6: {
            orderStatus = '退款待审';
            break;
        }
        case 8: {
            orderStatus = '退款失败';
            break;
        }
        case 9: {
            orderStatus = '审核通过';
            break;
        }
        case 10: {
            orderStatus = '审核未通过';
            break;
        }
        case 12: {
            orderStatus = '退款拒绝';
            break;
        }
        case 13: {
            orderStatus = '撤销退款申请';
            break;
        }
        case 15: {
            orderStatus = '退款成功';
            break;
        }
        case 19: {
            orderStatus = '交易完成';
            break;
        }
        
    }
    return orderStatus
}

export function companyVip(val) {
    let companyVip = '';
    switch (val) {
        case 1: {
            companyVip = '会员';
            break;
        }
        case 2: {
            companyVip = '潜在会员';
            break;
        }
        case 3: {
            companyVip = '非会员';
            break;
        }
    }
    return companyVip
}


export function articleStatus(val) {
    let articleStatus = '';
    switch (val) {
        case '1': {
            articleStatus = '已发布';
            break;
        }
        case '2': {
            articleStatus = '待审核';
            break;
        }
        case '3': {
            articleStatus = '被驳回';
            break;
        }
    }
    return articleStatus
}

export function copyrightStates(val) {
    let copyrightStates = '';
    switch (val) {
        case 1: {
            copyrightStates = '未上线';
            break;
        }
        case 2: {
            copyrightStates = '投放中';
            break;
        }
        case 3: {
            copyrightStates = '已结束';
            break;
        }
    }
    return copyrightStates
}

export function qualified(val) {
    let qualified = '';
    switch (val) {
        case 1: {
            qualified = '待评审';
            break;
        }
        case 2: {
            qualified = '合格';
            break;
        }
        case 3: {
            qualified = '不合格';
            break;
        }
    }
    return qualified
}





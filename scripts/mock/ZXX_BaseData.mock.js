let CompanyQueryInfoLisitTotalNum = 154;

module.exports = [{
    path: '/ZXX_BaseData/ZXX_GetAllCompanyInfo',
    method: 'post',
    response: (req, res) => {
        const companyList = [[1001, '企业1'], [1002, '企业2'], [1003, '企业3']];
        const agentList = [[2001, '中介1'], [2002, '中介2'], [2003, '中介3']];
        const laborList = [[3001, '劳务1', '张三', '16777777771'], [3002, '劳务2', '李四', '16777777772'], [3003, '劳务3', '王五', '16777777773']];

        return {
            Data: {
                AgentList: agentList.map((value) => ({ SpId: value[0], SpShortName: value[1] })),
                CompanyList: companyList.map((value) => ({ EntId: value[0], EntShortName: value[1] })),
                LaborList: laborList.map((value) => ({
                    SpId: value[0],
                    SpShortName: value[1],
                    CtctName: value[2],
                    CtctMobile: value[3]
                }))
            },
            Code: 0,
            Desc: '成功'
        };
    }
}, {
    path: '/ZXX_BaseData/ZXX_CompanyQueryInfoLisit',
    method: 'post',
    response: (req, res) => {
        let { RecordIndex, RecordSize, InfoIsCompleted } = JSON.parse(req.body.Data);
        if (RecordIndex + RecordSize > CompanyQueryInfoLisitTotalNum)
            CompanyQueryInfoLisitTotalNum % RecordSize && (RecordSize = Math.min(CompanyQueryInfoLisitTotalNum % RecordSize));
        return {
            Data: {
                "RecordCount": CompanyQueryInfoLisitTotalNum,
                ["RecordList|" + RecordSize]: [
                    {
                        "CreateBy": "测试内容7xg5",
                        "CreateTm": "测试内容e86l",
                        "CtctMobile": "测试内容r3m6",
                        "CtctName": "测试内容y27y",
                        "EntId": "@increment()",
                        "EntShortName": "测试内容",
                        "EntFullName": "测试内容v55x",
                        ["InfoIsCompleted" + (InfoIsCompleted ? '' : '|1-2')]: InfoIsCompleted || 1,
                        "Location": [
                            {
                                "Latitude": 0,
                                "Longitude": 84.358
                            }, {
                                "Latitude": 35.4133,
                                "Longitude": 84.3583
                            }
                        ],
                        "PayoffTime": 35016,
                        "SettleBeginDy": 27434,
                        "SettleEndDy": 12371,
                        "WhiteLocationNum": 43751
                    }
                ]
            },
            Code: 0,
            Desc: '成功'
        };
    }
}, {
    // 同步劳务/中介数据
    path: '/ZXX_BaseData/ZXX_SyncAgentInfo',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Desc: '成功'
    })
}, {
    // 编辑企业数据
    path: '/ZXX_BaseData/ZXX_EditCompanyInfo',
    method: 'post',
    response: (req, res) => ({
        Code: 1,
        Desc: '成功'
    })
}, {
    // 编辑劳务/中介数据
    path: '/ZXX_BaseData/ZXX_EditAgentInfo',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Desc: '成功'
    })
}, {
    // 编辑劳务/中介数据
    path: '/ZXX_BaseData/ZXX_SyncCompanyInfo',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Desc: '成功'
    })
}, {
    // 获取劳务/中介数据列表
    path: '/ZXX_BaseData/ZXX_AgentQueryInfoList',
    method: 'post',
    response: (req, res) => ({
        Code: 0,
        Desc: '成功',
        Data: {
            RecordCount: 60,
            "RecordList|60": [
                {
                    BankAccountName: "@cname",
                    BankCardNo: "@increment",
                    BankName: "@cname",
                    CreateBy: "@cname",
                    CreateTm: '@datetime("yyyy-MM-dd hh:mm:ss")',
                    CtctMobile: /^1[385][1-9]\d{8}/,
                    CtctName: "@cname",
                    'InfoIsCompleted|1': [0, 1, 2],
                    SpId: "@increment",
                    SpShortName: "@cname",
                    SpFullName: "@cname"
                }
            ]
        }
    })
}, {
    path: '/ZXX_BaseData/ZXX_UpdatePayAccnt',
    method: 'post',
    response: (req, res) => ({
        Data: {

        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_BaseData/ZXX_AblePayAccnt',
    method: 'post',
    response: (req, res) => ({
        Data: {

        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_BaseData/ZXX_AddPayAccnt',
    method: 'post',
    response: (req, res) => ({
        Data: {
            PayAccntId: '@id'
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_BaseData/ZXX_QueryPayAccnt',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 25,
            "RecordList|25": [
                {
                    "BankAccntName": '银行账户名-@cname',
                    "BankCardNum": '@integer(10000,99999)',
                    "BankName": '银行名-@integer(10000,99999)',
                    "CreatedBy": '@cname',
                    "CreatedTm": '@datetime("yyyy-MM-dd HH:mm:ss")',
                    "IsValide|1": [1, 2],
                    "PayAccntId": '@id',
                    "FrontPort": '@integer(10000,65535)',
                    "FrontIp": '192.8.124.@integer(10,99)',
                    "BankLoginAccnt": '@integer(10000,99999)'
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_BaseData/ZXX_AddUserPayAccntRouter',
    method: 'post',
    response: (req, res) => ({
        Data: {
            PayAccntRouterId: '@id'
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_BaseData/ZXX_UpdateUserPayAccntRouter',
    method: 'post',
    response: (req, res) => ({
        Data: {
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_BaseData/ZXX_QueryUserPayAccntRouter',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 25,
            "RecordList|25": [
                {
                    "BankVirtualSubAccnt": "虚拟子账户-@integer(10000,99999)",
                    "BankVirtualSubAccntName": "虚拟子账户名称-@integer(10000,99999)",
                    "BelongMonths": '@datetime("yyyy-MM")',
                    "CreatedBy": '@cname',
                    "CreatedTm": '@datetime("yyyy-MM-dd HH:mm:ss")',
                    "EntId": '@integer(10000,99999)',
                    "EntName": "企业名称-@integer(10000,99999)",
                    "PayAccntId": '付款银行账号-@integer(10000,99999)',
                    "PayAccntName": '付款银行账号名称-@integer(10000,99999)',
                    "PayAccntRouterId": '@integer(10000,99999)',
                    "SpId": '@integer(10000,99999)',
                    "SpName": "劳务名称-@integer(10000,99999)"
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_BaseData/ZXX_GetAllPayAccnt',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordList|25": [
                {
                    "BankAccntName": '付款银行账号名称-@integer(10000,99999)',
                    "PayAccntId": '@integer(10000,99999)',
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_BaseData/ZXX_AddAgentPayAccntRouter',
    method: 'post',
    response: (req, res) => ({
        Data: {
            PayAccntRouterId: '@id'
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_BaseData/ZXX_UpdateAgentPayAccntRouter',
    method: 'post',
    response: (req, res) => ({
        Data: {
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_BaseData/ZXX_QueryAgentPayAccntRouter',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 25,
            "RecordList|25": [
                {
                    "BankVirtualSubAccnt": "虚拟子账户-@integer(10000,99999)",
                    "BankVirtualSubAccntName": "虚拟子账户名称-@integer(10000,99999)",
                    "CreatedBy": '@cname',
                    "CreatedTm": '@datetime("yyyy-MM-dd HH:mm:ss")',
                    "PayAccntId": '付款银行账号-@integer(10000,99999)',
                    "PayAccntName": '付款银行账号名称-@integer(10000,99999)',
                    "PayAccntRouterId": '@integer(10000,99999)',
                    "SpId": '@integer(10000,99999)',
                    "SpName": "劳务名称-@integer(10000,99999)"
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}];
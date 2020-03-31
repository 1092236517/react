module.exports = [{
    path: '/ZXX_RiskFund/SelectRiskFund',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 1,
            "RecordList": [{
                "RiskFundNeedTol": '@integer(10000,99999)',
                "RiskFundOver": '@integer(10000,99999)',
                "RiskFundTol": '@integer(10000,99999)',
                "TrgtSpShortName": "中劳",
                EntList: [{
                    EntId: '',
                    EntShortName: '纬创',
                    SettlementList: [{
                        DataId: '@increment',
                        PersonCount: '@integer(10,99)',
                        RiskFundNeed: '@integer(10000,99999)',
                        'SettlementTyp|1': [1, 2, 3, 4, 5, 6]
                    }, {
                        DataId: '@increment',
                        PersonCount: '@integer(10,99)',
                        RiskFundNeed: '@integer(10000,99999)',
                        'SettlementTyp|1': [1, 2, 3, 4, 5, 6]
                    }, {
                        DataId: '@increment',
                        PersonCount: '@integer(10,99)',
                        RiskFundNeed: '@integer(10000,99999)',
                        'SettlementTyp|1': [1, 2, 3, 4, 5, 6]
                    }]
                }, {
                    EntId: '',
                    EntShortName: '纯化',
                    SettlementList: [{
                        DataId: '@increment',
                        PersonCount: '@integer(10,99)',
                        RiskFundNeed: '@integer(10000,99999)',
                        'SettlementTyp|1': [1, 2, 3, 4, 5, 6]
                    }, {
                        DataId: '@increment',
                        PersonCount: '@integer(10,99)',
                        RiskFundNeed: '@integer(10000,99999)',
                        'SettlementTyp|1': [1, 2, 3, 4, 5, 6]
                    }, {
                        DataId: '@increment',
                        PersonCount: '@integer(10,99)',
                        RiskFundNeed: '@integer(10000,99999)',
                        'SettlementTyp|1': [1, 2, 3, 4, 5, 6]
                    }]
                }]
            }]
        },
        Code: 0,
        Desc: '成功'
    })
}]
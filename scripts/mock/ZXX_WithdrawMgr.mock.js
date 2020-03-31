module.exports = [{
    path: '/ZXX_WithdrawMgr/ZXX_WithdrawMgr_Pay',
    method: 'post',
    response: (req, res) => ({
        Data: {
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WithdrawMgr/ZXX_WithdrawMgr_RequestRePay',
    method: 'post',
    response: (req, res) => ({
        Data: {
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WithdrawMgr/ZXX_WithdrawMgr_GetUserTradeList',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordList|8": [
                {
                    "Amount": '@integer(10000,99999)',
                    "EnterpriseName": "企业-@integer(1,20)",
                    "EstimateTime": '@datetime("yyyy-MM-dd HH:mm:ss")',
                    "Month": '@datetime("yyyy-MM")',
                    "RecordID": '@id',
                    "TradeType|1": [1, 2]
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WithdrawMgr/ZXX_WithdrawMgr_GetUserTradeDetail',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordList|8": [
                {
                    "Amount": '@integer(10000,99999)',
                    "BankCardNo": "银行卡号-@integer(10000,99999)",
                    "EmpolyeeNo": "工号-@integer(10000,99999)",
                    "EnterpriseName": "企业-@integer(1,20)",
                    "EstimateTime": '@datetime("yyyy-MM-dd HH:mm:ss")',
                    "RealName": "@cname",
                    "SettleBeginDate": '@datetime("yyyy-MM-dd")',
                    "SettleEndDate": '@datetime("yyyy-MM-dd")',
                    "TradeType|1": [1, 2],
                    "WithdrawTime": '@datetime("yyyy-MM-dd HH:mm:ss")'
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WithdrawMgr/ZXX_WithdrawMgr_GetWithdrawDetailList',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 4,
            "RecordList|4": [
                {
                    "Amount": '@integer(100000000,99999999999)',
                    "AuditRemark": "备注-@csentence(5,10)",
                    "AuditState|1": [1, 2, 3],
                    "AuditTime": '@datetime("yyyy-MM-dd")',
                    "AuditUserID": '@id',
                    "AuditUserName": "@cname",
                    "BankAccountName": "银行账户-@integer(10000,99999)",
                    "BankCardNo": "银行卡号-@integer(10000,99999)",
                    "BankName|1": ['建设银行', '招商银行', '中国银行'],
                    "BankOrderID": "@id",
                    "BatchID": '@increment',
                    "BatchSrc|1": [1, 2],
                    "BatchType|1": [1, 2],
                    "CommitResult": "@csentence(5,10)",
                    "IDCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "Month": '@datetime("yyyy-MM")',
                    "OPUserID": '@id',
                    "OPUserName": "@cname",
                    "SettleBeginDate": '@datetime("yyyy-MM-dd")',
                    "SettleEndDate": '@datetime("yyyy-MM-dd")',
                    "ToRemark": "说明-@csentence(5,10)",
                    "ToState|1": [1, 2, 3],
                    "ToTime": '@datetime("yyyy-MM-dd")',
                    "TradeType|1": [1, 2, 3],
                    "WithdrawDetailID": '@increment',
                    "WithdrawRemark": "备注-@csentence(5,10)",
                    "WithdrawState|1": [1, 2, 3],
                    "WithdrawTime": '@datetime("yyyy-MM-dd")',
                }
            ],
            "UnAuditAmount": '@integer(10000,99999)',
            "UnAuditCount": '@integer(100,999)',
            "WaitWithdrawAmount": '@integer(10000,99999)',
            "WaitWithdrawCount": '@integer(100,999)'
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WithdrawMgr/ZXX_WithdrawMgr_GetBankBackList',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 4,
            "RecordList|4": [
                {
                    "Amount": '@integer(10000,99999)',
                    "BankBackID": '@increment',
                    "BankCardNo": "银行卡号-@integer(10000,99999)",
                    "BankName|1": ['建设银行', '招商银行', '中国银行'],
                    "BatchID": '@id',
                    "BatchType|1": [1, 2],
                    "CreateTime": '@datetime("yyyy-MM-dd")',
                    "IDCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "IsUpdateBankInfo|1": [1, 2],
                    "ReApplyState|1": [1, 2, 3],
                    "ReApplyUserID": '@id',
                    "ReApplyUserName": "@cname",
                    "RealName": "@cname",
                    "TradeType|1": [1, 2, 3],
                    "WithdrawRemark": "备注-@csentence(5,10)"
                }
            ],
            "UnHandleCount": '@integer(10000,99999)'
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WithdrawMgr/ZXX_WithdrawMgr_SetToMoneyFail',
    method: 'post',
    response: (req, res) => ({
        Data: {
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WithdrawMgr/ZXX_WithdrawMgr_DestroyBankBack',
    method: 'post',
    response: (req, res) => ({
        Data: {
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WithdrawMgr/ZXX_WithdrawMgr_ExportWithdrawDetailList',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "FileUrl": "http://fileUrl"
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WithdrawMgr/ZXX_WithdrawMgr_ExportBankBackList',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "FileUrl": "http://fileUrl"
        },
        Code: 0,
        Desc: '成功'
    })
}]
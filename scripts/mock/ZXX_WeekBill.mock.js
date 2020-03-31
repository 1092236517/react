module.exports = [{
    path: '/ZXX_WeekBill/ZXX_WeekBill_Disagree',
    method: 'post',
    response: (req, res) => ({
        Data: {
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WeekBill/ZXX_WeekBill_Agree',
    method: 'post',
    response: (req, res) => ({
        Data: {
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WeekBill/ZXX_WeekBill_Salary_Select',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 4,
            "RecordList|4": [
                {

                    "AdvancePayAmt": '@integer(10000,99999)',
                    "AgentAmt": '@integer(10000,99999)',
                    "BeginDt": '@datetime("yyyy-MM-dd")',
                    "BillSrce|1": [1, 2],
                    "BillWeeklyBatchDetailId": '@increment',
                    "BillWeeklyBatchId": '@increment',
                    "ClockDays": '@integer(1,30)',
                    "EndDt": '@datetime("yyyy-MM-dd")',
                    "EntShortName": "企业-@integer(1,20)",
                    "EntryDt": '@datetime("yyyy-MM-dd")',
                    "IdCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "IntvDt": '@datetime("yyyy-MM-dd")',
                    "LaborConfirmedAmt": '@integer(10000,99999)',
                    "LeaveDt": '@datetime("yyyy-MM-dd")',
                    "PlatformSrvcAmt": '@integer(10000,99999)',
                    "PreCheckInfo": "预检测结果-@csentence(5,10)",
                    "RcrtOrderId": '@integer(10000,99999)',
                    "RealName": "@cname",
                    "Remark": "备注-@csentence(5,10)",
                    "SrceSpShortName": "中介-@integer(1,20)",
                    "TrgtSpShortName": "劳务-@integer(1,20)",
                    "TruelyAmt": '@integer(10000,99999)',
                    "WorkCardNo": "工号-@integer(10000,99999)",
                    "WorkSts|1": [1, 2, 3, 4]
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WeekBill/ZXX_WeekBill_Salary_Export',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "FileUrl": "http://fileUrl"
        },
        Code: 0,
        Desc: '成功'
    })

}, {
    path: '/ZXX_WeekBill/ZXX_WeekBill_Select',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 4,
            "RecordList|4": [
                {
                    "BeginDt": '@datetime("yyyy-MM-dd")',
                    "BillSrce|1": [1, 2],
                    "BillWeeklyBatchId": '@increment',
                    "CreateTm": '@datetime("yyyy-MM-dd HH:mm:ss")',
                    "EndDt": '@datetime("yyyy-MM-dd")',
                    "EntShortName": "企业-@integer(1, 20)",
                    "RemittanceSts|1": [1, 2, 3, 4],
                    "SrceSpAuditSts|1": [1, 2, 3],
                    "SrceSpShortName": "中介-@integer(1, 20)",
                    "TotAdvancePayAmt": "@integer(1000000, 9999999)",
                    "TotCnt": "@integer(1000, 9999)",
                    "TotDealAmt": "@integer(1000000, 9999999)",
                    "TotPayCnt": "@integer(1000, 9999)",
                    "TotPlatFee": "@integer(1000000, 9999999)",
                    "TotSrceFee": "@integer(1000000, 9999999)",
                    "TotUserCnt": "@integer(1000, 9999)",
                    "TrgtSpAuditSts|1": [1, 2, 3],
                    "TrgtSpShortName": "劳务-@integer(1, 20)",
                    "UpdateBy": "@cname"
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WeekBill/ZXX_WeekBill_Export',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "FileUrl": "http://fileUrl"
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WeekBill/ZXX_WeekBill_Detail_Select',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 4,
            "RecordList|4": [
                {
                    "AdvancePayAmt": '@integer(10000,99999)',
                    "AgentAmt": '@integer(10000,99999)',
                    "BeginDt": '@datetime("yyyy-MM-dd")',
                    "BillSrce|1": [1, 2],
                    "BillWeeklyBatchDetailId": '@increment',
                    "BillWeeklyBatchId": '@integer(10000,99999)',
                    "ClockDays": '@integer(1,30)',
                    "EndDt": '@datetime("yyyy-MM-dd")',
                    "EntShortName": "企业-@integer(1, 20)",
                    "EntryDt": '@datetime("yyyy-MM-dd")',
                    "IdCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "LeaveDt": '@datetime("yyyy-MM-dd")',
                    "PlatformSrvcAmt": '@integer(10000,99999)',
                    "RealName": "@cname",
                    "Remark": "备注-@csentence(5,10)",
                    "SrceSpShortName": "中介-@integer(1, 20)",
                    "TrgtSpAdvancePayAmt": '@integer(10000,99999)',
                    "TrgtSpShortName": "劳务-@integer(1, 20)",
                    "WorkCardNo": "工号-@integer(10000,99999)",
                    "WorkSts|1": [1, 2, 3, 4]
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WeekBill/ZXX_WeekBill_Detail_Export',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "FileUrl": "http://fileUrl"
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WeekBill/ZXX_WeekBill_Import_Select',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 4,
            "RecordList|4": [
                {
                    "BeginDt": '@datetime("yyyy-MM-dd")',
                    "BillSrce|1": [1, 2],
                    "BillWeeklyBatchId": "@integer(1000000, 9999999)",
                    "BillWeeklyBatchImportDetailId": '@increment',
                    "EndDt": '@datetime("yyyy-MM-dd")',
                    "EntShortName": "企业-@integer(1, 20)",
                    "EntryDt": '@datetime("yyyy-MM-dd")',
                    "IdCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "IntvDt": '@datetime("yyyy-MM-dd")',
                    "IsJoin|1": [1, 2],
                    "LaborConfirmedAmt": "@integer(1000000, 9999999)",
                    "LeaveDt": '@datetime("yyyy-MM-dd")',
                    "PreCheckInfo": "@csentence(5,10)",
                    "RealName": "@cname",
                    "Remark": "备注-@csentence(5,10)",
                    "SrceSpShortName": "中介-@integer(1, 20)",
                    "TrgtSpShortName": "劳务-@integer(1, 20)",
                    "UpdatedBy": "@cname",
                    "UpdatedTm": '@datetime("yyyy-MM-dd HH:mm:ss")',
                    "WorkCardNo": "工号-@id",
                    "WorkSts|1": [1, 2, 3, 4]
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WeekBill/ZXX_WeekBill_Import_Export',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "FileUrl": "http://fileUrl"
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WeekBill/ZXX_WeekBill_GenerateBatch',
    method: 'post',
    response: (req, res) => ({})
}, {
    path: '/ZXX_WeekBill/ZXX_WeekBill_GenerateReBatch',
    method: 'post',
    response: (req, res) => ({})
}]
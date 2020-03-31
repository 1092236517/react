module.exports = [{
    path: '/ZXX_MonthBill/ZXX_MonthBill_GetMonthBatchRealList',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 4,
            "RecordList|4": [
                {
                    "BillMonthlyBatchDetailId": '@increment',
                    "BillMonthlyBatchId": '@increment',
                    "BillRelatedMo": '@datetime("yyyy-MM")',
                    "BillSrce|1": [1, 2],
                    "EntName": "企业-@integer(1, 20)",
                    "EntryDt": '@datetime("yyyy-MM-dd")',
                    "IdCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "IntyDt": '@datetime("yyyy-MM-dd")',
                    "LeaveDt": '@datetime("yyyy-MM-dd")',
                    "IsJoin|1": [1, 2],
                    "PreCheckInfo": "@csentence(5,10)",
                    "RealName": '@cname',
                    "Remark": "备注-@csentence(5,10)",
                    "SrceSpName": "中介-@integer(1, 20)",
                    "TrgtSpMonthlyPaidSalary": '@integer(10000,99999)',
                    "TrgtSpName": "劳务-@integer(1, 20)",
                    "UpdateByName": "@cname",
                    "UpdateTm": '@datetime("yyyy-MM-dd")',
                    "WorkCardNo": '工号-@integer(10000,99999)',
                    "WorkSts|1": [1, 2, 3]
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_MonthBill/ZXX_MonthBill_ExportMonthBatchReal',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "FileUrl": "http://fileUrl"
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_MonthBill/ZXX_MonthBill_SetMonthBillAuditState',
    method: 'post',
    response: (req, res) => ({
        Data: {

        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_MonthBill/ZXX_MonthBill_GetMonthBatchList',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 4,
            "RecordList|4": [
                {
                    "BillMonthlyBatchDetailId": '@increment',
                    "BillMonthlyBatchId": '@increment',
                    "BillRelatedMo": '@datetime("yyyy-MM")',
                    "BillSrce|1": [1, 2],
                    "EntName": "企业-@integer(1, 20)",
                    "EntryDt": '@datetime("yyyy-MM-dd")',
                    "IdCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "LeaveDt": '@datetime("yyyy-MM-dd")',
                    "PlatformSrvcAmt": "@integer(1000000, 9999999)",
                    "PreCheckInfo": "@csentence(5,10)",
                    "InvtDt": '@datetime("yyyy-MM-dd")',
                    "RealName": "@cname",
                    "RemainingSalary": "@integer(1000000, 9999999)",
                    "MonthlyPaidAmt": "@integer(1000000, 9999999)",
                    "Remark": "@备注-@csentence(5,10)",
                    "SrceSpName": "中介-@integer(1, 20)",
                    "TrgtSpAuditAmount": "@integer(1000000, 9999999)",
                    "TrgtSpMonthlyPaidSalary": "@integer(1000000, 9999999)",
                    "TrgtSpName": "劳务-@integer(1, 20)",
                    "WeeklyPaidAmt": "@integer(1000000, 9999999)",
                    "WorkCardNo": "工号-@integer(1000000, 9999999)",
                    "WorkSts|1": [1, 2, 3]
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_MonthBill/ZXX_MonthBill_ExportMonthBatch',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "FileUrl": "http://fileUrl"
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_MonthBill/ZXX_MonthBill_GetMonthBatchBillList',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 8,
            "RecordList|8": [
                {
                    "BillMonthlyBatchId": "@increment",
                    "BillRelatedMo": '@datetime("yyyy-MM")',
                    "BillSrce|1": [1, 2],
                    "CreatedTm": '@datetime("yyyy-MM-dd")',
                    "EntId": "@integer(1, 20)",
                    "EntShortName": "企业-@integer(1, 20)",
                    "MonthBillCreateTm": '@datetime("yyyy-MM-dd")',
                    "PlatformSrvcAmt": "@integer(1000000, 9999999)",
                    "RemainingSalary": "@integer(1000000, 9999999)",
                    "RemittanceSts|1": [1, 2, 3, 4],
                    "TotCount": "@integer(1000, 99999)",
                    "TotMonthlySalary": "@integer(1000000, 9999999)",
                    "TotPayCnt": "@integer(1000, 99999)",
                    "TotUserCnt": "@integer(1000, 99999)",
                    "TrgtSpAuditSts|1": [1, 2, 3],
                    "TrgtSpId": "@integer(1, 20)",
                    "TrgtSpShortName": "劳务-@integer(1, 20)",
                    "UpdatedBy": '@id',
                    "UpdatedName": "@cname"
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_MonthBill/ZXX_MonthBill_ExportMonthBatchBill',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "FileUrl": "http://fileUrl"
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_MonthBill/ZXX_MonthBill_GetMonthBatchDetail',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "RecordCount": 4,
            "RecordList|4": [
                {
                    "BillMonthlyBatchDetailId": '@increment',
                    "BillMonthlyBatchId": '@increment',
                    "BillRelatedMo": '@datetime("yyyy-MM")',
                    "BillSrce|1": [1, 2],
                    "EntShortName": "企业-@integer(1, 20)",
                    "EntryDt": '@datetime("yyyy-MM-dd")',
                    "InvtDt": '@datetime("yyyy-MM-dd")',
                    "IdCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "LeaveDt": '@datetime("yyyy-MM-dd")',
                    "PlatformSrvcAmt": '@integer(10000,99999)',
                    "PreCheckInfo": "@csentence(5,10)",
                    "RealName": "@cname",
                    "RemainingSalary": '@integer(10000,99999)',
                    "Remark": "@备注-@csentence(5,10)",
                    "SrceSpName": "中介-@integer(1, 20)",
                    "TrgtSpMonthlyPaidSalary": '@integer(10000,99999)',
                    "TrgtSpShortName": "劳务-@integer(1, 20)",
                    "WeeklyPaidAmt": '@integer(10000,99999)',
                    "WorkCardNo": "工号-@id",
                    "WorkSts|1": [1, 2, 3]
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_MonthBill/ZXX_MonthBill_ExportMonthBatchDetail',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "FileUrl": "http://fileUrl"
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_MonthBill/ZXX_MonthBill_GenerateBatch',
    method: 'post',
    response: (req, res) => ({
        Data: {

        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_MonthBill/ZXX_MonthBill_GenerateReBatch',
    method: 'post',
    response: (req, res) => ({
        Data: {

        },
        Code: 0,
        Desc: '成功'
    })
}]
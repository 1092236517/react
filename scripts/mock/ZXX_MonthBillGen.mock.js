module.exports = [{
    path: '/ZXX_MonthBillGen/ZXX_MonthBillGen_CheckSingle',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "Join|1": [1, 2],
            "PreCheckInfo": '预检测结果@csentence(5,10)',
            "PayedWeekAmout": '@integer(10000,99999)',
            "PayedMonthAmout": '@integer(10000,99999)',
            "LeftMonthAmout": '@integer(10000,99999)'
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_MonthBillGen/ZXX_MonthBillGen_ImportCheck',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "EnterpriseID": "filemd5@id",
            "RecordList|33": [
                {
                    "AgentID": '@increment',
                    "AgentName": "中介-@increment",
                    "Amount": '@integer(10000,99999)',
                    "EmployeeNo": "工号-@id",
                    "EnterpriseID": '@id',
                    "EnterpriseName": "企业-@id",
                    "EntryDate": '@datetime("yyyy-MM-dd")',
                    "IDCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "InterviewDate": '@datetime("yyyy-MM-dd")',
                    "Join|1": [1, 2],
                    "LaborID": '@integer(10000,99999)',
                    "LaborName": "劳务-@integer(10000,99999)",
                    "LeaveDate": '@datetime("yyyy-MM-dd")',
                    "PreCheckInfo": "@csentence(5,10)",
                    "Remark": "备注-@csentence(5,10)",
                    "UserName": "@cname",
                    "WorkState|1": [1, 2, 3, 4],
                    "WorkStateOriginalText": "@csentence(5,10)"
                }
            ]
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_MonthBillGen/ZXX_MonthBillGen_GenerateBatch',
    method: 'post',
    response: (req, res) => ({
        Data: {
        },
        Code: 0,
        Desc: '成功'
    })
}]
module.exports = [{
    path: '/ZXX_WeekBillGen/ZXX_WeekBillGen_CheckSingle',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "Join|1": [1, 2],
            "PreCheckInfo": '预检测结果@csentence(5,10)'
        },
        Code: 0,
        Desc: '成功'
    })
}, {
    path: '/ZXX_WeekBillGen/ZXX_WeekBillGen_ImportCheck',
    method: 'post',
    response: (req, res) => ({
        Data: {
            "FileMd5": "filemd5@id",
            "RecordList": [
                {
                    "Number": 1,
                    "AgentID": 2001,
                    "AgentName": "中介1",
                    "EmployeeNo": "工号-@id",
                    "EnterpriseID": '@id',
                    "EnterpriseName": "企业-@id",
                    "EntryDate": '@datetime("yyyy-MM-dd")',
                    "IDCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "InterviewDate": '@datetime("yyyy-MM-dd")',
                    "Join": 1,
                    "LaborAmount": '@integer(10000,99999)',
                    "LaborID": '@integer(10000,99999)',
                    "LaborName": "劳务-@integer(10000,99999)",
                    "LeaveDate": '@datetime("yyyy-MM-dd")',
                    "PreCheckInfo": "@csentence(5,10)",
                    "Remark": "备注-@csentence(5,10)",
                    "UserName": "@cname",
                    "WorkState|1": [1, 2, 3, 4],
                    "WorkStateOriginalText": "@csentence(5,10)"
                },
                {
                    "Number": 2,
                    "AgentID": 2001,
                    "AgentName": "中介1",
                    "EmployeeNo": "工号-@id",
                    "EnterpriseID": '@id',
                    "EnterpriseName": "企业-@id",
                    "EntryDate": '@datetime("yyyy-MM-dd")',
                    "IDCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "InterviewDate": '@datetime("yyyy-MM-dd")',
                    "Join": 2,
                    "LaborAmount": '@integer(10000,99999)',
                    "LaborID": '@integer(10000,99999)',
                    "LaborName": "劳务-@integer(10000,99999)",
                    "LeaveDate": '@datetime("yyyy-MM-dd")',
                    "PreCheckInfo": "@csentence(5,10)",
                    "Remark": "备注-@csentence(5,10)",
                    "UserName": "@cname",
                    "WorkState|1": [1, 2, 3, 4],
                    "WorkStateOriginalText": "@csentence(5,10)"
                },
                {
                    "Number": 3,
                    "AgentID": 2002,
                    "AgentName": "中介2",
                    "EmployeeNo": "工号-@id",
                    "EnterpriseID": '@id',
                    "EnterpriseName": "企业-@id",
                    "EntryDate": '@datetime("yyyy-MM-dd")',
                    "IDCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "InterviewDate": '@datetime("yyyy-MM-dd")',
                    "Join": 1,
                    "LaborAmount": '@integer(10000,99999)',
                    "LaborID": '@integer(10000,99999)',
                    "LaborName": "劳务-@integer(10000,99999)",
                    "LeaveDate": '@datetime("yyyy-MM-dd")',
                    "PreCheckInfo": "@csentence(5,10)",
                    "Remark": "备注-@csentence(5,10)",
                    "UserName": "@cname",
                    "WorkState|1": [1, 2, 3, 4],
                    "WorkStateOriginalText": "@csentence(5,10)"
                },
                {
                    "Number": 4,
                    "AgentID": 2003,
                    "AgentName": "中介3",
                    "EmployeeNo": "工号-@id",
                    "EnterpriseID": '@id',
                    "EnterpriseName": "企业-@id",
                    "EntryDate": '@datetime("yyyy-MM-dd")',
                    "IDCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "InterviewDate": '@datetime("yyyy-MM-dd")',
                    "Join": 2,
                    "LaborAmount": '@integer(10000,99999)',
                    "LaborID": '@integer(10000,99999)',
                    "LaborName": "劳务-@integer(10000,99999)",
                    "LeaveDate": '@datetime("yyyy-MM-dd")',
                    "PreCheckInfo": "@csentence(5,10)",
                    "Remark": "备注-@csentence(5,10)",
                    "UserName": "@cname",
                    "WorkState|1": [1, 2, 3, 4],
                    "WorkStateOriginalText": "@csentence(5,10)"
                },
                {
                    "Number": 5,
                    "AgentID": 0,
                    "AgentName": "",
                    "EmployeeNo": "工号-@id",
                    "EnterpriseID": '@id',
                    "EnterpriseName": "企业-@id",
                    "EntryDate": '@datetime("yyyy-MM-dd")',
                    "IDCardNum": /(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                    "InterviewDate": '@datetime("yyyy-MM-dd")',
                    "Join": 2,
                    "LaborAmount": '@integer(10000,99999)',
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
    path: '/ZXX_WeekBillGen/ZXX_WeekBillGen_GenerateBatch',
    method: 'post',
    response: (req, res) => ({
        Data: {
        },
        Code: 0,
        Desc: '成功'
    })
}]
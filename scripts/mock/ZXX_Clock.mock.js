module.exports = [{
    // 导出打卡记录
    path: '/ZXX_Clock/ZXX_Clock_ExportRecord',
    method: 'post',
    response: (req, res) =>({
        Code: 0,
        Desc: '成功',
        "Data": {
            FileUrl: 'baidu.com'
        }
    })
}, {
    // 打卡记录列表
    path: '/ZXX_Clock/ZXX_Clock_QueryRecord',
    method: 'post',
    response: (req, res) => {
        return {
            "Code": 0,
            "Desc": "成功",
            "Data": {
                "RecordList|30": [
                    {
                        "Amount": '@increment',
                        "ClockDt": '@datetime("yyyy-MM-dd")',
                        "ClockInAddr": "@county",
                        "ClockInSts|1": [1, 2],
                        "ClockInTm": '@datetime("yyyy-MM-dd hh:mm:ss")',
                        "ClockOutAddr": "@county",
                        "ClockOutSts|1": [1, 2],
                        "ClockOutTm": '@datetime("yyyy-MM-dd hh:mm:ss")',
                        "EntName": "@cname",
                        "EntID|1": [1001, 1002, 1003],
                        "IDCardNum": "@increment",
                        "IsClockInRepaired|1": [1, 2],
                        "IsClockOutRepaired|1": [1, 2],
                        "Mobile": /^1[385][1-9]\d{8}/,
                        "RealName": "@cname",
                        "SrceSpName": "@cname",
                        "SrceSpID|1": [2001, 2002, 2003],
                        "TrgtSpName": "@cname",
                        "TrgtSpID|1": [3001, 3002, 3003],
                        "WorkCardNo": "@increment",
                        "ClockRecID": "@increment",
                        "Remark": "@cname",
                        "InterviewDt": '@datetime("yyyy-MM-dd")'
                    }
                ],
                "RecordCount|1": [20, 30]
            }
        };
    }
}, {
    // 补打卡
    path: '/ZXX_Clock/ZXX_Clock_RepairClock',
    method: 'post',
    response: (req, res) =>({
        "Code": 0,
        "Desc": '成功'
    })
}, {
    // 根据身份证号获取信息
    path: '/ZXX_Clock/ZXX_Clock_GetWorkInfo',
    method: 'post',
    response: (req, res) =>({
        "Code": 0,
        "Desc": '成功',
        "Data": {
            EntID: "@increment",
            EntName: "@cname",
            InviewDt: "@datetime(\"yyyy-MM-dd\")",
            SrceSpId: "@increment",
            SrceSpName: "@cname",
            TrgtSpID: "@increment",
            TrgtSpName: "@cname",
            WorkCardNo: "@increment"
        }
    })
}];
